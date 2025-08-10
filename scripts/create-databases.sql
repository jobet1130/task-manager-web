-- Database creation script for Task Manager
-- This script creates both production and staging databases

-- Create production database
CREATE DATABASE taskmanager_prod
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Create staging database
CREATE DATABASE taskmanager_staging
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Grant privileges on production database
GRANT ALL PRIVILEGES ON DATABASE taskmanager_prod TO postgres;

-- Grant privileges on staging database
GRANT ALL PRIVILEGES ON DATABASE taskmanager_staging TO postgres;

-- Create application user for production (optional)
-- CREATE USER taskmanager_prod_user WITH PASSWORD 'your_secure_password';
-- GRANT ALL PRIVILEGES ON DATABASE taskmanager_prod TO taskmanager_prod_user;

-- Create application user for staging (optional)
-- CREATE USER taskmanager_staging_user WITH PASSWORD 'your_secure_password';
-- GRANT ALL PRIVILEGES ON DATABASE taskmanager_staging TO taskmanager_staging_user;

SELECT 'Databases created successfully!' AS status;