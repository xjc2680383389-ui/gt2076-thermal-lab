import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
export const workspaces = sqliteTable('workspaces', {
 userId: text('user_id').primaryKey(), payload: text('payload').notNull(),
 revision: integer('revision').notNull().default(1), updatedAt: text('updated_at').notNull(),
});
export const snapshots = sqliteTable('snapshots', {
 userId: text('user_id').notNull(), key: text('key').notNull(), payload: text('payload').notNull(),
}, (t) => [primaryKey({columns:[t.userId,t.key]})]);
