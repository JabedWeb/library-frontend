"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { register } from "@/services/auth";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("LIBRARIAN");

  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleRegister = async () => {
    try {
      setLoading(true);

      await register({
        name,
        email,
        password,
        role: role as "ADMIN" | "LIBRARIAN",
      });

      toast.success("Registration successful");

      router.push("/login");
    } catch (error) {
      console.error(error);

      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg border p-6 shadow">
        <h1 className="mb-6 text-center text-3xl font-bold">Register</h1>

        <div className="space-y-4">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            className="w-full rounded-md border px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="LIBRARIAN">Librarian</option>

            <option value="ADMIN">Admin</option>
          </select>

          <Button
            className="w-full"
            disabled={loading}
            onClick={handleRegister}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </div>
      </div>
    </div>
  );
}
