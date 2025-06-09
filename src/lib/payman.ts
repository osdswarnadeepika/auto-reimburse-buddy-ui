import { PaymanClient, FormattedTaskResponse } from '@paymanai/payman-ts';

interface Wallet {
  currency: string;
  balance: number;
}

interface Transaction {
  id: string;
  status: string;
  amount: number;
  currency: string;
}

interface TransactionArtifact {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

interface TransactionStatusArtifact {
  status: string;
  details?: string;
}

// Initialize Payman client with client credentials
const client = PaymanClient.withCredentials({
  clientId: import.meta.env.VITE_PAYMAN_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_PAYMAN_CLIENT_SECRET || '',

});

console.log(import.meta.env.VITE_PAYMAN_CLIENT_ID, import.meta.env.VITE_PAYMAN_CLIENT_SECRET);  
console.log(client);

export interface ReceiptValidationResult {
  status: 'reimbursed' | 'requires_approval' | 'invalid_receipt';
  message: string;
  amount?: number;
  transactionId?: string;
}

export class PaymanService {
  private static instance: PaymanService;
  private client: PaymanClient;

  private constructor() {
    this.client = client;
  }

  public static getInstance(): PaymanService {
    if (!PaymanService.instance) {
      PaymanService.instance = new PaymanService();
    }
    return PaymanService.instance;
  }

  async createPayee(email: string, name: string): Promise<void> {
    try {
      const response = await this.client.ask(`create a new payee named ${name} with email ${email}`);
      if (response.status === 'failed') {
        throw new Error(response.error?.message || 'Failed to create payee');
      }
      console.log(`Created payee: ${name} (${email})`);
    } catch (error) {
      console.error('Error creating payee:', error);
      throw error;
    }
  }

  async getTSDWallet(): Promise<FormattedTaskResponse> {
    try {
      const response = await this.client.ask('list all wallets');
      if (response.status === 'failed') {
        throw new Error(response.error?.message || 'Failed to get wallets');
      }
      return response;
    } catch (error) {
      console.error('Error getting TSD wallet:', error);
      throw error;
    }
  }

  async validateAndProcessReceipt(
    amount: number,
    description: string,
    employeeEmail: string,
    employeeName: string
  ): Promise<ReceiptValidationResult> {
    try {
      // Check if payee exists, create if not
      try {
        const payeeResponse = await this.client.ask(`get payee with email ${employeeEmail}`);
        if (payeeResponse.status === 'failed') {
          await this.createPayee(employeeEmail, employeeName);
        }
        console.log(`Payee exists: ${employeeEmail}`);
      } catch {
        await this.createPayee(employeeEmail, employeeName);
      }

      // Get TSD wallet and check balance (optional, Payman will reject if insufficient)
      const walletResponse = await this.getTSDWallet();
      console.log('Wallet Response:', walletResponse);

      // Auto-approve and process if amount is within allocated funds (e.g., $100)
      const autoApprovalLimit = 100; // Assuming $100 is the auto-approval limit
      if (amount > autoApprovalLimit) {
        return {
          status: 'requires_approval',
          message: `Amount $${amount} exceeds auto-approval limit of $${autoApprovalLimit}. Requires manual approval.`, 
          amount,
        };
      }

      // Process the reimbursement using TSD
      const transactionResponse = await this.client.ask(
        `send $${amount} TSD to ${employeeEmail} for ${description}`
      );
      console.log('Transaction Response:', transactionResponse);

      if (transactionResponse.status === 'failed') {
        throw new Error(transactionResponse.error?.message || 'Failed to process transaction');
      }

      // Extract transaction ID from response artifacts
      const transactionArtifact = transactionResponse.artifacts?.find(
        artifact => artifact.type === 'transaction'
      );
      const transactionData = transactionArtifact?.content as unknown as TransactionArtifact | undefined;
      const transactionId = transactionData?.id || 'unknown';

      return {
        status: 'reimbursed',
        message: 'Reimbursement processed successfully',
        amount,
        transactionId,
      };
    } catch (error) {
      console.error('Error processing receipt:', error);
      return {
        status: 'invalid_receipt',
        message: error instanceof Error ? error.message : 'Failed to process receipt',
      };
    }
  }

  async getTransactionStatus(transactionId: string): Promise<string> {
    try {
      const response = await this.client.ask(`get transaction status for ${transactionId}`);
      if (response.status === 'failed') {
        throw new Error(response.error?.message || 'Failed to get transaction status');
      }
      const statusArtifact = response.artifacts?.find(
        artifact => artifact.type === 'transaction_status'
      );
      const statusData = statusArtifact?.content as unknown as TransactionStatusArtifact | undefined;
      return statusData?.status || 'unknown';
    } catch (error) {
      console.error('Error getting transaction status:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.ask('test connection');
      console.log('Test Connection Response:', response);
      return response.status === 'completed';
    } catch (error) {
      console.error('Error testing connection:', error);
      return false;
    }
  }
}

export const paymanService = PaymanService.getInstance(); 