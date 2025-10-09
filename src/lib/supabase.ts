"use server";

import { createClient } from "@/utils/supabase/server";

// Auth helper functions
export const signInWithEmail = async (email: string, password: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUpWithEmail = async (email: string, password: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const getCurrentUser = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};
