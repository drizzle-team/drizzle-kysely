CREATE TABLE customer (
	`id` text PRIMARY KEY NOT NULL,
	`company_name` text NOT NULL,
	`contact_name` text NOT NULL,
	`contact_title` text NOT NULL,
	`address` text NOT NULL,
	`city` text NOT NULL,
	`postal_code` text,
	`region` text,
	`country` text NOT NULL,
	`phone` text NOT NULL,
	`fax` text
);

CREATE TABLE order_detail (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`unit_price` numeric NOT NULL,
	`quantity` integer NOT NULL,
	`discount` numeric NOT NULL,
	`order_id` integer NOT NULL,
	`product_id` integer NOT NULL
);

CREATE TABLE employee (
	`id` integer PRIMARY KEY NOT NULL,
	`last_name` text NOT NULL,
	`first_name` text,
	`title` text NOT NULL,
	`title_of_courtesy` text NOT NULL,
	`birth_date` integer NOT NULL,
	`hire_date` integer NOT NULL,
	`address` text NOT NULL,
	`city` text NOT NULL,
	`postal_code` text NOT NULL,
	`country` text NOT NULL,
	`home_phone` text NOT NULL,
	`extension` integer NOT NULL,
	`notes` text NOT NULL,
	`reports_to` integer,
	`photo_path` text,
	FOREIGN KEY (`reports_to`) REFERENCES employee(`id`)
);

CREATE TABLE `order` (
	`id` integer PRIMARY KEY NOT NULL,
	`order_date` integer NOT NULL,
	`required_date` integer NOT NULL,
	`shipped_date` integer,
	`ship_via` integer NOT NULL,
	`freight` numeric NOT NULL,
	`ship_name` text NOT NULL,
	`ship_city` text NOT NULL,
	`ship_region` text,
	`ship_postal_code` text,
	`ship_country` text NOT NULL,
	`customer_id` text NOT NULL,
	`employee_id` integer NOT NULL
);

CREATE TABLE product (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`quantity_per_unit` text NOT NULL,
	`unit_price` numeric NOT NULL,
	`units_in_stock` integer NOT NULL,
	`units_on_order` integer NOT NULL,
	`reorder_level` integer NOT NULL,
	`discontinued` integer NOT NULL,
	`supplier_id` integer NOT NULL,
	FOREIGN KEY (`supplier_id`) REFERENCES supplier(`id`) ON DELETE cascade
);

CREATE TABLE supplier (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company_name` text NOT NULL,
	`contact_name` text NOT NULL,
	`contact_title` text NOT NULL,
	`address` text NOT NULL,
	`city` text NOT NULL,
	`region` text,
	`postal_code` text NOT NULL,
	`country` text NOT NULL,
	`phone` text NOT NULL
);
