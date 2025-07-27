-- -- As a reminder, this is the view of the BackToSchoolBundleView
-- CREATE OR REPLACE VIEW BackToSchoolBundleView AS
-- SELECT l.*
-- FROM Listing l
-- JOIN (
--     SELECT e.seller_id
--     FROM Listing e
--     JOIN Listing s
--       ON e.seller_id = s.seller_id
--     WHERE e.status = 'for sale' AND e.type = 'Electronics'
--       AND s.status = 'for sale' AND s.type = 'School Supplies'
--     GROUP BY e.seller_id
-- ) AS eligible_sellers
--   ON l.seller_id = eligible_sellers.seller_id
-- WHERE l.status = 'for sale'
--   AND l.type IN ('Electronics', 'School Supplies')
-- ORDER BY l.seller_id, l.posted_date DESC;

SELECT 
    seller_id,
    type,
    title,
    price,
    posted_date,
    status
FROM BackToSchoolBundleView 
WHERE seller_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1' -- Alice seller_id
ORDER BY posted_date DESC;