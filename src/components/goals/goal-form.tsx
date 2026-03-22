'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoalType, useGoals } from '@/store/GoalContext';
import { usePortfolio } from '@/store/PortfolioContext';
import { formatCurrency, parseCurrency } from '@/utils/format-utils';
import { ArrowLeft, Target, Home, GraduationCap, ShieldCheck, PiggyBank, Car, Plane, Briefcase } from 'lucide-react';
import { getGoalStatus } from '@/utils/goal-utils';
import Link from 'next/link';

const AVAILABLE_ICONS = [
  { name: 'Home', icon: Home, bg: 'bg-amber-100/60', text: 'text-amber-700', progressColor: 'bg-amber-600', trackColor: 'bg-amber-100' },
  { name: 'GraduationCap', icon: GraduationCap, bg: 'bg-primary', text: 'text-white', progressColor: 'bg-[#182a5c]', trackColor: 'bg-gray-100' },
  { name: 'ShieldCheck', icon: ShieldCheck, bg: 'bg-amber-100', text: 'text-amber-700', progressColor: 'bg-[#b46505]', trackColor: 'bg-amber-100/50' },
  { name: 'PiggyBank', icon: PiggyBank, bg: 'bg-rose-100', text: 'text-rose-700', progressColor: 'bg-rose-500', trackColor: 'bg-rose-100' },
  { name: 'Target', icon: Target, bg: 'bg-indigo-100', text: 'text-indigo-700', progressColor: 'bg-indigo-500', trackColor: 'bg-indigo-100' },
  { name: 'Car', icon: Car, bg: 'bg-cyan-100', text: 'text-cyan-700', progressColor: 'bg-cyan-500', trackColor: 'bg-cyan-100' },
  { name: 'Plane', icon: Plane, bg: 'bg-fuchsia-100', text: 'text-fuchsia-700', progressColor: 'bg-fuchsia-500', trackColor: 'bg-fuchsia-100' },
  { name: 'Briefcase', icon: Briefcase, bg: 'bg-slate-100', text: 'text-slate-700', progressColor: 'bg-slate-700', trackColor: 'bg-slate-200' },
];

export function GoalForm({ initialData }: { initialData?: GoalType }) {
  const router = useRouter();
  const { addGoal, updateGoal } = useGoals();
  const { assets } = usePortfolio();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    description: '',
    iconName: 'Target',
    isHero: false,
  });

  useEffect(() => {
    if (initialData) {
      // For date fields, if initialData has a valid YYYY-MM-DD or we can parse it
      let parsedDate = initialData.deadline;
      // Convert "Tháng 12, 2028" or "2032" to nearest valid date if possible, else leave it if it's already YYYY-MM-DD
      // To keep it simple, we just pass the raw value. If it's a legacy string, HTML5 date input might be blank.
      
      setFormData({
        name: initialData.name,
        targetAmount: initialData.targetAmount.toString(),
        deadline: parsedDate,
        description: initialData.description,
        iconName: initialData.iconName,
        isHero: initialData.isHero,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, [fieldName]: rawValue }));
  };

  const formatCurrencyForm = (val: string) => {
    if (!val) return '';
    const num = parseInt(val, 10);
    if (isNaN(num)) return '';
    return formatCurrency(num);
  };

  const handleIconSelect = (iconName: string) => {
    setFormData(prev => ({ ...prev, iconName }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedIcon = AVAILABLE_ICONS.find(i => i.name === formData.iconName) || AVAILABLE_ICONS[0];
    const targetAmt = parseFloat(formData.targetAmount) || 0;
    const currentAmt = isEditing && initialData ? assets.filter(a => a.goalId === initialData.id).reduce((sum, a) => sum + a.value, 0) : 0;
    
    const statusData = getGoalStatus(currentAmt, targetAmt);
    
    const payload = {
      name: formData.name,
      targetAmount: targetAmt,
      currentAmount: currentAmt,
      deadline: formData.deadline,
      description: formData.description,
      iconName: formData.iconName,
      isHero: formData.isHero,
      statusText: statusData.text,
      iconBgColor: selectedIcon.bg,
      iconTextColor: selectedIcon.text,
      statusBgColor: statusData.bg,
      statusTextColor: statusData.textCol,
      progressColor: selectedIcon.progressColor,
      trackColor: selectedIcon.trackColor,
    };

    if (isEditing && initialData) {
      updateGoal(initialData.id, payload);
    } else {
      addGoal(payload);
    }

    router.push('/goals');
  };

  // Preview current status calculation for UI
  const realCurrentAmt = isEditing && initialData ? assets.filter(a => a.goalId === initialData.id).reduce((sum, a) => sum + a.value, 0) : 0;
  const statusPreview = getGoalStatus(realCurrentAmt, parseFloat(formData.targetAmount) || 0);

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-8">
        <Link href="/goals" className="inline-flex items-center text-sm font-bold text-text-muted hover:text-primary transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Quay lại Mục tiêu
        </Link>
        <h1 className="text-3xl font-bold text-primary tracking-tight">
          {isEditing ? 'Chỉnh sửa Mục tiêu' : 'Thiết kế Mục tiêu mới'}
        </h1>
        <p className="text-text-muted mt-2">
          {isEditing ? 'Cập nhật lại số dư hoặc đích đến cho mục tiêu của bạn.' : 'Lập kế hoạch tài chính rõ ràng để hiện thực hóa ước mơ.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[32px] p-8 mt-4 shadow-sm border border-gray-100">
        
        {/* Basic Info */}
        <div className="space-y-6 mb-8">
          <h3 className="text-lg font-bold text-primary border-b border-gray-100 pb-2">Thông tin chung</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-text-main mb-2">Tên mục tiêu *</label>
              <input 
                type="text" 
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="VD: Quỹ học vấn cho con" 
                className="w-full bg-gray-50 border border-gray-200 text-text-main text-sm rounded-xl focus:ring-primary focus:border-primary block p-3 font-medium outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-text-main mb-2">Mốc thời gian</label>
              <input 
                type="date" 
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 text-text-main text-sm rounded-xl focus:ring-primary focus:border-primary block p-3 font-medium outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-text-main mb-2">Mô tả chi tiết</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="VD: Du học bậc Đại học tại Anh" 
              className="w-full bg-gray-50 border border-gray-200 text-text-main text-sm rounded-xl focus:ring-primary focus:border-primary block p-3 font-medium outline-none transition-colors min-h-[80px]"
            />
          </div>
        </div>

        {/* Financial Info */}
        <div className="space-y-6 mb-8">
          <h3 className="text-lg font-bold text-primary border-b border-gray-100 pb-2">Chỉ tiêu tài chính</h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-bold text-text-main mb-2">Số tiền đích (VNĐ) *</label>
              <input 
                type="text" 
                required
                value={formatCurrencyForm(formData.targetAmount)}
                onChange={(e) => handleCurrencyChange(e, 'targetAmount')}
                placeholder="VD: 10.000.000.000" 
                className="w-full bg-gray-50 border border-gray-200 text-text-main text-sm rounded-xl focus:ring-primary focus:border-primary block p-3 font-bold tracking-tighter outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Customization */}
        <div className="space-y-6 mb-10">
          <h3 className="text-lg font-bold text-primary border-b border-gray-100 pb-2">Tùy chỉnh Giao diện</h3>

          <div>
            <label className="block text-sm font-bold text-text-main mb-3">Chọn Biểu tượng</label>
            <div className="flex flex-wrap gap-3">
              {AVAILABLE_ICONS.map((item) => {
                const IconComp = item.icon;
                const isSelected = formData.iconName === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleIconSelect(item.name)}
                    className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                      isSelected 
                        ? `${item.bg} ${item.text} ring-2 ring-primary ring-offset-1` 
                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                    }`}
                  >
                    <IconComp className="w-6 h-6" />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-sm font-bold text-text-main mb-2">Tình trạng (Tự động tính toán)</label>
              <div className="w-full bg-gray-100 border border-gray-200 text-text-muted text-sm rounded-xl p-3 font-bold cursor-not-allowed flex items-center justify-between">
                <span>{statusPreview.text}</span>
                <span className="text-xs bg-white px-2 py-0.5 rounded-md shadow-sm border border-gray-100 text-primary">{((realCurrentAmt / (parseFloat(formData.targetAmount) || 1)) * 100).toFixed(1)}%</span>
              </div>
            </div>
            <div className="flex items-center mt-8 cursor-pointer">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="isHero"
                  checked={formData.isHero}
                  onChange={handleChange}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                <span className="ml-3 text-sm font-bold text-text-main">Đặt làm Mục tiêu Chính</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-100 gap-4">
          <Link href="/goals" className="px-6 py-3 rounded-xl font-bold bg-gray-100 text-text-main hover:bg-gray-200 transition-colors">
            Hủy bỏ
          </Link>
          <button type="submit" className="px-8 py-3 rounded-xl font-bold bg-primary text-white hover:bg-primary-dark transition-colors shadow-sm">
            {isEditing ? 'Cập nhật Mục tiêu' : 'Tạo Mục tiêu'}
          </button>
        </div>
      </form>
    </div>
  );
}
