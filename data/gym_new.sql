CREATE TABLE IF NOT EXISTS "USER" (
	"username" text,
	"password" text,
	"role" text,
	PRIMARY KEY ("username")
);

CREATE TABLE IF NOT EXISTS "CUSTOMER" (
	"customer_id" integer,
	"username" text,
	"fname" text,
	"lname" text,
	PRIMARY KEY ("customer_id", "username"),
	FOREIGN KEY ("username") REFERENCES "USER" ("username")
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "GYM" (
	"gym_id" integer,
	"location" text,
	"phone_number" integer,
	"Address" text,
	PRIMARY KEY ("gym_id")
);

CREATE TABLE IF NOT EXISTS "SESSION" (
	"session_id" integer,
	"capacity" integer,
	"day" text,
	"time" text,
	PRIMARY KEY ("session_id")
);

CREATE TABLE IF NOT EXISTS "CLASS" (
	"class_id" integer,
	"name" text,
	PRIMARY KEY ("class_id")
);

CREATE TABLE IF NOT EXISTS "OFFERS" (
	"gym_id" integer,
	"membership_id" integer,
	PRIMARY KEY ("gym_id", "membership_id"),
	FOREIGN KEY ("gym_id") REFERENCES "GYM" ("gym_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE,
	FOREIGN KEY ("membership_id") REFERENCES "MEMBERSHIP" ("membership_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "MEMBERSHIP" (
	"membership_id" integer,
	"cost" float,
	"length" float,
	PRIMARY KEY ("membership_id")
);

CREATE TABLE IF NOT EXISTS "BUYS" (
	"membership_id" integer,
	"customer_id" integer,
	"purchase_id" integer,
	"start_date" datetime,
	"exp_date" datetime,
	PRIMARY KEY ("membership_id", "customer_id", "purchase_id"),
	FOREIGN KEY ("membership_id") REFERENCES "MEMBERSHIP" ("membership_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE,
	FOREIGN KEY ("customer_id") REFERENCES "CUSTOMER" ("customer_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "INCLUDES" (
	"class_id" integer,
	"membership_id" integer,
	PRIMARY KEY ("class_id", "membership_id"),
	FOREIGN KEY ("class_id") REFERENCES "CLASS" ("class_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE,
	FOREIGN KEY ("membership_id") REFERENCES "MEMBERSHIP" ("membership_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "BOOKS" (
	"book_id" integer,
	"customer_id" integer,
	"session_id" integer,
	"day" text,
	"time" text,
	PRIMARY KEY ("book_id", "customer_id", "session_id"),
	FOREIGN KEY ("customer_id") REFERENCES "CUSTOMER" ("customer_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE,
	FOREIGN KEY ("session_id") REFERENCES "SESSION" ("session_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "REPRESENTS" (
	"class_id" integer,
	"session_id" integer,
	PRIMARY KEY ("class_id", "session_id"),
	FOREIGN KEY ("class_id") REFERENCES "CLASS" ("class_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE,
	FOREIGN KEY ("session_id") REFERENCES "SESSION" ("session_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

