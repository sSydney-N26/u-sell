INSERT INTO UserFollowedKeywords (user_id, keyword)
SELECT 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1', 'chemistry'
WHERE NOT EXISTS (SELECT 1 FROM UserFollowedKeywords WHERE user_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1' AND keyword = 'chemistry');