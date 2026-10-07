CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`impersonated_by` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer NOT NULL,
	`image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`role` text DEFAULT 'user',
	`banned` integer DEFAULT false,
	`ban_reason` text,
	`ban_expires` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `routers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`session_name` text NOT NULL,
	`ip_address` text NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`ros_version` text DEFAULT 'v7' NOT NULL,
	`connection_type` text DEFAULT 'auto' NOT NULL,
	`port` integer DEFAULT 80 NOT NULL,
	`use_ssl` integer DEFAULT false NOT NULL,
	`hotspot_name` text,
	`dns_name` text,
	`currency` text DEFAULT 'Rp',
	`reload_interval` integer DEFAULT 60,
	`description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `routers_session_name_unique` ON `routers` (`session_name`);--> statement-breakpoint
CREATE TABLE `quick_prints` (
	`id` text PRIMARY KEY NOT NULL,
	`router_id` text,
	`session_name` text NOT NULL,
	`name` text NOT NULL,
	`server` text NOT NULL,
	`profile` text NOT NULL,
	`prefix` text DEFAULT '',
	`char_length` integer DEFAULT 4,
	`price` integer DEFAULT 0,
	`selling_price` integer DEFAULT 0,
	`time_limit` text DEFAULT '',
	`data_limit` text DEFAULT '',
	`comment` text DEFAULT '',
	`color` text DEFAULT 'bg-blue-500',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`router_id`) REFERENCES `routers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `voucher_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`router_id` text,
	`session_name` text NOT NULL,
	`name` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`router_id`) REFERENCES `routers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
