# Contact Manager Database

Database component for the COP 4331C Small Project.

## Database

- MySQL
- Database name: `ContactManager`

## Tables

### Users

Stores application users.

Fields:

- `ID` - Primary key
- `FirstName` - User first name
- `LastName` - User last name
- `Username` - Unique username
- `Password` - User password/hash

### Contacts

Stores contacts belonging to users.

Fields:

- `ID` - Primary key
- `FirstName` - Contact first name
- `LastName` - Contact last name
- `Phone` - Contact phone number
- `Email` - Contact email
- `UserID` - Foreign key referencing `Users.ID`
- `DateCreated` - Time the contact was created

## Relationship

One user can have many contacts.

`Users.ID` → `Contacts.UserID`

## Setup

Run the following files in MySQL:

1. `schema.sql`
2. `seed.sql`

`queries.sql` contains example queries used by the API.

## Database Responsibilities

The database component is responsible for:

- Designing the database schema
- Creating the Users and Contacts tables
- Defining primary/foreign keys
- Maintaining the relationship between users and contacts
- Providing SQL queries for CRUD operations
- Providing sample/seed data
- Supporting the API team with database requirements
