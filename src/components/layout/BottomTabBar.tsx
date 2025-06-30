// src/components/layout/BottomTabBar.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  BarChart,
  Target,
  Calendar,
  MessageSquare,
  Settings,
} from "lucide-react";

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { label: "Dashboard", icon: BarChart, href: "/dashboard" },
    { label: "Goals", icon: Target, href: "/goals" },
    { label: "Planning", icon: Calendar, href: "/planning" },
    { label: "Feedback", icon: MessageSquare, href: "/feedback" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-sm flex justify-around py-2 z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;

        return (
          <button
            key={tab.href}
            onClick={() => router.push(tab.href)}
            className={`flex flex-col items-center text-xs focus:outline-none transition-colors duration-150 ${
              isActive ? "text-[#009F9D]" : "text-gray-500 hover:text-[#009F9D]"
            }`}
          >
            <div
              className={`flex items-center justify-center h-10 w-10 rounded-full ${
                isActive ? "bg-[#E0F7F6]" : ""
              }`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <span
              className={`mt-1 ${
                isActive ? "font-semibold" : "font-normal"
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
