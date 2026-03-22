CREATE TABLE `distributionHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`platform` enum('gumroad','etsy','shopify','lemonsqueezy') NOT NULL,
	`status` enum('pending','success','failed') DEFAULT 'pending',
	`errorMessage` text,
	`distributedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `distributionHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marketingContent` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`platform` enum('twitter','linkedin','facebook') NOT NULL,
	`postContent` text,
	`hashtags` text,
	`mentions` text,
	`mediaUrls` json,
	`status` enum('draft','scheduled','published') DEFAULT 'draft',
	`scheduledAt` timestamp,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `marketingContent_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `platformConfigs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`platform` enum('gumroad','etsy','shopify','lemonsqueezy') NOT NULL,
	`isEnabled` boolean DEFAULT true,
	`platformProductId` varchar(255),
	`platformTitle` varchar(255),
	`platformDescription` text,
	`platformPrice` decimal(10,2),
	`platformCurrency` varchar(3) DEFAULT 'USD',
	`customSettings` json,
	`status` enum('pending','synced','failed') DEFAULT 'pending',
	`lastSyncedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `platformConfigs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productAssets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`assetUrl` text NOT NULL,
	`assetKey` varchar(255) NOT NULL,
	`assetType` enum('thumbnail','preview','promotional','other') DEFAULT 'other',
	`mimeType` varchar(100),
	`width` int,
	`height` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `productAssets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productPricing` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`basePrice` decimal(10,2) NOT NULL,
	`baseCurrency` varchar(3) DEFAULT 'USD',
	`gumroadPrice` decimal(10,2),
	`etsyPrice` decimal(10,2),
	`shopifyPrice` decimal(10,2),
	`lemonsqueezyPrice` decimal(10,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `productPricing_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100),
	`fileUrl` text,
	`fileKey` varchar(255),
	`fileSize` int,
	`fileMimeType` varchar(100),
	`thumbnail` text,
	`status` enum('draft','ready','distributed') DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
