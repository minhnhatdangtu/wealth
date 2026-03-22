'use client';

import { Search, Bell, Settings } from 'lucide-react';

export function Header() {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-border-subtle flex items-center justify-between px-8 sticky top-0 z-10 hidden md:flex">
      {/* Search */}
      <div className="relative w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border-none rounded-xl bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-colors"
          placeholder="Tìm kiếm tài sản hoặc báo cáo..."
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-gray-500">
          <button className="hover:text-primary transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full border-2 border-white"></span>
          </button>
          <button className="hover:text-primary transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="h-6 w-px bg-gray-200"></div>

        <div className="flex items-center gap-3 cursor-pointer">
          <span className="text-sm font-medium text-text-main">Minh Nguyễn</span>
          <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 text-sm font-bold border border-white shadow-sm">
            M
          </div>
        </div>
      </div>
    </header>
  );
}
