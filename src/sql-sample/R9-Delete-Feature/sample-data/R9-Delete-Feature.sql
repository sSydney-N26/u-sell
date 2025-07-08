-- Verify that the listing belongs to the user
SELECT seller_id FROM Listing WHERE id = 1;

-- Delete the listing
DELETE FROM Listing WHERE id = 1;