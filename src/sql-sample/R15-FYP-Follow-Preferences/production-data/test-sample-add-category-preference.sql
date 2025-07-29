INSERT INTO UserFollowedCategories (user_id, category)
SELECT 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'Kitchen'
WHERE EXISTS (SELECT 1 FROM ProductType WHERE type = 'Kitchen')
AND NOT EXISTS (SELECT 1 FROM UserFollowedCategories WHERE user_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1' AND category = 'Kitchen');