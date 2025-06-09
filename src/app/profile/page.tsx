"use client";
import NavBar from "@/components/NavBar";
import { TokenIcon } from "@web3icons/react";
import { useWeb3 } from "@/app/contexts/Web3Context";
import Image from "next/image";


export default function ProfilePage() {

  const { account } = useWeb3();

  return (
    <div>
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
      <h1 className="text-center font-bold text-xl mt-2">{account}</h1>

      {/* Stats */}
      <div className="flex justify-around mt-4 text-center text-sm font-medium">
        <div>
          <p className="text-gray-700 font-bold">68</p>
          <p className="text-gray-500">Friends</p>
        </div>
        <div>
          <p className="text-gray-700 font-bold">#12</p>
          <p className="text-gray-500">Rank</p>
        </div>
        <div>
          <p className="text-gray-700 font-bold">75</p>
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
          <button className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-3 py-1 text-sm">
            <TokenIcon
              symbol="eth"
              variant="branded"
              size="20"
              color="#000000"
            />
            ETH
          </button>
          <button className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-3 py-1 text-sm">
            <TokenIcon
              symbol="btc"
              variant="branded"
              size="20"
              color="#000000"
            />
            BTC
          </button>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mt-8 px-6 pb-6">
        <p className="text-gray-500 mb-2">Recent Activity</p>
        <div className="flex items-center gap-4 border border-gray-200 rounded-md p-3 bg-white">
          <div className="w-10 h-10 bg-orange-700 rounded-md flex items-center justify-center text-white font-bold text-lg">
            D
          </div>
          <div>
            <p className="font-semibold">Beat DogeBoy #3015</p>
            <p className="text-gray-400 text-sm">2 hours ago</p>
          </div>
        </div>

        <div className="flex items-center gap-4 border border-gray-200 rounded-md p-3 bg-white">
          <div className="w-10 h-10 bg-orange-700 rounded-md flex items-center justify-center text-white font-bold text-lg">
            D
          </div>
          <div>
            <p className="font-semibold">Beat DogeBoy #3015</p>
            <p className="text-gray-400 text-sm">2 hours ago</p>
          </div>
        </div>

        <div className="flex items-center gap-4 border border-gray-200 rounded-md p-3 bg-white">
          <div className="w-10 h-10 bg-orange-700 rounded-md flex items-center justify-center text-white font-bold text-lg">
            D
          </div>
          <div>
            <p className="font-semibold">Beat DogeBoy #3015</p>
            <p className="text-gray-400 text-sm">2 hours ago</p>
          </div>
        </div>

        <div className="flex items-center gap-4 border border-gray-200 rounded-md p-3 bg-white">
          <div className="w-10 h-10 bg-orange-700 rounded-md flex items-center justify-center text-white font-bold text-lg">
            D
          </div>
          <div>
            <p className="font-semibold">Beat DogeBoy #3015</p>
            <p className="text-gray-400 text-sm">2 hours ago</p>
          </div>
        </div>

        <div className="flex items-center gap-4 border border-gray-200 rounded-md p-3 bg-white">
          <div className="w-10 h-10 bg-orange-700 rounded-md flex items-center justify-center text-white font-bold text-lg">
            D
          </div>
          <div>
            <p className="font-semibold">Beat DogeBoy #3015</p>
            <p className="text-gray-400 text-sm">2 hours ago</p>
          </div>
        </div>

        <div className="flex items-center gap-4 border border-gray-200 rounded-md p-3 bg-white">
          <div className="w-10 h-10 bg-orange-700 rounded-md flex items-center justify-center text-white font-bold text-lg">
            D
          </div>
          <div>
            <p className="font-semibold">Beat DogeBoy #3015</p>
            <p className="text-gray-400 text-sm">2 hours ago</p>
          </div>
        </div>

        <div className="flex items-center gap-4 border border-gray-200 rounded-md p-3 bg-white">
          <div className="w-10 h-10 bg-orange-700 rounded-md flex items-center justify-center text-white font-bold text-lg">
            D
          </div>
          <div>
            <p className="font-semibold">Beat DogeBoy #3015</p>
            <p className="text-gray-400 text-sm">2 hours ago</p>
          </div>
        </div>
      </section>

      <NavBar />
    </div>
  );
}
