DO $$
declare new_user_id INTEGER;
declare new_account_id INTEGER;
declare new_list_1_id INTEGER;
declare new_list_2_id INTEGER;
declare new_category_fruit_id INTEGER;
declare new_category_dairy_id INTEGER;
declare new_category_meat_id INTEGER;
declare new_category_canned_goods_id INTEGER;
declare new_category_personal_care_id INTEGER;
declare new_store_walmart_id INTEGER;
declare new_store_yigs_id INTEGER;
declare new_store_sobeys_id INTEGER;
declare new_item_1 INTEGER;
declare new_item_2 INTEGER;
declare new_item_3 INTEGER;
declare new_item_4 INTEGER;
declare new_item_5 INTEGER;
declare new_item_6 INTEGER;
declare new_item_7 INTEGER;
declare new_item_8 INTEGER;
declare new_item_9 INTEGER;
declare new_item_10 INTEGER;

BEGIN
INSERT INTO users (name, email, password, auth_id) VALUES ('User-1', 'user@some-email.com', '$2b$10$x1FG5UVhySW/hjuCxIPZi.srFYXOtgbfvqR9zAXBqPOx2XslGPvYO', gen_random_uuid()) RETURNING user_id INTO new_user_id;

INSERT INTO accounts (user_id, name) VALUES (new_user_id, 'My Grocery Lists') RETURNING account_id INTO new_account_id;

INSERT INTO account_users (account_id, user_id) VALUES (new_account_id, new_user_id);

INSERT INTO lists (account_id, name) VALUES (new_account_id, 'list 1') RETURNING list_id INTO new_list_1_id;
INSERT INTO lists (account_id, name) VALUES (new_account_id, 'list 2') RETURNING list_id INTO new_list_2_id;
INSERT INTO lists (account_id, name) VALUES (new_account_id, 'list 3');

INSERT INTO categories (account_id, name, order_id) VALUES (new_account_id, 'Fruits', 1) RETURNING category_id INTO new_category_fruit_id;
INSERT INTO categories (account_id, name, order_id) VALUES (new_account_id, 'Meat', 2) RETURNING category_id INTO new_category_meat_id;
INSERT INTO categories (account_id, name, order_id) VALUES (new_account_id, 'Dairy', 3) RETURNING category_id INTO new_category_dairy_id;
INSERT INTO categories (account_id, name, order_id) VALUES (new_account_id, 'Frozen Foods', 4);
INSERT INTO categories (account_id, name, order_id) VALUES (new_account_id, 'Break & Bakery', 5);
INSERT INTO categories (account_id, name, order_id) VALUES (new_account_id, 'Canned Goods', 6) RETURNING category_id INTO new_category_canned_goods_id;
INSERT INTO categories (account_id, name, order_id) VALUES (new_account_id, 'Cleaning Supplies', 7);
INSERT INTO categories (account_id, name, order_id) VALUES (new_account_id, 'Personal Care', 8) RETURNING category_id INTO new_category_personal_care_id;
INSERT INTO categories (account_id, name, order_id) VALUES (new_account_id, 'Pasta & Cereals', 9);
INSERT INTO categories (account_id, name, order_id) VALUES (new_account_id, 'Pet Supplies', 10);

INSERT INTO stores (account_id, name) VALUES (new_account_id, 'Walmart') RETURNING store_id INTO new_store_walmart_id;
INSERT INTO stores (account_id, name) VALUES (new_account_id, 'Yigs') RETURNING store_id INTO new_store_yigs_id;
INSERT INTO stores (account_id, name) VALUES (new_account_id, 'Sobeys') RETURNING store_id INTO new_store_sobeys_id;
INSERT INTO stores (account_id, name) VALUES (new_account_id, 'Dollarama');

INSERT INTO  items (account_id, category_id, store_ids, name) VALUES (new_account_id, new_category_fruit_id, new_store_yigs_id, 'Apples') RETURNING item_id INTO new_item_1;
INSERT INTO  items (account_id, category_id, store_ids, name) VALUES (new_account_id, new_category_fruit_id, new_store_yigs_id, 'Bananas') RETURNING item_id INTO new_item_2;
INSERT INTO  items (account_id, category_id, store_ids, name) VALUES (new_account_id, new_category_fruit_id, new_store_yigs_id, 'Oranges') RETURNING item_id INTO new_item_3;
INSERT INTO  items (account_id, category_id, store_ids, name) VALUES (new_account_id, new_category_meat_id, new_store_yigs_id, 'Sliced Turkey Breast') RETURNING item_id INTO new_item_4;
INSERT INTO  items (account_id, category_id, store_ids, name) VALUES (new_account_id, new_category_meat_id, new_store_yigs_id, 'Hamburgers') RETURNING item_id INTO new_item_5;
INSERT INTO  items (account_id, category_id, store_ids, name) VALUES (new_account_id, new_category_meat_id, new_store_yigs_id, 'Bacon');
INSERT INTO  items (account_id, category_id, store_ids, name) VALUES (new_account_id, new_category_meat_id, new_store_yigs_id, 'Chicken Breasts');
INSERT INTO  items (account_id, category_id, store_ids, name) VALUES (new_account_id, new_category_dairy_id, new_store_yigs_id, 'Lactose free Milk (Bags)') RETURNING item_id INTO new_item_6;
INSERT INTO  items (account_id, category_id, store_ids, name) VALUES (new_account_id, new_category_dairy_id, new_store_yigs_id, '1% Skim Milk (Bags)') RETURNING item_id INTO new_item_7;
INSERT INTO  items (account_id, category_id, store_ids, name) VALUES (new_account_id, new_category_dairy_id, new_store_yigs_id, 'Eggs');
INSERT INTO  items (account_id, category_id, store_ids, name) VALUES (new_account_id, new_category_personal_care_id, new_store_walmart_id, 'Once a Day - Vitamins') RETURNING item_id INTO new_item_8;
INSERT INTO  items (account_id, category_id, store_ids, name) VALUES (new_account_id, new_category_personal_care_id, new_store_walmart_id, 'Toothpaste') RETURNING item_id INTO new_item_9;
INSERT INTO  items (account_id, category_id, store_ids, name) VALUES (new_account_id, new_category_personal_care_id, new_store_walmart_id, 'Shampoo') RETURNING item_id INTO new_item_10;
INSERT INTO  items (account_id, category_id, store_ids, name) VALUES (new_account_id, new_category_personal_care_id, new_store_walmart_id, 'Deodorant');

INSERT INTO list_items (list_id, item_id, count) VALUES (new_list_1_id, new_item_1, 6);
INSERT INTO list_items (list_id, item_id, count) VALUES (new_list_1_id, new_item_2, 5);
INSERT INTO list_items (list_id, item_id, count) VALUES (new_list_1_id, new_item_3, 4);
INSERT INTO list_items (list_id, item_id, count) VALUES (new_list_1_id, new_item_4, 5);
INSERT INTO list_items (list_id, item_id, count) VALUES (new_list_1_id, new_item_5, 4);
INSERT INTO list_items (list_id, item_id, count) VALUES (new_list_1_id, new_item_6, 1);
INSERT INTO list_items (list_id, item_id, count) VALUES (new_list_1_id, new_item_7, 1);
INSERT INTO list_items (list_id, item_id, count) VALUES (new_list_1_id, new_item_8, 1);
INSERT INTO list_items (list_id, item_id, count) VALUES (new_list_1_id, new_item_9, 1);
INSERT INTO list_items (list_id, item_id, count) VALUES (new_list_1_id, new_item_10, 1);

INSERT INTO list_items (list_id, item_id, count) VALUES (new_list_2_id, new_item_1, 1);
INSERT INTO list_items (list_id, item_id, count) VALUES (new_list_2_id, new_item_2, 1);
INSERT INTO list_items (list_id, item_id, count) VALUES (new_list_2_id, new_item_3, 1);
INSERT INTO list_items (list_id, item_id, count) VALUES (new_list_2_id, new_item_4, 3);
INSERT INTO list_items (list_id, item_id, count) VALUES (new_list_2_id, new_item_5, 2);
END $$;