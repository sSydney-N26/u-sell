-- Test 1: Check initial state - listing 1 should already be flagged (5 distinct reports)
SELECT id, title, status,
       (SELECT COUNT(DISTINCT reporter_id) FROM Reports WHERE listing_id = 1) as report_count
FROM Listing
WHERE id = 1;

-- Test 2: Check listing 2 status (should have 2 reports, not flagged yet)
SELECT id, title, status,
       (SELECT COUNT(DISTINCT reporter_id) FROM Reports WHERE listing_id = 2) as report_count
FROM Listing
WHERE id = 2;

-- Test 3: Add more reports to listing 2 to trigger flagging
INSERT INTO Reports (listing_id, reporter_id, reason, description) VALUES
  (2, 'uid_jane', 'fake', 'Fake listing'),
  (2, 'uid_joe', 'offensive', 'Offensive content'),
  (2, 'uid_bob', 'other', 'Other reason');

-- Test 4: Check if listing 2 is now flagged (should be, since 5 distinct reports)
SELECT id, title, status,
       (SELECT COUNT(DISTINCT reporter_id) FROM Reports WHERE listing_id = 2) as report_count
FROM Listing
WHERE id = 2;

-- Test 5: Try to report the same listing again by the same user (should fail with duplicate key error)
INSERT INTO Reports (listing_id, reporter_id, reason, description)
VALUES (2, 'uid_bob', 'inappropriate', 'Duplicate report from same user');

-- Test 6: Report a different listing (listing 3)
INSERT INTO Reports (listing_id, reporter_id, reason, description)
VALUES (3, 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'inappropriate', 'Another inappropriate listing');

-- Test 7: Get all flagged listings with their report counts
SELECT
    l.id, l.title, l.status, l.posted_by,
    (SELECT COUNT(DISTINCT reporter_id) FROM Reports WHERE listing_id = l.id) as report_count
FROM Listing l
WHERE l.status = 'flagged'
ORDER BY l.id;

-- Test 8: Get all reports for listing 1 (should show 5 distinct reports)
SELECT r.id, r.reason, r.description, r.created_at, u.username as reporter_name
FROM Reports r
JOIN Users u ON r.reporter_id = u.uid
WHERE r.listing_id = 1
ORDER BY r.created_at;

-- Test 9: Get all reports for listing 2 (should show 5 distinct reports)
SELECT r.id, r.reason, r.description, r.created_at, u.username as reporter_name
FROM Reports r
JOIN Users u ON r.reporter_id = u.uid
WHERE r.listing_id = 2
ORDER BY r.created_at;
