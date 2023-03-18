## Drizzle ORM 🤝 Kysely

This repo is a [better-sqlite3](https://www.npmjs.com/package/better-sqlite3) Northwind example of how you can use [Kysely](https://github.com/koskimas/kysely) with [Drizzle ORM](driz.li/orm) and benefit from both.  
 
At [Drizzle Team](https://drizzle.team) we're aiming change the world of SQL in TypeScript for the better, not build "the only ORM you need".  

We've built module for you to declare Drizzle schema, use drizzle-kit for migrations and have your beloved Kysely as a query builder 🚀  

To run this project:
```bash
## we're using pnpm, you can use npm or yarn
npm install
npm run dev
```

You can alter sqlite schema in `src/schema.ts` and just use `npm run generate` to automatically generate all needed SQL alternations.  

```typescript
import Database from "better-sqlite3";
import { Kysely, SqliteDialect, sql } from "kysely";
import { Kyselify } from "drizzle-orm/kysely";
import { customers, details, employees, orders, products, suppliers } from "./schema";

import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { drizzle } from "drizzle-orm/better-sqlite3/driver";

const sqlite = new Database("datapack/_sqlite.db");
const drzldb = drizzle(sqlite);
migrate(drzldb, { migrationsFolder: "drizzle" });

interface Database {
  customer: Kyselify<typeof customers>;
  employee: Kyselify<typeof employees>;
  order: Kyselify<typeof orders>;
  supplier: Kyselify<typeof suppliers>;
  product: Kyselify<typeof products>;
  order_detail: Kyselify<typeof details>;
}

const db = new Kysely<Database>({
  dialect: new SqliteDialect({
    database: sqlite,
  }),
});

const main = async () => {
  // fully typed Kysely result and query builder
  const result = await db.selectFrom("customer").selectAll().execute();

  // you can also query with Drizzle ORM whenever needed!
  const result2 = drzldb.select().from(customers).all()
}

main()
```

If you have an existing Kysely based project, you can introspect your existing database with `drizzle-kit` and it will prepare you a complete `schema.ts` based on your current database - [see docs](driz.li/kit)
```bash 
> drizzle-kit introspect:pg ...
> drizzle-kit introspect:mysql ...
> drizzle-kit introspect:sqlite ...
```


