#!/bin/bash

# Drop and recreate the u_sell database COMMENT OUT IF YOU WANT TO KEEP THE DATA
mysql -u root -e "DROP DATABASE IF EXISTS u_sell; CREATE DATABASE u_sell;"

# Run the create-schema.sql script
mysql -u root u_sell < src/app/db/create-schema.sql

# Run the mock-data.sql script
mysql -u root u_sell < src/app/db/mock-data.sql

echo "Database setup complete!"