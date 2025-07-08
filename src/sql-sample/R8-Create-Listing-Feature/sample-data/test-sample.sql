-- Create Listing
INSERT INTO Listing (
  seller_id,
  type,
  price,
  title,
  description,
  product_condition,
  quantity,
  location,
  posted_by,
  status,
  image_storage_ref
)
VALUES (
  'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1',
  'School Supplies',
  10,
  'Computer Bag',
  'A pristine computer bag.',
  'like new',
  1,
  'MC',
  'Alice',
  'for sale',
  'images/school_supplies/bag.jpg'
);

-- Verify the listing was created
SELECT *
FROM Listing
WHERE seller_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1'
  AND title = 'Computer Bag'
  AND image_storage_ref = 'images/school_supplies/bag.jpg';