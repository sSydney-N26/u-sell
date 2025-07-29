-- 1) Query to get all Listing information.
-- Everytime, we limit to 12 and use certain offsets
-- values so there is a maximum of 12 listings per
-- page on the Browse tab. Offset is used so 
-- we return the appropriate rows for each page.

-- We also used this query with type predicate in the WHERE 
-- clause i.e., type = "School Supplies". We do it for every
-- single category so when clicking on the filter buttons, 
-- only Listings with those categories are returned.

SELECT id, type, price, title, description, 
    product_condition, 
    quantity, location, posted_date, 
    posted_by, status
FROM Listing
ORDER BY posted_date ASC LIMIT 12 OFFSET 2; 


-- 2) Query to get the number of items per
-- category. We also used the query without
-- specifying the type in the WHERE clause
-- to get the total number of items in the Listing

SELECT COUNT(*) AS totalItems
FROM Listing
WHERE status = 'for sale' OR status = 'pending';
