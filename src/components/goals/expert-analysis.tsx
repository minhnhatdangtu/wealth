import { TrendingUp, Clock, LockKeyhole } from 'lucide-react';

export function ExpertAnalysis() {
  return (
    <div className="bg-gray-50/80 rounded-[24px] p-8 lg:p-10 border border-gray-100 flex flex-col lg:flex-row gap-10">
      <div className="lg:w-1/3 flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-primary mb-4 leading-tight">
          Phân tích chiến lược từ chuyên gia
        </h3>
        <p className="text-text-muted text-sm leading-relaxed">
          Dựa trên biến động thị trường tháng này, chúng tôi khuyên bạn nên chuyển dịch một phần danh mục từ Trái phiếu sang Cổ phiếu tăng trưởng để bám sát mục tiêu &quot;Mua nhà&quot;.
        </p>
      </div>
      
      <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
          <TrendingUp className="w-5 h-5 text-amber-700 mb-4" />
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Lợi nhuận kỳ vọng</p>
          <p className="text-xl font-bold text-primary">+12.4%/năm</p>
        </div>
        
        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
          <Clock className="w-5 h-5 text-amber-700 mb-4" />
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Tốc độ hoàn thành</p>
          <p className="text-xl font-bold text-primary line-clamp-2">Nhanh hơn 15%</p>
        </div>
        
        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
          <LockKeyhole className="w-5 h-5 text-amber-700 mb-4" />
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Tính thanh khoản</p>
          <p className="text-xl font-bold text-primary">Cao (Loại A)</p>
        </div>
      </div>
    </div>
  );
}
