-- Display the Top 10 Most-Viewed Listings
SELECT
        l.id,
        l.title,
        l.price,
        l.type,
        l.posted_by,
        l.image_storage_ref,
        v.view_count
      FROM Top10View v
      JOIN Listing l ON v.listing_id = l.id
      WHERE l.status = 'for sale'
      ORDER BY v.view_count DESC, l.posted_date DESC;

-- Log a view for a listing
INSERT INTO ListingViews (listing_id, viewer_id) VALUES (7, NULL);

-- Fetch new view count for a listing
SELECT COUNT(*) AS view_count FROM ListingViews WHERE listing_id = 7;