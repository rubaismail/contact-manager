-- ============================================
-- COP 4331C Small Project - Contact Manager
-- Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS ContactManager;
USE ContactManager;

-- Drop tables in dependency order
DROP TABLE IF EXISTS Contacts;
DROP TABLE IF EXISTS Users;

-- ============================================
-- Users
-- ============================================

CREATE TABLE Users (
    ID INT NOT NULL AUTO_INCREMENT,
    FirstName VARCHAR(50) NOT NULL DEFAULT '',
    LastName VARCHAR(50) NOT NULL DEFAULT '',
    Username VARCHAR(50) NOT NULL,
    Password VARCHAR(255) NOT NULL,

    PRIMARY KEY (ID),
    UNIQUE KEY unique_username (Username)
) ENGINE=InnoDB;

-- ============================================
-- Contacts
-- ============================================

CREATE TABLE Contacts (
    ID INT NOT NULL AUTO_INCREMENT,
    FirstName VARCHAR(50) NOT NULL DEFAULT '',
    LastName VARCHAR(50) NOT NULL DEFAULT '',
    Phone VARCHAR(50) NOT NULL DEFAULT '',
    Email VARCHAR(100) NOT NULL DEFAULT '',
    UserID INT NOT NULL,
    DateCreated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (ID),

    CONSTRAINT fk_contacts_user
        FOREIGN KEY (UserID)
        REFERENCES Users(ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_contacts_userid (UserID),
    INDEX idx_contacts_name (LastName, FirstName)
) ENGINE=InnoDB;
