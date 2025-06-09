"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3 } from "@/app/contexts/Web3Context";
import { createHash } from 'crypto';

export default function PlayPage() {
  const { account, connect, isConnecting } = useWeb3();
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [createdRoomId, setCreatedRoomId] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const createRoom = () => {
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    const timestamp = Date.now();
    const data = `${account}${timestamp}`;
    const hash = createHash('md5').update(data).digest('hex');
    console.log('Creating room with ID:', hash);
    setCreatedRoomId(hash);
    
    // Auto-navigate to the created room after a short delay
    setTimeout(() => {
      router.push(`/play/${hash}`);
    }, 2000);
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(createdRoomId);
    alert('Room ID copied to clipboard!');
  };

  const joinRoom = async () => {
    if (!joinRoomId.trim()) {
      alert('Please enter a room ID');
      return;
    }
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }
    
    setIsJoining(true);
    
    try {
      // Navigate to the specific room
      console.log('Joining room:', joinRoomId);
      router.push(`/play/${joinRoomId.trim()}`);
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Failed to join room. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isJoining) {
      joinRoom();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">🎮 Game Lobby</h1>
          <p className="text-blue-100 text-sm">Connect & Play Online</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Wallet Connection */}
          {!account && (
            <div className="text-center bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="text-yellow-800 text-sm mb-3">
                🔐 Connect your wallet to start playing
              </div>
              <button
                onClick={() => connect('metamask')}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                {isConnecting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Connecting...
                  </span>
                ) : (
                  '🦊 Connect MetaMask'
                )}
              </button>
            </div>
          )}

          {/* Connected Status */}
          {account && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <div className="text-green-800 text-sm">
                ✅ Wallet Connected
              </div>
              <div className="text-green-600 text-xs mt-1 font-mono">
                {account.slice(0, 6)}...{account.slice(-4)}
              </div>
            </div>
          )}

          {/* Main Action Buttons - Horizontal Layout */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <button
                onClick={createRoom}
                disabled={!account}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg text-center"
              >
                <div className="text-lg">🏠</div>
                <div className="text-sm">Create Room</div>
              </button>
              
              <button
                onClick={joinRoom}
                disabled={!account || !joinRoomId.trim() || isJoining}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg text-center"
              >
                {isJoining ? (
                  <div>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-1"></div>
                    <div className="text-xs">Joining...</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-lg">🚪</div>
                    <div className="text-sm">Join Room</div>
                  </div>
                )}
              </button>
            </div>

            {/* Join Room Input */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter Room ID to join..."
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isJoining}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 text-center font-mono text-sm disabled:opacity-50"
              />
            </div>
          </div>

          {/* Created Room Display */}
          {createdRoomId && (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4 space-y-3">
              <div className="text-center">
                <div className="text-lg">🎉</div>
                <p className="text-gray-700 font-semibold">Room Created!</p>
                <p className="text-gray-500 text-xs">Share this ID with friends</p>
              </div>
              
              <div className="bg-white rounded-lg p-3 border">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={createdRoomId}
                    readOnly
                    className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm text-center"
                  />
                  <button
                    onClick={copyRoomId}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-semibold"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/play/${createdRoomId}`)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 text-sm font-semibold"
                >
                  🚀 Enter Room Now
                </button>
                <p className="flex-1 text-center text-gray-500 text-xs pt-3">
                  Auto-entering in 2 seconds...
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-gray-400 text-xs pt-4 border-t border-gray-100">
            Secure blockchain gaming experience
          </div>
        </div>
      </div>
    </div>
  );
}