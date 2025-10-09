"use client";
import { ChangeEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/app/actions/auth";
import { UserEmailLogin } from "@/types/AuthTypes";
import PageContainer from "@/components/PageContainer";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const next = searchParams?.get("next") || "/";

  const [formState, setFormState] = useState<UserEmailLogin>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await loginAction(
        formState.email,
        formState.password,
        next
      );

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        throw error;
      }
      console.error("Login error:", error);
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevFormState) => ({ ...prevFormState, [name]: value }));
  };

  return (
    <PageContainer className="items-center flex-1">
      <div className="flex flex-col items-center border w-full max-w-md p-6 rounded-md bg-white text-black shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Login</h2>

        {error && (
          <div className="w-full p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col mb-4">
            <label htmlFor="email" className="mb-1 font-medium">
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formState.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2"
              disabled={loading}
            />
          </div>
          <div className="flex flex-col mb-6">
            <label htmlFor="password" className="mb-1 font-medium">
              Password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formState.password}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-sm">
          Don&apos;t have an account?{" "}
          <a href="/sign-up" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </PageContainer>
  );
}
