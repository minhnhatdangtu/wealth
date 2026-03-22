import { Lightbulb, ArrowRight, TrendingUp } from 'lucide-react';

export function MarketInsights() {
  return (
    <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-bold text-text-main">Insight Thị trường & Danh mục</h3>
        </div>
        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-3 py-1 rounded-md tracking-wider uppercase">
          Cập nhật 5 phút trước
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-2 flex-1">
        {/* Left column text insights */}
        <div className="flex-1 space-y-4 flex flex-col justify-between">
          <div className="border-l-4 border-amber-500 pl-4 py-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Cơ hội đầu tư</p>
            <h4 className="text-base font-bold text-text-main mb-2">Chuyển dịch sang Trái phiếu Chính phủ</h4>
            <p className="text-sm text-text-muted">
              Dự báo lãi suất giảm vào Q4 tạo cơ hội tối ưu lợi nhuận an toàn cho 15% tiền mặt hiện có.
            </p>
          </div>
          
          <div className="border-l-4 border-primary pl-4 py-1">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Cảnh báo tập trung</p>
            <h4 className="text-base font-bold text-text-main mb-2">Tỷ trọng Bất động sản vượt ngưỡng</h4>
            <p className="text-sm text-text-muted">
              Danh mục hiện có 62% tài sản vào BĐS nghỉ dưỡng. Khuyến nghị đa dạng hóa sang quỹ ETF công nghệ.
            </p>
          </div>
        </div>

        {/* Right column deep blue card */}
        <div className="flex-1 bg-primary rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-end">
          <div className="absolute top-4 right-4 text-white/20">
            <TrendingUp className="w-16 h-16" />
          </div>
          
          <div className="relative z-10 mt-12">
            <h4 className="text-xl font-bold mb-3">Dự báo Hiệu suất 2024</h4>
            <p className="text-sm text-blue-100/90 leading-relaxed mb-6">
              Dựa trên mô hình Monte Carlo, danh mục của gia đình có 85% khả năng đạt mức tăng trưởng 12.4%.
            </p>
            <button className="text-sm font-bold text-amber-400 hover:text-amber-300 flex items-center gap-2 transition-colors">
              Xem chi tiết phân tích <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
