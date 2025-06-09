import { cn } from "@/components/cn";

export default function LeaderboardPage() {
  return (
    <div className={cn("min-h-screen bg-white flex flex-col items-center")}> 
      <div className={cn("w-full max-w-md p-6")}> 
        <h1 className="text-xl font-bold mb-6">Leaderboard</h1>
        {/* Top 3 Podium */}
        <div className={cn("flex justify-center items-end gap-4 mb-8")}> 
          {/* 1st */}
          <div className={cn("flex flex-col items-center")}> 
            <div className={cn("w-16 h-16 rounded-full bg-yellow-300 border-4 border-yellow-500 mb-2")} />
            <div className="font-bold">Sarah K.</div>
            <div className="text-xs text-gray-500">1,243 pts</div>
          </div>
          {/* 2nd */}
          <div className={cn("flex flex-col items-center")}> 
            <div className={cn("w-14 h-14 rounded-full bg-gray-300 border-4 border-gray-400 mb-2")} />
            <div className="font-bold">Alex M.</div>
            <div className="text-xs text-gray-500">892 pts</div>
          </div>
          {/* 3rd */}
          <div className={cn("flex flex-col items-center")}> 
            <div className={cn("w-14 h-14 rounded-full bg-orange-300 border-4 border-orange-400 mb-2")} />
            <div className="font-bold">Mike R.</div>
            <div className="text-xs text-gray-500">756 pts</div>
          </div>
        </div>
        {/* Other Rankings */}
        <div className="space-y-3">
          <div className={cn("flex items-center gap-3 p-3 bg-gray-50 rounded-lg")}> 
            <div className={cn("w-10 h-10 rounded-full bg-gray-200")} />
            <div>
              <div className="font-semibold">Emma L.</div>
              <div className="text-xs text-gray-500">#4 &bull; 652 pts</div>
            </div>
          </div>
          <div className={cn("flex items-center gap-3 p-3 bg-gray-50 rounded-lg")}> 
            <div className={cn("w-10 h-10 rounded-full bg-gray-200")} />
            <div>
              <div className="font-semibold">David P.</div>
              <div className="text-xs text-gray-500">#5 &bull; 589 pts</div>
            </div>
          </div>
          <div className={cn("flex items-center gap-3 p-3 bg-gray-50 rounded-lg")}> 
            <div className={cn("w-10 h-10 rounded-full bg-gray-200")} />
            <div>
              <div className="font-semibold">Lisa T.</div>
              <div className="text-xs text-gray-500">#6 &bull; 521 pts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
