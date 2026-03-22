import { ShieldAlert } from 'lucide-react';

export function RiskIndex() {
  return (
    <div className="bg-gray-50/50 rounded-[24px] p-8 border border-gray-100 h-full flex flex-col items-center relative overflow-hidden">
      <div className="w-full flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-danger" />
          <h3 className="text-lg font-bold text-text-main">Chỉ số Rủi ro</h3>
        </div>
      </div>

      {/* Radial Gauge */}
      <div className="relative w-48 h-48 mb-6 mt-4 flex-shrink-0">
        <svg className="w-full h-full transform -rotate-180" viewBox="0 0 100 100">
          <path d="M 20 80 A 40 40 0 1 1 80 80" fill="transparent" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
          <path 
            d="M 20 80 A 40 40 0 1 1 80 80" 
            fill="transparent" 
            stroke="#996D12" 
            strokeWidth="8" 
            strokeLinecap="round" 
            strokeDasharray="188.5"
            strokeDashoffset={188.5 - (188.5 * 72) / 100}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center -mt-8">
          <span className="text-5xl font-bold text-primary">7.2</span>
          <span className="text-[10px] font-bold text-text-muted tracking-widest uppercase mt-1">Trên 10</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <h4 className="text-sm font-bold text-text-main mb-2">Mức độ: <span className="text-danger">Trung bình cao</span></h4>
        <p className="text-xs text-text-muted leading-relaxed">
          Rủi ro chủ yếu đến từ biến động tỷ giá ngoại tệ và thị trường BĐS nội địa.
        </p>
      </div>

      <div className="w-full space-y-3 mt-auto border-t border-gray-200 pt-6">
        <div className="flex justify-between items-center text-xs">
          <span className="text-text-muted">Thị trường</span>
          <span className="font-bold text-danger">Cao</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-text-muted">Thanh khoản</span>
          <span className="font-bold text-primary">Thấp</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-text-muted">Địa chính trị</span>
          <span className="font-bold text-amber-600">Trung bình</span>
        </div>
      </div>
    </div>
  );
}
