import { useState } from 'react';
import { paymanService } from '../lib/payman';

export function TestReceipt() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTestReceipt = async () => {
    setLoading(true);
    try {
      const response = await paymanService.validateAndProcessReceipt(
        5, // amount
        'Lunch expense', // description
        'alice@example.com', // employee email
        'Alice' // employee name
      );
      setResult(response);
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Test Receipt Processing</h2>
      <button
        onClick={handleTestReceipt}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : 'Process $5 Lunch Receipt'}
      </button>
      
      {result && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="font-bold">Result:</h3>
          <pre className="mt-2 whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 