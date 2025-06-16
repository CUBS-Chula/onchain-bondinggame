"use client";

import { useWeb3 } from "@/app/contexts/Web3Context";
import { authApi, UserProfile } from "@/components/apiUtils";
import { cn } from "@/components/cn";
import RequireWalletNoti from "@/components/requireWalletNoti";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function PlayPage() {
  const { account } = useWeb3();
  const router = useRouter();
  const [createdRoomId, setCreatedRoomId] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const socketRef = useRef<Socket | null>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    // const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'http://localhost:3001';
    const backendUrl = "https://api.game.onchainbootcamp.org";
    const newSocket = io(backendUrl);
    setSocket(newSocket);
    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    // Socket event listeners for room creation
    newSocket.on("room-created", (data: { roomId: string; hostId: string }) => {
      console.log("Room created:", data);
      setCreatedRoomId(data.roomId);
      setIsCreating(false);

      // Don't auto-navigate - wait for player to join
    });

    newSocket.on("player-joined", (data: { guestData: any; roomData: any }) => {
      console.log(
        "Player joined the room, redirecting both players to game:",
        data
      );
      // Reset states
      setIsJoining(false);
      setJoinRoomId("");
      // Both host and guest get redirected to the game page
      router.push(`/play/${data.roomData.id}`);
    });

    newSocket.on(
      "room-joined-success",
      (data: { hostData: any; roomData: any }) => {
        console.log("Successfully joined room, redirecting to game:", data);
        // Reset states
        setIsJoining(false);
        setJoinRoomId("");
        // Guest gets redirected to the game page
        router.push(`/play/${data.roomData.id}`);
      }
    );

    newSocket.on("room-error", (error: string) => {
      console.error("Room error:", error);
      setErrorMessage(error);
      setIsCreating(false);
      setIsJoining(false);
      // Clear error after 5 seconds
      setTimeout(() => setErrorMessage(""), 5000);
    });

    return () => {
      newSocket.close();
    };
  }, [router]);

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoadingUser(true);
        const userData = await authApi.getMe();
        setCurrentUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

  const createRoom = () => {
    if (socket && currentUser && !isCreating) {
      setIsCreating(true);
      // Generate room code on frontend
      const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      console.log("Creating room with ID:", roomId);

      socket.emit("create-room", {
        roomId: roomId,
        userId: currentUser.userId,
        username: currentUser.username,
        rank: currentUser.rank,
        avatarId: currentUser.avatarId,
      });
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(createdRoomId);
    setSuccessMessage("Room code copied to clipboard!");
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const joinRoom = async () => {
    if (!joinRoomId.trim()) {
      setErrorMessage("Please enter a room code");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (!socket || !currentUser) {
      setErrorMessage("Not connected to server or user not loaded");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setIsJoining(true);
    setErrorMessage(""); // Clear any existing errors

    try {
      // Emit join-room event instead of navigating directly
      console.log("Attempting to join room:", joinRoomId);
      socket.emit("join-room", {
        roomId: joinRoomId.trim().toUpperCase(),
        guestData: {
          userId: currentUser.userId,
          username: currentUser.username,
          rank: currentUser.rank,
          avatarId: currentUser.avatarId,
        },
      });
      // Don't navigate here - wait for room-joined-success event
    } catch (error) {
      console.error("Error joining room:", error);
      setErrorMessage("Failed to join room. Please try again.");
      setTimeout(() => setErrorMessage(""), 5000);
      setIsJoining(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isJoining && !isCreating) {
      joinRoom();
    }
  };

  return (
    <RequireWalletNoti>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              🎮 Game Lobby
            </h1>
            <p className="text-blue-100 text-sm">Connect & Play Online</p>
          </div>

          <div className="p-6 space-y-4">
            {/* Error Message */}
            {errorMessage && (
              <div className="w-full p-3 rounded-lg text-center text-sm bg-red-100 text-red-800 border border-red-200">
                ❌ {errorMessage}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="w-full p-3 rounded-lg text-center text-sm bg-green-100 text-green-800 border border-green-200">
                ✅ {successMessage}
              </div>
            )}

            {/* Game Rules Info */}
            <div className="w-full p-3 rounded-lg text-center text-sm bg-yellow-50 text-yellow-800 border border-yellow-200">
              <div className="font-semibold mb-1">⚠️ Game Rules</div>
              <div className="text-xs">
                You can only play with each opponent once! Find different
                players for each match.
              </div>
            </div>

            {/* Connection Status */}
            <div
              className={cn(
                "w-full p-3 rounded-lg text-center text-sm",
                isConnected
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              )}
            >
              {isConnected
                ? "🟢 Connected to Game Server"
                : "🔴 Disconnected from Game Server"}
            </div>

            {/* Connected Wallet Status */}
            {account && currentUser && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <div className="text-green-800 text-sm font-semibold">
                  ✅ {currentUser.username}
                </div>
                <div className="text-green-600 text-xs mt-1">
                  Rank #{currentUser.rank} • {account.slice(0, 6)}...
                  {account.slice(-4)}
                </div>
              </div>
            )}

            {isLoadingUser && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <div className="text-blue-800 text-sm">
                  🔄 Loading user data...
                </div>
              </div>
            )}

            {/* Main Action Buttons - Horizontal Layout */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <button
                  onClick={createRoom}
                  disabled={!isConnected || !currentUser || isCreating}
                  className={cn(
                    "flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 shadow-lg text-center",
                    (!isConnected || !currentUser || isCreating) &&
                      "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isCreating ? (
                    <div>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-1"></div>
                      <div className="text-xs">Creating...</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-lg">🏠</div>
                      <div className="text-sm">Create Room</div>
                    </div>
                  )}
                </button>

                <button
                  onClick={joinRoom}
                  disabled={
                    !joinRoomId.trim() ||
                    isJoining ||
                    !isConnected ||
                    !currentUser
                  }
                  className={cn(
                    "flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg text-center"
                  )}
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
              <div>
                <input
                  type="text"
                  placeholder="Enter Room Code (e.g. ABC123)"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  disabled={isJoining || isCreating}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 text-center font-mono text-sm disabled:opacity-50 uppercase"
                  maxLength={6}
                />
              </div>
            </div>

            {/* Created Room Display */}
            {createdRoomId && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 space-y-4 mt-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">🎉</div>
                  <p className="text-blue-800 font-semibold text-xl mb-1">
                    Room Created!
                  </p>
                  <p className="text-blue-600 text-sm">
                    Share this code with your friend
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-blue-300 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl text-center">
                      <div className="font-mono text-2xl font-bold tracking-wider text-blue-800">
                        {createdRoomId}
                      </div>
                    </div>
                    <button
                      onClick={copyRoomId}
                      className="bg-blue-500 text-white px-6 py-4 rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm font-semibold shadow-md"
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-yellow-800 text-sm font-medium">
                      ⏳ Waiting for player to join...
                    </p>
                    <p className="text-yellow-600 text-xs mt-1">
                      You'll both be redirected to the game when someone joins!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-gray-400 text-xs pt-4 border-t border-gray-100">
              Real-time multiplayer rock-paper-scissors
            </div>
          </div>
        </div>
      </div>
    </RequireWalletNoti>
  );
}
