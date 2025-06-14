'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWeb3 } from '@/app/contexts/Web3Context'
import { cn } from '@/components/cn'

const blockchains = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: '₿', color: 'bg-orange-500' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'Ξ', color: 'bg-blue-500' },
  { id: 'binance', name: 'Binance Smart Chain', symbol: 'BNB', color: 'bg-yellow-500' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC', color: 'bg-purple-500' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', color: 'bg-green-500' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', color: 'bg-blue-700' },
  { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', color: 'bg-red-500' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', color: 'bg-pink-500' },
]

export default function RegisterPage() {
  const { account, connect, isConnecting, selectedWallet } = useWeb3()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const [nickname, setNickname] = useState('')
  const [selectedBlockchains, setSelectedBlockchains] = useState<string[]>([])
  const [profileImage, setProfileImage] = useState<string>('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<{ nickname?: string; blockchains?: string; image?: string; general?: string }>({})

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ ...errors, image: 'Image size must be less than 5MB' })
        return
      }
      
      // Clear any existing image error
      const { image, ...otherErrors } = errors
      setErrors(otherErrors)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors: { nickname?: string; blockchains?: string } = {}
    
    if (!nickname.trim()) {
      newErrors.nickname = 'Nickname is required'
    } else if (nickname.trim().length < 3) {
      newErrors.nickname = 'Nickname must be at least 3 characters'
    } else if (nickname.trim().length > 20) {
      newErrors.nickname = 'Nickname must be less than 20 characters'
    }
    
    if (selectedBlockchains.length === 0) {
      newErrors.blockchains = 'Please select at least one favorite blockchain'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return
    
    setIsSaving(true)
    
    try {
      // Simulate API call to save profile data
      const profileData = {
        wallet: account,
        nickname: nickname.trim(),
        favoriteBlockchains: selectedBlockchains,
        profileImage: profileImage,
        createdAt: new Date().toISOString()
      }
      
      // Save to localStorage (in real app, this would be an API call)
      localStorage.setItem('userProfile', JSON.stringify(profileData))
      
      // Wait a bit to show loading state
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Redirect to profile page
      router.push('/profile')
    } catch (error) {
      console.error('Failed to save profile:', error)
      setErrors({ ...errors, general: 'Failed to save profile. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  // If wallet is not connected, show wallet connection UI
  if (!account) {
    return (
      <div className={cn("min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4")}>
        <div className={cn("w-full max-w-md bg-white rounded-2xl shadow-xl p-8")}>
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔗</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h1>
            <p className="text-gray-600">Connect your wallet to create your profile and start trading</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => connect('metamask')}
              disabled={isConnecting}
              className={cn(
                "w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all duration-200",
                isConnecting && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-gray-700">MetaMask</span>
            </button>
            
            <button
              onClick={() => connect('coinbase')}
              disabled={isConnecting}
              className={cn(
                "w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200",
                isConnecting && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-semibold text-gray-700">Coinbase Wallet</span>
            </button>
            
            <button
              onClick={() => connect('walletconnect')}
              disabled={isConnecting}
              className={cn(
                "w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200",
                isConnecting && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="font-semibold text-gray-700">WalletConnect</span>
            </button>
          </div>
          
          {isConnecting && (
            <div className="text-center mt-4">
              <div className="inline-flex items-center gap-2 text-gray-600">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                Connecting...
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Connected wallet - show profile setup
  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100")}>
      <div className={cn("container mx-auto px-4 py-8 pb-32 max-w-md")}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Profile</h1>
          <p className="text-gray-600">Set up your trading profile to get started</p>
          <div className="mt-3 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm inline-block">
            ✓ Wallet Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </div>
        </div>

        <div className={cn("bg-white rounded-2xl shadow-xl p-6 mb-16")}>
          {/* Profile Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Profile Photo</label>
            <div className={cn("relative w-32 h-32 mx-auto")}>
              <div className={cn("w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center overflow-hidden")}>
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">👤</span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className={cn("absolute bottom-0 right-0 w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors")}
              >
                📷
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Nickname Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nickname</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your nickname"
              className={cn(
                "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                errors.nickname ? "border-red-500" : "border-gray-300"
              )}
            />
            {errors.nickname && (
              <p className="text-red-500 text-sm mt-1">{errors.nickname}</p>
            )}
          </div>

          {/* Favorite Blockchain Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Favorite Blockchains *</label>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 border rounded-xl bg-white hover:border-gray-400 transition-colors",
                  errors.blockchains ? "border-red-500" : "border-gray-300"
                )}
              >
                {selectedBlockchains.length > 0 ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedBlockchains.slice(0, 2).map(blockchainId => {
                      const blockchain = blockchains.find(b => b.id === blockchainId)
                      return (
                        <div key={blockchainId} className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1">
                          <div className={cn("w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold", blockchain?.color)}>
                            {blockchain?.symbol}
                          </div>
                          <span className="text-sm">{blockchain?.name}</span>
                        </div>
                      )
                    })}
                    {selectedBlockchains.length > 2 && (
                      <span className="text-sm text-gray-500">+{selectedBlockchains.length - 2} more</span>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-500">Select your favorite blockchains</span>
                )}
                <span className={cn("transition-transform", isDropdownOpen ? "rotate-180" : "")}>▼</span>
              </button>
              
              {errors.blockchains && (
                <p className="text-red-500 text-sm mt-1">{errors.blockchains}</p>
              )}
              
              {isDropdownOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}>
                  <div 
                    className="absolute bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                    style={{
                      top: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().bottom + window.scrollY + 4 : 0,
                      left: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().left + window.scrollX : 0,
                      width: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().width : 'auto'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {blockchains.map((blockchain, index) => {
                      const isSelected = selectedBlockchains.includes(blockchain.id)
                      const isFirst = index === 0
                      const isLast = index === blockchains.length - 1
                      return (
                        <button
                          key={blockchain.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedBlockchains(prev => prev.filter(id => id !== blockchain.id))
                            } else {
                              setSelectedBlockchains(prev => [...prev, blockchain.id])
                            }
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors",
                            isSelected && "bg-blue-50",
                            isFirst && "rounded-t-xl",
                            isLast && "rounded-b-xl"
                          )}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold", blockchain.color)}>
                              {blockchain.symbol}
                            </div>
                            <span className="text-left">{blockchain.name}</span>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Profile Preview */}
          <div className={cn("bg-gray-50 rounded-xl p-4 mb-6")}>
            <label className="block text-sm font-medium text-gray-700 mb-3">Preview</label>
            <div className="flex items-center gap-3">
              <div className={cn("w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center overflow-hidden")}>
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl">👤</span>
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">
                  {nickname || 'Your Nickname'}
                </div>
                <div className="text-sm text-gray-500">
                  {selectedBlockchains.length > 0 ? (
                    <div className="flex items-center gap-1 flex-wrap mt-1">
                      {selectedBlockchains.slice(0, 3).map(blockchainId => {
                        const blockchain = blockchains.find(b => b.id === blockchainId)
                        return (
                          <div key={blockchainId} className="flex items-center gap-1">
                            <div className={cn("w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold", blockchain?.color)}>
                              {blockchain?.symbol}
                            </div>
                            <span className="text-xs">{blockchain?.name}</span>
                          </div>
                        )
                      })}
                      {selectedBlockchains.length > 3 && (
                        <span className="text-xs text-gray-400">+{selectedBlockchains.length - 3} more</span>
                      )}
                    </div>
                  ) : (
                    'No blockchains selected'
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving || !nickname.trim() || selectedBlockchains.length === 0}
            className={cn(
              "w-full py-3 rounded-xl font-semibold transition-all duration-200",
              isSaving || !nickname.trim() || selectedBlockchains.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
            )}
          >
            {isSaving ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                Creating Profile...
              </div>
            ) : (
              'Create Profile'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
