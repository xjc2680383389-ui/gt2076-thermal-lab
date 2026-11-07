export type Research = {id:string; title:string; system:string; status:string; architecture:string; flow:string; tradeoffs:string; failures:string; validation:string; facts:string; assumptions:string; pending:string; sources:string; conclusion:string; updated:string};
export type Row = {id:string; [key:string]:string};
export type Snapshot = {id:string; name:string; date:string; note:string; snapshot?:string; snapshotKey?:string};
export type State = {format:1; research:Research[]; tables:Record<string,Row[]>; versions:Snapshot[]; architecture:string};
export const systems = ['中央回路与接口','THS MG1 / 电控','THS MG2 / 逆变器','后轴电驱 / 逆变器','电池冷媒直冷','座舱热泵','发动机余热','故障隔离与控制','轻量化与布置'];
export const tableDefs:Record<string,{title:string;subtitle:string;fields:[string,string][]}> = {
 components:{title:'部件清单',subtitle:'从功能需求建立清单；数量、规格与供应商尚未冻结。',fields:[['name','部件 / 功能'],['system','所属子系统'],['interface','热接口 / 介质'],['spec','规格与数量'],['status','状态 / 依据']]},
 parameters:{title:'参数与假设',subtitle:'每个数字都应有来源。用户需求、技术事实与设计假设分别记录。',fields:[['name','参数 / 命题'],['value','数值 / 描述'],['unit','单位'],['kind','证据类型'],['source','依据 / 来源'],['next','下一步验证']]},
 failures:{title:'故障模式',subtitle:'初始条目为待分析风险，不代表已完成 FMEA；严重度与概率不预设。',fields:[['name','故障模式'],['system','影响范围'],['effect','潜在后果'],['detection','诊断方法'],['isolation','隔离 / 降级草案'],['status','验证状态']]},
 tests:{title:'验证计划',subtitle:'先定义方法和判据，再记录结果；尚未执行的试验不视为通过。',fields:[['name','验证项目'],['system','关联子系统'],['method','方法 / 工况'],['criteria','通过判据'],['result','结果与证据'],['status','执行状态']]},
 comparisons:{title:'方案对比',subtitle:'保留候选方案与取舍，不用未经验证的打分替代工程证据。',fields:[['name','方案'],['architecture','架构 / 适用范围'],['benefit','潜在收益'],['cost','代价与风险'],['evidence','证据 / 待定项'],['status','决策状态']]},
 paths:{title:'热流路径记录',subtitle:'功能级路径用于表达设计意图；介质隔离与可逆工况需单独验证。',fields:[['name','路径'],['from','热源'],['to','热汇'],['medium','传热方式 / 边界'],['condition','工况'],['status','依据 / 状态']]},
 facts:{title:'事实与资料库',subtitle:'通用资料只支持其原始范围，不能直接证明本概念车的性能。',fields:[['name','技术事实 / 命题'],['scope','适用边界'],['source','原始资料链接'],['date','查阅日期'],['kind','证据类型']]},
};
const questionTitles = ['中央系统如何统筹多种介质，并保留可隔离支路？','MG1 的热接口如何与电控分配解耦？','MG2 与逆变器应串联还是并联散热？','后轴电驱的损耗图谱与独立支路如何定义？','电池直冷如何完成冷媒分配与泄漏隔离？','热泵如何协调座舱舒适性与电池需求？','发动机余热如何跨温区回收而不直接混液？','单泵、阀或传感器失效时如何维持受控降级？','如何量化管路、介质与模块的质量和布置代价？'];
export const seed:State = {
 format:1,
 research:questionTitles.map((title,i)=>({id:`R-${String(i+1).padStart(3,'0')}`,title,system:systems[i],status:'待研究',architecture:i===0?'初始提案：中央控制器统一协调低温冷却液、冷媒与发动机高温回路；通过换热器和阀组耦合，保留支路隔离。此为设计假设，尚未选择拓扑。':'',flow:'',tradeoffs:'',failures:'',validation:'',facts:'',assumptions:'',pending:'温度窗口、热负荷、流量、压降、接口尺寸与布置均待研究。',sources:'',conclusion:'',updated:''})),
 architecture:'V0.1 功能架构草案：中央控制统筹，介质分域。MG1、MG2 与后轴电驱及各自电控接入候选低温网络；电池使用独立冷媒直冷支路；座舱与电池共享冷媒能力需仲裁；发动机高温回路通过换热边界回收余热。各支路是否串并联、泵阀数量与失效位置尚未确定。',
 tables:{
 components:[
 ['C-01','MG1 与电控热接口','THS MG1 / 电控','油 / 水套 / 冷板形式待定','待定','需求分解'],
 ['C-02','MG2 与逆变器热接口','THS MG2 / 逆变器','电机冷却与逆变器冷板分开定义','待定','需求分解'],
 ['C-03','后轴电机与逆变器','后轴电驱 / 逆变器','候选低温冷却液支路','200 kW 为需求；额定/峰值待定','用户需求'],
 ['C-04','中央泵阀与分配模块','中央回路与接口','冷却液；跨域经换热器','流量、数量、接口待定','设计假设'],
 ['C-05','电池直冷板 / 膨胀控制','电池冷媒直冷','冷媒支路；与电芯绝缘隔离','冷媒、面积、分区数待定','需求 / 形式待定'],
 ['C-06','压缩机与座舱换热器','座舱热泵','冷媒；可逆换热','冷媒与能力待定','需求分解'],
 ['C-07','发动机余热换热器','发动机余热','高温冷却液 ↔ 隔离换热边界','面积与阀位待定','设计假设'],
 ['C-08','温度 / 压力 / 流量传感器','故障隔离与控制','监测接口','位置、数量、冗余待定','设计假设'],
 ].map(([id,name,system,inter,spec,status])=>({id,name,system,interface:inter,spec,status})),
 parameters:[
 {id:'P-01',name:'后轴电机功率要求',value:'200（额定 / 峰值与持续时间待定）',unit:'kW',kind:'用户需求',source:'项目初始需求',next:'明确工况与功率定义；不作为散热功率'},
 {id:'P-02',name:'电机 / 逆变器损耗图谱',value:'待定',unit:'kW / 工况',kind:'待定项',source:'待供应商或台架数据',next:'覆盖转速、扭矩、电压与温度'},
 {id:'P-03',name:'各部件允许温度窗口',value:'待定',unit:'°C',kind:'待定项',source:'待部件规格书',next:'区分结温、绕组温度与冷却液入口温度'},
 {id:'P-04',name:'泵流量与回路压降',value:'待定',unit:'L/min · kPa',kind:'待定项',source:'待管网与热负荷模型',next:'校核最不利支路和故障工况'},
 {id:'P-05',name:'电池直冷与座舱共享冷媒能力',value:'候选设计，尚未冻结',unit:'—',kind:'设计假设',source:'概念架构草案',next:'多蒸发支路分配、除霜与冷媒回油验证'},
 {id:'P-06',name:'整车热管理质量 / 包络',value:'待定',unit:'kg / mm',kind:'待定项',source:'待整车布置',next:'统计干重、介质、支架、管路与维修空间'},
 ],
 failures:[
 {id:'F-01',name:'低温主泵失效',system:'前后电驱与电控',effect:'候选共享回路流量丧失',detection:'泵反馈 + 流量 / 温差一致性',isolation:'独立支路 / 冗余策略待比较；受控降功率',status:'待分析 / 待验证'},
 {id:'F-02',name:'电池冷媒支路泄漏',system:'电池 / 座舱冷媒系统',effect:'冷媒损失与冷却能力下降',detection:'压力变化、泄漏检测及绝缘监测待定义',isolation:'支路关断与停车 / 降额条件待论证',status:'待分析 / 待验证'},
 {id:'F-03',name:'分配阀卡滞 / 传感器漂移',system:'中央控制',effect:'错误流量分配或错误热需求',detection:'阀位反馈与多信号合理性诊断',isolation:'失效安全阀位、旁通与保守控制待定',status:'待分析 / 待验证'},
 ],
 tests:[
 {id:'T-01',name:'热负荷边界建立',system:'全系统',method:'采集损耗图谱；建立驾驶 / 充电 / 热浸场景',criteria:'需求覆盖完整；温度与误差判据待定义',result:'未执行',status:'待输入'},
 {id:'T-02',name:'多支路流量与压降',system:'中央回路与接口',method:'一维流体模型 → 回路台架',criteria:'最不利工况流量需求满足；数值待定',result:'未执行',status:'待输入'},
 {id:'T-03',name:'电池直冷分配与热泵耦合',system:'电池 / 座舱',method:'冷媒循环模型 → 环境舱；制热、制冷、除霜',criteria:'温差、过热度、回油与舒适性边界待定',result:'未执行',status:'待规划'},
 {id:'T-04',name:'故障注入与降级',system:'故障隔离与控制',method:'模型 / HIL 注入泵失效、阀卡滞与传感器偏差',criteria:'检测时延、隔离范围与安全状态待定义',result:'未执行',status:'待规划'},
 ],
 comparisons:[
 {id:'A',name:'A · 中央协调 + 可隔离并联支路',architecture:'独立介质分域；低温支路集中分配',benefit:'可协同分配冷量；可评估支路隔离',cost:'阀组与控制复杂度；共享部件失效传播',evidence:'缺少热负荷、压降、质量与失效分析',status:'候选 / 未决策'},
 {id:'B',name:'B · 前后电驱独立循环',architecture:'前 / 后独立泵回路；热源经换热边界协同',benefit:'隔离边界直观；前后控制相对独立',cost:'泵、介质与管路可能增加',evidence:'需同工况比较质量、能耗和故障影响',status:'候选 / 未决策'},
 ],
 paths:[
 {id:'H-01',name:'前轴电驱散热',from:'MG1 / MG2 及各自电控',to:'中央低温回路 → 环境',medium:'电机内部冷却介质待定；经接口换热',condition:'驱动 / 发电',status:'设计假设'},
 {id:'H-02',name:'后轴电驱散热',from:'后轴电机 / 逆变器',to:'中央低温回路 → 环境',medium:'冷却液支路；阀隔离待论证',condition:'驱动 / 回收',status:'设计假设'},
 {id:'H-03',name:'电池直冷',from:'电池',to:'冷媒回路 → 环境',medium:'冷媒在直冷板内吸热；无电池液冷回路假定',condition:'电池冷却',status:'需求 / 拓扑待研究'},
 {id:'H-04',name:'座舱热泵',from:'环境 / 可用余热',to:'冷媒回路 → 座舱',medium:'可逆冷媒循环；制冷时热流反向',condition:'制热 / 制冷 / 除霜',status:'需求 / 控制待研究'},
 {id:'H-05',name:'发动机余热回收',from:'发动机高温回路',to:'隔离换热器 → 座舱或热泵',medium:'仅跨壁换热；不直接混液',condition:'发动机有可用余热',status:'设计假设'},
 ],
 facts:[
 {id:'K-01',name:'THS II 采用发动机与电驱协同，并通过功率分流装置分配动力。',scope:'丰田 2003 年 THS II 说明；不代表 2076 概念车参数',source:'https://global.toyota/en/detail/220017/',date:'2026-11-07',kind:'已知技术事实'},
 {id:'K-02',name:'冷媒直冷可让空调冷媒流经电池冷却板；不同于通过 Chiller 冷却液的间接冷却。',scope:'通用原理；不证明本项目温度窗口或性能',source:'https://www.hella.com/techworld/en/technical/car-air-conditioning/thermal-management-in-electric-and-hybrid-vehicles/',date:'2026-11-07',kind:'已知技术事实'},
 {id:'K-03',name:'整车热管理可涵盖发动机、座舱、电机、电池与功率电子。',scope:'现有产品技术范围；集成形式与收益需本项目验证',source:'https://www.mahle.com/en/products-and-services/passenger-cars/cooling/',date:'2026-11-07',kind:'已知技术事实'},
 ],
 },
 versions:[{id:'V0.1',name:'研究框架建立',date:'2026-11-07',note:'建立需求边界、功能架构草案与 9 项研究队列。尚无研究闭环；所有性能与布置待定。'}],
};
export function validState(s:unknown):s is State {
 if(!s || typeof s !== 'object') return false;
 const v=s as State;
 if(v.format!==1 || typeof v.architecture!=='string' || !Array.isArray(v.research) || !Array.isArray(v.versions) || !v.tables) return false;
 const strings=(o:unknown)=>!!o&&typeof o==='object'&&Object.values(o).every(x=>typeof x==='string');
 if(v.research.length>2000 || !v.research.every(r=>strings(r)&&['id','title','system','status','architecture','flow','tradeoffs','failures','validation','facts','assumptions','pending','sources','conclusion','updated'].every(k=>typeof (r as any)[k]==='string')&&['待研究','研究中','待复核','已整合'].includes(r.status))) return false;
 if(v.research.filter(r=>r.status==='研究中').length>1) return false;
 if(!Object.keys(tableDefs).every(k=>Array.isArray(v.tables[k])&&v.tables[k].length<5000&&v.tables[k].every(r=>strings(r)&&tableDefs[k].fields.every(([key])=>typeof r[key]==='string')&&typeof r.id==='string'))) return false;
 return v.versions.length<3000 && v.versions.every(r=>strings(r)&&typeof r.id==='string'&&typeof r.name==='string'&&typeof r.date==='string'&&typeof r.note==='string'&&(!r.snapshot||r.snapshot.length<1_500_000));
}
