// src/components/layout/TopHeader.tsx
"use client";

import { useRouter } from "next/navigation";
import { Bell, UserCircle } from "lucide-react";

export default function TopHeader() {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => router.push("/dashboard")}
      >
        <img
          src="/logo.svg"
          alt="Michibiki Logo"
          className="h-10 w-auto"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button
          type="button"
          aria-label="Notifications"
          className="focus:outline-none"
        >
          <Bell className="h-6 w-6 text-gray-600" />
        </button>
        <button
          type="button"
          aria-label="Profile"
          className="focus:outline-none"
        >
          <UserCircle className="h-7 w-7 text-gray-600" />
        </button>
      </div>
    </header>
  );
}
