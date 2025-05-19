"use client";

import { QrCode, Search, Trophy, User } from "lucide-react";

export default function NavBar() {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white border-t border-gray-200 pt-6 pb-18 px-4">
      <div className="flex justify-around items-center">
        <Trophy className="w-7 h-7 text-black" />
        <QrCode className="w-7 h-7 text-black" />
        <Search className="w-7 h-7 text-black" />
        <User className="w-7 h-7 text-black" />
      </div>
    </div>
  );
}
