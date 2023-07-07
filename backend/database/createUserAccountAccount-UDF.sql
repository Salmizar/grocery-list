CREATE OR REPLACE FUNCTION createAccountAndUser( accountName VARCHAR(50), fullName VARCHAR(50), emailAddress VARCHAR(255), auth_id VARCHAR(50), userPassword VARCHAR(255)) returns
SETOF accounts AS $$
DECLARE u_id INTEGER;
DECLARE a_id INTEGER;
DECLARE new_list_1_id INTEGER;
DECLARE new_category_fruit_id INTEGER;
DECLARE new_category_dairy_id INTEGER;
DECLARE new_category_meat_id INTEGER;
DECLARE new_category_canned_goods_id INTEGER;
DECLARE new_category_personal_care_id INTEGER;
DECLARE new_store_walmart_id INTEGER;
DECLARE new_store_yigs_id INTEGER;
DECLARE new_store_sobeys_id INTEGER;
DECLARE new_item_1 INTEGER;
BEGIN
	IF NOT EXISTS (Select user_id from users where email = emailAddress) THEN

		INSERT INTO users (name, email, auth_id, password) VALUES (fullName, emailAddress, auth_id, userPassword) RETURNING user_id INTO u_id;

		INSERT INTO accounts (user_id, name) VALUES (u_id, accountName) RETURNING account_id INTO a_id;
		INSERT INTO account_users (account_id, user_id) VALUES (a_id, u_id);
	
		INSERT INTO lists (account_id, name) VALUES (a_id, 'list 1') RETURNING list_id INTO new_list_1_id;

		INSERT INTO categories (account_id, name, order_id) VALUES (a_id, 'Fruits', 1) RETURNING category_id INTO new_category_fruit_id;
		INSERT INTO categories (account_id, name, order_id) VALUES (a_id, 'Meat', 2) RETURNING category_id INTO new_category_meat_id;
		INSERT INTO categories (account_id, name, order_id) VALUES (a_id, 'Dairy', 3) RETURNING category_id INTO new_category_dairy_id;
		INSERT INTO categories (account_id, name, order_id) VALUES (a_id, 'Frozen Foods', 4);
		INSERT INTO categories (account_id, name, order_id) VALUES (a_id, 'Break & Bakery', 5);
		INSERT INTO categories (account_id, name, order_id) VALUES (a_id, 'Canned Goods', 6) RETURNING category_id INTO new_category_canned_goods_id;
		INSERT INTO categories (account_id, name, order_id) VALUES (a_id, 'Cleaning Supplies', 7);
		INSERT INTO categories (account_id, name, order_id) VALUES (a_id, 'Personal Care', 8) RETURNING category_id INTO new_category_personal_care_id;
		INSERT INTO categories (account_id, name, order_id) VALUES (a_id, 'Pasta & Cereals', 9);
		INSERT INTO categories (account_id, name, order_id) VALUES (a_id, 'Pet Supplies', 10);

		INSERT INTO stores (account_id, name) VALUES (a_id, 'Walmart') RETURNING store_id INTO new_store_walmart_id;
		INSERT INTO stores (account_id, name) VALUES (a_id, 'Yigs') RETURNING store_id INTO new_store_yigs_id;
		INSERT INTO stores (account_id, name) VALUES (a_id, 'Sobeys') RETURNING store_id INTO new_store_sobeys_id;
		INSERT INTO stores (account_id, name) VALUES (a_id, 'Dollarama');

		INSERT INTO  items (account_id, category_id, store_ids, name) VALUES (a_id, new_category_fruit_id, new_store_yigs_id, 'Apples') RETURNING item_id INTO new_item_1;
		INSERT INTO  items (account_id, category_id, store_ids, name) VALUES (a_id, new_category_fruit_id, new_store_yigs_id, 'Bananas');
		INSERT INTO  items (account_id, category_id, store_ids, name) VALUES (a_id, new_category_fruit_id, new_store_yigs_id, 'Oranges');
		INSERT INTO  items (account_id, category_id, store_ids, name) VALUES (a_id, new_category_meat_id, new_store_yigs_id, 'Sliced Turkey Breast');
		INSERT INTO  items (account_id, category_id, store_ids, name) VALUES (a_id, new_category_meat_id, new_store_yigs_id, 'Hamburgers');
		INSERT INTO  items (account_id, category_id, store_ids, name) VALUES (a_id, new_category_dairy_id, new_store_yigs_id, 'Lactose free Milk (Bags)');
		INSERT INTO  items (account_id, category_id, store_ids, name) VALUES (a_id, new_category_dairy_id, new_store_yigs_id, '1% Skim Milk (Bags)');
		INSERT INTO  items (account_id, category_id, store_ids, name) VALUES (a_id, new_category_personal_care_id, new_store_walmart_id, 'Once a Day - Vitamins');
		INSERT INTO  items (account_id, category_id, store_ids, name) VALUES (a_id, new_category_personal_care_id, new_store_walmart_id, 'Toothpaste');
		INSERT INTO  items (account_id, category_id, store_ids, name) VALUES (a_id, new_category_personal_care_id, new_store_walmart_id, 'Shampoo');

		INSERT INTO list_items (list_id, item_id, count) VALUES (new_list_1_id, new_item_1, 6);
		
		RETURN QUERY SELECT * FROM accounts WHERE account_id = a_id;
	END IF;
END;
$$ language plpgsql;