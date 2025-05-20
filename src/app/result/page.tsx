import { cn } from "@/components/cn";
import NavBar from "@/components/NavBar";

export default function ResultPage() {
  return (
    <div className={cn("min-h-screen bg-white flex flex-col items-center")}> 
      <div className={cn("w-full max-w-md p-6 flex flex-col items-center")}> 
        <div className="flex items-center gap-2 mb-4">
          <div className="font-bold text-green-600 text-lg">YOU WIN!</div>
          <div className="text-gray-500">+25 points</div>
        </div>
        <div className="flex items-center justify-center gap-8 mb-6">
          <div className={cn("flex flex-col items-center")}> 
            <div className={cn("w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl")}>✊</div>
            <div className="text-xs mt-2">You</div>
          </div>
          <div className="text-2xl font-bold">vs</div>
          <div className={cn("flex flex-col items-center")}> 
            <div className={cn("w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl")}>✋</div>
            <div className="text-xs mt-2">Opponent</div>
          </div>
        </div>
        <div className="flex justify-between w-full mb-6">
          <div className="text-center">
            <div className="font-bold text-lg">12</div>
            <div className="text-xs text-gray-500">Wins</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">5</div>
            <div className="text-xs text-gray-500">Losses</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">70%</div>
            <div className="text-xs text-gray-500">Win Rate</div>
          </div>
        </div>
        <button className={cn("w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold mb-3")}>Play Again</button>
        <button className={cn("w-full bg-gray-100 text-gray-800 py-2 rounded-lg font-semibold")}>Back to Menu</button>
      </div>
      <NavBar />
    </div>
  );
}
