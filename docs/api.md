# Library Management API

Complete reference for the HTTP API implemented by this project.

## General information

- Base URL (local): `http://localhost:3333`
- Content type: `application/json`, except PDF downloads
- Swagger UI: `http://localhost:3333/api`
- Authentication: bearer JWT where noted
- Dates in JSON responses are serialized as ISO 8601 strings.
- IDs are positive integers. Route IDs are validated as integers except on student-profile routes, where invalid values are converted to `NaN` and normally result in an error.
- Request validation strips properties that are not declared in the DTO.

Authenticated requests use the token returned by `POST /auth/login`:

```http
Authorization: Bearer <access_token>
```

At present, only `GET /authors` requires authentication and the `ADMIN` role. All other controller endpoints are public.

## Common errors

NestJS errors generally have this shape:

```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

Common status codes:

| Status | Meaning |
| --- | --- |
| `400` | Invalid request body/parameter, duplicate unique value, or unavailable stock |
| `401` | Missing, invalid, or expired bearer token; or invalid login credentials |
| `403` | Authenticated user does not have the required role |
| `404` | Requested entity does not exist |
| `409` / `500` | A database constraint was violated; some Prisma errors are not explicitly translated by the application |

## Data shapes

Fields such as `photoUrl`, `imageUrl`, and `pdfPath` are generated or persisted by the application/database and are not accepted by the create/update DTOs.

### Author

```json
{
  "id": 1,
  "name": "Humayun Ahmed",
  "bio": "Famous Bangladeshi novelist",
  "photoUrl": null,
  "createdAt": "2026-06-27T10:00:00.000Z"
}
```

### Category

```json
{
  "id": 1,
  "name": "Programming",
  "createdAt": "2026-06-27T10:00:00.000Z"
}
```

### Book

```json
{
  "id": 1,
  "title": "NestJS Fundamentals",
  "isbn": "9781234567890",
  "stock": 10,
  "imageUrl": null,
  "authorId": 1,
  "createdAt": "2026-06-27T10:00:00.000Z"
}
```

### Student

```json
{
  "id": 1,
  "name": "Arifur Rahman",
  "email": "arifur@example.com",
  "phone": "01712345678",
  "photoUrl": null,
  "createdAt": "2026-06-27T10:00:00.000Z"
}
```

### Student profile

```json
{
  "id": 1,
  "studentId": 1,
  "address": "Dhaka, Bangladesh",
  "age": 22,
  "createdAt": "2026-06-27T10:00:00.000Z"
}
```

### Order

`status` is one of `BORROWED`, `RETURNED`, or `OVERDUE`.

```json
{
  "id": 1,
  "studentId": 1,
  "bookId": 1,
  "status": "BORROWED",
  "orderDate": "2026-06-27T10:00:00.000Z",
  "dueDate": "2026-07-01T00:00:00.000Z",
  "returnDate": null,
  "pdfPath": "/uploads/orders/order-1.pdf",
  "createdAt": "2026-06-27T10:00:00.000Z"
}
```

## Endpoint index

| Method | Path | Description | Access |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Register a user | Public |
| `POST` | `/auth/login` | Log in | Public |
| `GET` | `/auth/profile` | Read JWT identity | Bearer token |
| `POST` | `/authors` | Create an author | Public |
| `GET` | `/authors` | List authors | Admin bearer token |
| `GET` | `/authors/:id/books` | Get an author and their books | Public |
| `GET` | `/authors/:id` | Get an author | Public |
| `PATCH` | `/authors/:id` | Update an author | Public |
| `DELETE` | `/authors/:id` | Delete an author | Public |
| `POST` | `/categories` | Create a category | Public |
| `GET` | `/categories` | List categories and books | Public |
| `GET` | `/categories/:id` | Get a category and its books | Public |
| `PATCH` | `/categories/:id` | Update a category | Public |
| `DELETE` | `/categories/:id` | Delete a category | Public |
| `POST` | `/books` | Create a book | Public |
| `GET` | `/books` | List/search books | Public |
| `GET` | `/books/:id/summary` | Get borrowing summary for a book | Public |
| `GET` | `/books/:id` | Get a book | Public |
| `PATCH` | `/books/:id` | Update a book | Public |
| `DELETE` | `/books/:id` | Delete a book | Public |
| `POST` | `/students` | Create a student | Public |
| `GET` | `/students` | List/search students | Public |
| `GET` | `/students/:id/summary` | Get borrowing summary for a student | Public |
| `GET` | `/students/:id` | Get a student | Public |
| `PATCH` | `/students/:id` | Update a student | Public |
| `DELETE` | `/students/:id` | Delete a student | Public |
| `POST` | `/student-profiles` | Create a profile | Public |
| `GET` | `/student-profiles` | List profiles | Public |
| `GET` | `/student-profiles/:id` | Get a profile | Public |
| `PATCH` | `/student-profiles/:id` | Update a profile | Public |
| `DELETE` | `/student-profiles/:id` | Delete a profile | Public |
| `POST` | `/orders` | Borrow a book | Public |
| `GET` | `/orders` | List orders | Public |
| `GET` | `/orders/:id` | Get an order | Public |
| `PATCH` | `/orders/:id` | Update/return an order | Public |
| `DELETE` | `/orders/:id` | Delete an order | Public |
| `GET` | `/orders/:id/pdf` | Download order PDF | Public |

## Authentication

### Register a user

`POST /auth/register`

Request body:

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| `name` | string | Yes | Non-empty |
| `email` | string | Yes | Valid and unique email |
| `password` | string | Yes | At least 6 characters |
| `role` | string | No | `ADMIN` or `LIBRARIAN`; defaults to `LIBRARIAN` |

```json
{
  "name": "Library Admin",
  "email": "admin@example.com",
  "password": "secret123",
  "role": "ADMIN"
}
```

Success: `201 Created`

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "Library Admin",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

Returns `400` with `Email already exists` if the email is registered.

### Log in

`POST /auth/login`

Request body:

```json
{
  "email": "admin@example.com",
  "password": "secret123"
}
```

Success: `201 Created`

```json
{
  "access_token": "<jwt>",
  "user": {
    "id": 1,
    "name": "Library Admin",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

Returns `401` with `Invalid credentials` when either credential is wrong.

### Get authenticated profile

`GET /auth/profile`

Requires a bearer token. This returns the identity encoded in the JWT, not the full user record.

Success: `200 OK`

```json
{
  "id": 1,
  "email": "admin@example.com",
  "role": "ADMIN"
}
```

## Authors

### Create an author

`POST /authors`

```json
{
  "name": "Humayun Ahmed",
  "bio": "Famous Bangladeshi novelist"
}
```

`name` is required and non-empty. `bio` is optional. Returns `201` with the created Author.

### List authors

`GET /authors`

Requires an `ADMIN` bearer token. Returns `200` with an array of Authors ordered by descending ID. A librarian receives `403 Access denied`.

### Get an author's books

`GET /authors/:id/books`

Returns `200` with the Author plus a `books` array. Each book includes its `categories` array. Returns `404` if the author does not exist.

### Get an author

`GET /authors/:id`

Returns `200` with an Author or `404` with `Author with id <id> not found`.

### Update an author

`PATCH /authors/:id`

All fields are optional:

```json
{
  "name": "Updated name",
  "bio": "Updated biography"
}
```

Returns `200` with the updated Author or `404` if it does not exist.

### Delete an author

`DELETE /authors/:id`

Returns `200` with the deleted Author or `404`. Deletion can fail if books still reference the author.

## Categories

### Create a category

`POST /categories`

```json
{
  "name": "Programming"
}
```

`name` is required, non-empty, and unique. Returns `201` with the created Category.

### List categories

`GET /categories`

Returns `200` with categories ordered by descending ID. Each category includes a `books` array.

### Get a category

`GET /categories/:id`

Returns `200` with the Category and its `books`, or `404` with `Category <id> not found`.

### Update a category

`PATCH /categories/:id`

```json
{
  "name": "Software Engineering"
}
```

The field is optional, but if supplied it must be a non-empty string. Returns the updated Category.

### Delete a category

`DELETE /categories/:id`

Returns `200` with the deleted Category or `404`.

## Books

### Create a book

`POST /books`

Request body:

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| `title` | string | Yes | Non-empty |
| `isbn` | string | No | Unique when supplied |
| `stock` | integer | Yes | Minimum `0` |
| `authorId` | integer | Yes | Must reference an author |
| `categoryIds` | integer[] | Yes | Non-empty; each ID must reference a category |

```json
{
  "title": "NestJS Fundamentals",
  "isbn": "9781234567890",
  "stock": 10,
  "authorId": 1,
  "categoryIds": [1, 2]
}
```

Returns `201` with the created Book including `author` and `categories`.

### List or search books

`GET /books`

Optional query parameters can be combined:

| Query | Meaning |
| --- | --- |
| `title` | Case-insensitive partial title match |
| `author` | Case-insensitive partial author-name match |
| `category` | Case-insensitive partial category-name match |

Example: `GET /books?title=nest&category=programming`

Returns `200` with matching Books ordered by descending ID. Every item includes `author` and `categories`.

### Get a book borrowing summary

`GET /books/:id/summary`

Returns `200`:

```json
{
  "book": {
    "id": 1,
    "title": "NestJS Fundamentals",
    "isbn": "9781234567890",
    "stock": 9,
    "author": "Humayun Ahmed",
    "categories": ["Programming"]
  },
  "totalBorrowed": 1,
  "borrowedBy": [
    {
      "orderId": 1,
      "studentId": 1,
      "studentName": "Arifur Rahman",
      "status": "BORROWED",
      "orderDate": "2026-06-27T10:00:00.000Z",
      "returnDate": null
    }
  ]
}
```

`totalBorrowed` counts all historical orders. Returns `404 Book not found` when absent.

### Get a book

`GET /books/:id`

Returns the Book including `author` and `categories`, or `404`.

### Update a book

`PATCH /books/:id`

Accepts any subset of the create fields. Supplying `categoryIds` replaces all category associations:

```json
{
  "stock": 12,
  "categoryIds": [2, 3]
}
```

Returns the updated Book including `author` and `categories`.

### Delete a book

`DELETE /books/:id`

Returns the deleted Book or `404`. Deletion can fail if orders reference the book.

## Students

### Create a student

`POST /students`

```json
{
  "name": "Arifur Rahman",
  "email": "arifur@example.com",
  "phone": "01712345678"
}
```

`name` and a valid, unique `email` are required. `phone` is optional. Returns `201` with the created Student.

### List or search students

`GET /students`

Optional query parameters can be combined:

| Query | Meaning |
| --- | --- |
| `id` | Exact numeric student ID |
| `email` | Case-insensitive partial email match |
| `phone` | Partial phone match |

Example: `GET /students?email=arifur&phone=017`

Returns students ordered by descending ID. Each item includes its nullable `profile` and an `orders` array; every order includes its `book`.

### Get a student borrowing summary

`GET /students/:id/summary`

Returns `200`:

```json
{
  "student": {
    "id": 1,
    "name": "Arifur Rahman",
    "email": "arifur@example.com",
    "phone": "01712345678"
  },
  "totalBooksBorrowed": 1,
  "currentlyBorrowed": [
    {
      "id": 1,
      "title": "NestJS Fundamentals"
    }
  ],
  "orderHistory": [
    {
      "id": 1,
      "studentId": 1,
      "bookId": 1,
      "status": "BORROWED",
      "orderDate": "2026-06-27T10:00:00.000Z",
      "dueDate": "2026-07-01T00:00:00.000Z",
      "returnDate": null,
      "pdfPath": "/uploads/orders/order-1.pdf",
      "createdAt": "2026-06-27T10:00:00.000Z",
      "book": { "id": 1, "title": "NestJS Fundamentals" }
    }
  ]
}
```

The `book` nested in `orderHistory` contains all Book scalar fields. `currentlyBorrowed` uses the persisted `BORROWED` status. Returns `404 Student not found` if absent.

### Get a student

`GET /students/:id`

Returns the Student including `profile` and `orders` (with each order's `book`), or `404`.

### Update a student

`PATCH /students/:id`

Accepts any subset of `name`, `email`, and `phone` with create-time validation. Returns the updated Student without expanded relations.

### Delete a student

`DELETE /students/:id`

Returns the deleted Student or `404`. Deletion can fail if orders reference the student.

## Student profiles

Only one profile can exist for each student.

### Create a student profile

`POST /student-profiles`

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| `studentId` | integer | Yes | Must reference a student; must be unique among profiles |
| `address` | string | No | String |
| `age` | number | No | Minimum `1` |

```json
{
  "studentId": 1,
  "address": "Dhaka, Bangladesh",
  "age": 22
}
```

Returns `201` with the profile including `student`. If a profile already exists, the current implementation returns `404 This student already has a profile`.

### List student profiles

`GET /student-profiles`

Returns `200` with all profiles; each includes `student`.

### Get a student profile

`GET /student-profiles/:id`

Returns the profile including `student`, or `404 Profile not found`.

### Update a student profile

`PATCH /student-profiles/:id`

Accepts any subset of `studentId`, `address`, and `age`. Returns the updated profile including `student`.

### Delete a student profile

`DELETE /student-profiles/:id`

Returns the deleted profile or `404`.

## Orders

An order represents one student borrowing one book.

### Borrow a book

`POST /orders`

```json
{
  "studentId": 1,
  "bookId": 1,
  "dueDate": "2026-07-01"
}
```

All fields are required. IDs must be integers and `dueDate` must be an ISO 8601 date string.

The endpoint checks the student and book, decrements stock in a database transaction, creates the order, then attempts to generate a PDF and email it. PDF/email failure is logged but does not roll back the successfully created order.

Success: `201 Created`. The response is the Order including `student` and `book`; it normally includes `pdfPath` such as `/uploads/orders/order-1.pdf`.

Possible errors:

- `404 Student not found`
- `404 Book not found`
- `400 Book is out of stock`

### List orders

`GET /orders`

Returns orders ordered by descending ID. Each includes `student` and `book`. If a persisted `BORROWED` order is past its due date, the response reports its status as `OVERDUE`; this calculation does not update the database.

### Get an order

`GET /orders/:id`

Returns the Order including `student` and `book`. As in the list endpoint, overdue status is calculated at response time. Returns `404 Order <id> not found` if absent.

### Update or return an order

`PATCH /orders/:id`

All fields are optional:

| Field | Type | Validation/behavior |
| --- | --- | --- |
| `studentId` | integer | Must reference a student |
| `bookId` | integer | Must reference a book |
| `dueDate` | string | ISO 8601 date string |
| `status` | string | `BORROWED`, `RETURNED`, or `OVERDUE` |
| `returnDate` | string | ISO 8601 date string |

Typical return request:

```json
{
  "status": "RETURNED",
  "returnDate": "2026-06-30"
}
```

When a non-returned order first changes to `RETURNED`, book stock is incremented in the same transaction. Returns the updated Order including `student` and `book`, or `404 Order not found`.

### Delete an order

`DELETE /orders/:id`

Returns the deleted Order or `404`. Deleting an order does not restore book stock.

### Download an order PDF

`GET /orders/:id/pdf`

Returns `200` with `Content-Type: application/pdf` and downloads the file as `order-<id>.pdf`. The saved PDF is used when available; otherwise it is generated in memory. Returns `404` if the order does not exist.

## Static files

Files under the project's `uploads` directory are publicly served beneath `/uploads`. For example, a stored order PDF can be fetched directly using:

`GET /uploads/orders/order-1.pdf`

Unlike `/orders/:id/pdf`, a direct static-file request is not a controller endpoint and does not regenerate a missing PDF.
