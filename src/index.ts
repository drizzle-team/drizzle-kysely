import Database from "better-sqlite3";
import { Kysely, SqliteDialect, sql } from "kysely";
import { Kyselify } from "drizzle-orm/kysely";
import {
  customers,
  details,
  employees,
  orders,
  products,
  suppliers,
} from "./schema";

import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { drizzle } from "drizzle-orm/better-sqlite3/driver";
import {
  customerIds,
  customerSearches,
  employeeIds,
  orderIds,
  productIds,
  productSearches,
  supplierIds,
} from "./meta";

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
  await db.selectFrom("customer").selectAll().execute();

  const result2 = drzldb.select().from(customers).all();

  for (const id of customerIds) {
    await db
      .selectFrom("customer")
      .selectAll()
      .where("customer.id", "=", id)
      .execute();
  }

  for (const it of customerSearches) {
    await db
      .selectFrom("customer")
      .selectAll()
      .where(sql`company_name`, "like", `%${it}%`)
      .execute();
  }

  await db.selectFrom("employee").selectAll().execute();

  for (const id of employeeIds) {
    const e2 = db
      .selectFrom("employee as e2")
      .select([
        "id as e2_id",
        "last_name as e2_last_name",
        "first_name as e2_first_name",
        "title as e2_title",
        "title_of_courtesy as e2_title_of_courtesy",
        "birth_date as e2_birth_date",
        "hire_date as e2_hire_date",
        "address as e2_address",
        "city as e2_city",
        "postal_code as e2_postal_code",
        "country as e2_country",
        "home_phone as e2_home_phone",
        "extension as e2_extension",
        "notes as e2_notes",
        "reports_to as e2_reports_to",
      ])
      .as("e2");

    await db
      .selectFrom("employee as e1")
      .selectAll()
      .where("e1.id", "=", id)
      .leftJoin(e2, "e2.e2_id", "e1.reports_to")
      .execute();
  }

  await db.selectFrom("supplier").selectAll().execute();

  for (const id of supplierIds) {
    await db
      .selectFrom("supplier")
      .selectAll()
      .where("supplier.id", "=", id)
      .execute();
  }

  await db.selectFrom("product").selectAll().execute();

  for (const id of productIds) {
    await db
      .selectFrom("product")
      .selectAll()
      .where("product.id", "=", id)
      .leftJoin(
        db
          .selectFrom("supplier")
          .select([
            "id as s_id",
            "company_name",
            "contact_name",
            "contact_title",
            "address",
            "city",
            "region",
            "postal_code",
            "country",
            "phone",
          ])
          .as("s1"),
        "s1.s_id",
        "product.supplier_id"
      )
      .execute();
  }

  for (const it of productSearches) {
    await db
      .selectFrom("product")
      .selectAll()
      .where(sql`name`, "like", `%${it}%`)
      .execute();
  }

  await db
    .selectFrom("order")
    .select([
      "order.id",
      "order.shipped_date",
      "order.ship_name",
      "order.ship_city",
      "order.ship_country",
      db.fn.count("product_id").as("products_count"),
      db.fn.sum("quantity").as("quantity_sum"),
      sql`SUM(quantity * unit_price)`.as("total_price"),
    ])
    .leftJoin("order_detail", "order_detail.order_id", "order.id")
    .groupBy("order.id")
    .orderBy("order.id", "asc")
    .execute();

  for (const id of orderIds) {
    await db
      .selectFrom("order_detail")
      .selectAll()
      .where("order_id", "=", id)
      .leftJoin(
        db
          .selectFrom("order")
          .select([
            "order.id as o_id",
            "order_date",
            "required_date",
            "shipped_date",
            "ship_via",
            "freight",
            "ship_name",
            "ship_city",
            "ship_region",
            "ship_postal_code",
            "ship_country",
            "customer_id",
            "employee_id",
          ])
          .as("o"),
        "o.o_id",
        "order_detail.order_id"
      )
      .leftJoin(
        db
          .selectFrom("product")
          .select([
            "product.id as p_id",
            "name",
            "quantity_per_unit",
            "product.unit_price as p_unit_price",
            "units_in_stock",
            "units_on_order",
            "reorder_level",
            "discontinued",
            "supplier_id",
          ])
          .as("p"),
        "p.p_id",
        "order_detail.product_id"
      )
      .execute();
  }
};

main();
