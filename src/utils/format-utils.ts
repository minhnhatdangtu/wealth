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
export const parseCurrency = (val: string): number => {
  if (!val) return 0;
  // Loại bỏ mọi ký tự không phải số (giả định VNĐ không có xu/hào)
  const cleaned = val.replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
};

export const parseDecimal = (val: string): number => {
  if (!val) return 0;
  // Chuẩn hóa: bỏ dấu chấm (phần ngàn), đổi dấu phẩy sang dấu chấm (chuẩn float)
  const cleaned = val.replace(/\./g, '').replace(/,/g, '.');
  return parseFloat(cleaned) || 0;
};

// TIỆN ÍCH HIỂN THỊ nhanh
export const fmtVND = (v: number) => formatCurrency(v, 0);
