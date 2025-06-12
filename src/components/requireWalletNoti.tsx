"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWeb3 } from "@/app/contexts/Web3Context";

export default function RequireWalletNoti({
    children,
}: {
    children: React.ReactNode;
}) {
    const { account } = useWeb3();
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        
        if (!account) {
            // Countdown timer
            const countdownTimer = setInterval(() => {
                if (!isMountedRef.current) {
                    clearInterval(countdownTimer);
                    return;
                }
                
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownTimer);
                        // Use setTimeout to avoid setState during render
                        setTimeout(() => {
                            if (isMountedRef.current) {
                                router.replace("/");
                            }
                        }, 0);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => {
                clearInterval(countdownTimer);
                isMountedRef.current = false;
            };
        }
        
        return () => {
            isMountedRef.current = false;
        };
    }, [account, router]);

    if (!account) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="max-w-md w-full mx-4">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className="mb-6">
                            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <svg
                                    className="w-8 h-8 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Wallet Required
                            </h2>
                            <p className="text-gray-600">
                                You need to connect your wallet to access this page.
                            </p>
                        </div>
                        
                        <button
                            onClick={() => router.replace("/")}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Back to Home Page to Login
                        </button>
                        
                        <p className="text-sm text-gray-500 mt-4">
                            Redirecting automatically in {countdown} second{countdown !== 1 ? 's' : ''}...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}