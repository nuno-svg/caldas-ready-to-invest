CREATE TABLE `dimension_scores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`submission_id` text NOT NULL,
	`dimension` text NOT NULL,
	`readiness` integer NOT NULL,
	`priority` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_dimension_scores_submission` ON `dimension_scores` (`submission_id`);--> statement-breakpoint
CREATE INDEX `idx_dimension_scores_dimension` ON `dimension_scores` (`dimension`);--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`respondent_name` text NOT NULL,
	`respondent_email` text NOT NULL,
	`organization` text NOT NULL,
	`role` text DEFAULT '' NOT NULL,
	`archetype` text NOT NULL,
	`consent` integer NOT NULL,
	`overall_score` integer NOT NULL,
	`maturity_band` text NOT NULL,
	`responses_json` text NOT NULL,
	`themes_json` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_submissions_created_at` ON `submissions` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_submissions_archetype` ON `submissions` (`archetype`);