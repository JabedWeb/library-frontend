# Library Frontend

Frontend web app for a Library Management System. It is built with Next.js App Router, React, TypeScript, Tailwind CSS, shadcn-style UI components, Axios, and Sonner toasts.

The app connects to the Library Management backend API for authentication, authors, categories, books, students, and orders.

## Features

- User registration, login, logout, and protected pages through JWT stored in local storage.
- Authors CRUD with list, search/sort, create, edit, delete, and detail pages.
- Categories CRUD with category detail pages.
- Books CRUD with author/category relationships, inventory stock, search filters, and detail pages.
- Students CRUD with detail and summary pages.
- Orders CRUD for borrowing and returning books.
- Order PDF download through the backend `/orders/:id/pdf` endpoint.
- Shared UI primitives for buttons, dialogs, alerts, inputs, tables, and toasts.

## Tech Stack

- Next.js `16.2.9`
- React `19.2.4`
- TypeScript
- Tailwind CSS 4
- Axios
- Radix UI / shadcn-style components
- Lucide React icons
- Sonner notifications

## Requirements

- Node.js 20 or newer is recommended.
- npm
- The backend API should be running locally, normally at:

```bash
http://localhost:3333
```

The full backend API reference is available in [docs/api.md](docs/api.md).

## Environment Variables

Create a `.env.local` file in the project root when the backend URL is different from the default:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3333
```

If `NEXT_PUBLIC_API_URL` is not set, the frontend uses `http://localhost:3333`.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the app:

```bash
http://localhost:3000
```

If port `3000` is already busy, Next.js may choose another port or you can set one manually:

```bash
npm run dev -- -p 3001
```

## Available Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Runs the production build after `npm run build`.

```bash
npm run lint
```

Runs ESLint.

## App Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page |
| `/login` | Login page |
| `/register` | Register page |
| `/dashboard` | Protected dashboard page |
| `/authors` | Authors list and CRUD |
| `/authors/:id` | Author detail and books |
| `/categories` | Categories list and CRUD |
| `/categories/:id` | Category detail and books |
| `/books` | Books list, search, and CRUD |
| `/books/:id` | Book detail and borrowing summary |
| `/students` | Students list and CRUD |
| `/students/:id` | Student detail and borrowing summary |
| `/orders` | Orders list, borrowing, returning, PDF download, and CRUD |

## API Integration

Axios is configured in [src/lib/axios.ts](src/lib/axios.ts). It uses:

```ts
process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333"
```

When an `access_token` exists in local storage, it is automatically sent as:

```http
Authorization: Bearer <access_token>
```

Service files live in [src/services](src/services):

- `auth.ts` for register, login, and profile.
- `authors.ts` for author endpoints.
- `categories.ts` for category endpoints.
- `books.ts` for book endpoints.
- `students.ts` for student endpoints.
- `orders.ts` for order endpoints and PDF download.

## Order PDF Download

The frontend does not generate PDFs. On the Orders page, clicking `PDF` calls:

```http
GET /orders/:id/pdf
```

The backend either downloads an existing saved PDF for the order or generates one in memory and sends it back. The frontend receives the PDF as a Blob and triggers a browser download named:

```bash
order-<id>.pdf
```

## Project Structure

```text
src/
  app/                 Next.js App Router pages
  components/          Feature components and shared UI components
  context/             React context providers
  hooks/               Custom hooks
  lib/                 Shared helpers and Axios setup
  services/            API service functions
  types/               TypeScript domain types
docs/
  api.md               Backend API reference
```

## Authentication Notes

- Login stores the JWT access token in local storage.
- The app header changes depending on authentication state.
- Protected pages use `AuthGuard`.
- The backend currently requires admin bearer auth for `GET /authors`; other API access rules are documented in [docs/api.md](docs/api.md).

## Development Notes

- This project uses Next.js App Router under `src/app`.
- The repo includes local Next.js docs in `node_modules/next/dist/docs/`.
- Because this project uses Next.js 16, read the local Next docs before changing router APIs or conventions.
- UI components are intentionally simple and local to the repo. Prefer existing components in `src/components/ui` before adding new UI dependencies.

## Troubleshooting

### Backend connection errors

Make sure the backend is running and `NEXT_PUBLIC_API_URL` points to the correct host and port.

### Unauthorized author list

`GET /authors` may require an admin bearer token. Log in as an admin user before opening pages that load authors.

### PDF download fails

Confirm the backend order exists and that the backend PDF module is working. The frontend only requests `/orders/:id/pdf` and downloads the returned file.

### Build cannot fetch fonts

The app uses `next/font/google` for Geist fonts. A production build may need network access so Next.js can fetch the font files.

### Lint or build errors in existing files

Run:

```bash
npm run lint
npm run build
```

Then fix reported TypeScript or ESLint issues before deploying.
