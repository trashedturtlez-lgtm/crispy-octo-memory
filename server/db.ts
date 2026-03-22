import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, productAssets, platformConfigs, productPricing, marketingContent, distributionHistory, InsertProduct, InsertProductAsset, InsertPlatformConfig, InsertProductPricing, InsertMarketingContent, InsertDistributionHistory } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Product queries
export async function getUserProducts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(eq(products.userId, userId));
}

export async function getProductById(productId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, productId)).limit(1);
  return result[0];
}

export async function createProduct(data: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(products).values(data);
  return result;
}

export async function updateProduct(productId: number, data: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(products).set(data).where(eq(products.id, productId));
}

// Asset queries
export async function getProductAssets(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(productAssets).where(eq(productAssets.productId, productId));
}

export async function createProductAsset(data: InsertProductAsset) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(productAssets).values(data);
}

// Platform config queries
export async function getPlatformConfigs(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(platformConfigs).where(eq(platformConfigs.productId, productId));
}

export async function createPlatformConfig(data: InsertPlatformConfig) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(platformConfigs).values(data);
}

export async function updatePlatformConfig(configId: number, data: Partial<InsertPlatformConfig>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(platformConfigs).set(data).where(eq(platformConfigs.id, configId));
}

// Pricing queries
export async function getProductPricing(productId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(productPricing).where(eq(productPricing.productId, productId)).limit(1);
  return result[0];
}

export async function createProductPricing(data: InsertProductPricing) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(productPricing).values(data);
}

export async function updateProductPricing(pricingId: number, data: Partial<InsertProductPricing>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(productPricing).set(data).where(eq(productPricing.id, pricingId));
}

// Marketing content queries
export async function getMarketingContent(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(marketingContent).where(eq(marketingContent.productId, productId));
}

export async function createMarketingContent(data: InsertMarketingContent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(marketingContent).values(data);
}

// Distribution history queries
export async function getDistributionHistory(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(distributionHistory).where(eq(distributionHistory.productId, productId));
}

export async function createDistributionRecord(data: InsertDistributionHistory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(distributionHistory).values(data);
}
