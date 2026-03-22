'use client';

import Link from 'next/link';
import { usePortfolio } from '@/store/PortfolioContext';

export function AssetAllocation() {
  const { assets } = usePortfolio();
  
  const activeAssets = assets.filter(a => a.status === 'HOẠT ĐỘNG');
  const totalActiveValue = activeAssets.reduce((sum, a) => sum + a.value, 0);
  
  const getCatValue = (types: string[]) => 
    activeAssets
      .filter(a => types.some(t => a.type.toLowerCase().includes(t)))
      .reduce((s, a) => s + a.value, 0);

  const rawAllocations = [
    { name: 'Tiết kiệm & Quỹ', value: getCatValue(['tiết kiệm', 'quỹ đầu tư']) },
    { name: 'Vàng', value: getCatValue(['vàng']) },
    { name: 'Cổ phiếu', value: getCatValue(['chứng khoán']) },
    { name: 'Chứng chỉ quỹ', value: getCatValue(['chứng chỉ quỹ']) },
    { name: 'Bất động sản', value: getCatValue(['bất động sản']) },
  ];

  // Map to percentages and ensure they form accurate slices
  const parsedAllocations = rawAllocations.map(item => ({
    ...item,
    percentage: totalActiveValue > 0 ? Math.round((item.value / totalActiveValue) * 100) : 0,
  }));

  // Sort descending by percentage
  parsedAllocations.sort((a, b) => b.percentage - a.percentage);

  // Assign fixed colors based on new rank (0th is highest -> #0A1B5E)
  const rankColors = ['#0A1B5E', '#FFB800', '#FCA5A5', '#D1D5DB', '#6B7280'];
  const allocation = parsedAllocations.map((item, index) => ({
    ...item,
    hex: rankColors[index] || '#9CA3AF'
  }));

  // Generate conic gradient stops array
  let currentPct = 0;
  const conicStops = allocation.map(item => {
    const start = currentPct;
    const end = currentPct + item.percentage;
    currentPct = end;
    return `${item.hex} ${start}% ${end}%`;
  }).join(', ');

  const defaultGradient = '#F3F4F6 0% 100%'; // empty state
  const background = totalActiveValue > 0 ? `conic-gradient(${conicStops})` : `conic-gradient(${defaultGradient})`;

  return (
    <div className="bg-white rounded-2xl p-8 border border-border-subtle shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-text-main">Phân bổ Tài sản</h3>
        <Link href="/portfolio" className="text-xs font-bold text-primary tracking-wider uppercase hover:underline">
          Xem chi tiết
        </Link>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row items-center gap-12 mt-4">
        {/* Square Donut (Custom Visual) */}
        <div className="relative w-48 h-48 rounded-[20px] shadow-sm flex items-center justify-center overflow-hidden transform hover:scale-105 transition-transform duration-500">
          <div 
            className="absolute inset-0"
            style={{ background }}
          />
          <div className="relative w-[130px] h-[130px] bg-white rounded-[10px] shadow-inner flex items-center justify-center">
             {totalActiveValue === 0 && <span className="text-xs text-gray-400 font-medium">Chưa có dữ liệu</span>}
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full flex flex-col gap-4">
          {allocation.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.hex }} />
                <span className="text-sm font-medium text-text-main">{item.name}</span>
              </div>
              <span className="text-sm font-bold text-text-main">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
