"use client";
import { TokenIcon } from "@web3icons/react";
import { useWeb3 } from "@/app/contexts/Web3Context";
import Image from "next/image";
import Link from "next/link";
import RequireWallet from "@/components/requireWallet";
import RequireWalletNoti from "@/components/requireWalletNoti";
import { useState, useEffect } from "react";
import { authApi, UserProfile } from "@/components/apiUtils";

export default function ProfilePage() {
  const { account } = useWeb3();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authApi.getMe();
        setProfile(profileData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch profile');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <RequireWalletNoti>
      <div>
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading profile...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center m-4">
            <div className="text-red-800 text-sm">❌ {error}</div>
          </div>
        )}

        {profile && (
          <>
            {/* Banner */}
            <div className="relative" style={{ height: "200px" }}>
              <img
                src={`/banner/${profile.bannerId || '1'}.png`}
                alt="Profile Banner"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Avatar */}
            <div className="relative -mt-16 flex justify-center">
              <img
                src={`/avatar/${profile.avatarId || '1'}.png`}
                alt="Avatar"
                width={96}
                height={96}
                className="rounded-full border-4 border-white w-24 h-24"
              />
            </div>

            {/* Username */}
            <h1 className="text-center font-bold text-xl mt-2">
              {profile.username}
            </h1>

            {/* Stats */}
            <div className="flex justify-around mt-4 text-center text-sm font-medium">
              <div>
                <p className="text-gray-700 font-bold">{profile.friendList.length}</p>
                <p className="text-gray-500">Friends</p>
              </div>
              <div>
                <p className="text-gray-700 font-bold">#{profile.rank}</p>
                <p className="text-gray-500">Rank</p>
              </div>
              <div>
                <p className="text-gray-700 font-bold">{profile.score}</p>
                <p className="text-gray-500">Score</p>
              </div>
            </div>

            {/* Button */}
            <div className="flex justify-center mt-6">
              <button className="bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800 transition">
                Play Rock Paper Scissors
              </button>
            </div>

            {/* Favorite Chains */}
            <section className="mt-8 px-6">
              <p className="text-gray-500 mb-2">Favorite Chains</p>
              <div className="flex gap-3">
                {profile.favoriteChain.length > 0 ? (
                  profile.favoriteChain.map((chain, index) => (
                    <button key={index} className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-3 py-1 text-sm">
                      <TokenIcon
                        symbol={chain.toLowerCase()}
                        variant="branded"
                        size="20"
                        color="#000000"
                      />
                      {chain}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No favorite chains selected</p>
                )}
              </div>
            </section>

            {/* Recent Activity */}
            <section className="mt-8 px-6 pb-6">
              <p className="text-gray-500 mb-2">Recent Activity</p>
              {profile.gameHistory && profile.gameHistory.length > 0 ? (
                <div className="space-y-3">
                  {profile.gameHistory.slice(0, 5).map((game, index) => {
                    // Format the date for display
                    const gameDate = new Date(game.timestamp);
                    const formattedDate = gameDate.toLocaleDateString();
                    const formattedTime = gameDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    
                    // Get result style based on outcome
                    const resultStyle = {
                      win: "text-green-600 font-semibold",
                      lose: "text-red-600",
                      draw: "text-yellow-600"
                    };
                    
                    // Get emoji for each choice
                    const choiceEmoji = {
                      rock: "✊",
                      paper: "✋",
                      scissors: "✌️"
                    };
                    
                    return (
                      <div key={index} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img 
                              src={`/avatar/${game.opponentAvatarId || '1'}.png`} 
                              alt={`${game.opponentName}'s avatar`}
                              className="w-8 h-8 rounded-full border border-gray-200"
                            />
                            <div>
                              <div className="font-medium text-sm">{game.opponentName}</div>
                              <div className="text-xs text-gray-500">{formattedDate} • {formattedTime}</div>
                            </div>
                          </div>
                          <div className={`text-sm ${resultStyle[game.result]}`}>
                            {game.result === 'win' && '🏆 Won'}
                            {game.result === 'lose' && '❌ Lost'}
                            {game.result === 'draw' && '🤝 Draw'}
                          </div>
                        </div>
                        
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-50 border border-blue-100 rounded-full p-1.5 text-sm">
                              {choiceEmoji[game.playerChoice]}
                            </div>
                            <span className="text-xs">vs</span>
                            <div className="bg-red-50 border border-red-100 rounded-full p-1.5 text-sm">
                              {choiceEmoji[game.opponentChoice]}
                            </div>
                          </div>
                          <div className="text-xs font-medium text-purple-600">
                            +{game.pointsEarned} pts
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {profile.gameHistory.length > 5 && (
                    <div className="text-center mt-2">
                      <Link href="/game-history" className="text-blue-600 text-sm hover:underline">
                        View all {profile.gameHistory.length} games
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400 text-sm text-center py-8">
                  No recent activity available
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </RequireWalletNoti>
  );
}
