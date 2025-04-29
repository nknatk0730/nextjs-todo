import { seed } from 'drizzle-seed';
import { db } from '../drizzle';
import { users } from '../schema';
import { sql } from 'drizzle-orm';   // ★ 追加

// 1️⃣ テーブルは空にするがシーケンスは触らない
async function clear() {
  await db.execute(sql`TRUNCATE TABLE "users" CASCADE;`);
}

async function main() {
  await seed(db, { users }, { count: 2 }).refine((f) => ({
    users: {
      columns: {
        name:  f.fullName(),
        email: f.email(),
        age:   f.int({ minValue: 18, maxValue: 80 }),
        password: f.string(),
      },
    },
  }));
}

(async () => {
  try {
    await clear();
    await main();
    console.log('✔ Seed completed');
  } catch (e) {
    console.error('✖ Seed failed:', e);
  }
})();
