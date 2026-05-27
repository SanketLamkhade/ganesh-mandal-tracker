"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/home", label: "Home", icon: "🏠" },
  { href: "/reports", label: "Reports", icon: "📊" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gold/30 bg-white/95 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[52px] min-w-[72px] flex-col items-center justify-center rounded-xl px-4 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-saffron/15 text-maroon"
                  : "text-maroon/60 hover:text-maroon"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex min-h-[52px] min-w-[72px] flex-col items-center justify-center rounded-xl px-4 py-1.5 text-xs font-medium text-maroon/60 transition-colors hover:text-maroon"
        >
          <span className="text-lg">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
