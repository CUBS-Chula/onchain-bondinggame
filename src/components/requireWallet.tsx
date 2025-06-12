"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWeb3 } from "@/app/contexts/Web3Context";

export default function RequireWallet({
  children,
}: {
  children: React.ReactNode;
}) {
  const { account } = useWeb3();
  const router = useRouter();

  useEffect(() => {
    if (!account) {
      router.replace("/");
    }
  }, [account, router]);

  return <>{account ? children : null}</>;
}
