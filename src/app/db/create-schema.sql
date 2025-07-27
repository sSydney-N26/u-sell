-- Users table
DROP TABLE IF EXISTS Notifications, UserFollowedTags, UserFollowedUsers, UserFollowedKeywords, UserFollowedCategories, Reports, ListingViews, Listing, Admin, ProductType, ProductCondition, Users, ListingTags, Tags;

CREATE TABLE Users (
    uid VARCHAR(128) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    program VARCHAR(100),
    year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Types table
CREATE TABLE ProductType (
    type ENUM('School Supplies', 'Furniture', 'Kitchen', 'Electronics', 'Clothing', 'Misc', 'Toys', 'Health', 'Beauty', 'Video Games', 'Sports', 'Arts') PRIMARY KEY
);

-- Product Conditions table
CREATE TABLE ProductCondition (
    type ENUM('new', 'like new', 'gently used', 'fair', 'poor') PRIMARY KEY
);

-- Listings table
CREATE TABLE Listing (
    id INT AUTO_INCREMENT,
    seller_id VARCHAR(128),
    type ENUM('School Supplies', 'Furniture', 'Kitchen', 'Electronics', 'Clothing', 'Misc', 'Toys', 'Health', 'Beauty', 'Video Games', 'Sports', 'Arts'),
    price FLOAT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    product_condition ENUM('new', 'like new', 'gently used', 'fair', 'poor'),
    quantity INT DEFAULT 1,
    location VARCHAR(255),
    posted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    posted_by VARCHAR(50),
    status ENUM('for sale', 'pending', 'sold', 'removed', 'flagged') DEFAULT 'for sale',
    image_storage_ref VARCHAR(255), -- Firebase Storage reference/ID for the image
    view_count BIGINT UNSIGNED NOT NULL DEFAULT 0,
    FOREIGN KEY (type) REFERENCES ProductType(type),
    FOREIGN KEY (product_condition) REFERENCES ProductCondition(type),
    FOREIGN KEY (posted_by) REFERENCES Users(username),
    FOREIGN KEY (seller_id) REFERENCES Users(uid),
    PRIMARY KEY (id)
);

-- Tags table for storing approved tags
CREATE TABLE Tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ListingTags table for many-to-many relationship between listings and tags
CREATE TABLE ListingTags (
    listing_id INT,
    tag_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES Listing(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES Tags(tag_id) ON DELETE CASCADE,
    PRIMARY KEY (listing_id, tag_id)
);

-- Reports table for tracking listing reports
CREATE TABLE Reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    listing_id INT NOT NULL,
    reporter_id VARCHAR(128) NOT NULL,
    reason ENUM('inappropriate', 'spam', 'fake', 'offensive', 'other') NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES Listing(id) ON DELETE CASCADE,
    FOREIGN KEY (reporter_id) REFERENCES Users(uid)
);



CREATE INDEX idx_listing_seller_id ON Listing(seller_id, posted_date DESC);
CREATE INDEX idx_listing_id ON Listing(id);
CREATE INDEX idx_listing_type_and_date ON Listing(type, posted_date ASC);
CREATE INDEX idx_listing_date ON Listing(posted_date);
CREATE INDEX idx_listing_view_count ON Listing(view_count DESC);
CREATE INDEX idx_tags_name ON Tags(tag_name);
CREATE INDEX idx_listing_tags_listing ON ListingTags(listing_id);
CREATE INDEX idx_listing_tags_tag ON ListingTags(tag_id);

-- Trigger to flag listings when they reach 5 distinct reports (for admin review)
DELIMITER //
CREATE TRIGGER check_report_count_after_insert
AFTER INSERT ON Reports
FOR EACH ROW
BEGIN
    DECLARE report_count INT;

    -- Count distinct reporters for this listing (this handles multiple reports from same user)
    SELECT COUNT(DISTINCT reporter_id) INTO report_count
    FROM Reports
    WHERE listing_id = NEW.listing_id;

    -- If we've reached 5 distinct reports, flag the listing for admin review
    IF report_count >= 5 THEN
        UPDATE Listing
        SET status = 'flagged'
        WHERE id = NEW.listing_id AND status = 'for sale';
    END IF;
END//
DELIMITER ;

CREATE TABLE ListingViews (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  listing_id INT       NOT NULL,
  viewer_id  VARCHAR(128),
  viewed_at  DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id) REFERENCES Listing(id) ON DELETE CASCADE
);
CREATE INDEX idx_lv_listing ON ListingViews(listing_id, viewed_at);

DELIMITER //
CREATE TRIGGER trigger_after_view_insert
AFTER INSERT ON ListingViews
FOR EACH ROW
BEGIN
  UPDATE Listing
     SET view_count = view_count + 1
   WHERE id = NEW.listing_id;
END;
//

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


CREATE TABLE Admin (
    admin_id VARCHAR(128) PRIMARY KEY,
    FOREIGN KEY (admin_id) REFERENCES Users(uid)
);

-- User Followed Categories table
CREATE TABLE UserFollowedCategories (
    user_id VARCHAR(128) NOT NULL,
    category ENUM('School Supplies', 'Furniture', 'Kitchen', 'Electronics', 'Clothing', 'Misc', 'Toys', 'Health', 'Beauty', 'Video Games', 'Sports', 'Arts') NOT NULL,
    PRIMARY KEY (user_id, category),
    FOREIGN KEY (user_id) REFERENCES Users(uid) ON DELETE CASCADE,
    FOREIGN KEY (category) REFERENCES ProductType(type)
);

-- User Followed Keywords table
CREATE TABLE UserFollowedKeywords (
    user_id VARCHAR(128) NOT NULL,
    keyword VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_id, keyword),
    FOREIGN KEY (user_id) REFERENCES Users(uid) ON DELETE CASCADE
);

-- Users Followed Users table
CREATE TABLE UserFollowedUsers (
    user_id VARCHAR(128) NOT NULL,
    followee_id VARCHAR(128) NOT NULL,
    PRIMARY KEY (user_id, followee_id),
    FOREIGN KEY (user_id) REFERENCES Users(uid) ON DELETE CASCADE,
    FOREIGN KEY (followee_id) REFERENCES Users(uid) ON DELETE CASCADE
);

-- User Followed Tags table
CREATE TABLE UserFollowedTags (
    user_id VARCHAR(128) NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (user_id, tag_id),
    FOREIGN KEY (user_id) REFERENCES Users(uid) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES Tags(tag_id) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE Notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    listing_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(uid) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES Listing(id) ON DELETE CASCADE
);

-- Indexes for performance on FYP queries
CREATE INDEX idx_followed_categories_user ON UserFollowedCategories(user_id);
CREATE INDEX idx_followed_keywords_user ON UserFollowedKeywords(user_id);

-- Create view for Bundle Feature
CREATE OR REPLACE VIEW BackToSchoolBundleView AS
SELECT l.*
FROM Listing l
JOIN (
    SELECT e.seller_id
    FROM Listing e
    JOIN Listing s
      ON e.seller_id = s.seller_id
    WHERE e.status = 'for sale' AND e.type = 'Electronics'
      AND s.status = 'for sale' AND s.type = 'School Supplies'
    GROUP BY e.seller_id
) AS eligible_sellers
  ON l.seller_id = eligible_sellers.seller_id
WHERE l.status = 'for sale'
  AND l.type IN ('Electronics', 'School Supplies')
ORDER BY l.seller_id, l.posted_date DESC
LIMIT 5;
