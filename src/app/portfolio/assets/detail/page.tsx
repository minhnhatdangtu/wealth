'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePortfolio } from '@/store/PortfolioContext';
import {
  ArrowLeft, TrendingUp, TrendingDown,
  Calendar, Activity
} from 'lucide-react';

import { formatCurrency, formatNumber, parseDecimal as utilParseDecimal } from '@/utils/format-utils';

const fmtVND = (v: number) => formatCurrency(Math.abs(Math.round(v)));

const fmtDate = (d?: string) => {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day} Thg ${m}, ${y}`;
};

function getCardStyle(type: string): string {
  const t = type.toLowerCase();
  if (t.includes('chứng khoán')) return 'bg-gradient-to-br from-amber-600 to-amber-900';
  if (t.includes('chứng chỉ quỹ')) return 'bg-gradient-to-br from-emerald-600 to-emerald-900';
  if (t.includes('tiết kiệm')) return 'bg-gradient-to-br from-blue-600 to-blue-900';
  if (t.includes('bất động sản')) return 'bg-gradient-to-br from-[#182a5c] to-[#0a1530]';
  if (t.includes('vàng')) return 'bg-gradient-to-br from-yellow-600 to-orange-800';
  return 'bg-gradient-to-br from-gray-700 to-gray-900';
}

function MetricCell({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-base font-extrabold tabular-nums text-white leading-tight">{value}</p>
      {unit && <p className="text-[10px] text-white/40 mt-0.5">{unit}</p>}
    </div>
  );
}

function ExtraMetrics({ type, active }: { type: string; active: any[] }) {
  const t = type.toLowerCase();
  const parseQty = (q: string) => utilParseDecimal(q);
  const totalCost = active.reduce((s, a) => s + a.cost, 0);

  if (t.includes('bất động sản')) {
    const totalArea = active.reduce((s, a) => s + parseQty(a.quantity), 0);
    const avgCostPerM2 = totalArea > 0 ? totalCost / totalArea : 0;
    return (
      <>
        <MetricCell label="Tổng diện tích" value={formatNumber(totalArea)} unit="m²" />
        <MetricCell label="Giá vốn TB / m²" value={fmtVND(avgCostPerM2)} unit="VNĐ" />
      </>
    );
  }
  if (t.includes('chứng khoán')) {
    const totalQty = active.reduce((s, a) => s + parseQty(a.quantity), 0);
    const avgCost = totalQty > 0 ? totalCost / totalQty : 0;
    return (
      <>
        <MetricCell label="Tổng khối lượng" value={formatNumber(totalQty)} unit="CP" />
        <MetricCell label="Giá vốn TB / CP" value={fmtVND(avgCost)} unit="VNĐ" />
      </>
    );
  }
  if (t.includes('chứng chỉ quỹ')) {
    const totalQty = active.reduce((s, a) => s + parseQty(a.quantity), 0);
    const avgCost = totalQty > 0 ? totalCost / totalQty : 0;
    return (
      <>
        <MetricCell label="Tổng khối lượng" value={formatNumber(totalQty)} unit="CCQ" />
        <MetricCell label="Giá vốn TB / CCQ" value={fmtVND(avgCost)} unit="VNĐ" />
      </>
    );
  }
  if (t.includes('vàng')) {
    const totalQty = active.reduce((s, a) => s + parseQty(a.quantity), 0);
    const avgCost = totalQty > 0 ? totalCost / totalQty : 0;
    return (
      <>
        <MetricCell label="Tổng khối lượng" value={formatNumber(totalQty)} unit="Chỉ" />
        <MetricCell label="Giá vốn TB / Chỉ" value={fmtVND(avgCost)} unit="VNĐ" />
      </>
    );
  }
  if (t.includes('tiết kiệm')) {
    const terms = active.map(a => {
      const match = a.quantity.match(/(\d+)\s*Tháng/i);
      return match ? parseInt(match[1]) : 6;
    });
    const avgTerm = terms.length > 0 ? Math.round(terms.reduce((s, x) => s + x, 0) / terms.length) : 0;
    return (
      <>
        <MetricCell label="Tổng tài khoản" value={`${active.length}`} unit="Tài khoản" />
        <MetricCell label="Kỳ hạn trung bình" value={`${avgTerm}`} unit="Tháng" />
      </>
    );
  }
  return null;
}

function TransactionHistory({ assets }: { assets: any[] }) {
  if (assets.length === 0) return <div className="py-8 text-center text-gray-400 text-sm italic">Chưa có dữ liệu.</div>;
  return (
    <div>
      <h3 className="text-base font-bold text-gray-900 mb-6">Lịch sử nắm giữ</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-[10px] text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
              <th className="pb-4 pr-4">Tên tài sản</th>
              <th className="pb-4 px-4 text-center whitespace-nowrap">Trạng thái</th>
              <th className="pb-4 px-4 text-center">Số lượng</th>
              <th className="pb-4 pl-4 text-right whitespace-nowrap">Giá trị hiện tại</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {assets.map((a) => {
              const AIcon = a.icon;
              const plAbs = a.value - a.cost;
              const isProfit = plAbs >= 0;
              const parts = (a.quantity || '').trim().split(/\s+/);
              const qty = parts[0];
              const unit = parts.slice(1).join(' ');
              return (
                <tr key={a.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="py-5 pr-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${a.iconBg}`}>
                        <AIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{a.name}</p>
                        {a.startDate && <p className="text-[11px] text-gray-400 mt-0.5">{fmtDate(a.startDate)}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full border whitespace-nowrap ${
                      a.status === 'HOẠT ĐỘNG'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-gray-50 text-gray-500 border-gray-200'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <div className="flex flex-col items-center leading-tight">
                      <span className="font-bold text-gray-900">{qty}</span>
                      {unit && <span className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">{unit}</span>}
                    </div>
                  </td>
                  <td className="py-5 pl-4 text-right">
                    <p className="font-bold text-gray-900">{fmtVND(a.value)}</p>
                    <p className={`text-[11px] font-bold mt-0.5 ${isProfit ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {isProfit ? '+' : ''}{fmtVND(plAbs)} ({isProfit ? '+' : ''}{((plAbs / a.cost) * 100).toFixed(2)}%)
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AssetDetailContent() {
  const searchParams = useSearchParams();
  const rawName = searchParams.get('name');
  const router = useRouter();
  const { assets, loading } = usePortfolio();

  const grouped = assets.filter(a => a.name === rawName);

  if (loading) return <div className="p-12 text-center text-text-muted">Đang tải...</div>;

  if (grouped.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-gray-400">Không tìm thấy tài sản.</p>
        <button onClick={() => router.back()} className="text-primary font-bold">Quay lại</button>
      </div>
    );
  }

  const rep = grouped[0];
  const Icon = rep.icon;
  const cardStyle = getCardStyle(rep.type);

  const activeAssets = grouped.filter(a => a.status === 'HOẠT ĐỘNG');
  const activeCost  = activeAssets.reduce((s, a) => s + a.cost, 0);
  const activeValue = activeAssets.reduce((s, a) => s + a.value, 0);
  const plAbs = activeValue - activeCost;
  const plPct = activeCost > 0 ? (plAbs / activeCost) * 100 : 0;
  const isProfit = plAbs >= 0;
  const hasActive = grouped.some(a => a.status === 'HOẠT ĐỘNG');
  const status = hasActive ? 'HOẠT ĐỘNG' : 'ĐÃ TẤT TOÁN';

  return (
    <div className="min-h-screen bg-transparent p-6 lg:p-10">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Quay lại danh mục
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0 space-y-6">
          <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${rep.iconBg}`}>
                <Icon className="w-7 h-7" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{rawName}</h1>
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-full border ${
                    status === 'HOẠT ĐỘNG' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-gray-500 border-gray-200'
                  }`}>
                    {status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-[11px] text-gray-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Ngày bắt đầu: <strong className="text-gray-700 ml-1">{fmtDate(rep.startDate)}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    Thời hạn: <strong className="text-gray-700 ml-1">{rep.horizon === 'daihan' ? 'Dài hạn' : 'Ngắn hạn'}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
            <TransactionHistory assets={grouped} />
          </div>
        </div>

        <div className="w-full lg:w-[340px] shrink-0">
          <div className={`${cardStyle} rounded-[24px] p-8 text-white shadow-xl`}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/15">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-bold text-white text-sm">{rep.type}</p>
            </div>
            <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">Giá trị hiện tại</p>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-extrabold tabular-nums tracking-tight">{fmtVND(activeValue)}</span>
              <span className="text-sm text-white/60 font-semibold">VNĐ</span>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold mb-8 ${
              isProfit ? 'bg-emerald-400/20 text-emerald-300' : 'bg-rose-400/20 text-rose-300'
            }`}>
              {isProfit ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {isProfit ? '+' : ''}{fmtVND(plAbs)}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 border-t border-white/10 pt-6">
              <MetricCell label="Giá vốn" value={fmtVND(activeCost)} unit="VNĐ" />
              <div>
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1.5">Hiệu suất</p>
                <p className={`text-base font-extrabold tabular-nums leading-none ${isProfit ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {isProfit ? '+' : ''}{plPct.toFixed(1)}%
                </p>
              </div>
              <ExtraMetrics type={rep.type} active={activeAssets} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AssetDetailPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-text-muted">Đang chuẩn bị...</div>}>
      <AssetDetailContent />
    </Suspense>
  );
}
