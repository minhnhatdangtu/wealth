'use client';

import { Building2, TrendingUp, Gem, Landmark, PieChart } from 'lucide-react';
import { usePortfolio } from '@/store/PortfolioContext';
import { useMemo } from 'react';
import { formatCurrency } from '@/utils/format-utils';

export function AssetSummaryCards() {
  const { assets, selectedCategory, setSelectedCategory } = usePortfolio();

  const categories = [
    { id: 'Tiết kiệm & Quỹ', title: 'Tiết kiệm & Quỹ', icon: <Landmark className="w-5 h-5" /> },
    { id: 'Vàng & kim loại', title: 'Vàng & kim loại', icon: <Gem className="w-5 h-5" /> },
    { id: 'Chứng khoán', title: 'Chứng khoán', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'Chứng chỉ quỹ', title: 'Chứng chỉ quỹ', icon: <PieChart className="w-5 h-5" /> },
    { id: 'Bất động sản', title: 'Bất động sản', icon: <Building2 className="w-5 h-5" /> }
  ];

  const metrics = useMemo(() => {
    return categories.map(cat => {
      const activeCatAssets = assets.filter(a => a.type === cat.id && a.status === 'HOẠT ĐỘNG');
      
      const totalCost = activeCatAssets.reduce((sum, a) => sum + a.cost, 0);
      const totalValue = activeCatAssets.reduce((sum, a) => sum + a.value, 0);
      const totalPL = totalValue - totalCost;
      const plPercent = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;

      return {
        ...cat,
        value: totalValue,
        pl: totalPL,
        plPercent: plPercent
      };
    });
  }, [assets]);

  const formatVND = (num: number) => formatCurrency(Math.abs(num));

  const formatSign = (num: number, pct: number) => {
    if (num === 0) return '0';
    const s = new Intl.NumberFormat('vi-VN').format(Math.abs(num));
    const p = pct.toFixed(1);
    return num >= 0 ? `+${s} (+${p}%)` : `-${s} (${p}%)`;
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {metrics.map((card, idx) => {
          const isProfit = card.pl >= 0;
          const isSelected = selectedCategory === card.id;
          
          return (
            <div 
              key={idx} 
              onClick={() => setSelectedCategory(isSelected ? null : card.id)}
              className={`rounded-[24px] p-6 cursor-pointer flex flex-col justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border ${
                isSelected 
                  ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary' 
                  : 'bg-gray-50/80 border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="mb-4 bg-white w-10 h-10 rounded-xl shadow-sm flex items-center justify-center border border-gray-100 text-primary">
                {card.icon}
              </div>
              <p className="text-[10px] md:text-xs uppercase tracking-wider font-bold text-text-muted mb-2 line-clamp-1">
                {card.title}
              </p>
              <p className="text-lg md:text-xl font-bold text-primary mb-3 whitespace-nowrap overflow-hidden text-ellipsis" title={formatVND(card.value)}>
                {card.value > 0 ? formatVND(card.value) : '0'}
              </p>
              <p className={`text-[11px] font-bold ${card.value === 0 ? 'text-text-muted' : (isProfit ? 'text-emerald-600' : 'text-rose-600')} flex items-center gap-1`}>
                {card.value !== 0 && (
                  <>
                    {isProfit ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                    {formatSign(card.pl, card.plPercent)}
                  </>
                )}
                {card.value === 0 && 'Chưa có dữ liệu'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
