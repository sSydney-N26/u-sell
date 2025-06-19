-- === Users ===
INSERT INTO Users (uid, username, email, program, year)
VALUES
  ('x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'Alice', 'alice@uwaterloo.ca', 'Computer Science', 2),
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
