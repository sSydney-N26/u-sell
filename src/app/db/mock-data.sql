-- === Users ===
INSERT INTO Users (uid, username, email, program, year)
VALUES
  ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'alice@uwaterloo.ca', 'Computer Science', 3),
  ('40d6af98-9170-40ec-95b1-9f521e4958f6', 'barbara10', 'kendragalloway@example.org', 'Computer Science', 1),
  ('2ab3410d-aa84-404e-a9f5-52caa19fe15b', 'curtis61', 'melanie94@example.org', 'Mechanical Engineering', 5),
  ('325c8801-72e0-4f9f-aa7b-4de2c86ab3d4', 'yherrera', 'arnoldmaria@example.net', 'Environment', 1),
  ('83af10c1-2021-4eca-a9e5-76e6f4e9523b', 'jeffrey10', 'herringjames@example.org', 'Computer Science', 1),
  ('790818cc-bef4-4c39-beff-5b8bda31c3df', 'jennifercruz', 'psanchez@example.net', 'Computer Science', 1),
  ('566f84e4-fc6a-4ab8-82be-c440c77b2745', 'stephanie79', 'jrivas@example.com', 'Management Engineering', 4),
  ('15b960cf-c9ee-4159-8fee-6c355f988172', 'jonesjason', 'david51@example.org', 'Arts', 4),
  ('ee5d296c-9dce-4588-b318-4eefd1433c01', 'tasha01', 'kayla51@example.com', 'Biomedical Engineering', 3),
  ('247fc8f9-0491-49ce-aa15-86f829a9554e', 'meagan89', 'ericfarmer@example.net', 'Biomedical Engineering', 1),

  ('uid_bob', 'Bob', 'bob@uwaterloo.ca', 'Electrical Engineering', 3),
  ('uid_carol', 'Carol', 'carol@uwaterloo.ca', 'Mechanical Engineering', 1);

-- === Product Types ===
INSERT INTO ProductType (type)
VALUES
  ('School Supplies'),
  ('Furniture'),
  ('Kitchen'),
  ('Electronics'),
  ('Clothing'),
  ('Misc');

-- === Product Conditions ===
INSERT INTO ProductCondition (type)
VALUES
  ('new'),
  ('like new'),
  ('gently used'),
  ('fair'),
  ('poor');

-- === Listings ===
INSERT INTO Listing (seller_id, type, price, title, description, product_condition, quantity, location, posted_by, status, image_storage_ref)
VALUES
  ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'School Supplies', 40.00, 'CS 246 Textbook', 'Used for one term, some highlights', 'gently used', 1, 'UWaterloo SLC', 'Alice', 'for sale', 'images/cs246.jpg'),
  ('uid_bob', 'Furniture', 25.00, 'IKEA Chair', 'Sturdy and clean', 'like new', 1, 'Off-campus housing near Columbia', 'bob', 'for sale', 'images/chair.jpg'),
  ('uid_carol', 'Kitchen', 10.00, 'Toaster', 'Still works perfectly, just upgraded', 'fair', 1, 'Village 1', 'Carol', 'pending', 'images/toaster.jpg'),
  ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'Electronics', 100.00, 'Bluetooth Speaker', 'Bass heavy, battery still good', 'fair', 1, 'UWaterloo Dana Porter Library', 'Alice', 'sold', 'images/speaker.jpg'),
  ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'Misc', 150.00, 'Hair Dryer', 'Dyson Hair Dryer', 'fair', 1, 'UWaterloo Dana Porter Library', 'Alice', 'sold', 'images/speaker.jpg'),
  ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'School Supplies', 40.00, 'CS 246 Textbook', 'Used for one term, some highlights', 'gently used', 1, 'UWaterloo SLC', 'Alice', 'for sale', 'images/cs246.jpg'),
  ('uid_bob', 'Furniture', 25.00, 'IKEA Chair', 'Sturdy and clean', 'like new', 1, 'Off-campus housing near Columbia', 'Bob', 'for sale', 'images/chair.jpg'),
  ('uid_carol', 'Kitchen', 10.00, 'Toaster', 'Still works perfectly, just upgraded', 'fair', 1, 'Village 1', 'Carol', 'pending', 'images/toaster.jpg'),
  ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'Electronics', 100.00, 'Bluetooth Speaker', 'Bass heavy, battery still good', 'fair', 1, 'UWaterloo Dana Porter Library', 'Alice', 'sold', 'images/speaker.jpg'),
  ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'Misc', 150.00, 'Hair Dryer', 'Dyson Hair Dryer', 'fair', 1, 'UWaterloo Dana Porter Library', 'Alice', 'sold', 'images/speaker.jpg'),
  ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'School Supplies', 40.00, 'CS 246 Textbook', 'Used for one term, some highlights', 'gently used', 1, 'UWaterloo SLC', 'Alice', 'for sale', 'images/cs246.jpg'),
  ('uid_bob', 'Furniture', 25.00, 'IKEA Chair', 'Sturdy and clean', 'like new', 1, 'Off-campus housing near Columbia', 'Bob', 'for sale', 'images/chair.jpg'),
  ('uid_carol', 'Kitchen', 10.00, 'Toaster', 'Still works perfectly, just upgraded', 'fair', 1, 'Village 1', 'Carol', 'pending', 'images/toaster.jpg'),
  ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'Electronics', 100.00, 'Bluetooth Speaker', 'Bass heavy, battery still good', 'fair', 1, 'UWaterloo Dana Porter Library', 'Alice', 'sold', 'images/speaker.jpg'),
  ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'Misc', 150.00, 'Hair Dryer', 'Dyson Hair Dryer', 'fair', 1, 'UWaterloo Dana Porter Library', 'Alice', 'sold', 'images/speaker.jpg'),
  ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'School Supplies', 40.00, 'CS 246 Textbook', 'Used for one term, some highlights', 'gently used', 1, 'UWaterloo SLC', 'Alice', 'for sale', 'images/cs246.jpg'),
  ('uid_bob', 'Furniture', 25.00, 'IKEA Chair', 'Sturdy and clean', 'like new', 1, 'Off-campus housing near Columbia', 'Bob', 'for sale', 'images/chair.jpg'),
  ('uid_carol', 'Kitchen', 10.00, 'Toaster', 'Still works perfectly, just upgraded', 'fair', 1, 'Village 1', 'Carol', 'pending', 'images/toaster.jpg'),
  ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'Electronics', 100.00, 'Bluetooth Speaker', 'Bass heavy, battery still good', 'fair', 1, 'UWaterloo Dana Porter Library', 'Alice', 'sold', 'images/speaker.jpg'),
  ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'Misc', 150.00, 'Hair Dryer', 'Dyson Hair Dryer', 'fair', 1, 'UWaterloo Dana Porter Library', 'Alice', 'sold', 'images/speaker.jpg'),
  ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'School Supplies', 40.00, 'CS 246 Textbook', 'Used for one term, some highlights', 'gently used', 1, 'UWaterloo SLC', 'Alice', 'for sale', 'images/cs246.jpg'),
  ('uid_bob', 'Furniture', 25.00, 'IKEA Chair', 'Sturdy and clean', 'like new', 1, 'Off-campus housing near Columbia', 'Bob', 'for sale', 'images/chair.jpg'),
  ('uid_carol', 'Kitchen', 10.00, 'Toaster', 'Still works perfectly, just upgraded', 'fair', 1, 'Village 1', 'Carol', 'pending', 'images/toaster.jpg'),
  ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'Electronics', 100.00, 'Bluetooth Speaker', 'Bass heavy, battery still good', 'fair', 1, 'UWaterloo Dana Porter Library', 'Alice', 'sold', 'images/speaker.jpg'),
  ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'Misc', 150.00, 'Hair Dryer', 'Dyson Hair Dryer', 'fair', 1, 'UWaterloo Dana Porter Library', 'Alice', 'sold', 'images/speaker.jpg');
-- === Admins ===
INSERT INTO Admin (admin_id)
VALUES
  ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1');

-- Mock Data for Following feature --
-- uid x8uocqJbNoWO7TL6ZCEXCR2Hm1k1 is Alice, has 3 followers
INSERT INTO UserFollowedUsers (user_id, followee_id) VALUES ('40d6af98-9170-40ec-95b1-9f521e4958f6', 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1');
INSERT INTO UserFollowedUsers (user_id, followee_id) VALUES ('2ab3410d-aa84-404e-a9f5-52caa19fe15b', 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1');
INSERT INTO UserFollowedUsers (user_id, followee_id) VALUES ('325c8801-72e0-4f9f-aa7b-4de2c86ab3d4', 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1');

INSERT INTO UserFollowedUsers (user_id, followee_id) VALUES ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', '40d6af98-9170-40ec-95b1-9f521e4958f6');
INSERT INTO UserFollowedUsers (user_id, followee_id) VALUES ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', '2ab3410d-aa84-404e-a9f5-52caa19fe15b');
INSERT INTO UserFollowedUsers (user_id, followee_id) VALUES ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', '325c8801-72e0-4f9f-aa7b-4de2c86ab3d4');

INSERT INTO UserFollowedUsers (user_id, followee_id) VALUES ('2ab3410d-aa84-404e-a9f5-52caa19fe15b', '40d6af98-9170-40ec-95b1-9f521e4958f6');
INSERT INTO UserFollowedUsers (user_id, followee_id) VALUES ('325c8801-72e0-4f9f-aa7b-4de2c86ab3d4', '83af10c1-2021-4eca-a9e5-76e6f4e9523b');
INSERT INTO UserFollowedUsers (user_id, followee_id) VALUES ('40d6af98-9170-40ec-95b1-9f521e4958f6', '790818cc-bef4-4c39-beff-5b8bda31c3df');
INSERT INTO UserFollowedUsers (user_id, followee_id) VALUES ('40d6af98-9170-40ec-95b1-9f521e4958f6', '325c8801-72e0-4f9f-aa7b-4de2c86ab3d4');
INSERT INTO UserFollowedUsers (user_id, followee_id) VALUES ('325c8801-72e0-4f9f-aa7b-4de2c86ab3d4', '566f84e4-fc6a-4ab8-82be-c440c77b2745');
