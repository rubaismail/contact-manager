USE ContactManager;

-- ============================================
-- Sample User
-- ============================================

INSERT INTO Users
    (FirstName, LastName, Username, Password)
VALUES
    ('Aashish', 'Yadavally', 'AYadavally', 'COP4331');

-- ============================================
-- Sample Contacts
-- ============================================

INSERT INTO Contacts
    (FirstName, LastName, Phone, Email, UserID)
VALUES
    ('John', 'Smith', '407-555-1234', 'john@email.com', 1),
    ('Jane', 'Doe', '407-555-5678', 'jane@email.com', 1),
    ('Michael', 'Brown', '407-555-9012', 'michael@email.com', 1);
