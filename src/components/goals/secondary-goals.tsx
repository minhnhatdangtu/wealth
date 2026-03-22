'use client';

import { useGoals } from '@/store/GoalContext';
import { usePortfolio } from '@/store/PortfolioContext';
import * as LucideIcons from 'lucide-react';
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { getGoalStatus, formatGoalDeadline } from '@/utils/goal-utils';

export function SecondaryGoals() {
  const { goals, deleteGoal } = useGoals();
  const { assets } = usePortfolio();
  const secondaryGoals = goals.filter(g => !g.isHero);

  const formatVNDText = (value: number) => {
    if (value >= 1000000000) { // Billions
      return (value / 1000000000).toFixed(1).replace(/\.0$/, '') + ' tỷ';
    }
    return (value / 1000000).toFixed(0) + ' tr';
  };

  if (secondaryGoals.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {secondaryGoals.map((goal) => {
        const IconComponent = (LucideIcons as any)[goal.iconName] || LucideIcons.Target;
        const currentAmount = assets.filter(a => a.goalId === goal.id).reduce((sum, a) => sum + a.value, 0);
        const progressPercent = Math.min(100, (currentAmount / goal.targetAmount) * 100);
        const statusObj = getGoalStatus(currentAmount, goal.targetAmount);

        return (
          <div key={goal.id} className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 flex flex-col h-full relative group transition-all hover:shadow-md hover:-translate-y-1">
            
            {/* CRUD Hover Actions */}
            <div className="absolute top-6 right-6 flex items-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <button 
                onClick={() => {
                  if(window.confirm('Bạn có chắc chắn muốn xóa mục tiêu này?')) {
                    deleteGoal(goal.id);
                  }
                }}
                className="p-2.5 bg-white text-text-muted hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors shadow-sm ring-1 ring-gray-200/50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`w-12 h-12 ${goal.iconBgColor} rounded-xl flex items-center justify-center ${goal.iconTextColor} shadow-sm relative z-10`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <span className={`${statusObj.bg} ${statusObj.textCol} text-[10px] font-bold px-3 py-1.5 rounded-md tracking-wider uppercase transition-opacity duration-300 group-hover:opacity-0`}>
                {statusObj.text}
              </span>
            </div>

            <h3 className="text-xl font-bold text-text-main mb-1">{goal.name}</h3>
            <p className="text-sm text-text-muted mb-8">{goal.description}</p>

            <div className="mt-auto relative">
              <div className="flex justify-between items-end mb-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">{formatVNDText(currentAmount)}</span>
                  <span className="text-sm font-medium text-text-muted">/ {formatVNDText(goal.targetAmount)}</span>
                </div>
                <span className="text-lg font-bold text-amber-600">{progressPercent.toFixed(1)}%</span>
              </div>

              <div className="relative mb-8">
                <div className={`w-full h-3 ${goal.trackColor || 'bg-gray-100'} rounded-full overflow-hidden`}>
                  <div className={`h-full ${goal.progressColor || 'bg-primary'} rounded-full relative`} style={{ width: `${progressPercent}%` }}></div>
                </div>
                {progressPercent === 100 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-md ring-2 ring-white">
                    <LucideIcons.PiggyBank className="w-5 h-5 text-amber-950" />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2.5 mt-2">
                <Link href={`/goals/${goal.id}`} className="w-full text-center bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-colors">
                  Xem chi tiết
                </Link>
                <Link href={`/goals/${goal.id}/edit`} className="w-full text-center bg-gray-100 hover:bg-gray-200 text-text-main font-bold py-3.5 rounded-xl transition-colors">
                  Điều chỉnh chiến lược
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
