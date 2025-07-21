-- Users table
DROP TABLE IF EXISTS UserFollowedUsers, UserFollowedKeywords, UserFollowedCategories, Reports, ListingViews, Listing, Admin, ProductType, ProductCondition, Users;

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
    type ENUM('School Supplies', 'Furniture', 'Kitchen', 'Electronics', 'Clothing', 'Misc') PRIMARY KEY
);

-- Product Conditions table
CREATE TABLE ProductCondition (
    type ENUM('new', 'like new', 'gently used', 'fair', 'poor') PRIMARY KEY
);

-- Listings table
CREATE TABLE Listing (
    id INT AUTO_INCREMENT,
    seller_id VARCHAR(128),
    type ENUM('School Supplies', 'Furniture', 'Kitchen', 'Electronics', 'Clothing', 'Misc'),
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

-- Trigger to restore listing status if reports are deleted and count drops below 5
CREATE TRIGGER check_report_count_after_delete
AFTER DELETE ON Reports
FOR EACH ROW
BEGIN
    DECLARE report_count INT;

    -- Count distinct reporters for this listing
    SELECT COUNT(DISTINCT reporter_id) INTO report_count
    FROM Reports
    WHERE listing_id = OLD.listing_id;

    -- If we've dropped below 5 reports, restore the listing to 'for sale' status
    IF report_count < 5 THEN
        UPDATE Listing
        SET status = 'for sale'
        WHERE id = OLD.listing_id AND status = 'flagged';
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
DELIMITER ;


CREATE TABLE Admin (
    admin_id VARCHAR(128) PRIMARY KEY,
    FOREIGN KEY (admin_id) REFERENCES Users(uid)
);

-- User Followed Categories table
CREATE TABLE UserFollowedCategories (
    user_id VARCHAR(128) NOT NULL,
    category ENUM('School Supplies', 'Furniture', 'Kitchen', 'Electronics', 'Clothing', 'Misc') NOT NULL,
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

-- Indexes for performance on FYP queries
CREATE INDEX idx_followed_categories_user ON UserFollowedCategories(user_id);
CREATE INDEX idx_followed_keywords_user ON UserFollowedKeywords(user_id);
CREATE INDEX idx_followed_users_user ON UserFollowedUsers(user_id);
CREATE INDEX idx_followed_users_followee ON UserFollowedUsers(user_id);

-- Create view for Bundle Feature
CREATE OR REPLACE VIEW BackToSchoolBundleView AS
SELECT *
FROM (
    SELECT
        l.id,
        l.seller_id,
        l.type,
        l.price,
        l.title,
        l.description,
        l.product_condition,
        l.quantity,
        l.location,
        l.posted_date,
        l.posted_by,
        l.status,
        l.image_storage_ref,
        ROW_NUMBER() OVER (PARTITION BY l.seller_id ORDER BY l.posted_date DESC) AS row_num
    FROM Listing l
    WHERE l.status = 'for sale'
      AND l.type IN ('Electronics', 'School Supplies')
) AS ranked
WHERE ranked.row_num <= 5;
