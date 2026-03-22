'use client';

import { ChevronDown, Search } from 'lucide-react';
import { useTransactions } from '@/store/TransactionContext';

export function TransactionFilters() {
  const { 
    dateRange, setDateRange,
    filterType, setFilterType,
    filterCategory, setFilterCategory,
    filterStatus, setFilterStatus,
    filterSearch, setFilterSearch
  } = useTransactions();

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      {/* Dropdowns */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-widest font-bold text-text-muted">Loại giao dịch</label>
        <div className="relative">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full appearance-none bg-gray-50 border border-gray-100/50 rounded-xl px-4 py-3 text-sm font-medium text-text-main focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option>Tất cả</option>
            <option>Thu nhập</option>
            <option>Chi tiêu</option>
            <option>Đầu tư</option>
          </select>
          <ChevronDown className="w-4 h-4 text-text-muted absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-widest font-bold text-text-muted">Danh mục</label>
        <div className="relative">
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full appearance-none bg-gray-50 border border-gray-100/50 rounded-xl px-4 py-3 text-sm font-medium text-text-main focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option>Tất cả danh mục</option>
            <option>Bất động sản</option>
            <option>Chứng khoán</option>
            <option>Tiết kiệm</option>
            <option>Sinh hoạt</option>
            <option>Vàng</option>
            <option>Chứng chỉ quỹ</option>
            <option>Công việc</option>
            <option>Khác</option>
          </select>
          <ChevronDown className="w-4 h-4 text-text-muted absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-widest font-bold text-text-muted">Trạng thái</label>
        <div className="relative">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full appearance-none bg-gray-50 border border-gray-100/50 rounded-xl px-4 py-3 text-sm font-medium text-text-main focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option>Tất cả trạng thái</option>
            <option>HOÀN THÀNH</option>
            <option>ĐANG XỬ LÝ</option>
          </select>
          <ChevronDown className="w-4 h-4 text-text-muted absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-widest font-bold text-text-muted">Khoảng thời gian</label>
        <div className="relative flex justify-between gap-1">
          <input 
            type="date" 
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="w-1/2 bg-gray-50 border border-gray-100/50 rounded-xl px-2 py-3 text-xs font-medium text-text-main focus:outline-none focus:ring-1 focus:ring-primary hover:border-gray-200"
            title="Từ ngày"
          />
          <input 
            type="date" 
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="w-1/2 bg-gray-50 border border-gray-100/50 rounded-xl px-2 py-3 text-xs font-medium text-text-main focus:outline-none focus:ring-1 focus:ring-primary hover:border-gray-200"
            title="Đến ngày"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase tracking-widest font-bold text-text-muted">Tìm kiếm nhanh</label>
        <div className="relative h-full flex items-center">
          <Search className="w-4 h-4 text-text-muted absolute left-4" />
          <input 
            type="text" 
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            placeholder="Nội dung giao dịch..." 
            className="w-full h-full bg-gray-50 border border-gray-100/50 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-text-main focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
}
