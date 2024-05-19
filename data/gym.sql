CREATE TABLE "User" (
	"username"	string NOT NULL UNIQUE,
	"password"	string NOT NULL,
	"role"	TEXT NOT NULL,
	PRIMARY KEY("username")
)

CREATE TABLE "Trainer" (
	"trainer_id"	INTEGER NOT NULL,
	"username"	string NOT NULL,
	"date_of_Birth"	datetime,
	"no_of_clients"	integer,
	"experience"	integer,
	"bookability"	boolean,
	"specialty"	integer,
	"fname"	string,
	"lname"	string,
	"email"	string,
	"phone_number"	integer,
	FOREIGN KEY("username") REFERENCES "User"("username") ON UPDATE RESTRICT ON DELETE RESTRICT,
	PRIMARY KEY("trainer_id" AUTOINCREMENT)
)

CREATE TABLE "Customer" (
	"customer_id"	INTEGER NOT NULL,
	"username"	string,
	"fname"	string,
	"lname"	string,
	"email"	string,
	"phone_number"	integer,
	"gender"	string,
	"height"	float,
	"weight"	float,
	"city"	string,
	"date_joined"	datetime,
	"date_of_birth"	datetime,
	FOREIGN KEY("username") REFERENCES "User"("username") ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY("customer_id" AUTOINCREMENT)
)

CREATE TABLE "Gym" (
	"gym_id"	INTEGER NOT NULL,
	"phone_number"	integer,
	"city"	string,
	"street"	string,
	"stree_number"	string,
	PRIMARY KEY("gym_id" AUTOINCREMENT)
)

CREATE TABLE "Anhkei" (
	"username"	string NOT NULL UNIQUE,
	"gym_id"	integer NOT NULL,
	FOREIGN KEY("username") REFERENCES "User"("username") ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY("gym_id") REFERENCES "Gym"("gym_id") ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY("username","gym_id")
)

CREATE TABLE "Membership" (
	"membership_id"	INTEGER NOT NULL,
	"type"	string,
	"montly_cost"	float,
	"description"	string,
	"date_created"	datetime,
	" "	,
	PRIMARY KEY("membership_id" AUTOINCREMENT)
)

CREATE TABLE "Includes" (
	"gym_id" integer,
	"membership_id" integer,
	PRIMARY KEY ("gym_id", "membership_id"),
	FOREIGN KEY ("gym_id") REFERENCES "Gym" ("gym_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE,
	FOREIGN KEY ("membership_id") REFERENCES "Membership" ("membership_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE
)

CREATE TABLE "Class" (
	"class_id"	INTEGER NOT NULL,
	"name"	string,
	"bookability"	boolean,
	"day"	string,
	"time"	string,
	"location"	string,
	"room_capacity"	INTEGER,
	PRIMARY KEY("class_id" AUTOINCREMENT)
)

CREATE TABLE "Supervises" (
	"trainer_id" integer,
	"class_id" integer,
	PRIMARY KEY ("trainer_id", "class_id"),
	FOREIGN KEY ("trainer_id") REFERENCES "Trainer" ("trainer_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE,
	FOREIGN KEY ("class_id") REFERENCES "Class" ("class_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE
)

CREATE TABLE "Offers" (
	"membership_id" integer,
	"class_id" integer,
	PRIMARY KEY ("membership_id", "class_id"),
	FOREIGN KEY ("membership_id") REFERENCES "Membership" ("membership_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE,
	FOREIGN KEY ("class_id") REFERENCES "Class" ("class_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE
)

CREATE TABLE "Books" (
	"book_id"	integer NOT NULL,
	"day"	string,
	"time"	string,
	"class_id"	integer NOT NULL,
	"customer_id"	integer NOT NULL,
	PRIMARY KEY("book_id","class_id","customer_id"),
	FOREIGN KEY("customer_id") REFERENCES "Customer"("customer_id") ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY("class_id") REFERENCES "Class"("class_id") ON UPDATE CASCADE ON DELETE CASCADE
)

CREATE TABLE "Selects" (
	"customer_id" integer,
	"membership_id" integer,
	PRIMARY KEY ("customer_id", "membership_id"),
	FOREIGN KEY ("customer_id") REFERENCES "Class" ("class_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE,
	FOREIGN KEY ("membership_id") REFERENCES "Membership" ("membership_id")
            ON UPDATE CASCADE
            ON DELETE CASCADE
)

