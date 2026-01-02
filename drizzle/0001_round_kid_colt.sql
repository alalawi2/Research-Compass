CREATE TABLE `budgets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int NOT NULL,
	`user_id` int NOT NULL,
	`categories` text NOT NULL,
	`total_amount` int NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'USD',
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `budgets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`project_id` int,
	`title` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chat_conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversation_id` int NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`type` enum('bug','feature','feedback','question') NOT NULL,
	`subject` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`status` enum('new','reviewed','resolved') NOT NULL DEFAULT 'new',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `feedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`study_type` varchar(100),
	`status` enum('draft','in_progress','completed','archived') NOT NULL DEFAULT 'draft',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proposals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int NOT NULL,
	`user_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`introduction` text,
	`methods` text,
	`results` text,
	`discussion` text,
	`references` text,
	`version` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `proposals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sample_size_calculations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int NOT NULL,
	`user_id` int NOT NULL,
	`test_type` varchar(100) NOT NULL,
	`parameters` text NOT NULL,
	`result` text NOT NULL,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sample_size_calculations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `saved_papers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int NOT NULL,
	`user_id` int NOT NULL,
	`pubmed_id` varchar(50),
	`title` varchar(500) NOT NULL,
	`authors` text,
	`abstract` text,
	`journal` varchar(255),
	`year` int,
	`doi` varchar(100),
	`url` varchar(500),
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `saved_papers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `timelines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int NOT NULL,
	`user_id` int NOT NULL,
	`milestones` text NOT NULL,
	`start_date` timestamp,
	`end_date` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `timelines_id` PRIMARY KEY(`id`)
);
