-- Test 1: Check existing tags and their usage statistics for admin dashboard
SELECT
    t.tag_id,
    t.tag_name,
    t.created_at,
    COUNT(DISTINCT lt.listing_id) as current_listings
FROM Tags t
LEFT JOIN ListingTags lt ON t.tag_id = lt.tag_id
LEFT JOIN Listing l ON lt.listing_id = l.id AND l.status != 'removed'
GROUP BY t.tag_id, t.tag_name, t.created_at
ORDER BY current_listings DESC, t.created_at DESC;

-- Test 2: Test tag suggestions algorithm - find common words in listing titles
WITH RECURSIVE
numbers AS (
    SELECT 1 as n
    UNION ALL
    SELECT n + 1 FROM numbers WHERE n < 20
),
words AS (
    SELECT
        TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(LOWER(l.title), ' ', n), ' ', -1)) as word,
        COUNT(*) as frequency
    FROM Listing l
    CROSS JOIN numbers
    WHERE
        l.status != 'removed'
        AND LENGTH(TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(LOWER(l.title), ' ', n), ' ', -1))) > 2
        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(LOWER(l.title), ' ', n), ' ', -1)) != ''
        AND TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(LOWER(l.title), ' ', n), ' ', -1)) NOT IN (
            'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were',
            'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
            'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'a', 'an', 'new', 'used', 'like', 'good',
            'great', 'excellent', 'perfect', 'condition', 'quality', 'brand', 'original', 'authentic', 'genuine'
        )
    GROUP BY TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(LOWER(l.title), ' ', n), ' ', -1))
    HAVING COUNT(*) >= 3
)
SELECT
    word,
    frequency,
    (SELECT COUNT(*) FROM Listing l2 WHERE LOWER(l2.title) LIKE CONCAT('%', word, '%')) as total_listings
FROM words
WHERE word NOT IN (SELECT tag_name FROM Tags)
    AND word NOT IN (SELECT LOWER(type) FROM ProductType)
ORDER BY frequency DESC, total_listings DESC
LIMIT 10;

-- Test 3: Create a new tag from a suggestion
INSERT INTO Tags (tag_name) VALUES ('dryer');

-- Test 4: Check that the new tag was created successfully
SELECT tag_id, tag_name, created_at FROM Tags WHERE tag_name = 'dryer';

-- Test 5: Apply the new tag to some listings
INSERT INTO ListingTags (listing_id, tag_id) VALUES
    (5, 6),   -- Hair Dryer -> dryer
    (15, 6),  -- Hair Dryer -> dryer
    (20, 6),  -- Hair Dryer -> dryer
    (25, 6),  -- Hair Dryer -> dryer
    (26, 6);  -- Hair Dryer -> dryer

-- Test 6: Check updated tag usage statistics after adding new tag
SELECT
    t.tag_id,
    t.tag_name,
    t.created_at,
    COUNT(DISTINCT lt.listing_id) as current_listings
FROM Tags t
LEFT JOIN ListingTags lt ON t.tag_id = lt.tag_id
LEFT JOIN Listing l ON lt.listing_id = l.id AND l.status != 'removed'
GROUP BY t.tag_id, t.tag_name, t.created_at
ORDER BY current_listings DESC, t.created_at DESC;

-- Test 7: Test tag deletion (this will cascade to ListingTags)
DELETE FROM Tags WHERE tag_name = 'dryer';

-- Test 8: Verify that the tag was deleted and its associations were removed
SELECT COUNT(*) as remaining_tags FROM Tags WHERE tag_name = 'dryer';
SELECT COUNT(*) as remaining_listing_tags FROM ListingTags WHERE tag_id = 6;

-- Test 9: Check final tag usage statistics after deletion
SELECT
    t.tag_id,
    t.tag_name,
    t.created_at,
    COUNT(DISTINCT lt.listing_id) as current_listings
FROM Tags t
LEFT JOIN ListingTags lt ON t.tag_id = lt.tag_id
LEFT JOIN Listing l ON lt.listing_id = l.id AND l.status != 'removed'
GROUP BY t.tag_id, t.tag_name, t.created_at
ORDER BY current_listings DESC, t.created_at DESC;

-- Test 10: Test finding listings by tag (eg searching)
SELECT
    l.id,
    l.title,
    l.price,
    l.status,
    GROUP_CONCAT(t.tag_name) as tags
FROM Listing l
JOIN ListingTags lt ON l.id = lt.listing_id
JOIN Tags t ON lt.tag_id = t.tag_id
WHERE t.tag_name = 'textbook' AND l.status != 'removed'
GROUP BY l.id, l.title, l.price, l.status
ORDER BY l.id;

-- Test 11: Test finding all tags for a specific listing (displaying on detailed listing view)
SELECT
    l.id,
    l.title,
    GROUP_CONCAT(t.tag_name) as tags
FROM Listing l
LEFT JOIN ListingTags lt ON l.id = lt.listing_id
LEFT JOIN Tags t ON lt.tag_id = t.tag_id
WHERE l.id = 2
GROUP BY l.id, l.title;
