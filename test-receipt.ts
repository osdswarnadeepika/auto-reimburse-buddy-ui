import { PaymanService } from './src/lib/payman';

async function testReceiptProcessing() {
  console.log('Testing receipt processing...');
  const paymanService = PaymanService.getInstance();

  try {
    // Test processing a $5 lunch receipt for Alice
    const result = await paymanService.validateAndProcessReceipt(
      5, // amount
      'Lunch expense', // description
      'alice@example.com', // employee email
      'Alice' // employee name
    );

    console.log('Receipt Processing Result:', JSON.stringify(result, null, 2));
    
    if (result.status === 'reimbursed') {
      console.log('✅ Successfully processed reimbursement!');
      console.log(`Transaction ID: ${result.transactionId}`);
    } else if (result.status === 'requires_approval') {
      console.log('⚠️ Reimbursement requires approval');
      console.log(`Reason: ${result.message}`);
    } else {
      console.log('❌ Failed to process reimbursement');
      console.log(`Error: ${result.message}`);
    }
  } catch (error: any) {
    console.error('❌ Error processing receipt:', error.message);
    if (error.response) {
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testReceiptProcessing(); 