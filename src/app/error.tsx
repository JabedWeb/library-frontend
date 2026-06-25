"use client";

import { useEffect } from "react";
import type { ErrorInfo } from "next/error";
import Link from "next/link";

export default function Error({ error, unstable_retry }: ErrorInfo) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl font-bold text-red-600">
          !
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Something went wrong
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          We couldn't load this page due to an unexpected error. Please try
          again.
        </p>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 rounded-lg bg-gray-100 p-4 text-left">
            <p className="mb-2 text-xs font-semibold uppercase text-gray-500">
              Error Details
            </p>

            <pre className="overflow-x-auto text-xs text-red-600">
              {error.message}
            </pre>

            {error?.digest && (
              <p className="mt-3 text-xs text-gray-500">
                Digest: {error?.digest}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => unstable_retry()}
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="rounded-lg border px-5 py-2.5 text-sm font-medium transition hover:bg-gray-50"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
