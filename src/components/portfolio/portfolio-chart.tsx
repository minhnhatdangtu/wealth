'use client';

import { TrendingUp, Activity, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, CartesianGrid, Tooltip } from 'recharts';
import { usePortfolio } from '@/store/PortfolioContext';
import { useMemo } from 'react';
import { formatCurrency } from '@/utils/format-utils';

const data = [
  { name: 'THÁNG 12', value: 34000 },
  { name: 'THÁNG 01', value: 35000 },
  { name: 'THÁNG 02', value: 36000 },
  { name: 'THÁNG 03', value: 38500 },
  { name: 'THÁNG 04', value: 40000 },
  { name: 'THÁNG 05', value: 42850 },
];

export function PortfolioChart() {
  const { assets } = usePortfolio();

  const metrics = useMemo(() => {
    const activeAssets = assets.filter(a => a.status === 'HOẠT ĐỘNG');
    const closedAssets = assets.filter(a => a.status === 'ĐÃ TẤT TOÁN');

    const activeCost = activeAssets.reduce((sum, a) => sum + a.cost, 0);
    const activeValue = activeAssets.reduce((sum, a) => sum + a.value, 0);
    const activePL = activeValue - activeCost;
    
    // Profit/Loss of already closed assets
    const closedPL = closedAssets.reduce((sum, a) => sum + (a.value - a.cost), 0);

    return { activeCost, activeValue, activePL, closedPL };
  }, [assets]);

  const formatVND = (num: number) => formatCurrency(num);

  const formatVNDSign = (num: number) => {
    if (num === 0) return '0';
    const s = formatCurrency(Math.abs(num));
    return num >= 0 ? `+${s}` : `-${s}`;
  };

  // Compute a simple percentage for the header
  const pct = metrics.activeCost > 0 ? ((metrics.activePL / metrics.activeCost) * 100).toFixed(1) : '0';

  return (
    <div className="bg-white rounded-[32px] p-6 md:p-8 lg:p-10 shadow-sm border border-border-subtle flex flex-col lg:flex-row gap-8 lg:gap-12 transition-all">
      {/* LEFT: Chart Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest font-bold text-text-muted mb-2">Tổng giá trị tài sản (Đang hoạt động)</p>
          <div className="flex items-center flex-wrap gap-4">
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-primary">
                {metrics.activeValue > 0 ? formatVND(metrics.activeValue) : '0'}
              </h2>
              <span className="text-xl font-bold tracking-tight text-text-muted">VNĐ</span>
            </div>
            {/* Tỷ lệ % tăng trưởng gắn liền mạch với con số Tổng gia sản */}
            <div className={`flex items-center gap-1.5 px-3 py-1 lg:py-1.5 rounded-xl border ${
              metrics.activePL >= 0 ? 'bg-emerald-50 border-emerald-100 shadow-sm shadow-emerald-100/50' : 'bg-rose-50 border-rose-100 shadow-sm shadow-rose-100/50'
            }`}>
              <TrendingUp className={`w-4 h-4 ${metrics.activePL >= 0 ? 'text-emerald-600' : 'text-rose-600'}`} />
              <span className={`text-sm font-bold ${metrics.activePL >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {metrics.activePL >= 0 ? '+' : ''}{pct}%
              </span>
            </div>
          </div>
        </div>

        <div className="h-[280px] w-full mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: '700' }} 
                dy={16} 
              />
              <Tooltip 
                cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                contentStyle={{ borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', fontWeight: 'bold', color: '#1e293b' }}
                formatter={(value: any) => [`${new Intl.NumberFormat('vi-VN').format(Number(value))}`, '']}
                labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#1e3a8a" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                isAnimationActive={true} 
                animationDuration={1000}
                activeDot={{ r: 6, fill: '#1e3a8a', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RIGHT: Metric Side-panel */}
      <div className="w-full lg:w-72 xl:w-80 flex flex-col gap-4 shrink-0">
        <div className="bg-gray-50/80 rounded-[24px] p-6 lg:p-8 border border-gray-100 flex-1 flex flex-col justify-center relative overflow-hidden group hover:border-gray-200 transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-gray-300"></div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-text-muted mb-3">Tổng giá vốn</p>
          <p className="text-2xl md:text-3xl font-extrabold text-text-main line-clamp-1" title={formatVND(metrics.activeCost)}>
            {metrics.activeCost > 0 ? formatVND(metrics.activeCost) : '0'}
          </p>
          <p className="text-[11px] font-bold text-gray-400 mt-2 uppercase tracking-wider">VNĐ (Đang hoạt động)</p>
        </div>

        <div className="bg-emerald-50/50 rounded-[24px] p-6 lg:p-8 border border-emerald-100/60 flex-1 flex flex-col justify-center relative overflow-hidden hover:border-emerald-200 transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-800/60 mb-3 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            Lãi/lỗ hiện tại
          </p>
          <p className={`text-2xl md:text-3xl font-extrabold line-clamp-1 ${metrics.activePL >= 0 ? 'text-emerald-600' : 'text-rose-600'}`} title={formatVNDSign(metrics.activePL)}>
            {formatVNDSign(metrics.activePL)}
          </p>
          <p className="text-[11px] font-bold opacity-60 mt-2 text-emerald-900 uppercase tracking-wider">VNĐ (Chưa chốt)</p>
        </div>

        <div className="bg-blue-50/40 rounded-[24px] p-6 lg:p-8 border border-blue-100/60 flex-1 flex flex-col justify-center relative overflow-hidden hover:border-blue-200 transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-blue-800/60 mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Lãi/lỗ đã chốt
          </p>
          <p className={`text-2xl md:text-3xl font-extrabold line-clamp-1 ${metrics.closedPL >= 0 ? 'text-blue-600' : 'text-rose-600'}`} title={formatVNDSign(metrics.closedPL)}>
            {formatVNDSign(metrics.closedPL)}
          </p>
          <p className="text-[11px] font-bold opacity-60 mt-2 text-blue-900 uppercase tracking-wider">VNĐ (Thực nhận)</p>
        </div>
      </div>
    </div>
  );
}
