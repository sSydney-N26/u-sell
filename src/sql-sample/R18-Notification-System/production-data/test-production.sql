-- Trigger to create notifications when new listings match user preferences
CREATE TRIGGER create_listing_notifications
AFTER INSERT ON Listing
FOR EACH ROW
BEGIN
    -- Notify users who follow this category
    INSERT INTO Notifications (user_id, listing_id, message)
    SELECT
        ufc.user_id,
        NEW.id,
        CONCAT('New listing in ', NEW.type, ': ', NEW.title)
    FROM UserFollowedCategories ufc
    WHERE ufc.category = NEW.type
      AND NEW.seller_id != ufc.user_id; -- Don't notify the seller

    -- Notify users who follow keywords that appear in title or description
    INSERT INTO Notifications (user_id, listing_id, message)
    SELECT
        ufk.user_id,
        NEW.id,
        CONCAT('New listing matches "', ufk.keyword, '": ', NEW.title)
    FROM UserFollowedKeywords ufk
    WHERE (LOWER(NEW.title) LIKE CONCAT('%', ufk.keyword, '%')
           OR LOWER(NEW.description) LIKE CONCAT('%', ufk.keyword, '%'))
      AND NEW.seller_id != ufk.user_id; -- Don't notify the seller

    -- Notify users who follow this seller
    INSERT INTO Notifications (user_id, listing_id, message)
    SELECT
        ufu.user_id,
        NEW.id,
        CONCAT('New listing from ', NEW.posted_by, ': ', NEW.title)
    FROM UserFollowedUsers ufu
    WHERE ufu.followee_id = NEW.seller_id;
END;
//

-- Trigger to create notifications when tags are added to listings
CREATE TRIGGER create_tag_notifications
AFTER INSERT ON ListingTags
FOR EACH ROW
BEGIN
    -- Notify users who follow this specific tag
    INSERT INTO Notifications (user_id, listing_id, message)
    SELECT
        uft.user_id,
        NEW.listing_id,
        CONCAT('New listing with "', t.tag_name, '" tag: ', l.title)
    FROM UserFollowedTags uft
    JOIN Tags t ON uft.tag_id = t.tag_id
    JOIN Listing l ON NEW.listing_id = l.id
    WHERE uft.tag_id = NEW.tag_id
      AND l.seller_id != uft.user_id; -- Don't notify the seller
END;
//
DELIMITER ;