"use client";

import { useState, useEffect } from "react";
import { userApi, GameHistoryEntry } from "@/components/apiUtils";
import RequireWalletNoti from "@/components/requireWalletNoti";
import Link from "next/link";

export default function GameHistoryPage() {
  const [gameHistory, setGameHistory] = useState<GameHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        const result = await userApi.getUserGameHistory();
        setGameHistory(result.gameHistory);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch game history');
        console.error('Game history fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGameHistory();
  }, []);

  // Get emoji for each choice
  const choiceEmoji = {
    rock: "✊",
    paper: "✋",
    scissors: "✌️"
  };

  return (
    <RequireWalletNoti>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Game History</h1>
          <Link href="/profile" className="text-blue-600 hover:underline text-sm">
            Back to Profile
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading game history...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center m-4">
            <div className="text-red-800 text-sm">❌ {error}</div>
          </div>
        )}

        {!loading && !error && gameHistory.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
            <div className="text-gray-500 text-lg">You haven't played any games yet</div>
            <Link href="/" className="inline-block mt-4 bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800 transition">
              Play Rock Paper Scissors
            </Link>
          </div>
        )}

        {gameHistory.length > 0 && (
          <div className="space-y-4">
            {gameHistory.map((game, index) => {
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
              
              return (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={`/avatar/${game.opponentAvatarId || '1'}.png`} 
                        alt={`${game.opponentName}'s avatar`}
                        className="w-10 h-10 rounded-full border border-gray-200"
                      />
                      <div>
                        <div className="font-medium">{game.opponentName}</div>
                        <div className="text-xs text-gray-500">{formattedDate} • {formattedTime}</div>
                      </div>
                    </div>
                    <div className={`text-sm ${resultStyle[game.result]}`}>
                      {game.result === 'win' && '🏆 Victory'}
                      {game.result === 'lose' && '❌ Defeat'}
                      {game.result === 'draw' && '🤝 Draw'}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <div className="text-xs text-gray-500 mb-1">You played</div>
                        <div className="bg-blue-50 border border-blue-100 rounded-full p-2 text-lg">
                          {choiceEmoji[game.playerChoice]}
                        </div>
                      </div>
                      
                      <div className="text-sm font-medium">VS</div>
                      
                      <div className="flex flex-col items-center">
                        <div className="text-xs text-gray-500 mb-1">Opponent played</div>
                        <div className="bg-red-50 border border-red-100 rounded-full p-2 text-lg">
                          {choiceEmoji[game.opponentChoice]}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                      +{game.pointsEarned} points
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </RequireWalletNoti>
  );
}
