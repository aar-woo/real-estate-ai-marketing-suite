"use client";

import { signOutAction } from "@/app/actions/auth";
import { useState } from "react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOutAction();
    } catch (error) {
      console.error("Logout error:", error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
