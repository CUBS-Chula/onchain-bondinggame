"use client";

import OnchainLogo from "#/onchainlogo.png";
import { Wallet } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useWeb3 } from "./contexts/Web3Context";
import { apiUtils } from "@/components/apiUtils";

export default function Home() {
  const { account, disconnect } = useWeb3();
  const router = useRouter();

  // Check if user has wallet connected but no valid token
  const hasWalletButNoToken = account && !apiUtils.isAuthenticated();

  const handleDisconnect = async () => {
    try {
      // Clear any stored token
      apiUtils.removeToken();
      // Disconnect wallet
      await disconnect();
      // Force page refresh to reset state
      window.location.reload();
    } catch (error) {
      console.error('Error disconnecting:', error);
      // Still try to clear state even if disconnect fails
      apiUtils.removeToken();
      window.location.reload();
    }
  };

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
              <div className={`border rounded-lg px-6 py-4 flex items-center justify-center ${
                hasWalletButNoToken 
                  ? "bg-yellow-50 border-yellow-200" 
                  : "bg-green-50 border-green-200"
              }`}>
                <span className={`font-medium ${
                  hasWalletButNoToken 
                    ? "text-yellow-700" 
                    : "text-green-700"
                }`}>
                  {hasWalletButNoToken 
                    ? "⚠️ Wallet Connected (Login Required)" 
                    : "✅ Connected"}: {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </div>
              
              {hasWalletButNoToken ? (
                // Show login/register options if wallet connected but no token
                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/login')}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg flex items-center justify-center transform hover:scale-105"
                  >
                    🔑 Login to Continue
                  </button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      New user? {" "}
                      <button
                        onClick={() => router.push('/register')}
                        className="text-blue-600 font-bold hover:underline"
                      >
                        Register here
                      </button>
                    </p>
                  </div>
                  
                  <button
                    onClick={handleDisconnect}
                    className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-all duration-200"
                  >
                    🔌 Disconnect Wallet
                  </button>
                </div>
              ) : (
                // Show play button if fully authenticated
                <button
                  onClick={() => router.push('/play')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg transform hover:scale-105"
                >
                  🎮 Start Playing
                </button>
              )}
            </div>
          ) : (
            // Show connect wallet options if no wallet connected
            <div className="space-y-4">
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 shadow-lg flex items-center justify-center transform transition-all duration-200 ease-out hover:scale-105"
              >
                <Wallet className="w-6 h-6 mr-3" />
                Login with Wallet
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  First time here? {" "}
                  <button
                    onClick={() => router.push('/register')}
                    className="text-blue-600 font-bold hover:underline transition-all duration-200"
                  >
                    Register now!!
                  </button>
                </p>
              </div>
            </div>
          )}
          <div className="text-center text-gray-400 text-xs pt-4 border-t border-gray-100">
              © 2025 Onchain Bootcamp | All rights reserved
            </div>
        </div>
      </div>
    </div>
  );
}
