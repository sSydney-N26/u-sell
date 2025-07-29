-- Test 1: Check initial state of existing tags and their usage statistics
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

-- Test 2: Test tag suggestions algorithm with production data
-- This simulates the complex query in src/app/api/admin/tag-suggestions/route.ts
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

-- Test 3: Create a new tag from engineering recommendation tag from above test
-- This simulates the POST request in src/app/api/admin/tag-suggestions/route.ts
INSERT INTO Tags (tag_name) VALUES ('engineering');

-- Test 4: Check that the new tag was created successfully
SELECT tag_id, tag_name, created_at FROM Tags WHERE tag_name = 'engineering';

-- Test 5: Associate the new tag with relevant listings
-- This simulates the process of applying tags to listings
INSERT INTO ListingTags (listing_id, tag_id) VALUES
    (4, (SELECT tag_id FROM Tags WHERE tag_name = 'engineering')),
    (14, (SELECT tag_id FROM Tags WHERE tag_name = 'engineering')),
    (20, (SELECT tag_id FROM Tags WHERE tag_name = 'engineering'));

-- Test 6: Check updated tag usage statistics after adding new tag (engineering should have 3)
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

-- Test 7: Test finding listings by tag (search functionality)
-- This simulates searching for listings with a specific tag
SELECT
    l.id,
    l.title,
    l.price,
    l.status,
    GROUP_CONCAT(t.tag_name) as tags
FROM Listing l
JOIN ListingTags lt ON l.id = lt.listing_id
JOIN Tags t ON lt.tag_id = t.tag_id
WHERE t.tag_name = 'laptop' AND l.status != 'removed'
GROUP BY l.id, l.title, l.price, l.status
ORDER BY l.id;

-- Test 8: Test finding all tags for a specific listing (listing detail view)
-- This simulates displaying tags on a listing detail page
SELECT
    l.id,
    l.title,
    GROUP_CONCAT(t.tag_name) as tags
FROM Listing l
LEFT JOIN ListingTags lt ON l.id = lt.listing_id
LEFT JOIN Tags t ON lt.tag_id = t.tag_id
WHERE l.id = 15  -- Mirror Stand - Furniture
GROUP BY l.id, l.title;

-- Test 9: Test multi-tag search (find listings with multiple specific tags)
SELECT
    l.id,
    l.title,
    l.price,
    l.status,
    GROUP_CONCAT(t.tag_name) as tags
FROM Listing l
JOIN ListingTags lt ON l.id = lt.listing_id
JOIN Tags t ON lt.tag_id = t.tag_id
WHERE t.tag_name IN ('laptop', 'monitor') AND l.status != 'removed'
GROUP BY l.id, l.title, l.price, l.status
ORDER BY l.id;

-- Test 10: Test tag deletion (this will cascade to ListingTags)
DELETE FROM Tags WHERE tag_name = 'engineering';

-- Test 11: Verify that the tag was deleted and its associations were removed
SELECT COUNT(*) as remaining_tags FROM Tags WHERE tag_name = 'engineering';
SELECT COUNT(*) as remaining_listing_tags FROM ListingTags WHERE tag_id = (SELECT tag_id FROM Tags WHERE tag_name = 'engineering');

-- Test 12: Check final tag usage statistics after deletion
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

-- Test 13: Test finding listings by tag and price range
SELECT
    l.id,
    l.title,
    l.price,
    l.status,
    GROUP_CONCAT(t.tag_name) as tags
FROM Listing l
JOIN ListingTags lt ON l.id = lt.listing_id
JOIN Tags t ON lt.tag_id = t.tag_id
WHERE t.tag_name = 'mirror'
    AND l.status != 'removed'
    AND l.price BETWEEN 1 AND 1000
GROUP BY l.id, l.title, l.price, l.status
ORDER BY l.price;

-- Test 14: Test finding tags for listings in a specific category
SELECT
    l.id,
    l.title,
    l.type,
    GROUP_CONCAT(t.tag_name) as tags
FROM Listing l
LEFT JOIN ListingTags lt ON l.id = lt.listing_id
LEFT JOIN Tags t ON lt.tag_id = t.tag_id
WHERE l.type = 'Electronics' AND l.status != 'removed'
GROUP BY l.id, l.title, l.type
ORDER BY l.id;

-- Test 15: Test finding recently created tags
SELECT
    t.tag_id,
    t.tag_name,
    t.created_at,
    COUNT(DISTINCT lt.listing_id) as current_listings
FROM Tags t
LEFT JOIN ListingTags lt ON t.tag_id = lt.tag_id
LEFT JOIN Listing l ON lt.listing_id = l.id AND l.status != 'removed'
GROUP BY t.tag_id, t.tag_name, t.created_at
ORDER BY t.created_at DESC
LIMIT 5;

-- ===== EXPLAIN TESTS - Performance Optimization Analysis =====

-- Test 16: EXPLAIN - Show how indexes are used for tag usage statistics query
EXPLAIN SELECT
    t.tag_id,
    t.tag_name,
    t.created_at,
    COUNT(DISTINCT lt.listing_id) as current_listings
FROM Tags t
LEFT JOIN ListingTags lt ON t.tag_id = lt.tag_id
LEFT JOIN Listing l ON lt.listing_id = l.id AND l.status != 'removed'
GROUP BY t.tag_id, t.tag_name, t.created_at
ORDER BY current_listings DESC, t.created_at DESC;

-- Test 17: EXPLAIN - Show how indexes are used for tag suggestions algorithm
-- This simulates the complex query in Test 2 and src/app/api/admin/tag-suggestions/route.ts
EXPLAIN WITH RECURSIVE
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

-- Test 18: EXPLAIN - Show how indexes are used for finding tags for a specific listing
EXPLAIN SELECT
    l.id,
    l.title,
    GROUP_CONCAT(t.tag_name) as tags
FROM Listing l
LEFT JOIN ListingTags lt ON l.id = lt.listing_id
LEFT JOIN Tags t ON lt.tag_id = t.tag_id
WHERE l.id = 15
GROUP BY l.id, l.title;
