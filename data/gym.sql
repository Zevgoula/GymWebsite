CREATE TABLE IF NOT EXISTS "User" (
	"username" string,
	"password" string,
	"role" string,
	PRIMARY KEY ("username")
);

CREATE TABLE IF NOT EXISTS "Trainer" (
	"trainer_id" integer,
	"username" string,
	"date_of_Birth" datetime,
	"no_of_clients" integer,
	"experience" integer,
	"bookability" boolean,
	"specialty" integer,
	"fname" string,
	"lname" string,
	"email" string,
	"phone_number" integer,
	PRIMARY KEY ("trainer_id", "username"),
	FOREIGN KEY ("username") REFERENCES "User" ("username")
            ON UPDATE RESTRICT
            ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS "Customer" (
	"customer_id" ,
	"username" string,
	"fname" string,
	"lname" string,
	"email" string,
	"phone_number" integer,
	"gender" string,
	"height" float,
	"weight" float,
	"city" string,
	"date_joined" datetime,
	"date_of_birth" datetime,
	PRIMARY KEY ("customer_id", "username"),
	FOREIGN KEY ("username") REFERENCES "User" ("username")
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Gym" (
	"gym_id" integer,
	"phone_number" integer,
	"city" string,
	"street" string,
	"stree_number" string,
	PRIMARY KEY ("gym_id")
);

CREATE TABLE IF NOT EXISTS "Anhkei" (
	"username" string,
	"gym_id" integer,
	PRIMARY KEY ("username", "gym_id"),
	FOREIGN KEY ("username") REFERENCES "User" ("username")
            ON UPDATE CASCADE
            ON DELETE CASCADE,
	FOREIGN KEY ("gym_id") REFERENCES "Gym" ("gym_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Membership" (
	"membership_id" integer,
	"type" string,
	"montly_cost" float,
	"description" string,
	"date_created" datetime,
	" " ,
	PRIMARY KEY ("membership_id")
);

CREATE TABLE IF NOT EXISTS "Includes" (
	"gym_id" integer,
	"membership_id" integer,
	PRIMARY KEY ("gym_id", "membership_id"),
	FOREIGN KEY ("gym_id") REFERENCES "Gym" ("gym_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE,
	FOREIGN KEY ("membership_id") REFERENCES "Membership" ("membership_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Class" (
	"class_id" integer,
	"name" string,
	"bookability" boolean,
	"day" string,
	"time" string,
	"location" string,
	PRIMARY KEY ("class_id")
);

CREATE TABLE IF NOT EXISTS "Supervises" (
	"trainer_id" integer,
	"class_id" integer,
	PRIMARY KEY ("trainer_id", "class_id"),
	FOREIGN KEY ("trainer_id") REFERENCES "Trainer" ("trainer_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE,
	FOREIGN KEY ("class_id") REFERENCES "Class" ("class_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Offers" (
	"membership_id" integer,
	"class_id" integer,
	PRIMARY KEY ("membership_id", "class_id"),
	FOREIGN KEY ("membership_id") REFERENCES "Membership" ("membership_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE,
	FOREIGN KEY ("class_id") REFERENCES "Class" ("class_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Books" (
	"book_id" integer,
	"day" string,
	"time" string,
	"class_id" integer,
	"customer_id" integer,
	PRIMARY KEY ("book_id", "class_id", "customer_id"),
	FOREIGN KEY ("class_id") REFERENCES "Class" ("class_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE,
	FOREIGN KEY ("customer_id") REFERENCES "Customer" ("customer_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Selects" (
	"customer_id" integer,
	"membership_id" integer,
	PRIMARY KEY ("customer_id", "membership_id"),
	FOREIGN KEY ("customer_id") REFERENCES "Class" ("class_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE,
	FOREIGN KEY ("membership_id") REFERENCES "Membership" ("membership_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE
);

