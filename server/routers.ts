import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Product management procedures
  products: router({
    list: protectedProcedure
      .query(async ({ ctx }) => {
        return db.getUserProducts(ctx.user.id);
      }),

    get: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input, ctx }) => {
        const product = await db.getProductById(input.productId);
        if (!product || product.userId !== ctx.user.id) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return product;
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await db.createProduct({
          userId: ctx.user.id,
          name: input.name,
          description: input.description,
          category: input.category,
          status: "draft",
        });
        return result;
      }),

    update: protectedProcedure
      .input(z.object({
        productId: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        status: z.enum(["draft", "ready", "distributed"]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const product = await db.getProductById(input.productId);
        if (!product || product.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await db.updateProduct(input.productId, {
          name: input.name,
          description: input.description,
          category: input.category,
          status: input.status,
        });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const product = await db.getProductById(input.productId);
        if (!product || product.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        // TODO: Implement soft delete or cascade delete logic
        return { success: true };
      }),
  }),

  // Asset management procedures
  assets: router({
    list: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input, ctx }) => {
        const product = await db.getProductById(input.productId);
        if (!product || product.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return db.getProductAssets(input.productId);
      }),

    create: protectedProcedure
      .input(z.object({
        productId: z.number(),
        assetUrl: z.string(),
        assetKey: z.string(),
        assetType: z.enum(["thumbnail", "preview", "promotional", "other"]),
        mimeType: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const product = await db.getProductById(input.productId);
        if (!product || product.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return db.createProductAsset({
          productId: input.productId,
          assetUrl: input.assetUrl,
          assetKey: input.assetKey,
          assetType: input.assetType,
          mimeType: input.mimeType,
          width: input.width,
          height: input.height,
        });
      }),
  }),

  // Platform distribution procedures
  platforms: router({
    getConfigs: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input, ctx }) => {
        const product = await db.getProductById(input.productId);
        if (!product || product.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return db.getPlatformConfigs(input.productId);
      }),

    updateConfig: protectedProcedure
      .input(z.object({
        configId: z.number(),
        productId: z.number(),
        isEnabled: z.boolean().optional(),
        platformTitle: z.string().optional(),
        platformDescription: z.string().optional(),
        platformPrice: z.string().optional(),
        platformCurrency: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const product = await db.getProductById(input.productId);
        if (!product || product.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await db.updatePlatformConfig(input.configId, {
          isEnabled: input.isEnabled,
          platformTitle: input.platformTitle,
          platformDescription: input.platformDescription,
          platformPrice: input.platformPrice as any,
          platformCurrency: input.platformCurrency,
        });
        return { success: true };
      }),
  }),

  // Pricing procedures
  pricing: router({
    get: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input, ctx }) => {
        const product = await db.getProductById(input.productId);
        if (!product || product.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return db.getProductPricing(input.productId);
      }),

    update: protectedProcedure
      .input(z.object({
        productId: z.number(),
        basePrice: z.string(),
        baseCurrency: z.string().optional(),
        gumroadPrice: z.string().optional(),
        etsyPrice: z.string().optional(),
        shopifyPrice: z.string().optional(),
        lemonsqueezyPrice: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const product = await db.getProductById(input.productId);
        if (!product || product.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const existing = await db.getProductPricing(input.productId);
        if (existing) {
            await db.updateProductPricing(existing.id, {
            basePrice: input.basePrice as any,
            baseCurrency: input.baseCurrency,
            gumroadPrice: input.gumroadPrice as any,
            etsyPrice: input.etsyPrice as any,
            shopifyPrice: input.shopifyPrice as any,
            lemonsqueezyPrice: input.lemonsqueezyPrice as any,
          });
        } else {
          await db.createProductPricing({
            productId: input.productId,
            basePrice: input.basePrice as any,
            baseCurrency: input.baseCurrency,
            gumroadPrice: input.gumroadPrice as any,
            etsyPrice: input.etsyPrice as any,
            shopifyPrice: input.shopifyPrice as any,
            lemonsqueezyPrice: input.lemonsqueezyPrice as any,
          });
        }
        return { success: true };
      }),
  }),

  // Marketing content procedures
  marketing: router({
    list: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input, ctx }) => {
        const product = await db.getProductById(input.productId);
        if (!product || product.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return db.getMarketingContent(input.productId);
      }),

    create: protectedProcedure
      .input(z.object({
        productId: z.number(),
        platform: z.enum(["twitter", "linkedin", "facebook"]),
        postContent: z.string(),
        hashtags: z.string().optional(),
        mentions: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const product = await db.getProductById(input.productId);
        if (!product || product.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return db.createMarketingContent({
          productId: input.productId,
          platform: input.platform,
          postContent: input.postContent,
          hashtags: input.hashtags,
          mentions: input.mentions,
          status: "draft",
        });
      }),
  }),

  // Distribution history procedures
  distribution: router({
    history: protectedProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input, ctx }) => {
        const product = await db.getProductById(input.productId);
        if (!product || product.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return db.getDistributionHistory(input.productId);
      }),

    record: protectedProcedure
      .input(z.object({
        productId: z.number(),
        platform: z.enum(["gumroad", "etsy", "shopify", "lemonsqueezy"]),
        status: z.enum(["pending", "success", "failed"]),
        errorMessage: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const product = await db.getProductById(input.productId);
        if (!product || product.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return db.createDistributionRecord({
          productId: input.productId,
          platform: input.platform,
          status: input.status,
          errorMessage: input.errorMessage,
          distributedAt: input.status === "success" ? new Date() : undefined,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
