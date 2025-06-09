'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { ethers } from 'ethers'

// Extend the window.ethereum type
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      isCoinbaseWallet?: boolean
      isWalletConnect?: boolean
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (eventName: string, handler: (...args: any[]) => void) => void
      removeListener: (eventName: string, handler: (...args: any[]) => void) => void
    }
  }
}

interface Web3ContextType {
  account: string | null
  provider: ethers.BrowserProvider | null
  connect: (walletType: 'metamask' | 'coinbase' | 'walletconnect') => Promise<void>
  disconnect: () => void
  isConnecting: boolean
  selectedWallet: 'metamask' | 'coinbase' | 'walletconnect' | null
  setAccount: (account: string | null) => void
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  provider: null,
  connect: async () => {},
  disconnect: () => {},
  isConnecting: false,
  selectedWallet: null,
  setAccount: () => {},
})

export const useWeb3 = () => useContext(Web3Context)

interface Web3ProviderProps {
  children: ReactNode
}

export const Web3Provider = ({ children }: Web3ProviderProps) => {
  const [account, setAccount] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<'metamask' | 'coinbase' | 'walletconnect' | null>(null)

  const connect = async (walletType: 'metamask' | 'coinbase' | 'walletconnect') => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Please install a Web3 wallet to use this application')
      return
    }

    setIsConnecting(true)
    try {
      let provider: ethers.BrowserProvider

      switch (walletType) {
        case 'metamask':
          if (!window.ethereum.isMetaMask) {
            throw new Error('MetaMask not detected')
          }
          provider = new ethers.BrowserProvider(window.ethereum)
          break
        case 'coinbase':
          if (!window.ethereum.isCoinbaseWallet) {
            throw new Error('Coinbase Wallet not detected')
          }
          provider = new ethers.BrowserProvider(window.ethereum)
          break
        case 'walletconnect':
          if (!window.ethereum.isWalletConnect) {
            throw new Error('WalletConnect not detected')
          }
          provider = new ethers.BrowserProvider(window.ethereum)
          break
        default:
          throw new Error('Unsupported wallet type')
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setAccount(accounts[0])
      setProvider(provider)
      setSelectedWallet(walletType)

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null)
      })

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload()
      })
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      alert(error instanceof Error ? error.message : 'Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAccount(null)
    setProvider(null)
    setSelectedWallet(null)
  }

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (typeof window === 'undefined' || !window.ethereum) return

      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setProvider(provider)
          // Try to detect wallet type
          if (window.ethereum.isMetaMask) {
            setSelectedWallet('metamask')
          } else if (window.ethereum.isCoinbaseWallet) {
            setSelectedWallet('coinbase')
          } else if (window.ethereum.isWalletConnect) {
            setSelectedWallet('walletconnect')
          }
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error)
      }
    }

    checkConnection()
  }, [])

  return (
    <Web3Context.Provider value={{ account, provider, connect, disconnect, isConnecting, selectedWallet, setAccount }}>
      {children}
    </Web3Context.Provider>
  )
} 