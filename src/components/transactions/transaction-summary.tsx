'use client';

import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useTransactions, parseTxDate } from '@/store/TransactionContext';
import { formatCurrency } from '@/utils/format-utils';

export function TransactionSummary() {
  const { transactions, dateRange } = useTransactions();

  // Filter and Calculate
  const start = new Date(dateRange.start);
  start.setHours(0, 0, 0, 0);
  const end = new Date(dateRange.end);
  end.setHours(23, 59, 59, 999);

  const rangeDiff = end.getTime() - start.getTime() + 1;
  const prevStart = new Date(start.getTime() - rangeDiff);
  const prevEnd = new Date(end.getTime() - rangeDiff);

  let inTotal = 0, outTotal = 0, invTotal = 0;
  let inTotalPrev = 0, outTotalPrev = 0, invTotalPrev = 0;

  transactions.forEach(tx => {
    const txDate = parseTxDate(tx.date);
    const val = parseInt(tx.amount.replace(/[^0-9]/g, ''), 10) || 0;
    
    if (txDate >= start && txDate <= end) {
      if (tx.type === 'income') inTotal += val;
      else if (tx.type === 'expense') outTotal += val;
      else if (tx.type === 'investment') invTotal += val;
    } else if (txDate >= prevStart && txDate <= prevEnd) {
      if (tx.type === 'income') inTotalPrev += val;
      else if (tx.type === 'expense') outTotalPrev += val;
      else if (tx.type === 'investment') invTotalPrev += val;
    }
  });

  const available = Math.max(0, inTotal - outTotal - invTotal);

  const formatVND = (num: number) => formatCurrency(num);

  const getPercentageString = (current: number, prev: number) => {
    if (prev === 0) return current > 0 ? '+100.0%' : '0.0%';
    const pct = ((current - prev) / prev) * 100;
    return (pct > 0 ? '+' : '') + pct.toFixed(1) + '%';
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6">
      {/* Income: Dark Blue */}
      <div className="bg-primary rounded-[24px] p-6 lg:p-8 text-white relative overflow-hidden shadow-sm flex flex-col justify-between">
        <p className="text-blue-200 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4">TỔNG THU NHẬP</p>
        <div className="flex items-baseline gap-2 mb-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{formatVND(inTotal)}</h2>
          <span className="text-sm md:text-lg text-blue-200 font-medium">VNĐ</span>
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-blue-200">
          {inTotal >= inTotalPrev ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{getPercentageString(inTotal, inTotalPrev)} so với kì trước</span>
        </div>
      </div>

      {/* Expenses: Light Red/Rose */}
      <div className="bg-rose-50 rounded-[24px] p-6 lg:p-8 relative overflow-hidden flex flex-col justify-between border border-rose-100/50">
        <p className="text-rose-600 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4">TỔNG CHI TIÊU</p>
        <div className="flex items-baseline gap-2 mb-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-rose-700">{formatVND(outTotal)}</h2>
          <span className="text-sm md:text-lg text-rose-600 font-medium">VNĐ</span>
        </div>
        <div className={`flex items-center gap-2 text-xs md:text-sm font-medium ${outTotal >= outTotalPrev ? 'text-rose-600' : 'text-emerald-600'}`}>
          {outTotal >= outTotalPrev ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{getPercentageString(outTotal, outTotalPrev)} so với kì trước</span>
        </div>
      </div>

      {/* Investment: Light Yellow/Amber */}
      <div className="bg-amber-50 rounded-[24px] p-6 lg:p-8 relative overflow-hidden flex flex-col justify-between border border-amber-100/50">
        <p className="text-amber-700 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4">TỔNG ĐẦU TƯ</p>
        <div className="flex items-baseline gap-2 mb-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-amber-800">{formatVND(invTotal)}</h2>
          <span className="text-sm md:text-lg text-amber-700 font-medium">VNĐ</span>
        </div>
        <div className={`flex items-center gap-2 text-xs md:text-sm font-medium ${invTotal >= invTotalPrev ? 'text-amber-700 font-bold' : 'text-rose-600'}`}>
          {invTotal >= invTotalPrev ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{getPercentageString(invTotal, invTotalPrev)} so với kì trước</span>
        </div>
      </div>

      {/* Available Balance: Light Green/Emerald */}
      <div className="bg-emerald-50 rounded-[24px] p-6 lg:p-8 relative overflow-hidden flex flex-col justify-between border border-emerald-100/50">
        <p className="text-emerald-700 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4">SỐ DƯ KHẢ DỤNG</p>
        <div className="flex items-baseline gap-2 mb-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-emerald-800">{formatVND(available)}</h2>
          <span className="text-sm md:text-lg text-emerald-700 font-medium">VNĐ</span>
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-emerald-700">
          <Wallet className="w-4 h-4" />
          <span>Sẵn sàng tái đầu tư</span>
        </div>
      </div>
    </div>
  );
}
