'use client';

import { usePortfolio } from '@/store/PortfolioContext';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/format-utils';

export function HeroStats() {
  const { assets } = usePortfolio();
  
  // Filter active assets
  const activeAssets = assets.filter(a => a.status === 'HOẠT ĐỘNG');
  
  const totalValue = activeAssets.reduce((sum, a) => sum + a.value, 0);
  const totalCost = activeAssets.reduce((sum, a) => sum + a.cost, 0);
  
  const plAbs = totalValue - totalCost;
  const plPct = totalCost > 0 ? (plAbs / totalCost) * 100 : 0;
  const isProfit = plAbs >= 0;

  // Generate dynamic chart data for the last 6 months
  const now = new Date();
  const chartData = [];
  
  for (let i = 5; i >= 0; i--) {
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    
    const monthValue = activeAssets.reduce((sum, a) => {
      // If no startDate, assume it was there from the beginning for tracking purposes
      if (!a.startDate) return sum + a.value; 
      const startDate = new Date(a.startDate);
      if (startDate <= lastDayOfMonth) {
         return sum + a.value;
      }
      return sum;
    }, 0);
    
    // Format Month (e.g., TH03)
    const monthStr = `TH${String(lastDayOfMonth.getMonth() + 1).padStart(2, '0')}`;
    chartData.push({
      name: monthStr,
      value: monthValue
    });
  }

  // Calculate YoY growth: Current vs 12 months ago
  // To avoid zero division if no assets existed 12 months ago, we default to 0%.
  const lastYearDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const lastYearValue = activeAssets.reduce((sum, a) => {
    if (!a.startDate) return sum + a.value;
    const startDate = new Date(a.startDate);
    if (startDate <= lastYearDate) return sum + a.value;
    return sum;
  }, 0);
  
  const growthRate = lastYearValue > 0 ? ((totalValue - lastYearValue) / lastYearValue) * 100 : 0;

  // Category sums
  const getCatValue = (types: string[]) => 
    activeAssets
      .filter(a => types.some(t => a.type.toLowerCase().includes(t)))
      .reduce((s, a) => s + a.value, 0);

  const tTietKiemQuy = getCatValue(['tiết kiệm']) + getCatValue(['quỹ đầu tư', 'quỹ tương hỗ']); // Excluding chứng chỉ quỹ from this category explicitly based on naming conventions
  const tDauTu = getCatValue(['chứng khoán', 'chứng chỉ quỹ']);
  const tBDS = getCatValue(['bất động sản']);
  const tVang = getCatValue(['vàng']);

  const fmtVND = (v: number) => formatCurrency(v);


  return (
    <div className="bg-[#121950] rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-primary/10">
      <div className="flex flex-col lg:flex-row justify-between relative z-10">
        <div className="max-w-xl">
          <p className="text-blue-200 text-xs font-bold tracking-widest uppercase mb-4">Tổng giá trị tài sản</p>
          <div className="flex items-baseline gap-3 mb-6">
            <h2 className="text-5xl font-bold tracking-tight">{fmtVND(totalValue)}</h2>
            <span className="text-xl text-blue-200 font-medium">VNĐ</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/5">
              {growthRate >= 0 ? <TrendingUp className="w-4 h-4 text-green-400" /> : <TrendingDown className="w-4 h-4 text-rose-400" />}
              <span className={`text-sm font-semibold ${growthRate >= 0 ? 'text-white' : 'text-rose-400'}`}>
                {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-lg border border-white/5">
              <span className="text-sm text-blue-200">{isProfit ? 'LÃI:' : 'LỖ:'}</span>
              <span className={`text-sm font-semibold ${isProfit ? 'text-green-400' : 'text-rose-400'}`}>
                {isProfit ? '+' : ''}{fmtVND(plAbs)} VNĐ
              </span>
              <span className={`text-xs ${isProfit ? 'text-green-400/80' : 'text-rose-400/80'}`}>
                ({isProfit ? '+' : ''}{plPct.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Small Line Chart */}
        <div className="w-full lg:w-96 h-32 mt-8 lg:mt-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#ffffff" 
                strokeWidth={2}
                dot={{ r: 3, fill: '#ffffff', strokeWidth: 2, stroke: '#121950' }}
                activeDot={{ r: 5 }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] text-blue-300 font-medium px-2">
            {chartData.map((d, i) => (
              <span key={i}>{d.name}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
        <div>
          <p className="text-blue-300 text-xs uppercase tracking-wider mb-2">Tiết kiệm & Quỹ</p>
          <p className="text-xl font-bold">{fmtVND(tTietKiemQuy)} <span className="text-xs text-blue-300 font-medium ml-1">VNĐ</span></p>
        </div>
        <div>
          <p className="text-blue-300 text-xs uppercase tracking-wider mb-2">Đầu tư tài chính</p>
          <p className="text-xl font-bold">{fmtVND(tDauTu)} <span className="text-xs text-blue-300 font-medium ml-1">VNĐ</span></p>
        </div>
        <div>
          <p className="text-blue-300 text-xs uppercase tracking-wider mb-2">Bất động sản</p>
          <p className="text-xl font-bold">{fmtVND(tBDS)} <span className="text-xs text-blue-300 font-medium ml-1">VNĐ</span></p>
        </div>
        <div>
          <p className="text-blue-300 text-xs uppercase tracking-wider mb-2">Vàng</p>
          <p className="text-xl font-bold">{fmtVND(tVang)} <span className="text-xs text-blue-300 font-medium ml-1">VNĐ</span></p>
        </div>
      </div>
    </div>
  );
}
