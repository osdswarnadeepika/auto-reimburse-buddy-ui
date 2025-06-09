import { PaymanService } from './src/lib/payman';

async function testPaymanConnection() {
  console.log('Starting Payman API connection test...');
  const paymanService = PaymanService.getInstance();

  try {
    console.log('Attempting to list wallets...');
    const walletResponse = await paymanService.getTSDWallet();
    console.log('Successfully listed wallets:', JSON.stringify(walletResponse.artifacts, null, 2));
    console.log('Connection test SUCCESS ✅');
  } catch (error: any) {
    console.error('Connection test FAILED ❌');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    console.error('Please ensure your PAYMAN_CLIENT_ID and PAYMAN_CLIENT_SECRET in .env are correct and valid.');
  }
}

testPaymanConnection(); 