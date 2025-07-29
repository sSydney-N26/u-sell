-- Query #1 sample used in FYP to retrieve user's current following
SELECT uf.followee_id AS uid, u.email, u.username, u.program, u.year
FROM UserFollowedUsers uf
JOIN Users u ON uf.followee_id = u.uid
WHERE uf.user_id = "x8uocqJbNoWO7TL6ZCEXCR2Hm1k1";

-- Query #2 used in FYP to retrieve 10 random users to
-- provide the current user as suggestions to follow
SELECT uid, username, email, program, year
FROM Users
WHERE uid != "x8uocqJbNoWO7TL6ZCEXCR2Hm1k1"
ORDER BY RAND()
LIMIT 10;

-- Query #3 used in FYP to recursively retrieve
-- "Friends of Friends" to suggest to the current 
-- user to start following

WITH RECURSIVE FriendsofFriends AS (
SELECT followee_id AS uid, 1 AS depth
FROM UserFollowedUsers
WHERE user_id = "x8uocqJbNoWO7TL6ZCEXCR2Hm1k1"
UNION ALL
SELECT uf.followee_id AS uid, f.depth + 1 AS depth
FROM UserFollowedUsers uf
JOIN FriendsofFriends f ON uf.user_id = f.uid
WHERE f.depth < 2
)
SELECT DISTINCT 
u.uid,
u.username,
u.email,
u.program,
u.year
FROM FriendsofFriends f
JOIN Users u ON u.uid = f.uid
WHERE f.depth = 2
AND u.uid NOT IN (
    SELECT followee_id
    FROM UserFollowedUsers
    WHERE user_id = "x8uocqJbNoWO7TL6ZCEXCR2Hm1k1"
)
AND u.uid != "x8uocqJbNoWO7TL6ZCEXCR2Hm1k1"
LIMIT 10;


-- Query #4 used in FYP to start following a user with followee_id
-- Alice now wants to follow timothyburton
INSERT IGNORE INTO UserFollowedUsers(user_id, followee_id)
VALUES ("x8uocqJbNoWO7TL6ZCEXCR2Hm1k1", "0a976727-cf65-4b6c-b138-89f83f843421");   


-- Query #5 used in FYP to unfollow a user with followee_id
-- Alice now unfollows hannahking
DELETE FROM UserFollowedUsers WHERE user_id = "x8uocqJbNoWO7TL6ZCEXCR2Hm1k1" AND followee_id = "5af9ae2f-b972-4a19-b095-ed3a1be078c3";


-- Query #6 is the main query for FYP to retrieve listings by user's followed users
SELECT DISTINCT 
        l.id, l.seller_id, l.type, l.price, l.title, l.description, 
        l.product_condition, l.quantity, l.location, l.posted_date, 
        l.posted_by, l.status, l.image_storage_ref,
        CASE
          WHEN l.seller_id IN (SELECT followee_id FROM UserFollowedUsers WHERE user_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1')
          THEN 'user'
          WHEN l.type IN (SELECT category FROM UserFollowedCategories WHERE user_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1') 
            AND EXISTS (SELECT 1 FROM UserFollowedKeywords uk WHERE uk.user_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1'
              AND (LOWER(l.title) LIKE CONCAT('%', uk.keyword, '%') OR LOWER(l.description) LIKE CONCAT('%', uk.keyword, '%')))
            AND EXISTS (SELECT 1 FROM ListingTags lt JOIN UserFollowedTags ut ON lt.tag_id = ut.tag_id WHERE lt.listing_id = l.id AND ut.user_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1')
          THEN 'all'
          WHEN l.type IN (SELECT category FROM UserFollowedCategories WHERE user_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1') 
            AND EXISTS (SELECT 1 FROM UserFollowedKeywords uk WHERE uk.user_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1'
              AND (LOWER(l.title) LIKE CONCAT('%', uk.keyword, '%') OR LOWER(l.description) LIKE CONCAT('%', uk.keyword, '%')))
          THEN 'category_keyword'
          WHEN l.type IN (SELECT category FROM UserFollowedCategories WHERE user_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1')
            AND EXISTS (SELECT 1 FROM ListingTags lt JOIN UserFollowedTags ut ON lt.tag_id = ut.tag_id WHERE lt.listing_id = l.id AND ut.user_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1')
          THEN 'category_tag'
          WHEN EXISTS (SELECT 1 FROM UserFollowedKeywords uk WHERE uk.user_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1'
              AND (LOWER(l.title) LIKE CONCAT('%', uk.keyword, '%') OR LOWER(l.description) LIKE CONCAT('%', uk.keyword, '%')))
            AND EXISTS (SELECT 1 FROM ListingTags lt JOIN UserFollowedTags ut ON lt.tag_id = ut.tag_id WHERE lt.listing_id = l.id AND ut.user_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1')
          THEN 'keyword_tag'
          WHEN l.type IN (SELECT category FROM UserFollowedCategories WHERE user_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1')    
          THEN 'category'
          WHEN EXISTS (SELECT 1 FROM UserFollowedKeywords uk WHERE uk.user_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1'
              AND (LOWER(l.title) LIKE CONCAT('%', uk.keyword, '%') OR LOWER(l.description) LIKE CONCAT('%', uk.keyword, '%')))
          THEN 'keyword'
          WHEN EXISTS (SELECT 1 FROM ListingTags lt JOIN UserFollowedTags ut ON lt.tag_id = ut.tag_id WHERE lt.listing_id = l.id AND ut.user_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1')
          THEN 'tag'
          ELSE 'other'
        END as match_type
      FROM Listing l
      WHERE l.seller_id != 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1' 
        AND l.status = 'for sale'
        AND (
          l.type IN (
            SELECT category 
            FROM UserFollowedCategories 
            WHERE user_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1'
          )
          OR 
          EXISTS (
            SELECT 1 
            FROM UserFollowedKeywords uk 
            WHERE uk.user_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1' 
              AND (
                LOWER(l.title) LIKE CONCAT('%', uk.keyword, '%') 
                OR LOWER(l.description) LIKE CONCAT('%', uk.keyword, '%')
              )
          )
          OR EXISTS (
            SELECT 1 
            FROM ListingTags lt 
            JOIN UserFollowedTags ut ON lt.tag_id = ut.tag_id 
            WHERE lt.listing_id = l.id AND ut.user_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1'
          )
          OR l.seller_id IN (
              SELECT followee_id FROM UserFollowedUsers WHERE user_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1' 
          )
        )
      ORDER BY l.posted_date DESC;
