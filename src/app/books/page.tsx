import { AuthGuard } from "@/components/auth-guard";

export default function BooksPage() {
  return (
    <AuthGuard roles={["ADMIN"]}>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold">Books</h1>
      </div>
    </AuthGuard>
  );
}
