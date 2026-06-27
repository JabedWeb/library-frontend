"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/context/auth-context";

export function AppHeader() {
  const router = useRouter();

  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();

    router.push("/login");
  };

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Library LMS
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/">Home</Link>

          <Link href="/books">Books</Link>

          <Link href="/students">Students</Link>

          {isAuthenticated ? (
            <>
              <Link href="/dashboard">Dashboard</Link>

              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>

              <Link href="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
