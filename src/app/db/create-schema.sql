-- Users table
DROP TABLE IF EXISTS Users, ProductType, `Condition`, Listing, Admin;

CREATE TABLE Users (
    uid VARCHAR(128) PRIMARY KEY, -- TODO: not too sure about this, based on Firebase UID
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    program VARCHAR(100),
    year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Types table
CREATE TABLE ProductType (
    type VARCHAR(50) PRIMARY KEY
);

-- Product Conditions table
CREATE TABLE `Condition` (
    type ENUM('new', 'like new', 'gently used', 'fair', 'poor') PRIMARY KEY -- TODO: feel free to add more values/change it up!
);

-- Listings table
CREATE TABLE Listing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50), -- TODO: not sure about this, do we want to have a separate table with fixed options for this?
    price FLOAT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    product_condition ENUM('new', 'like new', 'gently used', 'fair', 'poor'),
    quantity INT DEFAULT 1,
    location VARCHAR(255),
    posted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    posted_by VARCHAR(128),
    status ENUM('for sale', 'pending', 'sold') DEFAULT 'for sale',
    image_storage_ref VARCHAR(255), -- Firebase Storage reference/ID for the image
    FOREIGN KEY (type) REFERENCES ProductType(type),
    FOREIGN KEY (product_condition) REFERENCES `Condition`(type),
    FOREIGN KEY (posted_by) REFERENCES Users(uid)
);

-- Administrator table TODO: not sure if we want a separate table for admins, or just use the Users table
CREATE TABLE Admin (
    admin_id VARCHAR(128) PRIMARY KEY,
    FOREIGN KEY (admin_id) REFERENCES Users(uid)
);