"use client";

import OnchainLogo from "#/onchainlogo.png";
import { Wallet } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useWeb3 } from "./contexts/Web3Context";

export default function Home() {
  const { account } = useWeb3();
  const router = useRouter();

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
        {/* <p className="text-lg text-gray-700">Connect your wallet to play</p>
        <p className="text-sm text-gray-500 mb-10">Secure blockchain gaming</p> */}

        <div className="space-y-4">
          {account ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg px-6 py-4 flex items-center justify-center">
                <span className="text-green-700 font-medium">
                  ✅ Connected: {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </div>
              
              <button
                onClick={() => router.push('/play')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg transform hover:scale-105"
              >
                🎮 Start Playing
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => router.push('/login')}
                className={`
                  w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold text-lg
                  hover:from-blue-700 hover:to-purple-700 shadow-lg flex items-center justify-center
                  transform transition-transform duration-500 delay-100 ease-out hover:scale-105
                `}
              >
                <Wallet className="w-6 h-6 mr-3" />
                Login with Wallet
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  First time here? {" "}
                  <button
                    onClick={() => router.push('/register')}
                    className="font-bold hover:underline"
                  >
                    Register now!!
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
