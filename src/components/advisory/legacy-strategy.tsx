import { FileSignature, Building, HeartHandshake, Users } from 'lucide-react';

export function LegacyStrategy() {
  return (
    <div className="mt-8 bg-primary rounded-[24px] overflow-hidden flex flex-col md:flex-row shadow-lg">
      <div className="md:w-1/3 bg-[#08154A] p-10 flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-white mb-4">Chiến lược Di sản</h3>
        <p className="text-blue-100/80 text-sm leading-relaxed">
          Đảm bảo giá trị gia đình trường tồn qua các thế hệ với các giải pháp hoạch định thừa kế thông minh.
        </p>
      </div>

      <div className="md:w-2/3 p-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 text-white">
        <div className="flex gap-4">
          <div className="text-amber-400 flex-shrink-0">
            <FileSignature className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold mb-2">Cập nhật Chúc thư Kỹ thuật số</h4>
            <p className="text-xs text-blue-100/70 leading-relaxed">
              Hệ thống ghi nhận 2 tài sản mới chưa được phân bổ trong kế hoạch thừa kế hiện tại.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="text-amber-400 flex-shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold mb-2">Cấu trúc Trust & Holding</h4>
            <p className="text-xs text-blue-100/70 leading-relaxed">
              Phân tích ưu điểm của việc chuyển đổi tài sản kinh doanh sang mô hình Holding Company.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="text-amber-400 flex-shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold mb-2">Quỹ Từ thiện Gia tộc</h4>
            <p className="text-xs text-blue-100/70 leading-relaxed">
              Đề xuất trích 2% lợi nhuận hằng năm để thành lập quỹ học bổng mang tên gia đình.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="text-amber-400 flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold mb-2">Đào tạo thế hệ kế cận</h4>
            <p className="text-xs text-blue-100/70 leading-relaxed">
              Lộ trình 12 tháng hướng dẫn quản lý tài chính cơ bản cho các thành viên Gen Z.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
