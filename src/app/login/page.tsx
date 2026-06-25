"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/services/auth";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveToken, saveUser } from "@/lib/auth";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await login({
        email,
        password,
      });

      saveToken(response.access_token);
      saveUser(response.user);
      refreshUser();

      toast.success("Login successful");

      router.push("/dashboard");
    } catch (error) {
      console.error(error);

      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg border p-6 shadow">
        <h1 className="mb-6 text-center text-3xl font-bold">Login</h1>

        <div className="space-y-4">
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

          <Button className="w-full" disabled={loading} onClick={handleLogin}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </div>
    </div>
  );
}
