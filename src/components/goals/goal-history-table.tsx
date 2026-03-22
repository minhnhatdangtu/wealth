import { usePortfolio } from '@/store/PortfolioContext';
import { getCategoryColor } from '@/utils/goal-utils';
import { History } from 'lucide-react';

export function GoalHistoryTable({ goalId }: { goalId: number }) {
  const { assets } = usePortfolio();
  
  const linkedAssets = assets.filter(a => a.goalId === goalId);

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const formatDatePill = (dateStr?: string) => {
    if (!dateStr || dateStr === 'Đang cập nhật') return 'Đang cập nhật';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]} THG ${parts[1]}, ${parts[0]}`;
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-500">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Lịch sử tích lũy gần đây
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-[25%] text-left pl-0">Ngày bất đầu</th>
              <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-[38%] text-left pl-0">Nội dung tài sản</th>
              <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-[20%] text-left pl-0">Phân loại</th>
              <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right w-[17%] pr-0">Giá trị (VNĐ)</th>
            </tr>
          </thead>
          <tbody>
            {linkedAssets.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-400 text-sm italic bg-gray-50/30 rounded-2xl">
                  Chưa có tài sản nào được liên kết với mục tiêu này.
                </td>
              </tr>
            ) : linkedAssets.map((tx) => {
              const colors = getCategoryColor(tx.type);
              return (
                <tr key={tx.id} className="group hover:bg-gray-50/80 transition-all duration-300">
                  <td className="py-5 rounded-l-2xl border-y border-l border-transparent group-hover:border-gray-100">
                    <span className="bg-white text-[10px] font-bold text-gray-500 px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm inline-block uppercase tracking-wider group-hover:border-primary/20 group-hover:text-primary transition-colors">
                      {formatDatePill(tx.startDate)}
                    </span>
                  </td>
                  <td className="py-5 border-y border-transparent group-hover:border-gray-100">
                    <span className="text-sm font-bold text-gray-800 block group-hover:text-primary transition-colors">{tx.name}</span>
                  </td>
                  <td className="py-5 border-y border-transparent group-hover:border-gray-100">
                    <span className={`text-[10px] font-bold inline-block px-3 py-1.5 rounded-lg tracking-wide ${colors.twBgLight} ${colors.twText} border border-transparent group-hover:border-current/10 transition-all`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-5 text-right rounded-r-2xl border-y border-r border-transparent group-hover:border-gray-100">
                    <span className="text-sm font-extrabold text-primary tabular-nums tracking-tight">+{formatVND(tx.value)}</span>
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
