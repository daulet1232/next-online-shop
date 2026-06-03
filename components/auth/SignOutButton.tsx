"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button className="button button--ghost profile-logout" type="button" onClick={() => signOut({ callbackUrl: "/" })}>
      <LogOut size={18} />
      Выйти
    </button>
  );
}
