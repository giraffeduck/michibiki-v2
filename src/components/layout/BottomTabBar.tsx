// src/components/layout/BottomTabBar.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { BarChart, Target, Activity, Settings } from "lucide-react";

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { label: "Dashboard", icon: BarChart, href: "/dashboard" },
    { label: "Goals", icon: Target, href: "/goals" },
    { label: "Training", icon: Activity, href: "/training" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white flex justify-around py-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;

        return (
          <button
            key={tab.href}
            onClick={() => router.push(tab.href)}
            className="flex flex-col items-center text-xs focus:outline-none"
          >
            <Icon
              className={`h-6 w-6 ${
                isActive ? "text-brand" : "text-gray-500"
              }`}
            />
            <span
              className={`mt-1 ${
                isActive ? "text-brand font-medium" : "text-gray-500"
              }`}
            >
              {tab.label}
            </span>
            {/* これでPurgingを防止 */}
            <span className="hidden text-brand"></span>
          </button>
        );
      })}
    </nav>
  );
}
