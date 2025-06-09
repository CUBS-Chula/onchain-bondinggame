'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';

export default function ScanPage() {
  const [showQR, setShowQR] = useState(false);
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const createRoom = () => {
    // Generate a random room ID (you might want to use a more sophisticated method)
    const newRoomId = Math.random().toString(36).substring(2, 8);
    setRoomId(newRoomId);
    setShowQR(true);
  };

  const handleScan = () => {
    // In a real implementation, you would use a QR code scanner here
    // For now, we'll just navigate to the room page
    if (roomId) {
      router.push(`/room/${roomId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">Room Options</h1>
        
        {!showQR ? (
          <div className="space-y-4">
            <button
              onClick={createRoom}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Create Room
            </button>
            <button
              onClick={handleScan}
              className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition-colors"
            >
              Scan QR Code
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-4">
              <QRCodeSVG
                value={`${window.location.origin}/room/${roomId}`}
                size={256}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Room ID: {roomId}
            </p>
            <button
              onClick={() => setShowQR(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
