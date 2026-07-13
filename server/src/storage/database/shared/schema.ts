import { pgTable, serial, varchar, text, numeric, integer, boolean, timestamp, index, uuid } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// 系统表（禁止删除）
export const healthCheck = pgTable("health_check", {
  id: serial().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 商品表
export const products = pgTable(
  "products",
  {
    id: serial().primaryKey(),
    name: varchar("name", { length: 200 }).notNull(),
    description: text("description"),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    original_price: numeric("original_price", { precision: 10, scale: 2 }),
    image_url: varchar("image_url", { length: 500 }).notNull(),
    category: varchar("category", { length: 50 }).notNull().default('其他'),
    stock: integer("stock").notNull().default(0),
    sales_count: integer("sales_count").notNull().default(0),
    rating: numeric("rating", { precision: 2, scale: 1 }).default('4.5'),
    is_hot: boolean("is_hot").notNull().default(false),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("products_category_idx").on(table.category),
    index("products_is_hot_idx").on(table.is_hot),
    index("products_sales_count_idx").on(table.sales_count),
  ]
);

// 购物车项表
export const cartItems = pgTable(
  "cart_items",
  {
    id: serial().primaryKey(),
    user_id: uuid("user_id").notNull(),
    product_id: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
    selected: boolean("selected").notNull().default(true),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("cart_items_user_id_idx").on(table.user_id),
    index("cart_items_product_id_idx").on(table.product_id),
  ]
);

// 地址表
export const addresses = pgTable(
  "addresses",
  {
    id: serial().primaryKey(),
    user_id: uuid("user_id").notNull(),
    name: varchar("name", { length: 50 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    province: varchar("province", { length: 50 }).notNull(),
    city: varchar("city", { length: 50 }).notNull(),
    district: varchar("district", { length: 50 }).notNull(),
    detail: varchar("detail", { length: 200 }).notNull(),
    is_default: boolean("is_default").notNull().default(false),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("addresses_user_id_idx").on(table.user_id),
  ]
);

// 订单表
export const orders = pgTable(
  "orders",
  {
    id: serial().primaryKey(),
    user_id: uuid("user_id").notNull(),
    total_amount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
    discount_amount: numeric("discount_amount", { precision: 10, scale: 2 }).default('0'),
    final_amount: numeric("final_amount", { precision: 10, scale: 2 }).notNull(),
    status: varchar("status", { length: 20 }).notNull().default('pending'),
    address_id: integer("address_id").references(() => addresses.id),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("orders_user_id_idx").on(table.user_id),
    index("orders_status_idx").on(table.status),
    index("orders_created_at_idx").on(table.created_at),
  ]
);

// 订单项表
export const orderItems = pgTable(
  "order_items",
  {
    id: serial().primaryKey(),
    order_id: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    product_id: integer("product_id").notNull().references(() => products.id),
    product_name: varchar("product_name", { length: 200 }).notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull().default(1),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("order_items_order_id_idx").on(table.order_id),
    index("order_items_product_id_idx").on(table.product_id),
  ]
);

// 类型导出
export type Product = typeof products.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type Address = typeof addresses.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;