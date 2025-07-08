-- Users table
DROP TABLE IF EXISTS Listing, Admin, ProductType, ProductCondition, Users;

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
    status ENUM('for sale', 'pending', 'sold') DEFAULT 'for sale',
    image_storage_ref VARCHAR(255), -- Firebase Storage reference/ID for the image
    FOREIGN KEY (type) REFERENCES ProductType(type),
    FOREIGN KEY (product_condition) REFERENCES ProductCondition(type),
    FOREIGN KEY (posted_by) REFERENCES Users(username),
    FOREIGN KEY (seller_id) REFERENCES Users(uid),
    PRIMARY KEY (id, seller_id)
);

CREATE INDEX idx_listing_seller_id ON Listing(seller_id, posted_date DESC);

CREATE TABLE Admin (
    admin_id VARCHAR(128) PRIMARY KEY,
    FOREIGN KEY (admin_id) REFERENCES Users(uid)
);