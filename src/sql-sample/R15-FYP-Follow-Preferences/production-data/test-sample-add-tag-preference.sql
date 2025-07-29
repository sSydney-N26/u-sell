INSERT INTO UserFollowedTags (user_id, tag_id)
SELECT 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 1
WHERE EXISTS (SELECT 1 FROM Tags WHERE tag_id = 1)
AND NOT EXISTS (SELECT 1 FROM UserFollowedTags WHERE user_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1' AND tag_id = 1);