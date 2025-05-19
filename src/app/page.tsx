"use client";

import OnchainLogo from "#/onchainlogo.png";
import useIsPWA from "@/components/useIsPWA";
import { SquarePlus } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const isPWA = useIsPWA();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Rock Paper Scissor
      </h1>
      <h2 className="text-xl text-gray-600 mb-2">Presented by</h2>
      <Image
        src={OnchainLogo}
        alt="Avatar"
        width={200}
        height={200}
        className="mb-20"
      />
      <div className="text-center">
        <p className="text-lg text-gray-700">Add to home screen</p>
        <p className="text-sm text-gray-500 mb-10">for great experience</p>

        {isPWA ? (
          <div className="bg-white shadow rounded-lg px-6 py-3 flex items-center">
            <span className="text-blue-600 mr-2">Now It's PWA</span>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg px-6 py-3 flex items-center">
            <span className="text-blue-600 mr-2">Add to Home Screen</span>
            <SquarePlus className="text-blue-600 w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
