'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePortfolio } from '@/store/PortfolioContext';

import { formatCurrency, formatNumber, parseDecimal } from '@/utils/format-utils';

const formatVND = (v: number) => formatCurrency(Math.abs(v));

export function DetailedHoldings() {
  const { assets, selectedCategory } = usePortfolio();
  const [filter, setFilter] = useState<'all' | 'daihan' | 'nganhan'>('all');
  const router = useRouter();

  // 1. Filter by category
  let filteredAssets = selectedCategory
    ? assets.filter(asset => asset.type === selectedCategory)
    : assets;

  // 2. Filter by horizon
  if (filter !== 'all') {
    filteredAssets = filteredAssets.filter(asset => asset.horizon === filter);
  }

  // 3. Group unique assets by name and aggregate their data
  const groupedMap = filteredAssets.reduce((acc, asset) => {
    const key = asset.name;
    if (!acc[key]) {
      acc[key] = {
        name: asset.name,
        type: asset.type,
        icon: asset.icon,
        iconBg: asset.iconBg,
        id: asset.id,
        statuses: [] as string[],
        totalQuantity: 0,
        totalCost: 0,
        totalValue: 0,
        qtyUnit: '',
      };
    }
    acc[key].statuses.push(asset.status);
    const parts = asset.quantity.trim().split(/\s+/);
    const qtyNum = parseDecimal(parts[0]);
    if (!isNaN(qtyNum)) acc[key].totalQuantity += qtyNum;
    if (!acc[key].qtyUnit && parts.length > 1) acc[key].qtyUnit = parts.slice(1).join(' ');
    acc[key].totalCost += asset.cost;
    acc[key].totalValue += asset.value;
    return acc;
  }, {} as Record<string, {
    name: string; type: string; icon: any; iconBg: string; id: number;
    statuses: string[]; totalQuantity: number; totalCost: number; totalValue: number; qtyUnit: string;
  }>);

  // 4. Build display rows: status logic + P&L
  const groupedHoldings = Object.values(groupedMap).map(group => {
    const hasActive = group.statuses.some(s => s === 'HOẠT ĐỘNG');
    const status = hasActive ? 'HOẠT ĐỘNG' : 'ĐÃ TẤT TOÁN';
    const plAbs = group.totalValue - group.totalCost;
    const plPct = group.totalCost > 0 ? (plAbs / group.totalCost) * 100 : 0;
    return { ...group, status, plAbs, plPct };
  }).sort((a, b) => b.plPct - a.plPct);

  // 5. Group by Category
  const categoryGroups = groupedHoldings.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, typeof groupedHoldings>);
  
  const sortedCategories = Object.keys(categoryGroups).sort();

  return (
    <div className="bg-white rounded-[24px] p-8 lg:p-10 shadow-sm border border-border-subtle overflow-hidden mt-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <h2 className="text-2xl font-extrabold text-primary tracking-tight">Chi tiết tài sản nắm giữ</h2>
        
        <div className="flex bg-gray-100/80 p-1.5 rounded-[20px]">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2.5 rounded-[16px] text-sm font-bold transition-all duration-300 ${
              filter === 'all' ? 'bg-white text-primary shadow-sm' : 'text-text-muted hover:text-text-main'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter('daihan')}
            className={`px-6 py-2.5 rounded-[16px] text-sm font-bold transition-all duration-300 ${
              filter === 'daihan' ? 'bg-white text-primary shadow-sm' : 'text-text-muted hover:text-text-main'
            }`}
          >
            Dài hạn
          </button>
          <button
            onClick={() => setFilter('nganhan')}
            className={`px-6 py-2.5 rounded-[16px] text-sm font-bold transition-all duration-300 ${
              filter === 'nganhan' ? 'bg-white text-primary shadow-sm' : 'text-text-muted hover:text-text-main'
            }`}
          >
            Ngắn hạn
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] text-text-muted font-bold uppercase tracking-wider border-b border-gray-100">
            <tr>
              <th className="px-4 py-4 w-1/4 whitespace-nowrap">Tài sản</th>
              <th className="px-4 py-4 text-center whitespace-nowrap">Trạng thái</th>
              <th className="px-4 py-4 text-center">Số<br/>lượng</th>
              <th className="px-4 py-4 text-center whitespace-nowrap">Giá vốn</th>
              <th className="px-4 py-4 text-right whitespace-nowrap">Giá trị hiện tại</th>
              <th className="px-4 py-4 text-right whitespace-nowrap">Lãi/Lỗ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sortedCategories.map((category) => (
              <React.Fragment key={category}>
                <tr className="bg-gray-50/50">
                  <td colSpan={6} className="px-4 py-3 text-[11px] font-extrabold text-primary/60 uppercase tracking-widest">
                    {category}
                  </td>
                </tr>
                {categoryGroups[category].map((item) => {
                  const Icon = item.icon;
                  const isProfit = item.plAbs >= 0;
                  const plColorClass = isProfit ? 'text-emerald-500' : 'text-rose-500';
                  const sign = isProfit ? '+' : '';
                  const detailHref = `/portfolio/assets/detail?name=${encodeURIComponent(item.name)}`;

                  return (
                    <tr
                      key={item.name}
                      onClick={() => router.push(detailHref)}
                      className="hover:bg-gray-50/50 cursor-pointer transition-colors group"
                    >
                      <td className="px-4 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.iconBg}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="whitespace-nowrap">
                            <p className="font-bold text-text-main">{item.name}</p>
                            <p className="text-xs text-text-muted mt-0.5">{item.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-6 font-medium text-center">
                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full border whitespace-nowrap ${
                          item.status === 'HOẠT ĐỘNG'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-gray-50 text-text-muted border-gray-200'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-6 font-bold text-center text-text-main">
                        <div className="flex flex-col items-center leading-tight">
                          <span>{item.totalQuantity > 0 ? formatNumber(item.totalQuantity) : '—'}</span>
                          {item.qtyUnit && <span className="text-[11px] font-semibold text-text-muted mt-0.5 uppercase">{item.qtyUnit}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-6 font-medium text-center text-text-muted">
                        {formatVND(item.totalCost)}
                      </td>
                      <td className="px-4 py-6 font-bold text-right text-text-main text-[15px]">
                        {formatVND(item.totalValue)}
                      </td>
                      <td className={`px-4 py-6 font-bold text-right tracking-tight ${plColorClass}`}>
                        <div className="flex flex-col items-end">
                          <span className="text-sm">{sign}{formatVND(item.plAbs)}</span>
                          <span className="text-xs mt-0.5">{sign}{item.plPct.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-end">
        <Link href="/portfolio/assets" className="text-sm font-bold text-primary hover:text-primary-light flex items-center gap-2 transition-colors cursor-pointer block">
          Xem tất cả tài sản <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
