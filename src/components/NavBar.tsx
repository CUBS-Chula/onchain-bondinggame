"use client";

import Link from "next/link";
import { Home, QrCode, Trophy, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/components/cn";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/play", icon: QrCode, label: "Play" },
  { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <nav className={cn(
      "fixed bottom-0 w-full bg-white border-t border-gray-200 pt-4 pb-6 px-4 z-50 md:max-w-[390px]"
    )}>
      <div className="flex justify-around items-center">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} className="flex flex-col items-center group">
            <Icon
              className={cn(
                "w-7 h-7 transition-colors",
                pathname === href ? "text-indigo-600" : "text-black group-hover:text-indigo-400"
              )}
            />
            <span className={cn(
              "text-xs mt-1 transition-colors",
              pathname === href ? "text-indigo-600 font-semibold" : "text-gray-500 group-hover:text-indigo-400"
            )}>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
