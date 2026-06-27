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

Catalog reads are public. Staff operations require a JWT with the `ADMIN` or
`LIBRARIAN` role. Destructive catalog and order deletion operations require
`ADMIN`.

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

| Status        | Meaning                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| `400`         | Invalid request body/parameter, duplicate unique value, or unavailable stock                            |
| `401`         | Missing, invalid, or expired bearer token; or invalid login credentials                                 |
| `403`         | Authenticated user does not have the required role                                                      |
| `404`         | Requested entity does not exist                                                                         |
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

| Method   | Path                      | Description                         | Access                       |
| -------- | ------------------------- | ----------------------------------- | ---------------------------- |
| `POST`   | `/auth/register`          | Register a librarian                | Admin bearer token           |
| `POST`   | `/auth/login`             | Log in                              | Public                       |
| `GET`    | `/auth/profile`           | Read JWT identity                   | Bearer token                 |
| `GET`    | `/search`                 | Global catalog search               | Public                       |
| `GET`    | `/health`                 | Application/database readiness      | Public                       |
| `GET`    | `/dashboard/summary`      | Dashboard metrics and recent orders | Admin/librarian bearer token |
| `POST`   | `/authors`                | Create an author                    | Admin/librarian bearer token |
| `GET`    | `/authors`                | List authors                        | Public                       |
| `GET`    | `/authors/catalog`        | Search and paginate authors         | Public                       |
| `GET`    | `/authors/:id/books`      | Get an author and their books       | Public                       |
| `GET`    | `/authors/:id/details`    | Author with paginated books         | Public                       |
| `GET`    | `/authors/:id`            | Get an author                       | Public                       |
| `PATCH`  | `/authors/:id`            | Update an author                    | Admin/librarian bearer token |
| `DELETE` | `/authors/:id`            | Delete an author                    | Admin bearer token           |
| `POST`   | `/categories`             | Create a category                   | Admin/librarian bearer token |
| `GET`    | `/categories`             | List categories and books           | Public                       |
| `GET`    | `/categories/catalog`     | Search and paginate categories      | Public                       |
| `GET`    | `/categories/:id/details` | Category with paginated books       | Public                       |
| `GET`    | `/categories/:id`         | Get a category and its books        | Public                       |
| `PATCH`  | `/categories/:id`         | Update a category                   | Admin/librarian bearer token |
| `DELETE` | `/categories/:id`         | Delete a category                   | Admin bearer token           |
| `POST`   | `/books`                  | Create a book                       | Admin/librarian bearer token |
| `GET`    | `/books`                  | List/search books                   | Public                       |
| `GET`    | `/books/catalog`          | Filter, sort, and paginate books    | Public                       |
| `GET`    | `/books/:id/details`      | Complete book details               | Public                       |
| `GET`    | `/books/:id/summary`      | Get borrowing summary for a book    | Admin/librarian bearer token |
| `GET`    | `/books/:id`              | Get a book                          | Public                       |
| `PATCH`  | `/books/:id`              | Update a book                       | Admin/librarian bearer token |
| `DELETE` | `/books/:id`              | Delete a book                       | Admin bearer token           |
| `POST`   | `/students`               | Create a student                    | Admin/librarian bearer token |
| `GET`    | `/students`               | List/search students                | Admin/librarian bearer token |
| `GET`    | `/students/search`        | Search and paginate students        | Admin/librarian bearer token |
| `GET`    | `/students/:id/details`   | Student with paginated history      | Admin/librarian bearer token |
| `GET`    | `/students/:id/summary`   | Get borrowing summary for a student | Admin/librarian bearer token |
| `GET`    | `/students/:id`           | Get a student                       | Admin/librarian bearer token |
| `PATCH`  | `/students/:id`           | Update a student                    | Admin/librarian bearer token |
| `DELETE` | `/students/:id`           | Delete a student                    | Admin bearer token           |
| `POST`   | `/student-profiles`       | Create a profile                    | Admin/librarian bearer token |
| `GET`    | `/student-profiles`       | List profiles                       | Admin/librarian bearer token |
| `GET`    | `/student-profiles/:id`   | Get a profile                       | Admin/librarian bearer token |
| `PATCH`  | `/student-profiles/:id`   | Update a profile                    | Admin/librarian bearer token |
| `DELETE` | `/student-profiles/:id`   | Delete a profile                    | Admin bearer token           |
| `POST`   | `/orders`                 | Borrow a book                       | Admin/librarian bearer token |
| `GET`    | `/orders`                 | List orders                         | Admin/librarian bearer token |
| `GET`    | `/orders/search`          | Filter and paginate orders          | Admin/librarian bearer token |
| `GET`    | `/orders/:id`             | Get an order                        | Admin/librarian bearer token |
| `PATCH`  | `/orders/:id`             | Safely update an order              | Admin/librarian bearer token |
| `PATCH`  | `/orders/:id/return`      | Return a borrowed book              | Admin/librarian bearer token |
| `DELETE` | `/orders/:id`             | Delete a returned order             | Admin bearer token           |
| `GET`    | `/orders/:id/pdf`         | Download order PDF                  | Admin/librarian bearer token |

## Search, pagination, filtering, and dashboard

The advanced list endpoints return a stable pagination envelope:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

`page` defaults to `1`. `limit` defaults to `20` and is capped at `100`.
Invalid query values return `400`. Legacy list endpoints remain unchanged for
backward compatibility.

### Global search

`GET /search?q=nest&limit=5`

Searches book titles/ISBNs, author names, and category names in one request.
`q` must contain at least two characters and `limit` is capped at `20` per
resource. The response contains lightweight `books`, `authors`, and
`categories` arrays under `data`, making it suitable for navigation-bar search.

### Book catalog

`GET /books/catalog`

| Query           | Values/meaning                                             |
| --------------- | ---------------------------------------------------------- |
| `search`        | Partial title or ISBN                                      |
| `title`         | Partial title                                              |
| `authorId`      | Exact author ID                                            |
| `categoryId`    | Books belonging to the category                            |
| `availability`  | `available` or `unavailable`                               |
| `sort`          | `latest`, `oldest`, `alphabetical`, `stock`, `borrowCount` |
| `page`, `limit` | Pagination                                                 |

Example:

`GET /books/catalog?categoryId=2&availability=available&sort=borrowCount&page=1&limit=12`

Each result includes its author, categories, and `_count.orders` borrow count.

### Author catalog and details

`GET /authors/catalog?search=humayun&sort=alphabetical&page=1&limit=20`

Author sort modes are `latest`, `oldest`, `alphabetical`, and `bookCount`.
Results include `_count.books`.

`GET /authors/:id/details?page=1&limit=20`

Returns `author` and a paginated `books` envelope. The legacy
`GET /authors/:id/books` remains available.

### Category catalog and details

`GET /categories/catalog?search=programming&sort=bookCount&page=1&limit=20`

Category sort modes are `latest`, `oldest`, `alphabetical`, and `bookCount`.

`GET /categories/:id/details?page=1&limit=20`

Returns `category` and a paginated `books` envelope. Books include authors,
categories, and borrow counts.

### Book details

`GET /books/:id/details`

Returns the book, author, categories, availability, total borrow count, the 20
most recent sanitized borrow-history records, and up to six related books that
share a category. Student identities are intentionally excluded from this
public endpoint.

### Student search and details

`GET /students/search`

Requires staff authentication. Supports `id`, partial `name`, partial `email`,
partial `phone`, `page`, `limit`, and `sort` (`latest`, `oldest`, or
`alphabetical`). List records include profile and order count without loading
unbounded order history.

`GET /students/:id/details?page=1&limit=20`

Returns the student profile, total/current/overdue borrowing counts, and
paginated order history with book, author, and category information.

### Order filtering

`GET /orders/search`

Requires staff authentication.

| Query                 | Values/meaning                               |
| --------------------- | -------------------------------------------- |
| `status`              | `BORROWED`, `RETURNED`, or derived `OVERDUE` |
| `studentId`, `bookId` | Exact relationship filters                   |
| `fromDate`, `toDate`  | ISO 8601 order-date range                    |
| `sort`                | `latest`, `oldest`, or `dueDate`             |
| `page`, `limit`       | Pagination                                   |

Example:

`GET /orders/search?status=OVERDUE&studentId=4&sort=dueDate&page=1&limit=20`

### Dashboard

`GET /dashboard/summary?recentLimit=10`

Requires staff authentication. Returns title count, available-copy stock,
authors, categories, students, active borrowings, available titles, overdue
borrowings, and recent orders. `recentLimit` is capped at `50`.

### Health check

`GET /health`

Returns `200` when the API and PostgreSQL connection are ready, or `503` when
the database is unavailable.

## Authentication

### Register a user

`POST /auth/register`

Requires an `ADMIN` bearer token. This provisions a staff librarian account;
there is currently no public customer/student authentication role.

Request body:

| Field      | Type   | Required | Validation                                                     |
| ---------- | ------ | -------- | -------------------------------------------------------------- |
| `name`     | string | Yes      | Non-empty                                                      |
| `email`    | string | Yes      | Valid and unique email                                         |
| `password` | string | Yes      | At least 6 characters                                          |
| `role`     | string | No       | Only `LIBRARIAN` is accepted publicly; defaults to `LIBRARIAN` |

```json
{
  "name": "Library Admin",
  "email": "admin@example.com",
  "password": "secret123",
  "role": "LIBRARIAN"
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
    "role": "LIBRARIAN"
  }
}
```

Returns `400` with `Email already exists` if the email is registered. Returns
`403` if registration attempts to create an `ADMIN`. Administrators are
provisioned with `npm run seed` using `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and the
optional `ADMIN_NAME` environment variable.

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

Returns `200` with an array of Authors ordered by descending ID. This catalog
read is public.

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

| Field         | Type      | Required | Validation                                   |
| ------------- | --------- | -------- | -------------------------------------------- |
| `title`       | string    | Yes      | Non-empty                                    |
| `isbn`        | string    | No       | Unique when supplied                         |
| `stock`       | integer   | Yes      | Minimum `0`                                  |
| `authorId`    | integer   | Yes      | Must reference an author                     |
| `categoryIds` | integer[] | Yes      | Non-empty; each ID must reference a category |

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

| Query      | Meaning                                      |
| ---------- | -------------------------------------------- |
| `title`    | Case-insensitive partial title match         |
| `author`   | Case-insensitive partial author-name match   |
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

| Query   | Meaning                              |
| ------- | ------------------------------------ |
| `id`    | Exact numeric student ID             |
| `email` | Case-insensitive partial email match |
| `phone` | Partial phone match                  |

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

| Field       | Type    | Required | Validation                                              |
| ----------- | ------- | -------- | ------------------------------------------------------- |
| `studentId` | integer | Yes      | Must reference a student; must be unique among profiles |
| `address`   | string  | No       | String                                                  |
| `age`       | number  | No       | Minimum `1`                                             |

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

The endpoint checks the student and book, atomically decrements stock only when
stock is available, and creates the order in one database transaction. It then
attempts to generate a PDF and email it. PDF/email failure is logged but does
not roll back the successfully created order. The due date must be in the
future.

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

| Field        | Type    | Validation/behavior                                                   |
| ------------ | ------- | --------------------------------------------------------------------- |
| `studentId`  | integer | Immutable after creation; a different value is rejected               |
| `bookId`     | integer | Immutable after creation; a different value is rejected               |
| `dueDate`    | string  | ISO 8601 date string                                                  |
| `status`     | string  | `BORROWED` or `RETURNED`; `OVERDUE` is derived and cannot be assigned |
| `returnDate` | string  | ISO 8601 date string; only valid when returning                       |

Typical return request:

```json
{
  "status": "RETURNED",
  "returnDate": "2026-06-30"
}
```

When a non-returned order first changes to `RETURNED`, book stock is incremented
in the same transaction. A returned order cannot be reopened. Returns the
updated Order including `student` and `book`, or `404 Order not found`.

### Return an order

`PATCH /orders/:id/return`

This is the preferred return endpoint. `returnDate` is optional and defaults to
the current server time:

```json
{
  "returnDate": "2026-06-30T10:00:00.000Z"
}
```

The order status and book stock are updated atomically. Repeating the request
does not increment stock again.

### Delete an order

`DELETE /orders/:id`

Requires `ADMIN`. Only an already returned order can be deleted. Active or
overdue loans must be returned first, preventing deletion from corrupting stock.

### Download an order PDF

`GET /orders/:id/pdf`

Returns `200` with `Content-Type: application/pdf` and downloads the file as `order-<id>.pdf`. The saved PDF is used when available; otherwise it is generated in memory. Returns `404` if the order does not exist.

## Stored files

The `uploads` directory is not exposed as a public static directory because
order PDFs contain student information. Authenticated staff must use
`GET /orders/:id/pdf`. The `pdfPath` field is an internal storage reference,
not a public URL.

## Production configuration

Required environment variables are `DATABASE_URL`, `JWT_SECRET`, `MAIL_HOST`,
`MAIL_USER`, and `MAIL_PASS`. `JWT_SECRET` must contain at least 32 characters.

Optional runtime variables:

| Variable         | Purpose                                                  |
| ---------------- | -------------------------------------------------------- |
| `PORT`           | HTTP port; defaults to `3333`                            |
| `CORS_ORIGINS`   | Comma-separated allowed origins; defaults to localhost   |
| `MAIL_PORT`      | SMTP port                                                |
| `MAIL_SECURE`    | Explicit SMTP TLS mode                                   |
| `ENABLE_SWAGGER` | Set `true` to expose Swagger while `NODE_ENV=production` |

Every response includes an `x-request-id`. The server also applies baseline
content-type, framing, referrer, and browser-permission security headers and
supports graceful shutdown.

Apply the query-optimization indexes during deployment:

```bash
npx prisma migrate deploy
```

Indexes cover foreign keys and the fields used by status, due-date, stock,
created-date, name, phone, and compound order filters. The new list services
use selected relations, relation counts, bounded result sets, and transactional
record/count queries to avoid unbounded payloads and inconsistent pagination.
