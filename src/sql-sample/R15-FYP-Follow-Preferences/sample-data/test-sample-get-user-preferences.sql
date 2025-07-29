SELECT 'category' as type, category as value, NULL as tag_id, NULL as tag_name
      FROM UserFollowedCategories 
      WHERE user_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1'
      UNION ALL
      SELECT 'keyword' as type, keyword as value, NULL as tag_id, NULL as tag_name
      FROM UserFollowedKeywords 
      WHERE user_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1'
      UNION ALL
      SELECT 'tag' as type, NULL as value, t.tag_id, t.tag_name
      FROM UserFollowedTags ut
      JOIN Tags t ON ut.tag_id = t.tag_id
      WHERE ut.user_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1'
      ORDER BY type, value, tag_name;