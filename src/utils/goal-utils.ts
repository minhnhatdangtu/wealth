export const getGoalStatus = (currentAmount: number, targetAmount: number) => {
  const percent = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;
  
  if (percent >= 100) {
    return { text: 'Đã đạt mục tiêu', bg: 'bg-emerald-100', textCol: 'text-emerald-700' };
  } else if (percent >= 80) {
    return { text: 'Sắp về đích', bg: 'bg-blue-100', textCol: 'text-blue-700' };
  } else if (percent >= 30) {
    return { text: 'Đang tăng trưởng', bg: 'bg-indigo-100', textCol: 'text-indigo-700' };
  } else {
    return { text: 'Mới khởi động', bg: 'bg-gray-100', textCol: 'text-gray-700' };
  }
};

export const formatGoalDeadline = (deadline: string) => {
  if (!deadline) return '2028';
  const parts = deadline.split('-');
  if (parts.length === 3) {
    return `Tháng ${parseInt(parts[1], 10)}, ${parts[0]}`;
  }
  return deadline;
};

export const getCategoryColor = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('chứng khoán')) {
    return { hex: '#D97706', twBg: 'bg-amber-600', twText: 'text-amber-700', twBgLight: 'bg-amber-100/60' };
  }
  if (t.includes('chứng chỉ quỹ')) {
    return { hex: '#059669', twBg: 'bg-emerald-600', twText: 'text-emerald-700', twBgLight: 'bg-emerald-100/60' };
  }
  if (t.includes('tiết kiệm')) {
    return { hex: '#3B82F6', twBg: 'bg-blue-600', twText: 'text-blue-700', twBgLight: 'bg-blue-100/60' };
  }
  if (t.includes('bất động sản')) {
    return { hex: '#182a5c', twBg: 'bg-primary', twText: 'text-primary', twBgLight: 'bg-indigo-100/60' };
  }
  if (t.includes('vàng')) {
    return { hex: '#F59E0B', twBg: 'bg-amber-500', twText: 'text-amber-800', twBgLight: 'bg-amber-100' };
  }
  return { hex: '#64748b', twBg: 'bg-slate-500', twText: 'text-slate-700', twBgLight: 'bg-slate-100' };
};
