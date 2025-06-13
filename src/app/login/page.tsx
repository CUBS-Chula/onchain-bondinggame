"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWeb3 } from "@/app/contexts/Web3Context";
import { Wallet, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  console.log("🏗️ LoginPage component rendering");
  
  const router = useRouter();
  const { account, connect, isConnecting, setAccount } = useWeb3();
  const [connectionError, setConnectionError] = useState("");

  console.log("🔍 LoginPage state:");
  console.log("  - account:", account);
  console.log("  - isConnecting:", isConnecting);
  console.log("  - connectionError:", connectionError);

  // Redirect to play page if already connected
  useEffect(() => {
    console.log("🔍 LOGIN PAGE - useEffect triggered");
    console.log("🔍 Current account:", account);
    if (account) {
      console.log("✅ Account found, redirecting to Home");
      router.push("/");
    } else {
      console.log("❌ No account found, staying on login page");
    }
  }, [account, router]);

  const handleConnect = async () => {
    try {
      console.log("🚀 CONNECT BUTTON CLICKED");
      console.log("🔍 Initial state check:");
      console.log("  - isConnecting:", isConnecting);
      console.log("  - current account:", account);
      console.log("  - window.ethereum exists:", typeof window.ethereum !== "undefined");
      
      setConnectionError("");
      console.log("🚀 Attempting to connect wallet...");

      // Check if any Web3 provider is available
      if (typeof window.ethereum === "undefined") {
        console.log("❌ No window.ethereum found");
        throw new Error(
          "No Web3 wallet detected. Please open this website in your wallet browser (MetaMask, Trust Wallet, etc.)"
        );
      }

      console.log("✅ window.ethereum found");
      console.log("🔍 window.ethereum object:", window.ethereum);

      // Request account access - works with any Web3 wallet
      console.log("🔄 Requesting account access...");
      const requestResult = await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("✅ eth_requestAccounts result:", requestResult);

      // Get the connected account
      console.log("🔄 Getting accounts...");
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      console.log("✅ eth_accounts result:", accounts);
      console.log("🔍 Number of accounts:", accounts.length);
      
      if (accounts.length > 0) {
        console.log("✅ Account found:", accounts[0]);
        console.log("🔄 Setting account in context...");
        
        // Update the Web3Context with the connected account
        setAccount(accounts[0]);
        console.log("✅ setAccount called with:", accounts[0]);
        
        // Also use the Web3Context connect method
        console.log("🔄 Calling connect method...");
        await connect("metamask"); // This will work with any Web3 provider
        console.log("🎉 Wallet connected successfully!", accounts[0]);
        console.log("🔄 About to redirect to /play");
      } else {
        console.log("❌ No accounts in array");
        throw new Error(
          "No accounts found. Please make sure your wallet is unlocked."
        );
      }
    } catch (error: any) {
      console.error("❌ CONNECT ERROR:");
      console.error("  - Error object:", error);
      console.error("  - Error message:", error.message);
      console.error("  - Error code:", error.code);
      console.error("  - Full error:", JSON.stringify(error, null, 2));
      
      if (error.code === 4001) {
        const errorMsg = "Connection rejected. Please approve the connection in your wallet.";
        console.log("🚫 User rejected connection");
        setConnectionError(errorMsg);
      } else {
        const errorMsg = error.message || "Failed to connect wallet. Please try again.";
        console.log("💥 Other error:", errorMsg);
        setConnectionError(errorMsg);
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
