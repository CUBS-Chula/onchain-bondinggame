import { useEffect, useState } from 'react';

// Debug toggle - set to true to enable console logging, false to disable
const DEBUG_IOS_DETECTION = true;

/**
 * React hook to detect if the current device is running iOS
 * @returns boolean indicating if the device is running iOS
 */
export default function useIsIOS(): boolean {
  const [isIOS, setIsIOS] = useState<boolean>(false);
  
  useEffect(() => {
    if (DEBUG_IOS_DETECTION) {
      console.log('🚀 useIsIOS hook starting - checking for iOS device...');
    }
    
    const isIOSDevice = () => {
      const platform = navigator?.platform || '';
      const userAgent = navigator?.userAgent || '';
      const iOSPlatforms = ['iPhone', 'iPad', 'iPod'];
      
      if (DEBUG_IOS_DETECTION) {
        console.log('🔍 Starting iOS detection with:', { platform, userAgent });
      }
      
      // Check for traditional iOS platforms
      if (iOSPlatforms.includes(platform)) {
        if (DEBUG_IOS_DETECTION) {
          console.log('📱 iOS Detection: Traditional iOS platform detected', { platform, detectedPlatform: platform });
        }
        return true;
      }
      
      // Check for iPadOS (reports as MacIntel but has touch support)
      if (platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
        if (DEBUG_IOS_DETECTION) {
          console.log('📱 iOS Detection: iPadOS detected (MacIntel with touch)', { 
            platform, 
            maxTouchPoints: navigator.maxTouchPoints 
          });
        }
        return true;
      }
      
      // Additional check for iPadOS using user agent
      if (userAgent.includes('iPad') || 
          (userAgent.includes('Mac') && 'ontouchend' in document)) {
        if (DEBUG_IOS_DETECTION) {
          const isIpadUA = userAgent.includes('iPad');
          const isMacWithTouch = userAgent.includes('Mac') && 'ontouchend' in document;
          console.log('📱 iOS Detection: iPadOS detected via user agent', { 
            userAgent,
            isIpadUA,
            isMacWithTouch,
            hasOntouchend: 'ontouchend' in document
          });
        }
        return true;
      }
      
      // Check for iOS Safari
      if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
        if (DEBUG_IOS_DETECTION) {
          console.log('📱 iOS Detection: iOS Safari detected via regex', { 
            userAgent,
            regexMatch: /iPad|iPhone|iPod/.test(userAgent),
            isNotMSStream: !(window as any).MSStream
          });
        }
        return true;
      }
      
      if (DEBUG_IOS_DETECTION) {
        console.log('📱 iOS Detection: No iOS detected', { platform, userAgent });
      }
      return false;
    };

    const detected = isIOSDevice();
    setIsIOS(detected);
    
    // Enhanced debug logging
    if (DEBUG_IOS_DETECTION) {
      console.log('🔍 iOS Detection Debug:', {
        platform: navigator?.platform,
        userAgent: navigator?.userAgent,
        maxTouchPoints: navigator?.maxTouchPoints,
        hasTouch: 'ontouchend' in document,
        isIOSUserAgent: /iPad|iPhone|iPod/.test(navigator?.userAgent || ''),
        isMacIntelWithTouch: navigator?.platform === 'MacIntel' && (navigator?.maxTouchPoints || 0) > 1,
        finalDetection: detected
      });
      
      console.log(`✅ useIsIOS hook completed - Final result: ${detected ? 'IS iOS' : 'NOT iOS'}`);
    }
  }, []);

  return isIOS;
}
