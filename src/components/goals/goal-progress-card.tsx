'use client';

import { GoalType } from '@/store/GoalContext';
import { usePortfolio } from '@/store/PortfolioContext';
import { getGoalStatus, formatGoalDeadline } from '@/utils/goal-utils';

export function GoalProgressCard({ goal }: { goal: GoalType }) {
  const { assets } = usePortfolio();
  const currentAmount = assets.filter(a => a.goalId === goal.id).reduce((sum, a) => sum + a.value, 0);

  const currentPercent = goal.targetAmount > 0 ? (currentAmount / goal.targetAmount) * 100 : 0;
  
  const formatTy = (value: number) => {
    return (value / 1000000000).toFixed(1);
  };

  const remainingTy = Math.max(0, parseFloat(formatTy(goal.targetAmount - currentAmount)));

  const statusObj = getGoalStatus(currentAmount, goal.targetAmount);

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-primary">Tiến độ mục tiêu</h2>
        <span className={`${statusObj.bg} ${statusObj.textCol} text-xs font-bold px-3 py-1 rounded-md tracking-wide`}>
          {statusObj.text}
        </span>
      </div>

      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-sm text-text-muted mb-1">Tổng tài sản tích lũy</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">{formatTy(currentAmount)}</span>
            <span className="text-xl font-bold text-text-main">tỷ VNĐ</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-muted mb-1">Mục tiêu: {formatTy(goal.targetAmount)} tỷ VNĐ</p>
          <span className="text-3xl font-bold text-primary">{currentPercent.toFixed(0)}%</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full ${goal.progressColor || 'bg-primary'} rounded-full relative transition-all duration-1000`} style={{ width: `${currentPercent}%` }}></div>
        </div>
        <div className="flex justify-between text-xs text-text-muted mt-3 font-medium">
          <span>Khởi đầu ({new Date().getFullYear()})</span>
          <span>Cần thêm {remainingTy} tỷ VNĐ</span>
          <span>Hoàn tất ({formatGoalDeadline(goal.deadline)})</span>
        </div>
      </div>

    </div>
  );
}
