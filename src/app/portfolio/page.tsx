'use client';

import { PortfolioChart } from '@/components/portfolio/portfolio-chart';
import { AssetSummaryCards } from '@/components/portfolio/asset-summary-cards';
import { DetailedHoldings } from '@/components/portfolio/detailed-holdings';
import Link from 'next/link';

export default function PortfolioPage() {
  const now = new Date();
  const dateStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}, ngày ${now.getDate()} tháng ${now.getMonth() + 1}, ${now.getFullYear()}`;

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-16">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-3">Danh mục đầu tư</h1>
          <p className="text-text-muted text-sm font-medium max-w-2xl" suppressHydrationWarning>
            Cập nhật lúc {dateStr}.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gray-50/80 p-1.5 rounded-[20px] border border-gray-100/50">
          <Link href="/portfolio/assets">
            <button className="text-text-main bg-white shadow-sm border border-gray-100 hover:text-primary hover:border-primary/50 px-6 py-3 rounded-[16px] font-bold transition-all text-sm">
              Sổ tài sản
            </button>
          </Link>
          <Link href="/portfolio/new">
            <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-[16px] font-bold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] text-sm flex items-center gap-1.5">
              <span className="text-lg leading-none">+</span> Thêm tài sản
            </button>
          </Link>
        </div>
      </div>

      <PortfolioChart />
      
      <div>
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-xl font-bold text-primary tracking-tight">Phân bổ danh mục</h2>
        </div>
        <AssetSummaryCards />
      </div>

      <DetailedHoldings />
    </div>
  );
}
