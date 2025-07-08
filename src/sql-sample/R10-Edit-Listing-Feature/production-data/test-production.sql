SELECT seller_id FROM Listing WHERE id = 21;

UPDATE Listing
SET 
  title = 'CS 200',
  description = 'never used',
  price = 49,
  product_condition = 'gently used',
  quantity = 11,
  location = 'MC',
  type = 'Misc',
  status = 'for sale'
WHERE id = 21;