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
VALUES ("x8uocqJbNoWO7TL6ZCEXCR2Hm1k1", "566f84e4-fc6a-4ab8-82be-c440c77b2745");   

-- Query #5 used in FYP to unfollow a user with followee_id
-- Alice now unfollows hannahking
DELETE FROM UserFollowedUsers WHERE user_id = "x8uocqJbNoWO7TL6ZCEXCR2Hm1k1" AND followee_id = "2ab3410d-aa84-404e-a9f5-52caa19fe15b";
