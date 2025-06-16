CREATE TABLE `streamio_room_rates` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`rate` text(1) NOT NULL,
	`comment` text(1000),
	`user_id` text,
	`room_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `streamio_user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`room_id`) REFERENCES `streamio_room`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
/*
 SQLite does not support "Set default to column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/
