import { paymanService } from './payman';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['VITE_PAYMAN_CLIENT_ID', 'VITE_PAYMAN_CLIENT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:');
  missingEnvVars.forEach(varName => console.error(`- ${varName}`));
  console.error('\nPlease create a .env file with these variables and try again.');
  process.exit(1);
}

async function testPaymanIntegration() {
  console.log('Starting Payman integration tests...\n');

  try {
    // Test 1: Connection Test
    console.log('Test 1: Testing Payman Connection');
    const isConnected = await paymanService.testConnection();
    console.log(`Connection test ${isConnected ? 'PASSED ✅' : 'FAILED ❌'}\n`);

    if (!isConnected) {
      console.error('Failed to connect to Payman. Please check your credentials.');
      return;
    }

    // Test 2: Create Payee
    console.log('Test 2: Creating Test Payee');
    const testEmail = 'test.employee@example.com';
    const testName = 'Test Employee';
    try {
      await paymanService.createPayee(testEmail, testName);
      console.log('Payee creation test PASSED ✅\n');
    } catch (error) {
      console.error('Payee creation test FAILED ❌:', error);
      return;
    }

    // Test 3: Get TSD Wallet
    console.log('Test 3: Getting TSD Wallet');
    try {
      const walletResponse = await paymanService.getTSDWallet();
      console.log('Wallet Response:', JSON.stringify(walletResponse, null, 2));
      console.log('TSD Wallet test PASSED ✅\n');
    } catch (error) {
      console.error('TSD Wallet test FAILED ❌:', error);
      return;
    }

    // Test 4: Process Small Reimbursement
    console.log('Test 4: Processing Small Reimbursement');
    try {
      const smallAmount = 50;
      const result = await paymanService.validateAndProcessReceipt(
        smallAmount,
        'Test lunch expense',
        testEmail,
        testName
      );
      console.log('Reimbursement Result:', JSON.stringify(result, null, 2));
      console.log('Small reimbursement test PASSED ✅\n');

      // Test 5: Check Transaction Status
      if (result.transactionId) {
        console.log('Test 5: Checking Transaction Status');
        const status = await paymanService.getTransactionStatus(result.transactionId);
        console.log('Transaction Status:', status);
        console.log('Transaction status test PASSED ✅\n');
      }
    } catch (error) {
      console.error('Reimbursement test FAILED ❌:', error);
      return;
    }

    // Test 6: Test Large Amount (should require approval)
    console.log('Test 6: Testing Large Amount Approval');
    try {
      const largeAmount = 1500;
      const result = await paymanService.validateAndProcessReceipt(
        largeAmount,
        'Test large expense',
        testEmail,
        testName
      );
      console.log('Large Amount Result:', JSON.stringify(result, null, 2));
      console.log('Large amount test PASSED ✅\n');
    } catch (error) {
      console.error('Large amount test FAILED ❌:', error);
      return;
    }

    console.log('All tests completed successfully! 🎉');
  } catch (error) {
    console.error('Test suite failed:', error);
  }
}

// Run the tests
testPaymanIntegration(); 