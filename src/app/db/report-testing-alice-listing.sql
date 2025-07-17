-- Alice's UID: x8uocqJbNoWO7TL6ZCEXCR2Hm1k1
-- Alice owns listing 1590, just delete from the db for that listing in reports when need to test again
-- delete from reports  where listing_id = '1590';

-- Step 1: Find one of Alice's listings
SELECT
    id,
    title,
    status,
    posted_date
FROM Listing
WHERE seller_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1'
    AND status = 'for sale'
LIMIT 1;

-- Step 2: Add 4 distinct reports to the listing
-- (Replace 1590 with the actual listing ID from Step 1)

-- First, let's get 4 different user UIDs to use as reporters
SELECT uid, username, email
FROM Users
WHERE uid != 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1'
LIMIT 4;

-- Now add 4 reports (replace the UIDs with actual UIDs from the query above)
-- Report 1
INSERT INTO Reports (listing_id, reporter_id, reason, description)
VALUES (1588, '00bf3bbd-64bf-4866-b56b-ccd811594a04', 'spam', 'Report 1 - Spam content');

-- Report 2
INSERT INTO Reports (listing_id, reporter_id, reason, description)
VALUES (1588, '00f94d5e-abd1-4a25-ad4e-8073b0c4f7b3', 'inappropriate', 'Report 2 - Inappropriate content');

-- Report 3
INSERT INTO Reports (listing_id, reporter_id, reason, description)
VALUES (1588, '01a9297c-c894-4a5e-812e-aec58f1b91ce', 'fake', 'Report 3 - Fake listing');

-- Report 4
INSERT INTO Reports (listing_id, reporter_id, reason, description)
VALUES (1588, '01cb9324-a69c-476e-b668-bc503e46d318', 'offensive', 'Report 4 - Offensive content');

-- Step 3: Check the listing status and report count (mainly want to get title)
SELECT
    l.id,
    l.title,
    l.status,
    l.posted_date,
    COUNT(DISTINCT r.reporter_id) as distinct_reports
FROM Listing l
LEFT JOIN Reports r ON l.id = r.listing_id
WHERE l.id = 1588
GROUP BY l.id, l.title, l.status, l.posted_date;

-- Step 4: Show all reports for this listing
SELECT
    r.id,
    r.reporter_id,
    r.reason,
    r.description,
    r.created_at,
    u.username as reporter_username
FROM Reports r
JOIN Users u ON r.reporter_id = u.uid
WHERE r.listing_id = 1590
ORDER BY r.created_at;

-- Step 5: Final listing details
SELECT
    l.id,
    l.title,
    l.description,
    l.price,
    l.type,
    l.status,
    l.posted_date,
    l.posted_by,
    u.email as seller_email
FROM Listing l
JOIN Users u ON l.seller_id = u.uid
WHERE l.id = 1590;


UPDATE Listing
SET status = 'for sale'
WHERE id = 1588;