-- Query #1 used in browse listing feature --
SELECT * 
FROM Listing
WHERE type = "Electronics"
ORDER BY posted_date ASC LIMIT 12 OFFSET 1;


-- Query #2 used in browse listing feature --
SELECT COUNT(*) AS totalItems
FROM Listing
WHERE type = "Electronics";
