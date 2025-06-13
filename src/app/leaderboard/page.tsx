"use client";
import { cn } from "@/components/cn";
import { useState, useEffect } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { authApi, UserProfile } from "@/components/apiUtils";

interface User {
  userId: string;
  username: string;
  walletId: string;
  friendList: string[];
  avatarId?: string;
  rank: number;
  score: number;
  favoriteChain: string[];
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserData, setCurrentUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { account } = useWeb3(); // Get user session from Web3 context

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all users for leaderboard
        const sortedUsers = await authApi.getAllUsers();
        setUsers(sortedUsers);

        // Fetch current user data if token exists and account is available
        if (account) {
          try {
            const currentUserResult = await authApi.getMe();
            setCurrentUserData(currentUserResult);
          } catch (userError) {
            console.error('Failed to fetch current user data:', userError);
            // Don't set error state for current user failure, just continue without it
          }
        }
        
      } catch (err) {
        console.error('Fetch error:', err); // Debug log
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [account]);

  if (loading) {
    return (
      <div className={cn("min-h-screen bg-white flex flex-col items-center justify-center")}>
        <div className="text-lg">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("min-h-screen bg-white flex flex-col items-center justify-center")}>
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  const topThree = users.slice(0, 3);
  const remainingUsers = users.slice(3);
  
  // Calculate current user's rank in the leaderboard
  const getCurrentUserRank = () => {
    if (!currentUserData) return users.length + 1;
    const userIndex = users.findIndex(user => user.walletId === currentUserData.walletId);
    return userIndex >= 0 ? userIndex + 1 : users.length + 1;
  };

  return (
    <div className={cn("min-h-screen bg-white flex flex-col")}> 
      <div className={cn("flex-1 p-6", account ? "pb-32" : "pb-20")}> {/* Conditional padding based on login status */}
        <h1 className="text-xl font-bold mb-6 text-center">Leaderboard</h1>
        
        {/* Top 3 Podium with Graphic */}
        {topThree.length > 0 && (
          <div className={cn("mb-8")}> 
            <div className={cn("flex justify-center items-end gap-3")}> 
              {/* 2nd Place */}
              {topThree[1] ? (
                <div className={cn("flex flex-col items-center")}> 
                  <div className={cn("w-12 h-12 rounded-full bg-gray-300 border-2 border-gray-400 mb-2 flex items-center justify-center")}>
                    <span className="text-xs font-bold text-gray-700">{topThree[1].username.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="font-bold text-xs text-center mb-1">{topThree[1].username}</div>
                  <div className="text-xs text-gray-500 mb-2">{topThree[1].score}</div>
                  {/* Podium Box for 2nd */}
                  <div className={cn("w-16 h-12 bg-gradient-to-t from-gray-500 to-gray-300 border border-gray-600 flex items-center justify-center")}>
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                </div>
              ) : (
                <div className="w-16"></div>
              )}
              
              {/* 1st Place */}
              {topThree[0] ? (
                <div className={cn("flex flex-col items-center")}> 
                  <div className={cn("w-16 h-16 rounded-full bg-yellow-300 border-2 border-yellow-500 mb-2 flex items-center justify-center")}>
                    <span className="text-sm font-bold text-yellow-800">{topThree[0].username.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="font-bold text-sm text-center mb-1">{topThree[0].username}</div>
                  <div className="text-xs text-gray-500 mb-2">{topThree[0].score}</div>
                  {/* Podium Box for 1st - Tallest */}
                  <div className={cn("w-16 h-16 bg-gradient-to-t from-yellow-600 to-yellow-300 border border-yellow-700 flex items-center justify-center")}>
                    <span className="text-yellow-800 font-bold text-lg">👑</span>
                  </div>
                </div>
              ) : (
                <div className="w-16"></div>
              )}
              
              {/* 3rd Place */}
              {topThree[2] ? (
                <div className={cn("flex flex-col items-center")}> 
                  <div className={cn("w-12 h-12 rounded-full bg-orange-300 border-2 border-orange-400 mb-2 flex items-center justify-center")}>
                    <span className="text-xs font-bold text-orange-700">{topThree[2].username.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="font-bold text-xs text-center mb-1">{topThree[2].username}</div>
                  <div className="text-xs text-gray-500 mb-2">{topThree[2].score}</div>
                  {/* Podium Box for 3rd */}
                  <div className={cn("w-16 h-10 bg-gradient-to-t from-orange-600 to-orange-300 border border-orange-700 flex items-center justify-center")}>
                    <span className="text-orange-800 font-bold text-sm">3</span>
                  </div>
                </div>
              ) : (
                <div className="w-16"></div>
              )}
            </div>
          </div>
        )}
        
        {/* Other Rankings */}
        <div className="space-y-3 max-w-md mx-auto">
          {remainingUsers.map((user, index) => (
            <div key={user.userId} className={cn("flex items-center gap-3 p-3 bg-gray-50 rounded-lg")}> 
              {/* Profile Avatar */}
              <div className={cn("w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center")}>
                <span className="text-sm font-bold text-gray-600">{user.username.charAt(0).toUpperCase()}</span>
              </div>
              
              {/* Username */}
              <div className="flex-1">
                <div className="font-semibold">{user.username}</div>
                <div className="text-xs text-gray-500">#{index + 4}</div>
              </div>
              
              {/* Score */}
              <div className="text-right">
                <div className="font-bold text-sm">{user.score}</div>
                <div className="text-xs text-gray-500">pts</div>
              </div>
            </div>
          ))}
          
          {users.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No users found
            </div>
          )}
        </div>
      </div>
      
      {/* Your Stats Section - Only show if user is logged in and has current user data */}
      {account && currentUserData && (
        <div className={cn("fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white border-t border-gray-200 px-4 py-3 z-40")}>
          <div className={cn("bg-gray-100 border border-gray-300 p-3 flex items-center justify-between")}>
            <div className="flex items-center gap-3">
              <div className={cn("w-8 h-8 bg-gray-300 flex items-center justify-center")}>
                <span className="text-sm font-bold text-gray-600">{currentUserData.username.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <div className="font-medium text-sm">{currentUserData.username}</div>
                <div className="text-xs text-gray-500">Rank #{getCurrentUserRank()}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">{currentUserData.score}</div>
              <div className="text-xs text-gray-500">points</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
