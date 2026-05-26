-- Sri Vinayaga Traders - Database Migration
-- Run this script to create all required tables
-- Table prefix: svt_web_

-- Categories Table
CREATE TABLE IF NOT EXISTS `svt_web_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Products Table
CREATE TABLE IF NOT EXISTS `svt_web_products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL UNIQUE,
  `category_id` INT,
  `category_slug` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `details` TEXT,
  `price_label` VARCHAR(100) DEFAULT 'Call for Price',
  `availability` ENUM('in_stock','out_of_stock','on_order') DEFAULT 'in_stock',
  `brand` VARCHAR(100),
  `image_url` VARCHAR(500),
  `is_featured` TINYINT(1) DEFAULT 0,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `svt_web_categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS `svt_web_contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(150),
  `message` TEXT NOT NULL,
  `status` ENUM('new','read','replied') DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bookings Table
CREATE TABLE IF NOT EXISTS `svt_web_bookings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(150),
  `address` TEXT NOT NULL,
  `preferred_date` DATE NOT NULL,
  `preferred_time` VARCHAR(20),
  `items_description` TEXT,
  `notes` TEXT,
  `status` ENUM('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Enquiries Table (from cart submissions)
CREATE TABLE IF NOT EXISTS `svt_web_enquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(150),
  `items` JSON NOT NULL,
  `notes` TEXT,
  `status` ENUM('new','processing','completed','cancelled') DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Categories
INSERT IGNORE INTO `svt_web_categories` (`name`, `slug`, `description`) VALUES
('TMT Bars', 'tmt', 'High-strength thermo-mechanically treated steel bars for construction'),
('Rings', 'rings', 'Steel rings in various sizes for construction'),
('Roofing Sheets', 'rsheets', 'Color coated metal roofing sheets'),
('Metal Pipes', 'pipes', 'MS, GI and GP metal pipes'),
('Sheets', 'sheets', 'MS and GI steel sheets'),
('Cement', 'cement', 'Premium quality cement from top brands'),
('Asbestos Sheets', 'asbseet', 'Fibre cement and asbestos roofing sheets'),
('Structural Materials', 'strmatr', 'Angle metals, channels, beams and rods'),
('Others', 'others', 'Miscellaneous construction materials and hardware');
