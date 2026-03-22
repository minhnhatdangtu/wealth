'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Pencil, ArrowDown, ArrowUp } from 'lucide-react';
import { clsx } from 'clsx';
import Link from 'next/link';
import { useTransactions, parseTxDate } from '@/store/TransactionContext';

export function TransactionHistoryTable() {
  const { 
    transactions, dateRange,
    filterType, filterCategory, filterStatus, filterSearch,
    sortConfig, setSortConfig
  } = useTransactions();

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  const start = new Date(dateRange.start);
  start.setHours(0, 0, 0, 0);
  const end = new Date(dateRange.end);
  end.setHours(23, 59, 59, 999);

  const filteredTransactions = transactions.filter(tx => {
    const txDate = parseTxDate(tx.date);
    if (txDate < start || txDate > end) return false;

    if (filterType !== 'Tất cả') {
      const isIncome = tx.type === 'income';
      const isExpense = tx.type === 'expense';
      const isInvestment = tx.type === 'investment';
      if (filterType === 'Thu nhập' && !isIncome) return false;
      if (filterType === 'Chi tiêu' && !isExpense) return false;
      if (filterType === 'Đầu tư' && !isInvestment) return false;
    }

    if (filterCategory !== 'Tất cả danh mục') {
      const cat = tx.subtitle.split(' • ')[0];
      if (cat !== filterCategory) return false;
    }

    if (filterStatus !== 'Tất cả trạng thái') {
      if (tx.status !== filterStatus) return false;
    }

    if (filterSearch.trim()) {
      const search = filterSearch.toLowerCase();
      if (!tx.title.toLowerCase().includes(search) && !tx.subtitle.toLowerCase().includes(search)) {
        return false;
      }
    }

    return true;
  });

  if (sortConfig.key) {
    filteredTransactions.sort((a, b) => {
      let aVal: number = 0;
      let bVal: number = 0;

      if (sortConfig.key === 'date') {
        aVal = parseTxDate(a.date).getTime();
        bVal = parseTxDate(b.date).getTime();
      } else if (sortConfig.key === 'amount') {
        aVal = parseInt(a.amount.replace(/[^0-9]/g, ''), 10) * (a.amount.startsWith('-') ? -1 : 1);
        bVal = parseInt(b.amount.replace(/[^0-9]/g, ''), 10) * (b.amount.startsWith('-') ? -1 : 1);
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const handleSort = (key: 'date' | 'amount') => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (columnKey: 'date' | 'amount') => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4 inline-block ml-1 opacity-50" /> : <ArrowDown className="w-4 h-4 inline-block ml-1 opacity-50" />;
  };

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE));
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-primary">Danh sách giao dịch</h3>
        {/* Helper layout spacing where icons used to be */}
        <div className="h-9 w-9"></div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left align-middle border-t border-gray-100">
          <thead className="text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-gray-100">
            <tr>
              <th className="px-4 py-4 w-40 cursor-pointer hover:bg-gray-50/50 transition-colors select-none group" onClick={() => handleSort('date')}>
                <div className="flex items-center">
                  NGÀY GIAO DỊCH {renderSortIcon('date')}
                </div>
              </th>
              <th className="px-4 py-4 text-left">NỘI DUNG & DANH MỤC</th>
              <th className="px-4 py-4 text-center w-36">TRẠNG THÁI</th>
              <th className="px-4 py-4 w-48 cursor-pointer hover:bg-gray-50/50 transition-colors select-none group" onClick={() => handleSort('amount')}>
                <div className="flex items-center justify-end pr-8">
                  SỐ TIỀN (VNĐ) {renderSortIcon('amount')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginatedTransactions.map((tx) => {
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
                  <td className={clsx('px-4 py-6 text-right font-bold text-lg relative', rowAmountColor)}>
                    <span className="pr-8 block">{tx.amount}</span>
                    <Link 
                      href={`/transactions/edit?id=${tx.id}`} 
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg flex-shrink-0"
                      title="Chỉnh sửa giao dịch"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredTransactions.length === 0 && (
          <div className="py-16 text-center border-t border-gray-100">
            <p className="text-text-muted text-sm font-medium">Không tìm thấy giao dịch nào phù hợp với bộ lọc.</p>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between mt-8 border-t border-gray-100 pt-6">
        <p className="text-xs font-medium text-text-muted">
          Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} trong tổng số {filteredTransactions.length} giao dịch
        </p>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-text-muted hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-bold transition-colors shadow-sm">
            {currentPage}
          </button>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-text-main hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
