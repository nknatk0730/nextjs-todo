import { seed } from 'drizzle-seed';
import { db } from '../drizzle';
// import { sql } from 'drizzle-orm';   // ★ 追加
import { todos } from '../schema';

// 1️⃣ テーブルは空にするがシーケンスは触らない
// async function clear() {
//   await db.execute(sql`TRUNCATE TABLE "todos" CASCADE;`);
// }

async function main() {
  await seed(db, { todos }, { count: 2 }).refine((f) => ({
    todos: {
      columns: {
        title:  f.default({
          defaultValue: 'cooking',
        }),
        description: f.default({
          defaultValue: 'cooking is fun',
        }),
        ownerId: f.int({
          minValue: 1,
          maxValue: 2,
        })
      },
    },
  }));
}

(async () => {
  try {
    // await clear();
    await main();
    console.log('✔ Seed completed');
  } catch (e) {
    console.error('✖ Seed failed:', e);
    process.exitCode = 1;
  }
})();
