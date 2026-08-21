"use client";

import { useClerk } from "@clerk/nextjs";
import { useState } from "react";

export default function LogoutButton({
  className = "btn primary",
  children = "Sair e trocar de conta",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { signOut } = useClerk();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    try {
      setLoading(true);
      await signOut({ redirectUrl: "/sign-in" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleSignOut}
      disabled={loading}
    >
      {loading ? "Saindo..." : children}
    </button>
  );
}
