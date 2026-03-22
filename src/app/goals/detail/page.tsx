'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGoals } from '@/store/GoalContext';
import { useTransactions } from '@/store/TransactionContext';
import { usePortfolio } from '@/store/PortfolioContext';
import Link from 'next/link';
import { ArrowLeft, Target, Calendar, TrendingUp, Info, History } from 'lucide-react';
import { GoalHistoryTable } from '@/components/goals/goal-history-table';
import { getGoalStatus, formatGoalDeadline } from '@/utils/goal-utils';
import { formatCurrency, formatNumber } from '@/utils/format-utils';

function GoalDetailContent() {
  const searchParams = useSearchParams();
  const idStr = searchParams.get('id');
  const goalId = idStr ? parseInt(idStr) : null;
  
  const { goals, loading: loadingGoals } = useGoals();
  const { transactions } = useTransactions();
  const { assets } = usePortfolio();
  
  const goal = goals.find(g => g.id === goalId);

  if (loadingGoals) return <div className="p-8 text-center text-text-muted">Đang tải dữ liệu...</div>;
  if (!goal) return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold text-rose-500 mb-4">Không tìm thấy mục tiêu</h2>
      <Link href="/goals" className="text-primary hover:underline font-bold">Quay lại danh sách</Link>
    </div>
  );

  const formatVNDText = (num: number) => {
    if (num >= 1000000000) return formatNumber(num / 1000000000, 1) + ' tỷ';
    if (num >= 1000000) return formatNumber(num / 1000000, 1) + ' tr';
    return formatCurrency(num);
  };

  const currentAmount = assets.filter(a => a.goalId === goal.id).reduce((sum, a) => sum + a.value, 0);
  const currentProgress = (currentAmount / goal.targetAmount) * 100;
  const goalTransactions = transactions.filter(t => (t as any).goalId === goal.id);
  const statusObj = getGoalStatus(currentAmount, goal.targetAmount);

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-16">
      <Link href="/goals" className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-bold text-sm">
        <ArrowLeft className="w-4 h-4" />
        Quay lại danh sách mục tiêu
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-sm border border-border-subtle overflow-hidden">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
               <div className="flex items-center gap-5">
                 <div className="w-16 h-16 rounded-[24px] bg-primary/10 flex items-center justify-center text-primary shadow-sm ring-1 ring-primary/20">
                   <Target className="w-8 h-8" />
                 </div>
                 <div>
                   <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">{goal.name}</h1>
                   <div className="flex items-center gap-3 mt-1.5">
                     <span className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider ${statusObj.bg} ${statusObj.textCol} ring-1 ring-inset ring-black/5`}>
                       {statusObj.text}
                     </span>
                     <span className="text-text-muted text-xs font-bold border-l border-gray-100 pl-3">Mục tiêu tài chính</span>
                   </div>
                 </div>
               </div>
               <div className="flex items-center gap-3 bg-gray-50/80 p-2 rounded-2xl border border-gray-100/50">
                 <Link href={`/goals/edit?id=${goal.id}`}>
                   <button className="bg-white hover:bg-gray-50 text-text-main px-6 py-2.5 rounded-xl font-bold border border-gray-100 shadow-sm transition-all text-sm">Chỉnh sửa</button>
                 </Link>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
               <div className="bg-gray-50/50 border border-gray-100/80 rounded-2xl p-5">
                 <div className="flex items-center gap-2 text-text-muted mb-2 font-bold text-[11px] uppercase tracking-wider">
                   <TrendingUp className="w-4 h-4" />
                   Tiến độ (%)
                 </div>
                 <p className="text-3xl font-extrabold text-primary tracking-tighter">{currentProgress.toFixed(1)}%</p>
               </div>
               <div className="bg-gray-50/50 border border-gray-100/80 rounded-2xl p-5">
                 <div className="flex items-center gap-2 text-text-muted mb-2 font-bold text-[11px] uppercase tracking-wider">
                   <Target className="w-4 h-4" />
                   Đã tích lũy
                 </div>
                 <p className="text-3xl font-extrabold text-emerald-600 tracking-tighter">{formatVNDText(currentAmount)}</p>
               </div>
               <div className="bg-gray-100/30 border border-gray-100/50 rounded-2xl p-5 ring-1 ring-inset ring-gray-200/50">
                 <div className="flex items-center gap-2 text-text-muted mb-2 font-bold text-[11px] uppercase tracking-wider">
                   <Calendar className="w-4 h-4" />
                   Thời hạn
                 </div>
                 <p className="text-xl font-extrabold text-text-main tracking-tight mt-1 px-3 py-1 bg-white inline-block rounded-lg shadow-sm border border-gray-100">
                    {formatGoalDeadline(goal.deadline)}
                 </p>
               </div>
             </div>

             <div className="space-y-3">
               <div className="flex justify-between items-center px-1">
                 <span className="text-[13px] font-bold text-text-muted uppercase tracking-wider">Tiến trình đạt được</span>
                 <span className="text-sm font-extrabold text-primary">{currentProgress.toFixed(1)}% ({formatVNDText(currentAmount)} / {formatVNDText(goal.targetAmount)})</span>
               </div>
               <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden p-1 shadow-inner ring-1 ring-black/[0.03]">
                 <div 
                   className="h-full bg-gradient-to-r from-primary via-indigo-500 to-indigo-400 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-all duration-1000 ease-out"
                   style={{ width: `${Math.min(currentProgress, 100)}%` }}
                 />
               </div>
             </div>
           </div>

           <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-sm border border-border-subtle">
             <div className="flex items-center gap-3 mb-8">
               <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl shadow-sm ring-1 ring-indigo-200/50">
                 <History className="w-5 h-5" />
               </div>
               <h2 className="text-2xl font-extrabold text-primary tracking-tight">Lịch sử tích lũy</h2>
             </div>
             <GoalHistoryTable goalId={goal.id} />
           </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-primary to-indigo-700 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden ring-1 ring-white/20">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Target className="w-32 h-32 rotate-12" />
            </div>
            <div className="relative z-10">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 w-max mb-6 ring-1 ring-white/20">
                <Info className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">Cần tích lũy thêm</h3>
              <p className="text-4xl font-extrabold tracking-tighter mb-8 bg-clip-text text-white">
                {formatVNDText(Math.max(0, goal.targetAmount - currentAmount))}
              </p>
              <div className="pt-6 border-t border-white/10">
                <p className="text-[13px] font-medium text-blue-100 leading-relaxed">
                  Để đạt được mục tiêu vào tháng {formatGoalDeadline(goal.deadline)}, bạn cần duy trì kế hoạch đầu tư đều đặn hàng tháng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GoalDetailPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-text-muted">Đang chuẩn bị...</div>}>
      <GoalDetailContent />
    </Suspense>
  );
}
