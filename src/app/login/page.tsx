import { cn } from "@/components/cn";

export default function GamePlayPage() {
  return (
    <div className={cn("min-h-screen bg-white flex flex-col items-center")}> 
      <div className={cn("w-full max-w-md p-6 flex flex-col items-center")}> 
        <div className="flex items-center justify-between w-full mb-6">
          <div className="flex items-center gap-2">
            <div className={cn("w-8 h-8 rounded-full bg-gray-200")} />
            <div>
              <div className="font-semibold">CryptoWhale</div>
              <div className="text-xs text-gray-500">Rank #12</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Lisa</div>
            <div className="text-xs text-gray-400">Rank #17</div>
          </div>
        </div>
        <div className="text-center mb-4">
          <div className="text-xs text-gray-500 mb-1">Time Remaining</div>
          <div className="text-2xl font-bold">10</div>
        </div>
        <div className="text-center mb-4 font-semibold">Choose Your Move</div>
        <div className="flex justify-center gap-6 mb-6">
          <button className={cn("w-16 h-16 rounded-lg bg-gray-100 flex flex-col items-center justify-center text-2xl border border-gray-300 hover:bg-gray-200")}>✊<div className="text-xs mt-1">Rock</div></button>
          <button className={cn("w-16 h-16 rounded-lg bg-gray-100 flex flex-col items-center justify-center text-2xl border border-gray-300 hover:bg-gray-200")}>✋<div className="text-xs mt-1">Paper</div></button>
          <button className={cn("w-16 h-16 rounded-lg bg-gray-100 flex flex-col items-center justify-center text-2xl border border-gray-300 hover:bg-gray-200")}>✌️<div className="text-xs mt-1">Scissors</div></button>
        </div>
      </div>
    </div>
  );
}
