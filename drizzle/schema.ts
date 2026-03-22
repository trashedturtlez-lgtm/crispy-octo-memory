import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Products table
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  fileUrl: text("fileUrl"),
  fileKey: varchar("fileKey", { length: 255 }),
  fileSize: int("fileSize"),
  fileMimeType: varchar("fileMimeType", { length: 100 }),
  thumbnail: text("thumbnail"),
  status: mysqlEnum("status", ["draft", "ready", "distributed"]).default("draft"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// Product Assets (images, graphics)
export const productAssets = mysqlTable("productAssets", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  assetUrl: text("assetUrl").notNull(),
  assetKey: varchar("assetKey", { length: 255 }).notNull(),
  assetType: mysqlEnum("assetType", ["thumbnail", "preview", "promotional", "other"]).default("other"),
  mimeType: varchar("mimeType", { length: 100 }),
  width: int("width"),
  height: int("height"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProductAsset = typeof productAssets.$inferSelect;
export type InsertProductAsset = typeof productAssets.$inferInsert;

// Platform Configurations
export const platformConfigs = mysqlTable("platformConfigs", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  platform: mysqlEnum("platform", ["gumroad", "etsy", "shopify", "lemonsqueezy"]).notNull(),
  isEnabled: boolean("isEnabled").default(true),
  platformProductId: varchar("platformProductId", { length: 255 }),
  platformTitle: varchar("platformTitle", { length: 255 }),
  platformDescription: text("platformDescription"),
  platformPrice: decimal("platformPrice", { precision: 10, scale: 2 }),
  platformCurrency: varchar("platformCurrency", { length: 3 }).default("USD"),
  customSettings: json("customSettings"),
  status: mysqlEnum("status", ["pending", "synced", "failed"]).default("pending"),
  lastSyncedAt: timestamp("lastSyncedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PlatformConfig = typeof platformConfigs.$inferSelect;
export type InsertPlatformConfig = typeof platformConfigs.$inferInsert;

// Product Pricing
export const productPricing = mysqlTable("productPricing", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  basePrice: decimal("basePrice", { precision: 10, scale: 2 }).notNull(),
  baseCurrency: varchar("baseCurrency", { length: 3 }).default("USD"),
  gumroadPrice: decimal("gumroadPrice", { precision: 10, scale: 2 }),
  etsyPrice: decimal("etsyPrice", { precision: 10, scale: 2 }),
  shopifyPrice: decimal("shopifyPrice", { precision: 10, scale: 2 }),
  lemonsqueezyPrice: decimal("lemonsqueezyPrice", { precision: 10, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductPricing = typeof productPricing.$inferSelect;
export type InsertProductPricing = typeof productPricing.$inferInsert;

// Marketing Content
export const marketingContent = mysqlTable("marketingContent", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  platform: mysqlEnum("platform", ["twitter", "linkedin", "facebook"]).notNull(),
  postContent: text("postContent"),
  hashtags: text("hashtags"),
  mentions: text("mentions"),
  mediaUrls: json("mediaUrls"),
  status: mysqlEnum("status", ["draft", "scheduled", "published"]).default("draft"),
  scheduledAt: timestamp("scheduledAt"),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MarketingContent = typeof marketingContent.$inferSelect;
export type InsertMarketingContent = typeof marketingContent.$inferInsert;

// Distribution History
export const distributionHistory = mysqlTable("distributionHistory", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  platform: mysqlEnum("platform", ["gumroad", "etsy", "shopify", "lemonsqueezy"]).notNull(),
  status: mysqlEnum("status", ["pending", "success", "failed"]).default("pending"),
  errorMessage: text("errorMessage"),
  distributedAt: timestamp("distributedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DistributionHistory = typeof distributionHistory.$inferSelect;
export type InsertDistributionHistory = typeof distributionHistory.$inferInsert;
