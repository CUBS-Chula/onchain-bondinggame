"use client";

import { useState, useEffect } from "react";
import { useWeb3 } from "@/app/contexts/Web3Context";
import { useRouter } from "next/navigation";
import { LogOut, ArrowLeft, Loader } from "lucide-react";

export default function LogoutPage() {
  const { account, disconnect } = useWeb3();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Wait 2 seconds for Web3 context to load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    disconnect();
    localStorage.clear(); // Clear local storage
    router.push("/");
  };

  const handleCancel = () => {
    router.back();
  };

  // Show loading state for 2 seconds
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
          <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-2">🚪 Logout</h1>
              <p className="text-gray-100 text-sm">Loading wallet status...</p>
            </div>
          </div>
          
          <div className="p-6 text-center space-y-4">
            <Loader className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-spin" />
            <h1 className="text-xl font-bold text-gray-800 mb-2">Checking Connection</h1>
            <p className="text-gray-600 text-sm">Please wait while we check your wallet status...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 relative flex items-center justify-center">
            <button
              onClick={() => router.push("/")}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-blue-200 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-2">🚪 Logout</h1>
              <p className="text-blue-100 text-sm">Already disconnected</p>
            </div>
          </div>
          
          <div className="p-6 text-center space-y-4">
            <h1 className="text-xl font-bold text-gray-800 mb-2">Already Logged Out</h1>
            <p className="text-gray-600 text-sm">You are not connected to any wallet.</p>
            
            <div className="space-y-3 mt-6">
              <button
                onClick={() => router.push("/login")}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
              >
                Go to Login
              </button>
              
              <button
                onClick={() => router.push("/")}
                className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 relative flex items-center justify-center">
          <button
            onClick={handleCancel}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-red-200 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">🚪 Logout</h1>
            <p className="text-red-100 text-sm">Disconnect your wallet safely</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
            <div className="text-gray-600 text-sm mb-2">Currently connected:</div>
            <div className="text-gray-800 font-mono text-sm break-all">
              {account?.slice(0, 6)}...{account?.slice(-6)}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="text-yellow-800 text-sm text-center">
              <div className="font-medium mb-2">⚠️ About to logout</div>
              <div className="text-xs">
                This will disconnect your wallet. You'll need to reconnect to access your account again.
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:from-red-600 hover:to-pink-700 shadow-lg flex items-center justify-center transform transition-transform duration-200 hover:scale-105"
            >
              <LogOut className="w-6 h-6 mr-3" />
              Disconnect Wallet
            </button>

            <button
              onClick={handleCancel}
              className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 px-6 py-4 rounded-xl font-semibold text-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}