import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl font-bold text-gray-700">
          404
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Page Not Found
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          The page you are looking for does not exist or may have been removed.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Go Home
          </Link>

          <Link
            href="/students"
            className="rounded-lg border px-5 py-2.5 text-sm font-medium transition hover:bg-gray-50"
          >
            View Students
          </Link>
        </div>
      </div>
    </div>
  );
}
