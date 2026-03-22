'use client';

import { useTransactions } from '@/store/TransactionContext';
import { NewTransactionForm } from '@/components/transactions/new-transaction-form';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function EditTransactionPage() {
  const { id } = useParams();
  const { transactions } = useTransactions();
  const router = useRouter();
  
  const txId = parseInt(id as string, 10);
  const transaction = transactions.find(t => t.id === txId);

  useEffect(() => {
    if (!transaction) {
      router.push('/transactions');
    }
  }, [transaction, router]);

  if (!transaction) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <NewTransactionForm initialData={transaction} transactionId={txId} />
      
      {/* Footer text */}
      <div className="text-center mt-12 text-sm text-gray-400 font-medium">
        Legacy Wealth Private Tier Security • SSL Encrypted
      </div>
    </div>
  );
}
