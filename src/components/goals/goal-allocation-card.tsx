import { ExternalLink, PieChart } from 'lucide-react';
import { usePortfolio } from '@/store/PortfolioContext';
import { getCategoryColor } from '@/utils/goal-utils';

export function GoalAllocationCard({ goalId }: { goalId: number }) {
  const { assets } = usePortfolio();
  const linkedAssets = assets.filter(a => a.goalId === goalId);
  
  const totalValue = linkedAssets.reduce((sum, a) => sum + a.value, 0) || 1;

  const categories = linkedAssets.reduce((acc, asset) => {
    if (!acc[asset.type]) {
      const colors = getCategoryColor(asset.type);
      acc[asset.type] = { 
        value: 0, 
        colorHex: colors.hex, 
        twBg: colors.twBg,
        twText: colors.twText,
        twBgLight: colors.twBgLight
      };
    }
    acc[asset.type].value += asset.value;
    return acc;
  }, {} as Record<string, { value: number, colorHex: string, twBg: string, twText: string, twBgLight: string }>);

  const chartData = Object.entries(categories).map(([label, data]) => ({ label, ...data }));
  const isEmpty = linkedAssets.length === 0;

  let currentOffset = 0;

  const formatVND = (value: number) => {
    return (value / 1000000000).toFixed(1) + ' tỷ VNĐ';
  };

  return (
    <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow duration-500">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-gray-900 font-bold text-lg flex items-center gap-2">
          <PieChart className="w-5 h-5 text-primary" />
          Phân bổ nguồn vốn
        </h2>
      </div>

      <div className="relative mb-4 flex items-center justify-center py-4">
        {/* SVG Circular Donut Chart with Rounded Caps */}
        <div className="w-48 h-48 relative flex flex-col items-center justify-center shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 transform -rotate-90">
            {/* Background Track */}
            <circle cx="50" cy="50" r="42" fill="transparent" stroke="#f8fafc" strokeWidth="8" />
            
            {isEmpty ? (
              <circle cx="50" cy="50" r="42" fill="transparent" stroke="#f1f5f9" strokeWidth="8" strokeDasharray="263.8" />
            ) : chartData.map((slice, i) => {
              const percentage = slice.value / totalValue;
              const dashVal = percentage * 263.8;
              const GAP = chartData.length > 1 ? 4 : 0; 
              const segmentLength = Math.max(0, dashVal - GAP);
              const strokeDasharray = `${segmentLength} 263.8`;
              const strokeDashoffset = -currentOffset;
              currentOffset += dashVal;
              return (
                <circle 
                  key={i} 
                  cx="50" cy="50" r="42" 
                  fill="transparent" 
                  stroke={slice.colorHex} 
                  strokeWidth="10" 
                  strokeDasharray={strokeDasharray} 
                  strokeDashoffset={strokeDashoffset} 
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out cursor-pointer hover:stroke-[12px]"
                />
              );
            })}
          </svg>
          
          <div className="flex flex-col items-center justify-center z-10 bg-white/80 backdrop-blur-sm w-32 h-32 rounded-full shadow-inner">
            <span className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase mb-1">Tỷ trọng</span>
            <span className="text-3xl font-bold text-primary tabular-nums tracking-tighter">
              {isEmpty ? '0%' : '100%'}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full space-y-2 mt-auto">
        {isEmpty ? (
          <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
            <p className="text-xs text-gray-400 italic">Chưa có dữ liệu phân bổ cho mục tiêu này</p>
          </div>
        ) : chartData.map((slice, i) => (
          <div key={i} className="group flex justify-between items-center bg-gray-50/50 hover:bg-white px-4 py-3 rounded-2xl border border-transparent hover:border-gray-100 hover:shadow-sm transition-all duration-300">
            <div className="flex items-center gap-3">
              <span className={`w-3.5 h-3.5 rounded-full ${slice.twBg} shadow-sm group-hover:scale-110 transition-transform`}></span>
              <div className="flex flex-col">
                <span className="text-gray-900 text-sm font-bold">{slice.label}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-gray-900 text-sm block tabular-nums">{formatVND(slice.value)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
