import Link from "next/link";


import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="container mx-auto py-16">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold">Library Management System</h1>

        <p className="text-muted-foreground">
          Manage students, books, authors, categories and borrowing records.
        </p>

        <Link href="/students">
          <Button size="lg">Open Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
