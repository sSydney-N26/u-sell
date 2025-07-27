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
  'Pencil Case',
  'A pristine pencil case.',
  'like new',
  1,
  'MC',
  'alice',
  'for sale',
  '/photos/schoolsupplies.jpg'
);

-- Analyzing Select query before index creation
EXPLAIN ANALYZE
SELECT *
FROM Listing
WHERE seller_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1'
  AND title = 'Pencil Case'
  AND image_storage_ref = '/photos/schoolsupplies.jpg';

-- Adding Index
CREATE INDEX idx_listing_seller_title_image
ON Listing (seller_id, title, image_storage_ref);

-- Analyzing Select query after index creation
EXPLAIN ANALYZE
SELECT *
FROM Listing
WHERE seller_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1'
  AND title = 'Pencil Case'
  AND image_storage_ref = '/photos/schoolsupplies.jpg';
