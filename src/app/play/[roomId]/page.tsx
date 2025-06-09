"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { cn } from "@/components/cn";
import NavBar from "@/components/NavBar";
import { useWeb3 } from '@/app/contexts/Web3Context';
// import QRCode from 'qrcode.react';

type Choice = 'rock' | 'paper' | 'scissors' | null;
type GameState = 'waiting' | 'room-created' | 'countdown' | 'playing' | 'result';
type PlayerRole = 'host' | 'guest' | null;

interface Room {
  id: string;
  hostId: string;
  guestId: string | null;
  playCount: number;
}

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [countdown, setCountdown] = useState(10);
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [opponentChoice, setOpponentChoice] = useState<Choice>(null);
  const [result, setResult] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [roomId, setRoomId] = useState<string>(''); // Used for URL parameter display
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [playerRole, setPlayerRole] = useState<PlayerRole>(null); // Will be used for future features
  const [room, setRoom] = useState<Room | null>(null);
  const playerChoiceRef = useRef<Choice>(null);
  const { account } = useWeb3();

  // Mock API calls - these will be used for future room functionality
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const createRoom = async () => {
    // Simulate API call
    const newRoom: Room = {
      id: account + '-' + Date.now(),
      hostId: "player-" + account,
      guestId: null,
      playCount: 0,
    };
    setRoom(newRoom);
    setRoomId(newRoom.id);
    setPlayerRole('host');
    setGameState('room-created');
    return newRoom;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const joinRoom = async (roomIdParam: string) => {
    // Simulate API call
    if (room && room.playCount >= 1) {
      console.log('Already played with this player');
      return;
    }
    const updatedRoom = { ...room!, guestId: 'player-' + Math.random().toString(36).substring(7) };
    setRoom(updatedRoom);
    setPlayerRole('guest');
    startGame();
  };

  const determineWinner = useCallback((player: Choice, opponent: Choice) => {
    console.log('Determining winner:', { player, opponent });
    
    if (!player || !opponent) {
      console.log('Missing choices:', { player, opponent });
      return;
    }

    if (player === opponent) {
      setResult('เสมอ!');
    } else if (
      (player === 'rock' && opponent === 'scissors') ||
      (player === 'paper' && opponent === 'rock') ||
      (player === 'scissors' && opponent === 'paper')
    ) {
      setResult('คุณชนะ!');
    } else {
      setResult('คุณแพ้!');
    }
    console.log('Setting game state to result');
    setGameState('result');
    // Update play count
    if (room) {
      setRoom({ ...room, playCount: room.playCount + 1 });
    }
  }, [room]);

  const startGame = useCallback(() => {
    console.log('Starting new game');
    setGameState('countdown');
    setPlayerChoice(null);
    setOpponentChoice(null);
    setResult('');
    playerChoiceRef.current = null;
    setCountdown(10);
  }, [determineWinner]);

  useEffect(() => {
    if (gameState === 'countdown') {
      let timeLeft = 10;
      const timer = setInterval(() => {
        timeLeft--;
        setCountdown(timeLeft);
        console.log(`Countdown: ${timeLeft}, Player choice: ${playerChoiceRef.current}`);
        
        if (timeLeft === 0) {
          clearInterval(timer);
          console.log('Countdown ended');
          console.log('Final player choice:', playerChoiceRef.current);
          
          // If player hasn't chosen, force a random choice
          if (!playerChoiceRef.current) {
            console.log('No player choice, selecting random');
            const choices: Choice[] = ['rock', 'paper', 'scissors'];
            const randomChoice = choices[Math.floor(Math.random() * choices.length)];
            console.log('Random choice selected:', randomChoice);
            playerChoiceRef.current = randomChoice;
            setPlayerChoice(randomChoice);
          }

          // Show result immediately
          const opponentChoice: Choice = 'scissors';
          console.log('Setting opponent choice:', opponentChoice);
          setOpponentChoice(opponentChoice);
          determineWinner(playerChoiceRef.current, opponentChoice);
        }
      }, 1000);

      return () => {
        clearInterval(timer);
        console.log('Timer cleared on unmount');
      };
    }
  }, [gameState, determineWinner]);

  useEffect(() => {
    console.log('Component mounted, starting game');
    startGame();
  }, [startGame]);

  const makeChoice = (choice: Choice) => {
    if (gameState === 'countdown') {
      console.log('Player making choice:', choice);
      playerChoiceRef.current = choice;
      setPlayerChoice(choice);
    }
  };

  const resetGame = () => {
    console.log('Resetting game');
    if (room && room.playCount >= 2) {
      setGameState('waiting');
      setRoom(null);
      setRoomId('');
      setPlayerRole(null);
    } else {
      setPlayerChoice(null);
      setOpponentChoice(null);
      setResult('');
      setGameState('waiting');
      setCountdown(10);
    }
    startGame();
  };

  return (
    <div className={cn("min-h-screen bg-white flex flex-col items-center")}>
      <div className={cn("w-full max-w-md p-6 flex flex-col items-center")}>
        <div className="flex items-center justify-between w-full mb-6">
          <div className="flex items-center gap-2">
            <div className={cn("w-8 h-8 rounded-full bg-gray-200")} />
            <div>
              <div className="font-semibold">Player 1</div>
              <div className="text-xs text-gray-500">Rank #12</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Player 2</div>
            <div className="text-xs text-gray-400">Rank #17</div>
          </div>
        </div>

        {/* Always show game options */}
        <div className="w-full space-y-6 mb-6">
          <div className="text-center mb-4 font-semibold">Choose Your Move</div>
          <div className="flex justify-center gap-6 mb-6">
            <button 
              onClick={() => makeChoice('rock')} 
              className={cn("w-16 h-16 rounded-lg bg-gray-100 flex flex-col items-center justify-center text-2xl border border-gray-300 hover:bg-gray-200", 
                gameState !== 'countdown' && "opacity-50 cursor-not-allowed")}
              disabled={gameState !== 'countdown'}
            >
              ✊<div className="text-xs mt-1">Rock</div>
            </button>
            <button 
              onClick={() => makeChoice('paper')} 
              className={cn("w-16 h-16 rounded-lg bg-gray-100 flex flex-col items-center justify-center text-2xl border border-gray-300 hover:bg-gray-200",
                gameState !== 'countdown' && "opacity-50 cursor-not-allowed")}
              disabled={gameState !== 'countdown'}
            >
              ✋<div className="text-xs mt-1">Paper</div>
            </button>
            <button 
              onClick={() => makeChoice('scissors')} 
              className={cn("w-16 h-16 rounded-lg bg-gray-100 flex flex-col items-center justify-center text-2xl border border-gray-300 hover:bg-gray-200",
                gameState !== 'countdown' && "opacity-50 cursor-not-allowed")}
              disabled={gameState !== 'countdown'}
            >
              ✌️<div className="text-xs mt-1">Scissors</div>
            </button>
          </div>
        </div>

        {gameState === 'countdown' && (
          <div className="text-center mb-4">
            <div className="text-xs text-gray-500 mb-1">Time Remaining</div>
            <div className="text-2xl font-bold">{countdown}</div>
          </div>
        )}

        {gameState === 'countdown' && playerChoice && (
          <div className="text-center">
            <p className="text-sm text-gray-500">You chose: {playerChoice}</p>
          </div>
        )}

        {gameState === 'result' && (
          <div className="text-center space-y-4 w-full">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className={cn("flex flex-col items-center")}> 
                <div className={cn("w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl")}>
                  {playerChoice === 'rock' ? '✊' : playerChoice === 'paper' ? '✋' : '✌️'}
                </div>
                <div className="text-xs mt-2">You</div>
              </div>
              <div className="text-2xl font-bold">vs</div>
              <div className={cn("flex flex-col items-center")}> 
                <div className={cn("w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl")}>✌️</div>
                <div className="text-xs mt-2">Opponent</div>
              </div>
            </div>
            <p className="text-2xl font-bold">{result}</p>
            <button 
              onClick={resetGame} 
              className={cn("w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold")}
            >
              เล่นอีกครั้ง
            </button>
          </div>
        )}
      </div>
      <NavBar />
    </div>
  );
}
