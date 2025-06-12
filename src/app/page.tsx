"use client";

import OnchainLogo from "#/onchainlogo.png";
import useIsPWA from "@/components/useIsPWA";
import useIsIOS from "@/components/useIsIOS";
import useIsMetaMaskBrowser from "@/components/useIsMetaMaskBrowser";
import { SquarePlus, Wallet } from "lucide-react";
import Image from "next/image";
import { useWeb3 } from "./contexts/Web3Context";
import { useState } from "react";
import { connectWithWalletConnect } from "@/utils/walletConnectClient";

export default function Home() {
  const isPWA = useIsPWA();
  const isIOS = useIsIOS();
  const isMetaMaskBrowser = useIsMetaMaskBrowser();
  const { account, connect, isConnecting, setAccount } = useWeb3();
  const [showQR, setShowQR] = useState(false);

  console.log('🌟 HOME PAGE COMPONENT RENDERED 🌟');
  console.log(
    "Platform:",
    navigator.platform,
    "UserAgent:",
    navigator.userAgent,
    "TouchPoints:",
    navigator.maxTouchPoints
  );

  console.log("Current wallet state:", {
    account,
    isConnecting,
    isPWA,
    isIOS: isIOS,
    isMetaMaskBrowser,
  });
  
  console.log('🎯 HOOK RESULTS:', {
    'isPWA': isPWA,
    'isIOS': isIOS,
    'isMetaMaskBrowser': isMetaMaskBrowser
  });

  const handleConnect = async () => {
    try {
      console.log('🚀 Attempting to connect wallet...', {
        isIOS,
        isPWA,
        isMetaMaskBrowser,
        shouldUseWalletConnect: isIOS && isPWA && !isMetaMaskBrowser
      });
      
      // If opened in MetaMask mobile browser, use MetaMask directly
      if (isMetaMaskBrowser) {
        console.log('🦊 Detected MetaMask browser - connecting directly...');
        await connect('metamask');
        return;
      }
      
      if (isIOS && isPWA) {
        // For iOS PWA (but not MetaMask browser), use WalletConnect
        console.log('📱 Using WalletConnect for iOS PWA...');
        setShowQR(true);
        
        const connectedAccount = await connectWithWalletConnect();
        console.log('✅ WalletConnect connected successfully:', connectedAccount);
        
        setAccount(connectedAccount); // Update the Web3 context
        setShowQR(false); // Hide QR code after successful connection
      } else {
        // For other platforms, try MetaMask first
        console.log('🦊 Attempting MetaMask connection...');
        await connect('metamask');
      }
      console.log('🎉 Wallet connected successfully. Final account:', account);
    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
      setShowQR(false); // Hide QR code on error
      
      // If MetaMask fails and it's not a MetaMask browser, try WalletConnect as fallback
      if (!isIOS && !isPWA && !isMetaMaskBrowser) {
        try {
          console.log('🔄 Trying WalletConnect as fallback...');
          setShowQR(true);
          const connectedAccount = await connectWithWalletConnect();
          console.log('✅ WalletConnect fallback successful:', connectedAccount);
          setAccount(connectedAccount); // Update the Web3 context
          setShowQR(false);
        } catch (wcError) {
          console.error('❌ WalletConnect also failed:', wcError);
          setShowQR(false);
        }
      }
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
        <p className="text-lg text-gray-700">Connect your wallet to play</p>
        <p className="text-sm text-gray-500 mb-10">Secure blockchain gaming</p>

        <div className="space-y-4">
          {account ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg px-6 py-4 flex items-center justify-center">
                <span className="text-green-700 font-medium">
                  ✅ Connected: {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </div>
              
              <button
                onClick={() => window.location.href = '/play'}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg transform hover:scale-105"
              >
                🎮 Start Playing
              </button>
            </div>
          ) : showQR ? (
            <div className="bg-white shadow-lg rounded-lg p-6 border">
              <p className="text-sm text-gray-600 mb-4">Scan QR code with your wallet app</p>
              <div className="w-48 h-48 mx-auto bg-white flex items-center justify-center border rounded-lg">
                <div id="walletconnect-qrcode" className="w-full h-full">
                  {/* This container will be populated by WalletConnect's QR modal */}
                </div>
              </div>
              <button
                onClick={() => setShowQR(false)}
                className="mt-4 text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center justify-center"
              >
                <Wallet className="w-6 h-6 mr-3" />
                {isConnecting ? (
                  <span className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Connecting...
                  </span>
                ) : (
                  'Login with Wallet'
                )}
              </button>
              
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">First time here?</p>
                <button
                  onClick={handleConnect}
                  className="text-orange-600 font-semibold text-lg hover:text-orange-700 underline decoration-2 underline-offset-4 hover:decoration-orange-700 transition-all duration-200"
                >
                  Register Now - It's Free! 🎉
                </button>
                <p className="text-xs text-gray-400 mt-2">No account needed - just connect your wallet!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
