SELECT 
    l.id, l.type, l.price, l.title, l.description, l.product_condition,
    l.quantity, l.location, l.posted_date, l.posted_by, l.status,
    l.image_storage_ref,
    (SELECT COUNT(*) FROM Listing WHERE seller_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1') as totalListings,
    (SELECT SUM(status = 'for sale') FROM Listing WHERE seller_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1') as activeListings,
    (SELECT SUM(status = 'sold') FROM Listing WHERE seller_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1') as soldListings,
    (SELECT AVG(price) FROM Listing WHERE seller_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1') as averagePrice,
    (SELECT MIN(price) FROM Listing WHERE seller_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1') as minPrice,
    (SELECT MAX(price) FROM Listing WHERE seller_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1') as maxPrice
    FROM Listing l
    WHERE l.seller_id = 'x8uocqJbNoWO7TL6ZCEXCR2Hm1k1'
    ORDER BY l.posted_date DESC
    