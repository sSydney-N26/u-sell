USE u_sell;

CREATE OR REPLACE VIEW BackToSchoolBundleView_JOIN AS
SELECT l.*
FROM Listing l
JOIN (
    SELECT e.seller_id
    FROM Listing e
    JOIN Listing s
      ON e.seller_id = s.seller_id
    WHERE e.status = 'for sale' AND e.type = 'Electronics'
      AND s.status = 'for sale' AND s.type = 'School Supplies'
    GROUP BY e.seller_id
) AS eligible_sellers
  ON l.seller_id = eligible_sellers.seller_id
WHERE l.status = 'for sale'
  AND l.type IN ('Electronics', 'School Supplies')
ORDER BY l.seller_id, l.posted_date DESC;

CREATE OR REPLACE VIEW BackToSchoolBundleView_EXISTS AS
SELECT l.*
FROM Listing l
WHERE l.status = 'for sale'
  AND l.type IN ('Electronics', 'School Supplies')
  AND EXISTS (
    SELECT 1
    FROM Listing e
    WHERE e.seller_id = l.seller_id
      AND e.status = 'for sale'
      AND e.type = 'Electronics'
  )
  AND EXISTS (
    SELECT 1
    FROM Listing s
    WHERE s.seller_id = l.seller_id
      AND s.status = 'for sale'
      AND s.type = 'School Supplies'
  )
ORDER BY l.seller_id, l.posted_date DESC;

-- Testing the join view
EXPLAIN 
SELECT * 
FROM BackToSchoolBundleView_JOIN 
LIMIT 10;

-- Testing the exists view
EXPLAIN 
SELECT * 
FROM BackToSchoolBundleView_EXISTS 
LIMIT 10;