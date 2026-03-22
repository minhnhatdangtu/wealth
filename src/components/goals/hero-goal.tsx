'use client';

import { useGoals } from '@/store/GoalContext';
import { usePortfolio } from '@/store/PortfolioContext';
import * as LucideIcons from 'lucide-react';
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { getGoalStatus, formatGoalDeadline } from '@/utils/goal-utils';

export function HeroGoal() {
  const { goals, deleteGoal } = useGoals();
  const { assets } = usePortfolio();
  const heroGoal = goals.find(g => g.isHero);

  if (!heroGoal) return null;

  // Calculate current amount from assets
  const currentAmount = assets.filter(a => a.goalId === heroGoal.id).reduce((sum, a) => sum + a.value, 0);
  const progressPercent = Math.min(100, (currentAmount / heroGoal.targetAmount) * 100);

  // Typecasting to access Lucide icons dynamically
  const IconComponent = (LucideIcons as any)[heroGoal.iconName] || LucideIcons.Home;
  
  const formatVND = (value: number) => new Intl.NumberFormat('vi-VN').format(value);

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  
  // Calculate total current amount for all goals
  const totalCurrent = goals.reduce((sum, g) => {
    const goalAssets = assets.filter(a => a.goalId === g.id);
    return sum + goalAssets.reduce((s, a) => s + a.value, 0);
  }, 0);

  const totalProgressPercent = totalTarget > 0 ? Math.min(100, (totalCurrent / totalTarget) * 100) : 0;
  const statusObj = getGoalStatus(currentAmount, heroGoal.targetAmount);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main Goal Card */}
      <div className="flex-1 bg-white rounded-[24px] p-8 lg:p-10 shadow-sm border border-gray-100 flex items-center relative group">
        
        {/* CRUD Hover Actions */}
        <div className="absolute top-6 right-6 flex items-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <button 
            onClick={() => {
              if(window.confirm('Bạn có chắc chắn muốn xóa mục tiêu này?')) {
                deleteGoal(heroGoal.id);
              }
            }}
            className="p-2.5 bg-white text-text-muted hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors shadow-sm ring-1 ring-gray-200/50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="w-full">
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 ${heroGoal.iconBgColor} rounded-2xl flex items-center justify-center ${heroGoal.iconTextColor}`}>
                <IconComponent className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-main pr-24">{heroGoal.name}</h2>
              </div>
            </div>
            
            <div className="text-right mt-2 md:mt-0 md:pr-16">
              <div className="flex flex-col items-end gap-1">
                <span className={`${statusObj.bg} ${statusObj.textCol} text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider uppercase mb-1`}>
                  {statusObj.text}
                </span>
                <p className="text-xs uppercase tracking-widest text-text-muted font-bold">Thời hạn mục tiêu</p>
                <p className="text-xl font-bold text-primary">{formatGoalDeadline(heroGoal.deadline)}</p>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex items-baseline gap-2">
              <h3 className="text-[40px] font-bold tracking-tight text-primary">{formatVND(heroGoal.targetAmount)}</h3>
              <span className="text-lg font-bold text-text-muted">VNĐ</span>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-3">
              <div>
                <p className="text-sm font-medium text-text-muted mb-1">Tiến độ hiện tại</p>
                <p className="text-2xl font-bold text-amber-600">{progressPercent.toFixed(1)}% <span className="text-lg text-text-main ml-1">Hoàn thành</span></p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-text-muted mb-1">Đã tích lũy</p>
                <p className="text-xl font-bold text-text-main">{formatVND(currentAmount)} VNĐ</p>
              </div>
            </div>
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${heroGoal.progressColor || 'bg-secondary'}`} style={{ width: `${progressPercent}%` }}>
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30 rounded-r-full"></div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href={`/goals/detail?id=${heroGoal.id}`} className="bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-8 rounded-xl transition-colors text-center inline-block">
              Xem chi tiết
            </Link>
            <Link href={`/goals/edit?id=${heroGoal.id}`} className="bg-gray-100 hover:bg-gray-200 text-text-main font-bold py-3.5 px-8 rounded-xl transition-colors text-center inline-block">
              Điều chỉnh chiến lược
            </Link>

          </div>
        </div>
      </div>

      {/* Side Insight Card */}
      <div className="w-full lg:w-80 bg-primary rounded-[24px] p-8 text-white flex flex-col justify-center items-center relative overflow-hidden shadow-lg">
        {/* Progress Ring */}
        <div className="relative w-48 h-48 mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <circle 
              cx="50" cy="50" r="40" fill="transparent" stroke="#FFB800" strokeWidth="8" 
              strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * totalProgressPercent) / 100} 
              strokeLinecap="round" className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[44px] font-bold leading-none mb-1">{totalProgressPercent.toFixed(0)}%</span>
            <span className="text-[10px] uppercase tracking-widest text-blue-200 font-bold whitespace-nowrap">Tổng mục tiêu</span>
          </div>
        </div>

        <div className="text-center relative z-10">
          <h4 className="text-lg font-bold mb-2">Sức khỏe tài chính</h4>
          <p className="text-sm text-blue-100/90 leading-relaxed px-2">
            Bạn đang đi đúng hướng để đạt được tất cả mục tiêu trước thời hạn.
          </p>
        </div>
      </div>
    </div>
  );
}
