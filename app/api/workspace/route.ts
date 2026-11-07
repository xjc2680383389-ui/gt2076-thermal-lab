import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
import { validState, type State } from '../../data';
export const dynamic = 'force-dynamic';
const respond = (data: unknown, status = 200) => Response.json(data, {status, headers:{'Cache-Control':'no-store'}});
export async function GET(request: Request) {
 const user = await getChatGPTUser();
 if (!user) return respond({error:'请登录后读取个人工作台。'},401);
 try {
  const row = await env.DB!.prepare('SELECT payload, revision, updated_at FROM workspaces WHERE user_id = ?').bind(user.userId).first<{payload:string,revision:number,updated_at:string}>();
  if(!row) return respond({state:null,revision:0});
  const state:State=JSON.parse(row.payload);
  const url=new URL(request.url);
  if(url.searchParams.has('snapshot')){
   const key=url.searchParams.get('snapshot')!;
   if(!state.versions.some(v=>v.snapshotKey===key))return respond({error:'版本不存在。'},404);
   const snap=await env.DB!.prepare('SELECT payload FROM snapshots WHERE user_id=? AND key=?').bind(user.userId,key).first<{payload:string}>();
   return snap?respond({state:JSON.parse(snap.payload)}):respond({error:'快照读取失败。'},404);
  }
  if(url.searchParams.has('includeSnapshots')){
   const rows=await env.DB!.prepare('SELECT key,payload FROM snapshots WHERE user_id=?').bind(user.userId).all<{key:string,payload:string}>();
   const all=new Map(rows.results.map(r=>[r.key,r.payload]));
   state.versions=state.versions.map(v=>v.snapshotKey?{...v,snapshot:all.get(v.snapshotKey)||v.snapshot}:v);
  }
  return respond({state, revision:row.revision, updatedAt:row.updated_at});
 } catch { return respond({error:'暂时无法读取云端记录，请重试。'},503); }
}
export async function PUT(request: Request) {
 const user = await getChatGPTUser();
 if (!user) return respond({error:'请登录后保存。'},401);
 const origin = request.headers.get('origin');
 if (origin && origin !== new URL(request.url).origin) return respond({error:'请求来源无效。'},403);
 try {
  const body = await request.text();
  if(body.length > 24_000_000) return respond({error:'记录过大，请拆分备份归档。'},413);
  const {state, revision} = JSON.parse(body);
  if (!validState(state) || !Number.isInteger(revision) || revision < 0) return respond({error:'记录格式无效。'},400);
  const submitted:State=state;
  const uploads=submitted.versions.filter(v=>v.snapshot);
  const versions=submitted.versions.map(v=>{
   if(!v.snapshot)return v;
   if(!validState(JSON.parse(v.snapshot)))throw new Error('Invalid snapshot');
   return {...v,snapshotKey:crypto.randomUUID(),snapshot:undefined};
  });
  const stored={...submitted,versions};
  if(JSON.stringify(stored).length>1_500_000)return respond({error:'当前设计记录过大，请导出后拆分研究。历史快照独立保存。'},413);
  for(const v of uploads){
   const key=versions[submitted.versions.indexOf(v)].snapshotKey!;
   await env.DB!.prepare('INSERT INTO snapshots (user_id,key,payload) VALUES (?,?,?)').bind(user.userId,key,v.snapshot!).run();
  }
  const updatedAt = new Date().toISOString();
  const row = await env.DB!.prepare('INSERT INTO workspaces (user_id,payload,revision,updated_at) VALUES (?,?,1,?) ON CONFLICT(user_id) DO UPDATE SET payload=excluded.payload,revision=workspaces.revision+1,updated_at=excluded.updated_at WHERE workspaces.revision=? RETURNING revision').bind(user.userId,JSON.stringify(stored),updatedAt,revision).first<{revision:number}>();
  if(!row) return respond({error:'另一个窗口已更新记录。请先导出当前内容，再刷新合并。'},409);
  return respond({revision:row.revision,updatedAt,versions});
 } catch { return respond({error:'保存未完成，内容仍保留在当前页面，请重试或导出。'},503); }
}
