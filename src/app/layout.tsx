import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { Web3Provider } from "./contexts/Web3Context";
export const metadata: Metadata = {
  title: "Onchain Bonding Game",
  description: "Onchain Bootcamp 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white flex justify-center">
        <Web3Provider>
          <div
            className="
            w-full h-screen bg-gray 
            md:h-[calc(100vh-1rem*2)] md:w-[390px] md:border-gray-700 md:rounded-xl md:shadow-xl 
            md:mt-4 md:overflow-hidden md:relative
          "
          >
            {children}
            <NavBar />
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}
