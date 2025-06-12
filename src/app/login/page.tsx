"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWeb3 } from "@/app/contexts/Web3Context";
import { Wallet, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { account, connect, isConnecting, setAccount } = useWeb3();
  const [connectionError, setConnectionError] = useState("");

  // Redirect to play page if already connected
  useEffect(() => {
    if (account) {
      router.push("/play");
    }
  }, [account, router]);

  const handleConnect = async () => {
    try {
      setConnectionError("");
      console.log("🚀 Attempting to connect wallet...");

      // Check if any Web3 provider is available
      if (typeof window.ethereum === "undefined") {
        throw new Error(
          "No Web3 wallet detected. Please open this website in your wallet browser (MetaMask, Trust Wallet, etc.)"
        );
      }

      // Request account access - works with any Web3 wallet
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Get the connected account
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        // Update the Web3Context with the connected account
        setAccount(accounts[0]);
        // Also use the Web3Context connect method
        await connect("metamask"); // This will work with any Web3 provider
        console.log("🎉 Wallet connected successfully!", accounts[0]);
      } else {
        throw new Error(
          "No accounts found. Please make sure your wallet is unlocked."
        );
      }
    } catch (error: any) {
      console.error("❌ Failed to connect wallet:", error);
      if (error.code === 4001) {
        setConnectionError(
          "Connection rejected. Please approve the connection in your wallet."
        );
      } else {
        setConnectionError(
          error.message || "Failed to connect wallet. Please try again."
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 relative flex items-center justify-center">
          {/* <button
            onClick={() => router.push("/")}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-blue-200 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button> */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">🔐 Login</h1>
            <p className="text-blue-100 text-sm">
              Connect your Web3 wallet to continue
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Connection Error */}
          {connectionError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <div className="text-red-800 text-sm">❌ {connectionError}</div>
            </div>
          )}

          <div className="space-y-4">
            {/* Main Connect Button */}
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className={`
                w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold text-lg
                hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center
                transform transition-transform duration-500 delay-100 ease-out hover:scale-105
              `}
            >
              <Wallet className="w-6 h-6 mr-3" />
              {isConnecting ? (
                <span className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white rounded-full mr-2"></div>
                  Connecting...
                </span>
              ) : (
                "Connect Wallet"
              )}
            </button>

            {/* Wallet Browser Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="text-blue-800 text-sm text-center">
                <div className="font-medium mb-2">
                  📱 Wallet Browser Required
                </div>
                <div className="text-xs">
                  Please open this website in your wallet's built-in browser
                  (MetaMask, Trust Wallet, Coinbase Wallet, etc.)
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-700 text-xs pt-4 border-t border-gray-100">
            © 2025 Onchain Bootcamp. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
