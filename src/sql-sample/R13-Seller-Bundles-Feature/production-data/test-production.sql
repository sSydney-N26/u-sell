-- View Performance Comparison: EXISTS vs JOIN
-- This file compares the performance of BackToSchoolBundleView 
-- when created with EXISTS vs JOIN approach

USE u_sell;

-- =====================================================
-- STEP 1: Create View with JOIN approach
-- =====================================================
SELECT 'Creating view with JOIN approach...' AS step;

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

-- =====================================================
-- STEP 2: Create View with EXISTS approach
-- =====================================================
SELECT 'Creating view with EXISTS approach...' AS step;

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

-- =====================================================
-- TEST 1: EXPLAIN JOIN View Query
-- =====================================================
SELECT 'TEST 1: EXPLAIN JOIN View Query' AS test_name;
EXPLAIN 
SELECT * 
FROM BackToSchoolBundleView_JOIN 
LIMIT 10;

-- =====================================================
-- TEST 2: EXPLAIN EXISTS View Query
-- =====================================================
SELECT 'TEST 2: EXPLAIN EXISTS View Query' AS test_name;
EXPLAIN 
SELECT * 
FROM BackToSchoolBundleView_EXISTS 
LIMIT 10;

-- =====================================================
-- TEST 3: EXPLAIN Specific Seller Query - JOIN View
-- =====================================================
SELECT 'TEST 3: EXPLAIN Alice Query - JOIN View' AS test_name;
EXPLAIN 
SELECT seller_id, type, title, price, posted_date
FROM BackToSchoolBundleView_JOIN 
WHERE seller_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1'
ORDER BY posted_date DESC 
LIMIT 5;

-- =====================================================
-- TEST 4: EXPLAIN Specific Seller Query - EXISTS View
-- =====================================================
SELECT 'TEST 4: EXPLAIN Alice Query - EXISTS View' AS test_name;
EXPLAIN 
SELECT seller_id, type, title, price, posted_date
FROM BackToSchoolBundleView_EXISTS 
WHERE seller_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1'
ORDER BY posted_date DESC 
LIMIT 5;

-- =====================================================
-- TEST 5: Execution Time Comparison
-- =====================================================
SELECT 'TEST 5: Execution Time Comparison' AS test_name;

-- Test JOIN view timing
SELECT 'JOIN View - Start time:' AS timing_test, NOW() AS start_time;

SELECT COUNT(*) as result_count
FROM BackToSchoolBundleView_JOIN 
LIMIT 100;

SELECT 'JOIN View - End time:' AS timing_test, NOW() AS end_time;

-- Test EXISTS view timing
SELECT 'EXISTS View - Start time:' AS timing_test, NOW() AS start_time;

SELECT COUNT(*) as result_count
FROM BackToSchoolBundleView_EXISTS 
LIMIT 100;

SELECT 'EXISTS View - End time:' AS timing_test, NOW() AS end_time;

-- =====================================================
-- TEST 6: Row Count Comparison
-- =====================================================
SELECT 'TEST 6: Row Count Comparison' AS test_name;

SELECT 'JOIN View - Total rows:' AS view_type, COUNT(*) as total_rows
FROM BackToSchoolBundleView_JOIN;

SELECT 'EXISTS View - Total rows:' AS view_type, COUNT(*) as total_rows
FROM BackToSchoolBundleView_EXISTS;

-- =====================================================
-- TEST 7: Sample Results Comparison
-- =====================================================
SELECT 'TEST 7: Sample Results Comparison' AS test_name;

-- Show sample results from JOIN view
SELECT 'JOIN View - Sample results:' AS sample_type;
SELECT seller_id, type, title, price, posted_date
FROM BackToSchoolBundleView_JOIN 
ORDER BY seller_id, posted_date DESC 
LIMIT 5;

-- Show sample results from EXISTS view
SELECT 'EXISTS View - Sample results:' AS sample_type;
SELECT seller_id, type, title, price, posted_date
FROM BackToSchoolBundleView_EXISTS 
ORDER BY seller_id, posted_date DESC 
LIMIT 5;

-- =====================================================
-- TEST 8: Performance Summary
-- =====================================================
SELECT 'TEST 8: Performance Summary' AS test_name;

-- Compare execution plans side by side
SELECT 'JOIN View Execution Plan:' AS plan_type;
EXPLAIN FORMAT=JSON SELECT * FROM BackToSchoolBundleView_JOIN LIMIT 10;

SELECT 'EXISTS View Execution Plan:' AS plan_type;
EXPLAIN FORMAT=JSON SELECT * FROM BackToSchoolBundleView_EXISTS LIMIT 10;

-- =====================================================
-- CLEANUP: Drop test views
-- =====================================================
SELECT 'Cleaning up test views...' AS cleanup;

DROP VIEW IF EXISTS BackToSchoolBundleView_JOIN;
DROP VIEW IF EXISTS BackToSchoolBundleView_EXISTS;

SELECT 'Test completed!' AS completion; 