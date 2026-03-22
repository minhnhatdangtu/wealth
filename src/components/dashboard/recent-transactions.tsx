'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import { useTransactions } from '@/store/TransactionContext';

export function RecentTransactions() {
  const { transactions } = useTransactions();
  const [activeFilter, setActiveFilter] = useState('Tất cả');

  const filteredTransactions = transactions.filter(tx => {
    if (activeFilter === 'Tất cả') return true;
    if (activeFilter === 'Thu nhập' && tx.type === 'income') return true;
    if (activeFilter === 'Chi tiêu' && tx.type === 'expense') return true;
    if (activeFilter === 'Đầu tư' && tx.type === 'investment') return true;
    return false;
  });

  const recentTransactions = filteredTransactions.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-8 border border-border-subtle shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-text-main">Dòng vốn Di chuyển Gần đây</h3>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {['Tất cả', 'Thu nhập', 'Chi tiêu', 'Đầu tư'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveFilter(t)}
              className={clsx(
                "px-4 py-1.5 text-xs font-medium rounded-md transition-colors",
                activeFilter === t 
                  ? "bg-primary text-white font-bold shadow-sm"
                  : "text-text-muted hover:text-text-main"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left align-middle border-t border-gray-100">
          <thead className="text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-gray-100">
            <tr>
              <th className="px-4 py-4 w-40 text-left">NGÀY GIAO DỊCH</th>
              <th className="px-4 py-4 text-left">NỘI DUNG & DANH MỤC</th>
              <th className="px-4 py-4 text-center w-36">TRẠNG THÁI</th>
              <th className="px-4 py-4 text-right w-48 pr-8">SỐ TIỀN (VNĐ)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentTransactions.map((tx) => {
              const Icon = tx.icon;
              const dateOnly = tx.date.split('\n')[0];

              let rowIconBg = 'bg-gray-100 text-gray-500';
              let rowAmountColor = 'text-gray-500';

              if (tx.type === 'income') {
                rowIconBg = 'bg-amber-100/50 text-amber-600 border-amber-50';
                rowAmountColor = 'text-amber-600';
              } else if (tx.type === 'expense') {
                rowIconBg = 'bg-rose-100/50 text-rose-600 border-rose-50';
                rowAmountColor = 'text-rose-600';
              } else if (tx.type === 'investment') {
                rowIconBg = 'bg-cyan-100/50 text-cyan-600 border-cyan-50';
                rowAmountColor = 'text-cyan-600';
              }

              return (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-4 py-6 text-sm text-text-muted font-medium">
                    {dateOnly}
                  </td>
                  <td className="px-4 py-6">
                    <div className="flex items-center gap-4">
                      <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border shadow-sm', rowIconBg)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-text-main text-base mb-1">{tx.title}</p>
                        <p className="text-xs text-text-muted">{tx.subtitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-6 text-center">
                    <span className={clsx('inline-flex justify-center px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest whitespace-nowrap !w-auto', tx.statusBg.replace('w-24', ''))}>
                      {tx.status}
                    </span>
                  </td>
                  <td className={clsx('px-4 py-6 text-right font-bold text-lg', rowAmountColor)}>
                    <span className="pr-8 block">{tx.amount}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {recentTransactions.length === 0 && (
          <div className="py-16 text-center border-t border-gray-100">
            <p className="text-text-muted text-sm font-medium">Không tìm thấy giao dịch nào phù hợp với bộ lọc.</p>
          </div>
        )}
      </div>
    </div>
  );
}
