CREATE TABLE `snapshots` (
	`user_id` text NOT NULL,
	`key` text NOT NULL,
	`payload` text NOT NULL,
	PRIMARY KEY(`user_id`, `key`)
);
