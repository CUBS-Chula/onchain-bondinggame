"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { cn } from "@/components/cn";
import { useWeb3 } from '@/app/contexts/Web3Context';
import { authApi, UserProfile } from '@/components/apiUtils';
import { io, Socket } from 'socket.io-client';

type Choice = 'rock' | 'paper' | 'scissors' | null;
type GameState = 'joining' | 'waiting-for-player' | 'countdown' | 'result';
type PlayerRole = 'host' | 'guest' | null;

interface Room {
  id: string;
  hostId: string;
  guestId: string | null;
  playCount: number;
}

interface OpponentData {
  username: string;
  rank: number;
  userId: string;
}

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;
  
  const [gameState, setGameState] = useState<GameState>('joining');
  const [countdown, setCountdown] = useState(10);
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [opponentChoice, setOpponentChoice] = useState<Choice>(null);
  const [result, setResult] = useState<string>('');
  const [playerRole, setPlayerRole] = useState<PlayerRole>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [opponentData, setOpponentData] = useState<OpponentData | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const playerChoiceRef = useRef<Choice>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { account } = useWeb3();

  const socketRef = useRef<Socket | null>(null);
  const roomRef = useRef<Room | null>(null);
  const currentUserRef = useRef<UserProfile | null>(null);

  // Initialize Socket.IO connection and rejoin room (reconnection)
  useEffect(() => {
    if (!roomId || !currentUser) return;

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'http://localhost:3001';
    const newSocket = io(backendUrl);
    setSocket(newSocket);
    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log('Connected to server in game room, rejoining:', roomId);
      setIsConnected(true);
      
      // Try to rejoin the room (this handles reconnections properly now)
      newSocket.emit('join-room', {
        roomId: roomId,
        guestData: {
          userId: currentUser.userId,
          username: currentUser.username,
          rank: currentUser.rank
        }
      });
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    // Socket event listeners
    newSocket.on('room-created', (data: { roomId: string, hostId: string }) => {
      console.log('Hosting room:', data);
      const newRoom = {
        id: data.roomId,
        hostId: data.hostId,
        guestId: null,
        playCount: 0
      };
      setRoom(newRoom);
      roomRef.current = newRoom;
      setPlayerRole('host');
      setGameState('waiting-for-player');
    });

    newSocket.on('player-joined', (data: { guestData: OpponentData, roomData: Room }) => {
      console.log('Player joined:', data);
      setOpponentData(data.guestData);
      setRoom(data.roomData);
      roomRef.current = data.roomData;
      setGameState('countdown');
      startCountdown();
    });

    newSocket.on('room-joined-success', (data: { hostData: OpponentData, roomData: Room }) => {
      console.log('Successfully joined room:', data);
      setOpponentData(data.hostData);
      setRoom(data.roomData);
      roomRef.current = data.roomData;
      setPlayerRole('guest');
      setGameState('countdown');
      
      setTimeout(() => {
        startCountdown();
      }, 100);
    });

    newSocket.on('game-result', (data: { playerChoice: Choice, opponentChoice: Choice, result: string }) => {
      console.log('Game result received:', data);
      if (countdownTimerRef.current) {
        console.log('Game result received, clearing countdown timer');
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
      setPlayerChoice(data.playerChoice);
      setOpponentChoice(data.opponentChoice);
      setResult(data.result);
      setGameState('result');
    });

    newSocket.on('room-error', (error: string) => {
      console.error('Room error:', error);
      setErrorMessage(`Room error: ${error}`);
      // Navigate back to lobby on room error after showing message
      setTimeout(() => {
        router.push('/play');
      }, 3000);
    });

    newSocket.on('player-temporarily-disconnected', () => {
      setErrorMessage('Opponent temporarily disconnected, waiting for reconnection...');
      // Clear error after 15 seconds
      setTimeout(() => setErrorMessage(''), 15000);
    });

    newSocket.on('player-disconnected', () => {
      setErrorMessage('Opponent disconnected');
      // Navigate back to lobby after showing message
      setTimeout(() => {
        router.push('/play');
      }, 3000);
    });

    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
      newSocket.close();
    };
  }, [roomId, currentUser, router]);

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoadingUser(true);
        const userData = await authApi.getMe();
        setCurrentUser(userData);
        currentUserRef.current = userData;
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Navigate back to lobby if user data fails
        router.push('/play');
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, [router]);

  // Clear countdown timer when game state changes away from countdown
  useEffect(() => {
    if (gameState !== 'countdown' && countdownTimerRef.current) {
      console.log('Game state changed away from countdown, clearing timer');
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, [gameState]);

  const startCountdown = useCallback(() => {
    // Clear any existing timer first to prevent multiple timers
    if (countdownTimerRef.current) {
      console.log('Clearing existing timer before starting new countdown');
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    
    let timeLeft = 10;
    setCountdown(timeLeft);
    console.log('Starting countdown timer');
    
    countdownTimerRef.current = setInterval(() => {
      console.log(`Countdown: ${timeLeft}, Player choice: ${playerChoiceRef.current}`);
      
      if (timeLeft <= 0) {
        // Clear the interval immediately when time reaches 0
        if (countdownTimerRef.current) {
          console.log('Countdown reached 0, clearing timer');
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
        
        // Set countdown to 0 to ensure UI shows 0
        setCountdown(0);
        
        // If player hasn't chosen, force a random choice
        if (!playerChoiceRef.current) {
          const choices: Choice[] = ['rock', 'paper', 'scissors'];
          const randomChoice = choices[Math.floor(Math.random() * choices.length)];
          console.log('No choice made, selecting random:', randomChoice);
          playerChoiceRef.current = randomChoice;
          setPlayerChoice(randomChoice);
        }

        // Send choice to server - get current values from refs
        const currentSocket = socketRef.current;
        const currentRoom = roomRef.current;
        const currentUserData = currentUserRef.current;
        
        if (currentSocket && currentRoom && currentUserData) {
          console.log('Sending choice to server:', playerChoiceRef.current);
          console.log('Socket connected:', currentSocket.connected);
          console.log('Room ID:', currentRoom.id);
          console.log('User ID:', currentUserData.userId);
          currentSocket.emit('player-choice', {
            roomId: currentRoom.id,
            choice: playerChoiceRef.current,
            userId: currentUserData.userId
          });
        } else {
          console.error('Cannot send choice - missing:', {
            socket: !!currentSocket,
            room: !!currentRoom,
            currentUser: !!currentUserData,
            socketConnected: currentSocket?.connected
          });
        }
        return; // Exit the interval function
      }
      
      // Decrement time and update UI only if time > 0
      timeLeft--;
      setCountdown(timeLeft);
    }, 1000);
  }, []); // Remove dependencies to avoid stale closure issues

  const makeChoice = (choice: Choice) => {
    if (gameState === 'countdown') {
      console.log('Player making choice:', choice);
      playerChoiceRef.current = choice;
      setPlayerChoice(choice);
    }
  };

  const resetGame = () => {
    console.log('Resetting game, clearing any existing timers');
    setPlayerChoice(null);
    setOpponentChoice(null);
    setResult('');
    setGameState('waiting-for-player');
    playerChoiceRef.current = null;
    setCountdown(10);
    if (countdownTimerRef.current) {
      console.log('Clearing timer during game reset');
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  };

  const backToLobby = () => {
    router.push('/play');
  };

  return (
    <div className={cn("min-h-screen bg-white flex flex-col items-center")}>
      <div className={cn("w-full max-w-md p-6 flex flex-col items-center")}>
        {/* Error Message */}
        {errorMessage && (
          <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center text-sm text-red-800">
            ❌ {errorMessage}
          </div>
        )}

        {/* Header with room info */}
        <div className="w-full mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <div className="text-blue-800 font-semibold text-sm">Room: {roomId}</div>
          <div className={cn("text-xs mt-1", 
            isConnected ? "text-green-600" : "text-red-600")}>
            {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
          </div>
        </div>

        {/* Back to lobby button */}
        <button
          onClick={backToLobby}
          className="self-start mb-4 text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
        >
          ← Back to Lobby
        </button>

        {/* Player Info Header */}
        <div className="flex items-center justify-between w-full mb-6">
          <div className="flex items-center gap-2">
            <div className={cn("w-8 h-8 rounded-full bg-blue-200")} />
            <div>
              {isLoadingUser ? (
                <>
                  <div className="font-semibold">Loading...</div>
                  <div className="text-xs text-gray-500">--</div>
                </>
              ) : currentUser ? (
                <>
                  <div className="font-semibold">{currentUser.username}</div>
                  <div className="text-xs text-gray-500">Rank #{currentUser.rank}</div>
                </>
              ) : (
                <>
                  <div className="font-semibold">Guest</div>
                  <div className="text-xs text-gray-500">Rank --</div>
                </>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">
              {opponentData ? opponentData.username : 'Waiting...'}
            </div>
            <div className="text-xs text-gray-400">
              {opponentData ? `Rank #${opponentData.rank}` : 'Rank --'}
            </div>
          </div>
        </div>

        {/* Game Status Messages */}
        {gameState === 'joining' && (
          <div className="text-center mb-6">
            <div className="text-lg font-semibold mb-2 text-blue-600">
              🔄 Joining Room...
            </div>
            <div className="text-sm text-gray-500">
              Connecting to room {roomId}
            </div>
          </div>
        )}

        {gameState === 'waiting-for-player' && (
          <div className="text-center mb-6">
            <div className="text-lg font-semibold mb-2 text-orange-600">
              ⏳ Waiting for opponent...
            </div>
            <div className="text-sm text-gray-500">
              Share room code {roomId} with your friend
            </div>
          </div>
        )}

        {/* Game Options */}
        <div className="w-full space-y-6 mb-6">
          <div className="text-center mb-4 font-semibold">Choose Your Move</div>
          <div className="flex justify-center gap-6 mb-6">
            <button 
              onClick={() => makeChoice('rock')} 
              className={cn("w-16 h-16 rounded-lg bg-gray-100 flex flex-col items-center justify-center text-2xl border border-gray-300 hover:bg-gray-200", 
                gameState !== 'countdown' && "opacity-50 cursor-not-allowed",
                playerChoice === 'rock' && gameState === 'countdown' && "bg-blue-200 border-blue-400")}
              disabled={gameState !== 'countdown'}
            >
              ✊<div className="text-xs mt-1">Rock</div>
            </button>
            <button 
              onClick={() => makeChoice('paper')} 
              className={cn("w-16 h-16 rounded-lg bg-gray-100 flex flex-col items-center justify-center text-2xl border border-gray-300 hover:bg-gray-200",
                gameState !== 'countdown' && "opacity-50 cursor-not-allowed",
                playerChoice === 'paper' && gameState === 'countdown' && "bg-blue-200 border-blue-400")}
              disabled={gameState !== 'countdown'}
            >
              ✋<div className="text-xs mt-1">Paper</div>
            </button>
            <button 
              onClick={() => makeChoice('scissors')} 
              className={cn("w-16 h-16 rounded-lg bg-gray-100 flex flex-col items-center justify-center text-2xl border border-gray-300 hover:bg-gray-200",
                gameState !== 'countdown' && "opacity-50 cursor-not-allowed",
                playerChoice === 'scissors' && gameState === 'countdown' && "bg-blue-200 border-blue-400")}
              disabled={gameState !== 'countdown'}
            >
              ✌️<div className="text-xs mt-1">Scissors</div>
            </button>
          </div>
        </div>

        {/* Countdown */}
        {gameState === 'countdown' && (
          <div className="text-center mb-4">
            <div className="text-lg font-semibold mb-2 text-gray-700">
              🎮 Game Starting!
            </div>
            <div className="text-4xl font-bold text-red-500 mb-2">{countdown}</div>
            <div className="text-sm text-gray-500 mb-2">Choose your move now!</div>
            {playerChoice && (
              <p className="text-sm text-green-600 font-semibold">
                ✓ You chose: <span className="capitalize">{playerChoice}</span>
              </p>
            )}
          </div>
        )}

        {/* Game Result */}
        {gameState === 'result' && (
          <div className="text-center space-y-4 w-full">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className={cn("flex flex-col items-center")}> 
                <div className={cn("w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-3xl border-2 border-blue-400")}>
                  {playerChoice === 'rock' ? '✊' : playerChoice === 'paper' ? '✋' : '✌️'}
                </div>
                <div className="text-sm mt-2 font-semibold">You</div>
                <div className="text-xs text-gray-500">{playerChoice}</div>
              </div>
              <div className="text-3xl font-bold text-gray-600">VS</div>
              <div className={cn("flex flex-col items-center")}> 
                <div className={cn("w-16 h-16 rounded-full bg-red-200 flex items-center justify-center text-3xl border-2 border-red-400")}>
                  {opponentChoice === 'rock' ? '✊' : opponentChoice === 'paper' ? '✋' : '✌️'}
                </div>
                <div className="text-sm mt-2 font-semibold">Opponent</div>
                <div className="text-xs text-gray-500">{opponentChoice}</div>
              </div>
            </div>
            <div className={cn("text-3xl font-bold mb-4",
              result.includes('Win') ? 'text-green-600' : 
              result.includes('Lose') ? 'text-red-600' : 'text-yellow-600')}>
              {result}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={resetGame} 
                className={cn("flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg")}
              >
                🔄 Play Again
              </button>
              <button 
                onClick={backToLobby} 
                className={cn("flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300")}
              >
                🏠 Lobby
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
