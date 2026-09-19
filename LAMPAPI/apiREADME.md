# Contact Manager API

The PHP API accepts JSON requests and returns JSON responses. Endpoint paths and JSON field names are case-sensitive.

## Request requirements

- Use `POST` for every endpoint.
- Send `Content-Type: application/json`.
- Send a JSON object as the request body.
- Do not send `UserID` to protected endpoints. The API obtains it from the authenticated PHP session.

Malformed JSON returns HTTP `400`, unsupported media types return `415`, and unsupported methods return `405`.

## Response contract

Every successful response contains `success`, `data`, and an optional `message`:

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

Every error response contains `success` and `error`:

```json
{
  "success": false,
  "error": "Useful error message"
}
```

Common status codes:

| Status | Meaning |
| --- | --- |
| `200` | Request completed successfully |
| `201` | Resource created successfully |
| `400` | Missing, invalid, or malformed request data |
| `401` | Authentication required or credentials rejected |
| `404` | Requested contact not found for the authenticated user |
| `405` | Only `POST` is supported |
| `409` | Username already exists |
| `415` | Request is not JSON |
| `500` | Unexpected server or database error |

## Authentication

`Login.php` creates a PHP session after verifying the submitted password. Clients must retain and resend the resulting `PHPSESSID` cookie when calling protected endpoints. `Logout.php` ends the current PHP session.

## Endpoints

### Register.php

Creates a user account.

```json
{
  "FirstName": "Jane",
  "LastName": "Doe",
  "Username": "jdoe",
  "Password": "example-password"
}
```

Returns HTTP `201` with the new user ID in `data.ID`.

### Login.php

Authenticates a user and creates a session.

```json
{
  "Username": "jdoe",
  "Password": "example-password"
}
```

Returns the user ID and name in `data`.

### Logout.php

Ends the current PHP session. Send the `PHPSESSID` cookie obtained from login and an empty JSON object:

```json
{}
```

Returns HTTP `200` with:

```json
{
  "success": true,
  "data": null,
  "message": "Logout successful"
}
```

### AddContact.php

Creates a contact for the authenticated user.

```json
{
  "FirstName": "John",
  "LastName": "Smith",
  "Phone": "407-555-1234",
  "Email": "john@example.com"
}
```

Returns HTTP `201` with the new contact ID in `data.ID`.

### EditContact.php

Updates a contact owned by the authenticated user.

```json
{
  "ID": 1,
  "FirstName": "John",
  "LastName": "Smith",
  "Phone": "407-555-5678",
  "Email": "john.smith@example.com"
}
```

### DeleteContact.php

Deletes a contact owned by the authenticated user.

```json
{
  "ID": 1
}
```

### SearchContact.php

Returns a paginated list of the authenticated user's contacts. An empty query lists all contacts.

```json
{
  "query": "Jo",
  "page": 1,
  "limit": 10
}
```

`page` defaults to `1`. `limit` defaults to `10` and is capped at `100`.

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```
