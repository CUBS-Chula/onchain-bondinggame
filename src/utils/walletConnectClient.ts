import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import QRCode from 'qrcode';

export const connectWithWalletConnect = async (): Promise<string> => {
  console.log('🔗 Starting WalletConnect connection...');
  
  // Create a new WalletConnect instance with additional options
  const connector = new WalletConnect({
    bridge: 'https://bridge.walletconnect.org',
    qrcodeModal: QRCodeModal,
    clientMeta: {
      description: 'Rock Paper Scissor Game',
      url: window.location.origin,
      icons: ['https://walletconnect.org/walletconnect-logo.png'],
      name: 'Rock Paper Scissor'
    }
  });

  console.log('📱 WalletConnect instance created:', {
    connected: connector.connected,
    chainId: connector.chainId,
    accounts: connector.accounts,
    bridge: connector.bridge,
    uri: connector.uri
  });

    // Check if connection is already established
  if (!connector.connected) {
    console.log('🆕 Creating new session...');
    try {
      await connector.createSession();
      console.log('✅ Session created successfully');
      console.log('🔗 WalletConnect URI:', connector.uri);
      console.log('📱 QR Code should be displayed now');
      
      // Also generate custom QR code as backup
      if (connector.uri) {
        try {
          const qrCodeDataURL = await QRCode.toDataURL(connector.uri, {
            width: 256,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          console.log('🎯 Custom QR Code generated successfully');
          
          // Try to display it in the custom container after a short delay
          setTimeout(() => {
            const qrContainer = document.getElementById('walletconnect-qrcode');
            if (qrContainer) {
              qrContainer.innerHTML = `<img src="${qrCodeDataURL}" alt="WalletConnect QR Code" style="width: 100%; height: 100%; object-fit: contain;" />`;
              console.log('🖼️ Custom QR code displayed in container');
            }
          }, 1000);
        } catch (qrError) {
          console.error('❌ Failed to generate custom QR code:', qrError);
        }
      }
    } catch (error) {
      console.error('❌ Failed to create session:', error);
      throw error;
    }
  } else {
    console.log('♻️ Using existing connection');
  }

  return new Promise((resolve, reject) => {
    // Add timeout to prevent hanging
    const timeout = setTimeout(() => {
      console.log('⏰ Connection timeout after 60 seconds');
      reject(new Error('Connection timeout'));
    }, 60000);

    // Subscribe to connection events
    connector.on('connect', (error, payload) => {
      clearTimeout(timeout);
      
      console.log('🎯 Connect event triggered:', { error, payload });
      
      if (error) {
        console.error('❌ Connection error:', error);
        reject(error);
        return;
      }

      // Get connected accounts
      const { accounts, chainId } = payload.params[0];
      console.log('✅ Successfully connected:', {
        accounts,
        chainId,
        firstAccount: accounts[0]
      });
      
      resolve(accounts[0]);
    });

    // Subscribe to disconnect events
    connector.on('disconnect', (error) => {
      clearTimeout(timeout);
      
      if (error) {
        console.error('❌ WalletConnect disconnect error:', error);
      }
      console.log('🔌 Disconnected from WalletConnect');
    });

    // Handle session update
    connector.on('session_update', (error, payload) => {
      if (error) {
        console.error('❌ Session update error:', error);
        return;
      }
      console.log('🔄 Session updated:', payload);
    });

    // Log QR code modal events
    connector.on('modal_closed', () => {
      clearTimeout(timeout);
      console.log('❌ QR Modal was closed by user');
      reject(new Error('User closed QR modal'));
    });

    // Additional debugging events
    connector.on('session_request', (error, payload) => {
      console.log('📋 Session request:', { error, payload });
    });

    connector.on('call_request', (error, payload) => {
      console.log('📞 Call request:', { error, payload });
    });

    // Log when URI is generated (for QR code)
    if (connector.uri) {
      console.log('🔗 WalletConnect URI generated:', connector.uri);
      console.log('📱 You should see a QR code modal now. Scan it with MetaMask mobile app.');
      
      // For debugging: display the URI as text too
      console.log('🔧 DEBUG: Manual connection URI (copy this to MetaMask if QR doesn\'t work):');
      console.log(connector.uri);
      
      // Try to update the page with connection info
      const qrContainer = document.getElementById('walletconnect-qrcode');
      if (qrContainer && !qrContainer.innerHTML.includes('img')) {
        qrContainer.innerHTML += `
          <div style="margin-top: 10px; font-size: 12px; color: #666; word-break: break-all;">
            <p><strong>Debug URI:</strong></p>
            <p style="font-family: monospace; background: #f5f5f5; padding: 5px; border-radius: 3px;">
              ${connector.uri}
            </p>
            <p><em>Copy this URI and paste it into MetaMask mobile app manually if QR scan doesn't work</em></p>
          </div>
        `;
      }
    }

    console.log('👂 Event listeners attached, waiting for user action...');
    console.log('📖 Instructions:');
    console.log('  1. Open MetaMask mobile app');
    console.log('  2. Tap the scan QR code button (or use "Connect to a dApp" option)');
    console.log('  3. Scan the QR code that should appear');
    console.log('  4. If QR scan doesn\'t work, copy the URI from console and paste it in MetaMask');
    console.log('  5. Approve the connection in MetaMask');
  });
};