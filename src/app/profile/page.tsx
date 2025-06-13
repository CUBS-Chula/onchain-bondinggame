"use client";
import { TokenIcon } from "@web3icons/react";
import { useWeb3 } from "@/app/contexts/Web3Context";
import Image from "next/image";
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
            <div className="bg-blue-600 relative" style={{ height: "200px" }}></div>

            <div className="relative -mt-16 flex justify-center">
              <Image
                src="https://dummyimage.com/96x96/000/fff"
                alt="Avatar"
                width={96}
                height={96}
                className="rounded-full border-4 border-white"
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
              <div className="text-gray-400 text-sm text-center py-8">
                No recent activity available
              </div>
            </section>
          </>
        )}
      </div>
    </RequireWalletNoti>
  );
}
