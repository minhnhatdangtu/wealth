import { Sparkles } from 'lucide-react';
import { MarketInsights } from '@/components/advisory/market-insights';
import { RiskIndex } from '@/components/advisory/risk-index';
import { OptimizationProposals } from '@/components/advisory/optimization-proposals';
import { LegacyStrategy } from '@/components/advisory/legacy-strategy';

export default function AdvisoryPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#996D12]">Cố vấn AI chuyên biệt</span>
          </div>
          <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">Advisory Lab.</h1>
          <p className="text-text-muted text-lg max-w-3xl">
            Phân tích chuyên sâu danh mục tài sản của gia tộc với sức mạnh của trí tuệ nhân tạo và kinh nghiệm quản lý di sản đa thế hệ.
          </p>
        </div>
        <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md transition-transform hover:scale-105">
          <Sparkles className="w-5 h-5" />
          Tạo Báo Cáo Mới
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          <MarketInsights />
        </div>
        <div className="lg:w-1/3">
          <RiskIndex />
        </div>
      </div>

      <OptimizationProposals />
      <LegacyStrategy />
    </div>
  );
}
