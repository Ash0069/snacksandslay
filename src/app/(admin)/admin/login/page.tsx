'use client';

import { useRouter } from "next/navigation";
import { type SubmitEvent, useEffect, useState } from "react";
import LoginCard from "@/components/admin/login/LoginCard";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch("/api/admin/session", { cache: "no-store" });
      const data = (await response.json().catch(() => null)) as
        | { authenticated?: boolean }
        | null;

      if (data?.authenticated) {
        router.replace("/admin/cms");
      }
    };

    void checkSession();
  }, [router]);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      setError(data?.error ?? "Login failed.");
      setLoading(false);
      return;
    }

    router.replace("/admin/cms");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
      <LoginCard
        username={username}
        password={password}
        error={error}
        loading={loading}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
