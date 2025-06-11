#!/bin/bash

# Exit on error
set -e

echo "Setting up database..."

# Prompt for MySQL root password
read -sp "Enter MySQL root password: " MYSQL_ROOT_PASSWORD
echo

# Create admin user if it doesn't exist
echo "Setting up admin user..."
mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'admin';" || echo "Note: Could not create admin user. If it already exists, this is fine."

# Grant necessary permissions to admin user
echo "Granting permissions..."
mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "GRANT ALL PRIVILEGES ON *.* TO 'admin'@'localhost';"
mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "FLUSH PRIVILEGES;"

# Drop and recreate the u_sell database
echo "Creating database..."
mysql -u admin -padmin -e "DROP DATABASE IF EXISTS u_sell; CREATE DATABASE u_sell;"

# Run the create-schema.sql script
echo "Creating schema..."
mysql -u admin -padmin u_sell < src/app/db/create-schema.sql

# Run the mock-data.sql script
echo "Loading mock data..."
mysql -u admin -padmin u_sell < src/app/db/mock-data.sql

echo "Database setup complete!"