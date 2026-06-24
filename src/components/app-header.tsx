import Link from "next/link";

export function AppHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Library LMS
        </Link>

        <nav className="flex gap-6">
          <Link href="/students">Students</Link>

          <Link href="/authors">Authors</Link>

          <Link href="/categories">Categories</Link>

          <Link href="/books">Books</Link>

          <Link href="/orders">Orders</Link>
        </nav>
      </div>
    </header>
  );
}
