import { NewTransactionForm } from '@/components/transactions/new-transaction-form';

export default function NewTransactionPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <NewTransactionForm />
      
      {/* Page bottom layout matching the mockup */}
      <div className="mt-12 text-center text-text-muted">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px bg-gray-200 w-16"></div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
            Legacy Wealth Private Tier Security
          </span>
          <div className="h-px bg-gray-200 w-16"></div>
        </div>
        <p className="text-[10px] text-gray-400">
          Bản quyền © 2024 Legacy Wealth. Tất cả quyền được bảo lưu.
        </p>
      </div>
    </div>
  );
}
