'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTransactions } from '@/store/TransactionContext';
import { NewTransactionForm } from '@/components/transactions/new-transaction-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

function TransactionEditContent() {
  const searchParams = useSearchParams();
  const idStr = searchParams.get('id');
  const txId = idStr ? parseInt(idStr) : null;
  
  const { transactions, loading } = useTransactions();
  const tx = transactions.find(t => t.id === txId);

  if (loading) return <div className="p-8 text-center text-text-muted">Đang tải dữ liệu...</div>;
  if (!tx) return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold text-rose-500 mb-4">Không tìm thấy giao dịch</h2>
      <Link href="/transactions" className="text-primary hover:underline font-bold">Quay lại danh sách</Link>
    </div>
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <Link href="/transactions" className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-bold text-sm">
        <ArrowLeft className="w-4 h-4" />
        Hủy và quay lại
      </Link>
      <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-sm border border-border-subtle overflow-hidden">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-8">Chỉnh sửa giao dịch</h1>
        <NewTransactionForm isEditMode initialData={tx} txId={tx.id} />
      </div>
    </div>
  );
}

export default function EditTransactionPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-text-muted">Đang chuẩn bị...</div>}>
      <TransactionEditContent />
    </Suspense>
  );
}
