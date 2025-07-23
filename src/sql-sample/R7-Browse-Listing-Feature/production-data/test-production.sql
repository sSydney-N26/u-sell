-- Query #1 used in browse listing feature --
EXPLAIN
SELECT id, type, price, title, description, 
    product_condition, 
    quantity, location, posted_date, 
    posted_by, status
FROM Listing
WHERE status != 'removed' AND status != 'flagged' AND 
      status != 'sold' AND type = "School Supplies"
ORDER BY posted_date ASC LIMIT 120 OFFSET 1;


-- Query #2 used in browse listing feature --
SELECT COUNT(*) AS totalItems
FROM Listing
WHERE type = "School Supplies";
