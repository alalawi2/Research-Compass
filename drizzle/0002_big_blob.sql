CREATE TABLE `project_activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int NOT NULL,
	`user_id` int NOT NULL,
	`activity_type` varchar(100) NOT NULL,
	`description` text NOT NULL,
	`metadata` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `project_activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_collaborators` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int NOT NULL,
	`user_id` int NOT NULL,
	`role` enum('owner','editor','viewer') NOT NULL DEFAULT 'viewer',
	`invited_by` int NOT NULL,
	`invited_at` timestamp NOT NULL DEFAULT (now()),
	`accepted_at` timestamp,
	CONSTRAINT `project_collaborators_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proposal_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`proposal_id` int NOT NULL,
	`user_id` int NOT NULL,
	`section` varchar(100),
	`content` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `proposal_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proposal_revisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`proposal_id` int NOT NULL,
	`user_id` int NOT NULL,
	`version` int NOT NULL,
	`content` text NOT NULL,
	`change_description` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `proposal_revisions_id` PRIMARY KEY(`id`)
);
