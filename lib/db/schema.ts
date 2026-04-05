import { pgTable, text, timestamp, integer, decimal, pgEnum, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- Enums ---
export const planEnum = pgEnum('plan', ['free', 'pro', 'agency']);
export const roleEnum = pgEnum('role', ['owner', 'admin', 'user']);
export const saleStatusEnum = pgEnum('sale_status', ['pending', 'completed', 'cancelled']);

// --- Tables ---

export const businesses = pgTable('businesses', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  plan: planEnum('plan').default('free').notNull(),
  ownerId: uuid('owner_id').notNull(), // Will map to a user later
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  businessId: uuid('business_id').references(() => businesses.id).notNull(),
  role: roleEnum('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessId: uuid('business_id').references(() => businesses.id).notNull(),
  name: text('name').notNull(),
  sku: text('sku').notNull(),
  category: text('category'),
  costPrice: decimal('cost_price', { precision: 10, scale: 2 }).notNull(),
  sellPrice: decimal('sell_price', { precision: 10, scale: 2 }).notNull(),
  stockQty: integer('stock_qty').default(0).notNull(),
  lowStockThreshold: integer('low_stock_threshold').default(5).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const customers = pgTable('customers', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessId: uuid('business_id').references(() => businesses.id).notNull(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  totalSpent: decimal('total_spent', { precision: 10, scale: 2 }).default('0').notNull(),
  orderCount: integer('order_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sales = pgTable('sales', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessId: uuid('business_id').references(() => businesses.id).notNull(),
  customerId: uuid('customer_id').references(() => customers.id),
  invoiceNo: text('invoice_no').notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  profit: decimal('profit', { precision: 10, scale: 2 }).notNull(),
  status: saleStatusEnum('status').default('completed').notNull(),
  saleDate: timestamp('sale_date').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const saleItems = pgTable('sale_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  saleId: uuid('sale_id').references(() => sales.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  qty: integer('qty').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
});

// --- Relations (For easy querying later) ---

export const businessesRelations = relations(businesses, ({ many }) => ({
  users: many(users),
  products: many(products),
  customers: many(customers),
  sales: many(sales),
}));

export const usersRelations = relations(users, ({ one }) => ({
  business: one(businesses, {
    fields: [users.businessId],
    references: [businesses.id],
  }),
}));

export const salesRelations = relations(sales, ({ one, many }) => ({
  business: one(businesses, {
    fields: [sales.businessId],
    references: [businesses.id],
  }),
  customer: one(customers, {
    fields: [sales.customerId],
    references: [customers.id],
  }),
  items: many(saleItems),
}));

export const saleItemsRelations = relations(saleItems, ({ one }) => ({
  sale: one(sales, {
    fields: [saleItems.saleId],
    references: [sales.id],
  }),
  product: one(products, {
    fields: [saleItems.productId],
    references: [products.id],
  }),
}));