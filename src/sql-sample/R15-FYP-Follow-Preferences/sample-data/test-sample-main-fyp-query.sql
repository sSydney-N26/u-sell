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
      ORDER BY l.posted_date DESC