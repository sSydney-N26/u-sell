-- Test 1: Check initial state of Alice's MacBook (ID 1588) - should have 3 reports, not flagged yet
SELECT id, title, status,
       (SELECT COUNT(DISTINCT reporter_id) FROM Reports WHERE listing_id = 1588) as report_count
FROM Listing
WHERE id = 1588;

-- Test 2: Add 2 more reports to Alice's MacBook to trigger automatic flagging (will reach 5 total)
INSERT INTO Reports (listing_id, reporter_id, reason, description) VALUES
  (1588, '6016e394-db8d-4bd3-8615-fbb0131db924', 'inappropriate', 'This listing contains inappropriate content'),
  (1588, '325c8801-72e0-4f9f-aa7b-4de2c86ab3d4', 'spam', 'This seems like spam');

-- Test 3: Check if Alice's MacBook is now flagged (should be, since 5 distinct reports)
SELECT id, title, status,
       (SELECT COUNT(DISTINCT reporter_id) FROM Reports WHERE listing_id = 1588) as report_count
FROM Listing
WHERE id = 1588;

-- Test 4: Try to report the same listing again by the same user (should fail with duplicate key error)
INSERT INTO Reports (listing_id, reporter_id, reason, description)
VALUES (1588, '6016e394-db8d-4bd3-8615-fbb0131db924', 'inappropriate', 'Duplicate report from same user');

-- Test 5: Check a listing that already has 5 reports and should be flagged (Winter Jacket ID 1592)
SELECT id, title, status,
       (SELECT COUNT(DISTINCT reporter_id) FROM Reports WHERE listing_id = 1592) as report_count
FROM Listing
WHERE id = 1592;

-- Test 6: Check a listing with 4 reports that needs 1 more to flag (Coffee Maker ID 1591)
SELECT id, title, status,
       (SELECT COUNT(DISTINCT reporter_id) FROM Reports WHERE listing_id = 1591) as report_count
FROM Listing
WHERE id = 1591;

-- Test 7: Add the 5th report to Coffee Maker to trigger flagging
INSERT INTO Reports (listing_id, reporter_id, reason, description)
VALUES (1591, '6016e394-db8d-4bd3-8615-fbb0131db924', 'inappropriate', 'This listing contains inappropriate content');

-- Test 8: Check if Coffee Maker is now flagged
SELECT id, title, status,
       (SELECT COUNT(DISTINCT reporter_id) FROM Reports WHERE listing_id = 1591) as report_count
FROM Listing
WHERE id = 1591;

-- Test 9: Check a listing that was flagged and approved by admin (ID 1600) so it should be for sale still
SELECT id, title, status,
       (SELECT COUNT(DISTINCT reporter_id) FROM Reports WHERE listing_id = 1600) as report_count
FROM Listing
WHERE id = 1600;

-- Test 10: Check a listing that was flagged and removed by admin (ID 1605)
SELECT id, title, status,
       (SELECT COUNT(DISTINCT reporter_id) FROM Reports WHERE listing_id = 1605) as report_count
FROM Listing
WHERE id = 1605;

-- Test 11: Get all currently flagged listings with their report counts
SELECT
    l.id, l.title, l.status, l.posted_by,
    (SELECT COUNT(DISTINCT reporter_id) FROM Reports WHERE listing_id = l.id) as report_count
FROM Listing l
WHERE l.status = 'flagged'
ORDER BY l.id;

-- Test 12: Get all reports for Alice's MacBook (should show 5 distinct reports)
SELECT r.id, r.reason, r.description, r.created_at, u.username as reporter_name
FROM Reports r
JOIN Users u ON r.reporter_id = u.uid
WHERE r.listing_id = 1588
ORDER BY r.created_at;

-- Test 13: Get all reports for Coffee Maker (should show 5 distinct reports)
SELECT r.id, r.reason, r.description, r.created_at, u.username as reporter_name
FROM Reports r
JOIN Users u ON r.reporter_id = u.uid
WHERE r.listing_id = 1591
ORDER BY r.created_at;

-- Test 14: Test reporting a listing that was already approved by admin (should pass as that listing is now back)
INSERT INTO Reports (listing_id, reporter_id, reason, description)
VALUES (1600, '6016e394-db8d-4bd3-8615-fbb0131db924', 'inappropriate', 'Trying to report an approved listing');

-- Test 15: Check that removed listings cannot be reported (they have 'removed' status)
-- Note: In real usage, the API route would reject this with a 400 error
SELECT id, title, status FROM Listing WHERE id = 1605;

-- Test 16: Find listings with exactly 4 reports (on the edge of being flagged)
SELECT
    l.id, l.title, l.status,
    (SELECT COUNT(DISTINCT reporter_id) FROM Reports WHERE listing_id = l.id) as report_count
FROM Listing l
WHERE (SELECT COUNT(DISTINCT reporter_id) FROM Reports WHERE listing_id = l.id) = 4
ORDER BY l.id;

-- Test 17: Find listings with exactly 5 reports (should be flagged)
SELECT
    l.id, l.title, l.status,
    (SELECT COUNT(DISTINCT reporter_id) FROM Reports WHERE listing_id = l.id) as report_count
FROM Listing l
WHERE (SELECT COUNT(DISTINCT reporter_id) FROM Reports WHERE listing_id = l.id) = 5
ORDER BY l.id;

-- Test 18: Check the special test case - listing with multiple flagging cycles (ID 1611)
-- This listing was flagged (5 reports), approved, flagged again (5 more reports), then removed
SELECT id, title, status,
       (SELECT COUNT(DISTINCT reporter_id) FROM Reports WHERE listing_id = 1611) as report_count
FROM Listing
WHERE id = 1611;

-- Test 19: Get all reports for the multiple flagging cycle listing (should show 10 distinct reports)
SELECT r.id, r.reason, r.description, r.created_at, u.username as reporter_name
FROM Reports r
JOIN Users u ON r.reporter_id = u.uid
WHERE r.listing_id = 1611
ORDER BY r.created_at;

-- Test 20: Find all listings with more than 5 reports (should include the multiple flagging cycle listing, 1600 with 6 reports and 1593 we seeded with 6 reports)
SELECT
    l.id, l.title, l.status,
    (SELECT COUNT(DISTINCT reporter_id) FROM Reports WHERE listing_id = l.id) as report_count
FROM Listing l
WHERE (SELECT COUNT(DISTINCT reporter_id) FROM Reports WHERE listing_id = l.id) > 5
ORDER BY report_count DESC, l.id;

-- ===== EXPLAIN TESTS - Just to show index optimization for section RC =====

-- Test 21: EXPLAIN - Show how the index is used for getting all reports for a listing
-- This simulates the query in Test 12 and 13
EXPLAIN SELECT r.id, r.reason, r.description, r.created_at, u.username as reporter_name
FROM Reports r
JOIN Users u ON r.reporter_id = u.uid
WHERE r.listing_id = 1588
ORDER BY r.created_at;

-- Test 22: EXPLAIN - Show how the index is used for finding listings with specific report counts
-- This simulates the query in Test 16 and 17
EXPLAIN SELECT
    l.id, l.title, l.status,
    (SELECT COUNT(DISTINCT reporter_id) FROM Reports WHERE listing_id = l.id) as report_count
FROM Listing l
WHERE (SELECT COUNT(DISTINCT reporter_id) FROM Reports WHERE listing_id = l.id) = 5
ORDER BY l.id;