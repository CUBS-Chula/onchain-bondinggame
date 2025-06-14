'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { ethers } from 'ethers'

// Define types for Ethereum provider events
type AccountsChangedHandler = (accounts: string[]) => void
type ChainChangedHandler = (chainId: string) => void
type ConnectHandler = (connectInfo: { chainId: string }) => void
type DisconnectHandler = (error: { code: number; message: string }) => void

type EthereumEventHandler = 
  | AccountsChangedHandler 
  | ChainChangedHandler 
  | ConnectHandler 
  | DisconnectHandler

// Define Ethereum RPC method types
interface EthereumRequestMap {
  'eth_requestAccounts': string[]
  'eth_accounts': string[]
  'eth_chainId': string
  'wallet_switchEthereumChain': null
  'wallet_addEthereumChain': null
}

// Extend the window.ethereum type
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      isCoinbaseWallet?: boolean
      isWalletConnect?: boolean
      request: <T extends keyof EthereumRequestMap>(args: {
        method: T
        params?: unknown[]
      }) => Promise<EthereumRequestMap[T]>
      on: (eventName: string, handler: EthereumEventHandler) => void
      removeListener: (eventName: string, handler: EthereumEventHandler) => void
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

  // Setup event listeners when provider is available
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return

    // Listen for account changes
    const handleAccountsChanged: AccountsChangedHandler = (accounts: string[]) => {
      setAccount(accounts[0] || null)
    }
    
    // Listen for chain changes
    const handleChainChanged: ChainChangedHandler = () => {
      window.location.reload()
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    // Cleanup function to remove listeners
    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum?.removeListener('chainChanged', handleChainChanged)
    }
  }, [])

  const connect = async (walletType: 'metamask' | 'coinbase' | 'walletconnect') => {
    if (typeof window === 'undefined' || !window.ethereum) {
      console.error('Web3 wallet not found')
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
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      // Error handling moved to component level
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