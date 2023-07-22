DO $do$
BEGIN
	/*Revoke public access*/
	REVOKE ALL ON DATABASE grocerylist FROM public;
	
	/*Create role*/
	CREATE ROLE grocerylistusers WITH NOLOGIN;
	
	/*Grant permissions to role*/
	GRANT CONNECT ON DATABASE grocerylist TO grocerylistusers;
	GRANT USAGE, SELECT , UPDATE ON all sequences IN schema public TO grocerylistusers;
	GRANT SELECT, UPDATE, DELETE, INSERT, REFERENCES ON ALL TABLES IN SCHEMA public TO grocerylistusers;
	
	/*Create user*/
	CREATE ROLE grocerylistuser LOGIN INHERIT IN ROLE grocerylistusers PASSWORD 'change_me';

	/*pgAdmin bug where valid until is not properly set on password change*/
	ALTER USER grocerylistuser VALID UNTIL 'infinity';

	/*Create tables and their foreign key references*/
	CREATE TABLE IF NOT EXISTS users (
		user_id serial PRIMARY KEY,
		name VARCHAR ( 50 ) NOT NULL,
		email VARCHAR ( 255 ) UNIQUE NOT NULL,
		password VARCHAR ( 255 ) NOT NULL,
		auth_id VARCHAR ( 50 ) NOT NULL
	);
	CREATE TABLE IF NOT EXISTS accounts (
		account_id serial PRIMARY KEY,
		user_id INT NOT NULL,
		name VARCHAR ( 50 ) NOT NULL DEFAULT 'My Grocery Lists',
		FOREIGN KEY (user_id)
		  REFERENCES users (user_id) ON DELETE CASCADE
	);
	CREATE TABLE IF NOT EXISTS account_users (
		account_user_id serial PRIMARY KEY,
		account_id INT NOT NULL,
		user_id INT NOT NULL,
		FOREIGN KEY (account_id)
		  REFERENCES accounts (account_id) ON DELETE CASCADE,
		FOREIGN KEY (user_id)
		  REFERENCES users (user_id) ON DELETE CASCADE
	);
	CREATE TABLE IF NOT EXISTS categories (
		category_id serial PRIMARY KEY,
		account_id INT NOT NULL,
		name VARCHAR ( 50 ) NOT NULL,
		order_id INT NOT NULL,
		FOREIGN KEY (account_id)
		  REFERENCES accounts (account_id) ON DELETE CASCADE
	);
	CREATE TABLE IF NOT EXISTS stores (
		store_id serial PRIMARY KEY,
		account_id INT NOT NULL,
		name VARCHAR ( 50 ) NOT NULL,
		FOREIGN KEY (account_id)
		  REFERENCES accounts (account_id) ON DELETE CASCADE
	);
	CREATE TABLE IF NOT EXISTS items (
		item_id serial PRIMARY KEY,
		account_id INT NOT NULL,
		name VARCHAR ( 50 ) NOT NULL,
		category_id INT NULL,
		store_ids TEXT NULL,
		FOREIGN KEY (account_id)
		  REFERENCES accounts (account_id) ON DELETE CASCADE
	);
	CREATE TABLE IF NOT EXISTS lists (
		list_id serial PRIMARY KEY,
		account_id INT NOT NULL,
		name VARCHAR ( 50 ) NOT NULL,
		FOREIGN KEY (account_id)
		  REFERENCES accounts (account_id) ON DELETE CASCADE
	);
	CREATE TABLE IF NOT EXISTS list_items (
		list_item_id serial PRIMARY KEY,
		list_id INT NOT NULL,
		item_id INT NOT NULL,
		count INT NOT NULL DEFAULT 0,
		FOREIGN KEY (list_id)
		  REFERENCES lists (list_id) ON DELETE CASCADE,
		FOREIGN KEY (item_id)
		  REFERENCES items (item_id) ON DELETE CASCADE
	);
END
$do$