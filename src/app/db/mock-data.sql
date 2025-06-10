-- === Users ===
INSERT INTO Users (uid, username, email, program, year)
VALUES
  ('uid_alice', 'alice', 'alice@uwaterloo.ca', 'Computer Science', 2),
  ('uid_bob', 'bob', 'bob@uwaterloo.ca', 'Electrical Engineering', 3),
  ('uid_carol', 'carol', 'carol@uwaterloo.ca', 'Mechanical Engineering', 1);

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
INSERT INTO Condition (type)
VALUES
  ('new'),
  ('like new'),
  ('gently used'),
  ('fair'),
  ('poor');

-- === Listings ===
INSERT INTO Listing (type, price, title, description, product_condition, quantity, location, posted_by, status, image_storage_ref)
VALUES
  ('Textbook', 40.00, 'CS 246 Textbook', 'Used for one term, some highlights', 'gently used', 1, 'UWaterloo SLC', 'uid_alice', 'for sale', 'images/cs246.jpg'),
  ('Furniture', 25.00, 'IKEA Chair', 'Sturdy and clean', 'like new', 1, 'Off-campus housing near Columbia', 'uid_bob', 'for sale', 'images/chair.jpg'),
  ('Kitchen', 10.00, 'Toaster', 'Still works perfectly, just upgraded', 'fair', 1, 'Village 1', 'uid_carol', 'pending', 'images/toaster.jpg'),
  ('Electronics', 100.00, 'Bluetooth Speaker', 'Bass heavy, battery still good', 'used', 1, 'UWaterloo Dana Porter Library', 'uid_alice', 'sold', 'images/speaker.jpg');

-- === Admins ===
INSERT INTO Admin (admin_id)
VALUES
  ('uid_alice');
