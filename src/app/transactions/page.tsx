import { Plus } from 'lucide-react';
import Link from 'next/link';
import { TransactionSummary } from '@/components/transactions/transaction-summary';
import { TransactionFilters } from '@/components/transactions/transaction-filters';
import { TransactionHistoryTable } from '@/components/transactions/transaction-history-table';

export default function TransactionsPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">Nhật ký Giao dịch</h1>
          <p className="text-text-muted text-sm max-w-2xl">
            Theo dõi và quản lý mọi dòng tiền lưu chuyển trong hệ sinh thái tài sản của gia đình.
          </p>
        </div>
        <Link href="/transactions/new" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md transition-transform hover:scale-105">
          <Plus className="w-5 h-5" />
          Thêm giao dịch mới
        </Link>
      </div>

      <TransactionSummary />
      
      <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
        <TransactionFilters />
        <TransactionHistoryTable />
      </div>
    </div>
  );
}
