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
      className="absolute px-5 top-4 right-4 bg-gray-700 hover:bg-gray-500 text-white px-3 py-1 rounded-md text-sm transition-colors duration-100 disabled:bg-gray-400 cursor-pointer"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
