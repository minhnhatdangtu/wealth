/**
 * Chuẩn hóa định dạng số cho toàn hệ thống:
 * - Dấu chấm (.) phân cách phần ngàn
 * - Dấu phẩy (,) phân cách thập phân
 */

// ĐỊNH DẠNG (DISPLAY)
export const formatCurrency = (value: number, decimals: number = 0) => {
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatNumber = (value: number, decimals: number = 2) => {
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
};

// PHÂN TÍCH (PARSING)
export const parseCurrency = (val: string | number): number => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  // Loại bỏ mọi ký tự không phải số
  const cleaned = val.replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
};

/**
 * Phân tích chuỗi số sang số thực (float).
 * Hỗ trợ cả chuẩn Việt Nam (0,5) và chuẩn Máy tính (0.5) 
 * Ưu tiên nhận diện chuẩn Việt Nam có dấu phẩy.
 */
export const parseDecimal = (val: string | number): number => {
  if (typeof val === 'number') return val;
  if (!val) return 0;

  // Loại bỏ các ký tự đơn vị (m2, Chỉ, CCQ, ...)
  let cleaned = val.toString().replace(/[^0-9,.]/g, '').trim();
  if (!cleaned) return 0;

  // TH1: Có dấu phẩy -> Chắc chắn chuẩn VN (1.234,56)
  if (cleaned.includes(',')) {
    // Xóa mọi dấu chấm (phần ngàn), đổi phẩy sang chấm
    cleaned = cleaned.replace(/\./g, '').replace(/,/g, '.');
  } 
  // TH2: Không có dấu phẩy nhưng có dấu chấm
  else if (cleaned.includes('.')) {
    // Nếu có NHIỀU dấu chấm -> Là phần ngàn VN (1.000.000)
    const dotCount = (cleaned.match(/\./g) || []).length;
    if (dotCount > 1) {
      cleaned = cleaned.replace(/\./g, '');
    } else {
      // Nếu chỉ có 1 dấu chấm, có thể là 1.000 (ngàn) hoặc 1.5 (thập phân)
      // Nếu có đúng 3 chữ số sau dấu chấm -> Coi là phần ngàn (1.000)
      // Ngoại trừ trường hợp nó bắt đầu bằng 0 (0.500) -> Thập phân
      const parts = cleaned.split('.');
      if (parts[1].length === 3 && parts[0] !== '0') {
        cleaned = cleaned.replace(/\./g, '');
      } else {
        // Giữ nguyên dấu chấm (thập phân kiểu JS)
      }
    }
  }

  return parseFloat(cleaned) || 0;
};

// TIỆN ÍCH HIỂN THỊ nhanh
export const fmtVND = (v: number) => formatCurrency(v, 0);
