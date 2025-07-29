-- === Users ===
INSERT INTO Users (uid, username, email, program, year)
VALUES
  ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'alice', 'alice@uwaterloo.ca', 'Computer Science', 3),
  ('1afb501b-57cc-422c-827f-7826ae22db55', 'heather29', 'lindsey62@example.org', 'Civil Engineering', 1),
  ('3f9a1261-df93-4e67-9a77-09be06c35924', 'haynesjose', 'christopher51@example.net', 'Engineering', 2),
  ('5af9ae2f-b972-4a19-b095-ed3a1be078c3', 'hannahking', 'parkerwilliam@example.com', 'Arts', 5),
  ('917e2c44-2103-4d80-b093-36e6270bac3b', 'stephanie81', 'sydneyfloyd@example.org', 'Mathematics', 2),
  ('bb076683-88d2-449f-9100-32ef4b0ba023', 'kari89', 'kimberlybrandt@example.com', 'Systems Design Engineering', 2),
  ('7ff59612-9d23-4501-824f-685d8c63967e', 'wsantos', 'manuel01@example.net', 'Engineering', 4),
  ('ddc899fd-5c20-4656-8c03-ec28bed09806', 'stevenbyrd', 'asilva@example.net', 'Arts', 5),
  ('dc5dbe09-3d8e-486b-9254-902ffb1f0d86', 'donaldpayne', 'sabrinaweaver@example.net', 'Electrical Engineering', 1),
  ('e2c03bd2-0312-4c5d-a080-c00675893c0d', 'smithkyle', 'kathleen12@example.org', 'Architecture', 1),
  ('abf7b346-09c2-4f9b-8b58-3d5afd4ec73e', 'jamesmills', 'ana92@example.net', 'Environment', 1),
  ('cc2f1171-02be-4fb3-9ecc-5a78cdf78ff0', 'louis43', 'hardingderek@example.net', 'Software Engineering', 5),
  
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
-- "x8uocqJbNoWO7TL6ZCEXCR2Hm1k1" is user Alice. List of who Alice is following
INSERT INTO UserFollowedUsers(user_id, followee_id) VALUES ("x8uocqJbNoWO7TL6ZCEXCR2Hm1k1", "1afb501b-57cc-422c-827f-7826ae22db55");
INSERT INTO UserFollowedUsers(user_id, followee_id) VALUES ("x8uocqJbNoWO7TL6ZCEXCR2Hm1k1", "3f9a1261-df93-4e67-9a77-09be06c35924");
INSERT INTO UserFollowedUsers(user_id, followee_id) VALUES ("x8uocqJbNoWO7TL6ZCEXCR2Hm1k1", "5af9ae2f-b972-4a19-b095-ed3a1be078c3");
INSERT INTO UserFollowedUsers(user_id, followee_id) VALUES ("x8uocqJbNoWO7TL6ZCEXCR2Hm1k1", "917e2c44-2103-4d80-b093-36e6270bac3b");
INSERT INTO UserFollowedUsers(user_id, followee_id) VALUES ("x8uocqJbNoWO7TL6ZCEXCR2Hm1k1", "bb076683-88d2-449f-9100-32ef4b0ba023");

-- Insert for Friends of Friends Suggestions (should get 6 suggestions in total)
INSERT INTO UserFollowedUsers(user_id, followee_id) VALUES ("5af9ae2f-b972-4a19-b095-ed3a1be078c3", "7ff59612-9d23-4501-824f-685d8c63967e");
INSERT INTO UserFollowedUsers(user_id, followee_id) VALUES ("5af9ae2f-b972-4a19-b095-ed3a1be078c3", "ddc899fd-5c20-4656-8c03-ec28bed09806");
INSERT INTO UserFollowedUsers(user_id, followee_id) VALUES ("917e2c44-2103-4d80-b093-36e6270bac3b", "ddc899fd-5c20-4656-8c03-ec28bed09806");
INSERT INTO UserFollowedUsers(user_id, followee_id) VALUES ("917e2c44-2103-4d80-b093-36e6270bac3b", "dc5dbe09-3d8e-486b-9254-902ffb1f0d86");
INSERT INTO UserFollowedUsers(user_id, followee_id) VALUES ("917e2c44-2103-4d80-b093-36e6270bac3b", "e2c03bd2-0312-4c5d-a080-c00675893c0d");
INSERT INTO UserFollowedUsers(user_id, followee_id) VALUES ("bb076683-88d2-449f-9100-32ef4b0ba023", "abf7b346-09c2-4f9b-8b58-3d5afd4ec73e");
INSERT INTO UserFollowedUsers(user_id, followee_id) VALUES ("bb076683-88d2-449f-9100-32ef4b0ba023", "cc2f1171-02be-4fb3-9ecc-5a78cdf78ff0");
-- This shouldn't get suggested because it is a friend of a user that Alice doesn't follow
INSERT INTO UserFollowedUsers(user_id, followee_id) VALUES ("7ff59612-9d23-4501-824f-685d8c63967e", "abf7b346-09c2-4f9b-8b58-3d5afd4ec73e");
