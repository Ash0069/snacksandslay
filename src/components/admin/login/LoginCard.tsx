import Link from "next/link";
import type { SubmitEvent } from "react";

type LoginCardProps = {
  username: string;
  password: string;
  error: string;
  loading: boolean;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
};

export default function LoginCard({
  username,
  password,
  error,
  loading,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: LoginCardProps) {
  return (
    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
      <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
      <p className="mt-1 text-sm text-slate-600">Sign in to manage menu items.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="Username"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="Password"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 py-2 font-medium text-white transition hover:bg-slate-800"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <Link href="/menu" className="mt-4 inline-block text-sm text-slate-600 hover:text-slate-900">
        Back to Menu
      </Link>
    </div>
  );
}
