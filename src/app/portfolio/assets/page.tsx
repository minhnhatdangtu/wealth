'use client';

import { usePortfolio } from '@/store/PortfolioContext';
import Link from 'next/link';
import { ArrowLeft, Edit3, Settings2, Pencil, Trash2, Info } from 'lucide-react';
import React, { useState } from 'react';

export default function AllAssetsPage() {
  const { assets, marketPrices, updateMarketPrice, deleteAsset } = usePortfolio();
  const [editingPriceTicker, setEditingPriceTicker] = useState<string | null>(null);
  const [tempPriceStr, setTempPriceStr] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.abs(num)).replace(/,/g, '.');
  };

  const renderDate = (dateString?: string) => {
    if (!dateString) return <span className="text-gray-300">--</span>;
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    return <span className="text-[11px] font-bold text-text-muted bg-gray-50/80 px-2.5 py-1.5 rounded-lg border border-gray-100 tracking-wide uppercase">{parts[2]} Thg {parts[1]}, {parts[0]}</span>;
  };

  const handleEditPrice = (ticker: string, currentPrice: number) => {
    setEditingPriceTicker(ticker);
    setTempPriceStr(currentPrice.toString());
  };

  const handleSavePrice = async (ticker: string) => {
    const pStr = tempPriceStr.replace(/,/g, '').replace(/\./g, '');
    const finalPrice = parseFloat(pStr);
    if (!isNaN(finalPrice) && finalPrice > 0) {
      await updateMarketPrice(ticker, finalPrice);
    }
    setEditingPriceTicker(null);
  };


  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanStr = e.target.value.replace(/[^0-9]/g, '');
    if (!cleanStr) {
      setTempPriceStr('');
      return;
    }
    const num = parseFloat(cleanStr);
    setTempPriceStr(new Intl.NumberFormat('vi-VN').format(num).replace(/,/g, '.'));
  };

  const oracleValidTypes = ['Vàng & kim loại', 'Chứng khoán', 'Chứng chỉ quỹ', 'Tiết kiệm & Quỹ'];
  
  // Tự động phân nhóm các tài sản đang hoạt động theo danh mục
  const groupedOracleAssets: Record<string, string[]> = {};
  
  assets.filter(a => oracleValidTypes.includes(a.type) && a.status === 'HOẠT ĐỘNG').forEach(a => {
    if (!groupedOracleAssets[a.type]) {
      groupedOracleAssets[a.type] = [];
    }
    if (!groupedOracleAssets[a.type].includes(a.name)) {
      groupedOracleAssets[a.type].push(a.name);
    }
  });

  const categories = ['Tất cả', ...Array.from(new Set(assets.map(a => a.type)))];
  const filteredAssets = selectedCategory === 'Tất cả' 
    ? assets 
    : assets.filter(a => a.type === selectedCategory);

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-16">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-4 font-bold text-sm">
            <ArrowLeft className="w-4 h-4" />
            Về trang Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-3">Danh sách Tài sản</h1>
        </div>
      </div>

      {/* Global Oracle Configurator */}
      <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-sm border border-border-subtle overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-amber-100 text-amber-600 p-2 rounded-xl shadow-sm ring-1 ring-amber-200/50">
            <Settings2 className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-extrabold text-primary tracking-tight">Bảng Giá Thị Trường</h2>
        </div>
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3 items-start mb-8 max-w-3xl shadow-sm">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-[13px] font-medium text-blue-800 leading-relaxed">
            Hệ thống sẽ dùng Bảng giá thị trường để áp dụng hàng loạt lên tất cả các tài sản tương ứng. Định giá này chỉ tác động lên các tài sản ở trạng thái Đang Hoạt Động.
          </p>
        </div>
        
        <div className="space-y-8">
          {Object.entries(groupedOracleAssets).map(([type, tickers]) => (
            <div key={type} className="space-y-4">
              <h3 className="text-[13px] font-bold text-text-muted border-b border-gray-100 pb-2 uppercase tracking-wider">{type}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tickers.map((ticker) => {
                  const asset = assets.find(a => a.name === ticker);
                  if (!asset) return null;
                  
                  // Nếu tài sản chưa có mặt trong MarketPrices, tính toán ngầm định đơn giá hiện tại
                  let currentPrice = marketPrices[ticker];
                  if (currentPrice === undefined) {
                    const rawNumStr = asset.quantity.split(' ')[0].replace(/,/g, '');
                    const rawNum = parseFloat(rawNumStr);
                    currentPrice = rawNum > 0 ? Math.round(asset.value / rawNum) : 0;
                  }
                  
                  // Lấy đơn vị tài sản
                  const assetUnit = asset.quantity.split(' ').slice(1).join(' ') || 'Đơn vị';

                  return (
                    <div key={ticker} className="bg-white rounded-[24px] p-5 border border-gray-100/80 shadow-sm ring-1 ring-black/5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-text-main text-sm">{ticker}</span>
                        {editingPriceTicker !== ticker && (
                          <button onClick={() => handleEditPrice(ticker, currentPrice)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-full transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      {editingPriceTicker === ticker ? (
                        <div className="flex gap-2 items-center">
                          <input 
                            type="text" 
                            value={tempPriceStr}
                            onChange={handlePriceChange}
                            className="w-full text-xl font-extrabold text-primary tracking-tighter bg-white border border-primary/30 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            autoFocus
                          />
                          <button 
                            onClick={() => handleSavePrice(ticker)}
                            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 flex-shrink-0 rounded-xl text-[11px] uppercase tracking-wider font-extrabold shadow-sm transition-transform active:scale-95"
                          >
                            Lưu
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-end gap-1.5">
                          <span className="text-2xl font-extrabold tracking-tighter text-emerald-600">
                            {formatVND(currentPrice)}
                          </span>
                          <span className="text-xs font-bold text-text-muted mb-1.5 line-clamp-1">VNĐ/{assetUnit}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Raw Inventory Table */}
      <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-sm border border-border-subtle overflow-hidden">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-extrabold text-primary tracking-tight">Tất cả tài sản sở hữu</h2>
          <div className="flex bg-gray-50/80 p-1.5 rounded-[16px] border border-gray-100 overflow-x-auto hide-scrollbar max-w-full">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 text-sm font-bold rounded-[12px] whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
                    : 'text-text-muted hover:text-text-main hover:bg-white/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
          <div className="overflow-x-auto max-h-[800px] overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-text-muted font-bold uppercase tracking-wider border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md z-10 shadow-sm">
              <tr>
                <th className="px-4 py-4 w-1/4 whitespace-nowrap">Tên Tài Sản</th>
                <th className="px-4 py-4 text-center whitespace-nowrap">Phân loại</th>
                <th className="px-4 py-4 text-center whitespace-nowrap">Trạng thái</th>
                <th className="px-4 py-4 text-center">Số lượng</th>
                <th className="px-4 py-4 text-center whitespace-nowrap">Giá vốn</th>
                <th className="px-4 py-4 text-right whitespace-nowrap">Giá trị hiện tại</th>
                <th className="px-4 py-4 text-right whitespace-nowrap">Lãi / Lỗ</th>
                <th className="px-4 py-4 text-center whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAssets.map((item) => {
                const Icon = item.icon;
                const unitPrice = marketPrices[item.name];
                const hasOracle = unitPrice !== undefined && item.status === 'HOẠT ĐỘNG';
                
                const formattedQuantity = item.quantity.replace(/,/g, '.');
                const qtyParts = formattedQuantity.split(' ');
                const qtyVal = qtyParts[0];
                const qtyUnit = qtyParts.slice(1).join(' ');
                
                const pl = item.value - item.cost;
                const plPercent = item.cost > 0 ? (pl / item.cost) * 100 : 0;
                const isPositive = pl > 0;
                const isNegative = pl < 0;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors duration-300 group">
                    <td className="px-4 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center ${item.iconBg}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="whitespace-nowrap">
                          <p className="font-bold text-text-main text-[15px]">{item.name}</p>
                          <p className="text-xs text-text-muted mt-0.5">{renderDate(item.startDate)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-6 font-bold text-center text-text-muted text-[13px] whitespace-nowrap">
                      {item.type}
                    </td>
                    <td className="px-4 py-6 font-medium text-center">
                      <span className={`px-3 py-1 text-[10px] font-bold rounded-[8px] border whitespace-nowrap uppercase tracking-wider ${
                        item.status === 'HOẠT ĐỘNG'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-gray-50 text-text-muted border-gray-200'
                       }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-6 font-bold text-center text-text-main">
                      <div className="flex flex-col items-center leading-tight">
                        <span className="text-[15px] tracking-tight">{qtyVal}</span>
                        {qtyUnit && <span className="text-[10px] uppercase font-bold text-text-muted mt-0.5">{qtyUnit}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-6 font-medium text-center text-text-muted tracking-tight text-[15px]">
                      {formatVND(item.cost)}
                    </td>
                    <td className="px-4 py-6 font-bold text-right tracking-tighter text-text-main">
                      <div className="flex flex-col items-end">
                        <span className="text-[15px]">{formatVND(item.value)}</span>
                        {item.isCustomPriced && (
                          <span className="text-[9px] uppercase px-2 py-0.5 bg-amber-100/50 text-amber-700 rounded-full ring-1 ring-amber-200/50 mt-1.5 font-bold tracking-wider">Giá thị trường</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-6 font-bold text-right tracking-tighter">
                      <div className={`flex flex-col items-end ${isPositive ? 'text-emerald-500' : isNegative ? 'text-rose-500' : 'text-text-muted'}`}>
                        <span className="text-[15px]">{isPositive ? '+' : ''}{formatVND(pl)}</span>
                        <span className={`text-[11px] font-bold mt-1 px-2 py-0.5 rounded-full tracking-wide ${isPositive ? 'bg-emerald-50 text-emerald-600' : isNegative ? 'bg-rose-50 text-rose-600' : 'bg-gray-100'}`}>
                          {isPositive ? '+' : ''}{plPercent.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-6 text-center">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/portfolio/${item.id}/edit`}>
                          <button className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => {
                            if (window.confirm('Bạn có chắc chắn muốn xoá tài sản này khỏi sổ cái không?')) {
                              deleteAsset(item.id);
                            }
                          }}
                          className="p-2 text-text-muted hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
