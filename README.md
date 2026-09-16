# Contact Manager

A full-stack contact management web application built for the COP 4331C Small Project. Users can create an account, log in, and securely manage their own contacts through a responsive web interface.

Live application: [team11.store](http://team11.store/)

## Features

- User registration, login, logout, and session-based authentication
- Create, view, edit, and delete contacts
- Case-insensitive partial search by name, email, or phone number
- Server-side pagination for scalable contact retrieval
- Per-user contact ownership and authorization
- Responsive desktop and mobile interface
- Inline loading, success, validation, and error feedback
- JSON API documented and testable through SwaggerHub

## Tech stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** PHP, Apache
- **Database:** MySQL
- **Hosting:** Ubuntu Linux on DigitalOcean
- **API:** JSON over HTTP

## Project structure

```text
contact-manager/
├── LAMPAPI/             # PHP API endpoints and shared utilities
├── css/                 # Application styles
├── images/              # Static image assets
├── js/                  # Frontend JavaScript
├── database/            # Database schema and seed data
├── index.html           # Authentication page
├── contacts.html        # Contact dashboard
└── README.md
```

## Getting started

### Prerequisites

- Apache
- PHP with the `mysqli` extension
- MySQL
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/rubaismail/contact-manager.git
cd contact-manager
```

Create the database:

```bash
mysql -u root -p < database/schema.sql
```

Create a least-privilege application user in MySQL:

```sql
CREATE USER 'contact_app'@'localhost'
IDENTIFIED BY 'replace-with-a-strong-password';

GRANT SELECT, INSERT, UPDATE, DELETE
ON ContactManager.*
TO 'contact_app'@'localhost';

FLUSH PRIVILEGES;
```

Create a `.env` file in the project root:

```dotenv
APP_ENV=production
APP_DEBUG=false
APP_NAME=ContactManager
APP_URL=http://localhost/

DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=ContactManager
DB_USERNAME=contact_app
DB_PASSWORD="replace-with-the-application-password"
```

Do not commit `.env`. In production, keep it outside the public document root and update the path used by `LAMPAPI/config.php` accordingly.

Configure Apache to serve the project directory, then open the configured URL in a browser.

## API

All endpoints accept JSON requests and return JSON responses.

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| `POST` | `/LAMPAPI/Register.php` | Create an account | Public |
| `POST` | `/LAMPAPI/Login.php` | Authenticate a user | Public |
| `POST` | `/LAMPAPI/AddContact.php` | Create a contact | Required |
| `POST` | `/LAMPAPI/SearchContact.php` | List or search contacts | Required |
| `POST` | `/LAMPAPI/EditContact.php` | Update a contact | Required |
| `POST` | `/LAMPAPI/DeleteContact.php` | Delete a contact | Required |

Authenticated endpoints use the PHP session cookie. Contact ownership is derived from the authenticated session; clients must not submit a `UserID`.

Search supports the following pagination fields:

```json
{
  "query": "Jo",
  "page": 1,
  "limit": 10
}
```

The default page size is 10 and the maximum is 100.

## Database

The application uses two tables:

- `Users` stores account information and password hashes.
- `Contacts` stores contact details and references its owner through `UserID`.

The database enforces the one-to-many ownership relationship with a foreign key. Deleting a user removes that user's contacts through `ON DELETE CASCADE`.

## Security

- Passwords are stored using PHP's `password_hash()` and verified with `password_verify()`.
- SQL operations use prepared statements.
- Protected endpoints derive identity from the server-side session.
- Database credentials are loaded from environment configuration.
- The application database account receives only required CRUD privileges.
- Production deployments should use HTTPS and secure, HTTP-only session cookies.

## Testing

API endpoints can be tested through SwaggerHub, Postman, or `curl`. Tests should cover successful requests, validation failures, authentication, ownership enforcement, pagination, and database errors.

Before submitting changes:

```bash
git diff --check
```

## Deployment

After changes are merged into `main`, update the server checkout:

```bash
cd /var/www/html
git fetch origin
git pull --ff-only origin main
```

Keep production secrets outside source control and verify database migrations before deploying API changes.
