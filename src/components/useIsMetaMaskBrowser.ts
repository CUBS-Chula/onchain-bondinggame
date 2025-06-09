import { useEffect, useState } from 'react';

/**
 * React hook to detect if the current browser is MetaMask mobile browser
 * @returns boolean indicating if the browser is MetaMask mobile browser
 */
export default function useIsMetaMaskBrowser(): boolean {
  const [isMetaMaskBrowser, setIsMetaMaskBrowser] = useState<boolean>(false);
  
  useEffect(() => {
    const detectMetaMaskBrowser = (): boolean => {
      const userAgent = navigator?.userAgent || '';
      
      // Check for MetaMask in user agent string
      // MetaMask mobile browser typically includes "MetaMask" in the user agent
      const isMetaMaskUserAgent = userAgent.includes('MetaMask');
      
      // Additional check for MetaMask's injected provider
      const hasMetaMaskProvider = typeof window !== 'undefined' && 
        window.ethereum && 
        window.ethereum.isMetaMask === true;
      
      // Check if it's specifically the MetaMask mobile browser
      // MetaMask mobile browser will have both the user agent string and the provider
      const isMetaMaskMobile = isMetaMaskUserAgent && hasMetaMaskProvider;
      
      return Boolean(isMetaMaskMobile);
    };

    const detected = detectMetaMaskBrowser();
    setIsMetaMaskBrowser(detected);
    
    // Debug logging
    console.log('🦊 MetaMask Browser Detection:', {
      userAgent: navigator?.userAgent,
      hasMetaMaskInUA: navigator?.userAgent?.includes('MetaMask'),
      hasEthereum: typeof window !== 'undefined' && !!window.ethereum,
      isMetaMask: typeof window !== 'undefined' && window.ethereum?.isMetaMask,
      finalDetection: detected
    });
  }, []);

  return isMetaMaskBrowser;
}
