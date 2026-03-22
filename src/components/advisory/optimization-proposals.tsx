import { Scale, Percent, PiggyBank, ArrowRightLeft } from 'lucide-react';

export function OptimizationProposals() {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-6">
        <Scale className="w-5 h-5 text-amber-700" />
        <h3 className="text-xl font-bold text-text-main">Đề xuất tối ưu hóa tài sản</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rebalance */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-text-main mb-2">Tái cân bằng (Rebalance)</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Bán bớt các mã cổ phiếu ngân hàng đã đạt đỉnh để chốt lời 20% và chuyển sang quỹ trái phiếu.
              </p>
            </div>
          </div>
        </div>

        {/* Tax Loss */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-text-main mb-2">Tối ưu thuế (Tax-Loss)</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Sử dụng các khoản lỗ từ danh mục phái sinh để bù trừ nghĩa vụ thuế thu nhập cá nhân năm nay.
              </p>
            </div>
          </div>
        </div>

        {/* Fixed Interest */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700 flex-shrink-0">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-text-main mb-2">Cố định lãi suất</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Chuyển đổi khoản vay thế chấp sang lãi suất cố định 3 năm để tránh biến động tài chính.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
