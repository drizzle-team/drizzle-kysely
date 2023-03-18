import {
  InferModel,
  text,
  foreignKey,
  integer,
  sqliteTable,
  numeric,
} from "drizzle-orm/sqlite-core";

export const customers = sqliteTable("customer", {
  id: text("id").primaryKey(),
  company_name: text("company_name").notNull(),
  contact_name: text("contact_name").notNull(),
  contact_title: text("contact_title").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  postal_code: text("postal_code"),
  region: text("region"),
  country: text("country").notNull(),
  phone: text("phone").notNull(),
  fax: text("fax"),
});

export type Customer = InferModel<typeof customers>;

export const employees = sqliteTable(
  "employee",
  {
    id: integer("id").primaryKey(),
    last_name: text("last_name").notNull(),
    first_name: text("first_name"),
    title: text("title").notNull(),
    title_of_courtesy: text("title_of_courtesy").notNull(),
    birth_date: integer("birth_date", { mode: "timestamp" }).notNull(),
    hire_date: integer("hire_date", { mode: "timestamp" }).notNull(),
    address: text("address").notNull(),
    city: text("city").notNull(),
    // region: ..
    postal_code: text("postal_code").notNull(),
    country: text("country").notNull(),
    home_phone: text("home_phone").notNull(),
    extension: integer("extension").notNull(),
    notes: text("notes").notNull(),
    reports_to: integer("reports_to"),
    // photo: ..
    photo_path: text("photo_path"),
  },
  (table) => ({
    reportsToFk: foreignKey(() => ({
      columns: [table.reports_to],
      foreignColumns: [table.id],
    })),
  })
);

export type Employee = InferModel<typeof employees>;

export const orders = sqliteTable("order", {
  id: integer("id").primaryKey(),
  order_date: integer("order_date", { mode: "timestamp" }).notNull(),
  required_date: integer("required_date", { mode: "timestamp" }).notNull(),
  shipped_date: integer("shipped_date", { mode: "timestamp" }),
  ship_via: integer("ship_via").notNull(),
  freight: numeric("freight").notNull(),
  ship_name: text("ship_name").notNull(),
  ship_city: text("ship_city").notNull(),
  ship_region: text("ship_region"),
  ship_postal_code: text("ship_postal_code"),
  ship_country: text("ship_country").notNull(),
  customer_id: text("customer_id").notNull(),
  employee_id: integer("employee_id").notNull(),
});

export type Order = InferModel<typeof orders>;

export const suppliers = sqliteTable("supplier", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  company_name: text("company_name").notNull(),
  contact_name: text("contact_name").notNull(),
  contact_title: text("contact_title").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  region: text("region"),
  postal_code: text("postal_code").notNull(),
  country: text("country").notNull(),
  phone: text("phone").notNull(),
});

export type Supplier = InferModel<typeof suppliers>;

export const products = sqliteTable("product", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  quantity_per_unit: text("quantity_per_unit").notNull(),
  unit_price: numeric("unit_price").notNull(),
  units_in_stock: integer("units_in_stock").notNull(),
  units_on_order: integer("units_on_order").notNull(),
  reorder_level: integer("reorder_level").notNull(),
  discontinued: integer("discontinued").notNull(),
  supplier_id: integer("supplier_id")
    .notNull()
    .references(() => suppliers.id, { onDelete: "cascade" }),
});

export type Product = InferModel<typeof products>;

export const details = sqliteTable("order_detail", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  unit_price: numeric("unit_price").notNull(),
  quantity: integer("quantity").notNull(),
  discount: numeric("discount").notNull(),
  order_id: integer("order_id").notNull(),
  product_id: integer("product_id").notNull(),
});

export type Detail = InferModel<typeof details>;
