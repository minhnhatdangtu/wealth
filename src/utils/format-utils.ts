/**
 * Định dạng số tùy chỉnh theo quy tắc:
 * - Dấu chấm (.) phân cách phần ngàn
 * - Dấu phẩy (,) phân cách thập phân
 * Không phụ thuộc vào môi trường locale để đảm bảo tính nhất quán tuyệt đối.
 */

// ĐỊNH DẠNG (DISPLAY)
export const formatCurrency = (value: number, decimals: number = 0) => {
  const rounded = Math.round(value);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const formatNumber = (value: number, decimals: number = 2) => {
  if (value === 0) return '0';
  
  // Lấy phần nguyên và phần thập phân chính xác
  const fixed = value.toFixed(decimals);
  let [whole, frac] = fixed.split('.');
  
  // Định dạng phần nguyên với dấu chấm hàng ngàn
  const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
  // Xử lý phần thập phân (loại bỏ số 0 thừa ở cuối)
  if (frac) {
    frac = frac.replace(/0+$/, '');
    if (frac.length > 0) {
      return `${formattedWhole},${frac}`;
    }
  }
  
  return formattedWhole;
};

// PHÂN TÍCH (PARSING)
export const parseCurrency = (val: string | number): number => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  return parseInt(val.toString().replace(/[^0-9]/g, ''), 10) || 0;
};

export const parseDecimal = (val: string | number): number => {
  if (typeof val === 'number') return val;
  if (!val) return 0;

  let cleaned = val.toString().replace(/[^0-9,.]/g, '').trim();
  if (!cleaned) return 0;

  // Nếu có dấu phẩy -> Coi là chuẩn Việt Nam
  if (cleaned.includes(',')) {
    // 1.000,5 -> 1000.5
    cleaned = cleaned.replace(/\./g, '').replace(/,/g, '.');
  } 
  // Nếu chỉ có dấu chấm -> Phân biệt (1.000) và (0.5)
  else if (cleaned.includes('.')) {
    const dots = cleaned.split('.');
    if (dots.length > 2) {
      // 1.000.000 -> 1000000
      cleaned = cleaned.replace(/\./g, '');
    } else {
      // Nếu 3 chữ số sau dấu chấm và số lớn hơn hoặc bằng 1000 -> Phần ngàn
      const post = dots[1];
      const pre = dots[0];
      if (post.length === 3 && parseFloat(cleaned) >= 1000 && pre !== '0') {
        cleaned = cleaned.replace(/\./g, '');
      }
      // Ngược lại giữ nguyên cho chuẩn JS (0.5)
    }
  }

  const res = parseFloat(cleaned);
  return isNaN(res) ? 0 : res;
};

// TIỆN ÍCH HIỂN THỊ nhanh
export const fmtVND = (v: number) => formatCurrency(v, 0);
