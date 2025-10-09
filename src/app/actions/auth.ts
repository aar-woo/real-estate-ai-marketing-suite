"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type AuthResult = {
  error?: string;
  success?: boolean;
};

export async function loginAction(
  email: string,
  password: string,
  redirectTo: string = "/"
): Promise<AuthResult> {
  try {
    const supabase = await createClient();

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    if (!data.user) {
      return { error: "Login failed" };
    }

    revalidatePath("/", "layout");

    redirect(redirectTo);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error("Login error:", error);
    return { error: "An unexpected error occurred during login" };
  }
}

export async function signupAction(
  email: string,
  password: string,
  redirectTo: string = "/"
): Promise<AuthResult> {
  try {
    const supabase = await createClient();

    // Validate inputs
    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    // Basic password validation
    if (password.length < 6) {
      return { error: "Password must be at least 6 characters" };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    if (!data.user) {
      return { error: "Sign up failed" };
    }

    // Check if email confirmation is required
    if (data.user && !data.user.confirmed_at) {
      return {
        success: true,
        error: "Please check your email to confirm your account",
      };
    }

    // Revalidate the layout to update auth state
    revalidatePath("/", "layout");

    // Redirect to the desired page
    redirect(redirectTo);
  } catch (error) {
    // If it's a redirect error, re-throw it (Next.js uses throw for redirects)
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error("Sign up error:", error);
    return { error: "An unexpected error occurred during sign up" };
  }
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Sign out error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
