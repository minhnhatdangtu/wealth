'use client';

import { Lightbulb, BadgeCheck } from 'lucide-react';
import { useGoals } from '@/store/GoalContext';
import { usePortfolio } from '@/store/PortfolioContext';

export function HealthScore() {
  const { goals } = useGoals();
  const { assets } = usePortfolio();

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  
  // Calculate total current amount for all goals
  const totalCurrent = goals.reduce((sum, g) => {
    const goalAssets = assets.filter(a => a.goalId === g.id && a.status === 'HOẠT ĐỘNG');
    return sum + goalAssets.reduce((s, a) => s + a.value, 0);
  }, 0);

  const totalProgressPercent = totalTarget > 0 ? Math.min(100, (totalCurrent / totalTarget) * 100) : 0;

  // Determine insight text based on progress
  let healthText = "FAIR";
  let insightText = "Bạn đang có tiến độ ổn định. Hãy tiếp tục duy trì kế hoạch tiết kiệm và đầu tư hiện tại.";
  
  if (totalTarget === 0) {
    healthText = "NEW";
    insightText = "Bạn chưa thiết lập mục tiêu tài chính nào. Hãy thiết lập mục tiêu để có lộ trình rõ ràng.";
  } else if (totalProgressPercent >= 80) {
    healthText = "EXCELLENT";
    insightText = "Bạn đang đi đúng hướng để đạt được tất cả mục tiêu trước thời hạn. Có thể cân nhắc gia tăng mức đầu tư.";
  } else if (totalProgressPercent >= 50) {
    healthText = "GOOD";
    insightText = "Tiến độ đang bám sát kế hoạch. Hãy kiểm tra lại tỷ trọng phân bổ để tối ưu hóa lợi nhuận trong dài hạn.";
  } else if (totalProgressPercent < 20) {
    healthText = "FOCUS";
    insightText = "Tiến độ tích lũy mục tiêu đang ở mức khởi đầu. Nên xem xét gia tăng nguồn thu hoặc cắt giảm chi tiêu.";
  }

  return (
    <div className="bg-white rounded-2xl p-8 border border-border-subtle shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-text-main">Sức khỏe Tài chính</h3>
        <BadgeCheck className="w-6 h-6 text-[#996D12]" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Custom Donut Circle for Score */}
        <div className="relative w-48 h-48 mb-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#F3F4F6"
              strokeWidth="12"
            />
            {/* Progress track */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#996D12"
              strokeWidth="12"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * totalProgressPercent) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-primary">{totalProgressPercent.toFixed(0)}</span>
            <span className="text-[10px] font-bold text-text-muted tracking-widest mt-1 uppercase">{healthText}</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 w-full mt-auto">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-[#996D12]" />
            <span className="text-sm font-bold text-text-main">Lời khuyên chuyên gia</span>
          </div>
          <p className="text-sm text-text-muted leading-relaxed">
            {insightText}
          </p>
        </div>
      </div>
    </div>
  );
}
