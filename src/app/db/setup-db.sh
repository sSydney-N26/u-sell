#!/bin/bash

# Exit on error
set -e

echo "Setting up database..."

echo "Enter your MySQL Root Password"
mysql -u root -p -e "
    CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED BY 'admin1!';
    GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%' WITH GRANT OPTION;
    FLUSH PRIVILEGES;
    "

echo "Checking to see if u_sell table already exist, if so drop"
mysql -u admin -p"admin1!" -e "
    DROP DATABASE IF EXISTS u_sell;
    CREATE DATABASE u_sell;
    "
echo "Creating schema..."
mysql -u admin -p"admin1!" u_sell < create-schema.sql

# Run the production data script
echo "Loading production data..."
mysql -u admin -p"admin1!" u_sell < usell_prod_data.sql


echo "Database setup complete!"