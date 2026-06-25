"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getUser, isAuthenticated } from "@/lib/auth";
import { useAuth } from "@/context/auth-context";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();


useEffect(() => {
  if (!isAuthenticated) {
    router.replace("/login");
  }
}, [isAuthenticated, router]);

  if (!user) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold">Dashboard</h1>

      <div className="mt-6 rounded-lg border p-6">
        <p>
          <strong>Name:</strong> {user.name}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>
    </div>
  );
}
