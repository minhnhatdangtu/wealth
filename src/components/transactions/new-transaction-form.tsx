'use client';

import { 
  CreditCard, Wallet, TrendingUp, Building2, 
  LineChart, PiggyBank, ShoppingBag, Calendar, 
  Receipt, X, ShieldCheck, Coins, Landmark, Briefcase, MoreHorizontal, CheckCircle2, Clock
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTransactions, TransactionType } from '@/store/TransactionContext';
import { formatCurrency, parseCurrency } from '@/utils/format-utils';

const assetCategories = [
  { id: 'bds', label: 'Bất động sản', icon: Building2 },
  { id: 'chungkhoan', label: 'Chứng khoán', icon: LineChart },
  { id: 'tietkiem', label: 'Tiết kiệm', icon: PiggyBank },
  { id: 'sinhhoat', label: 'Sinh hoạt', icon: ShoppingBag },
  { id: 'vang', label: 'Vàng', icon: Coins },
  { id: 'chungchiquy', label: 'Chứng chỉ quỹ', icon: Landmark },
  { id: 'congviec', label: 'Công việc', icon: Briefcase },
  { id: 'khac', label: 'Khác', icon: MoreHorizontal },
];

export function NewTransactionForm({ 
  initialData, 
  transactionId 
}: { 
  initialData?: TransactionType; 
  transactionId?: number; 
}) {
  const router = useRouter();
  const { addTransaction, updateTransaction } = useTransactions();
  
  const isEditMode = !!initialData && transactionId !== undefined;

  const [cashFlow, setCashFlow] = useState(() => {
    if (!initialData) return 'expense';
    const sub = initialData.subtitle || '';
    if (sub.endsWith('Thu nhập') || sub.endsWith('Thu nhập thụ động')) return 'income';
    if (sub.endsWith('Đầu tư') || sub.endsWith('Tái đầu tư')) return 'investment';
    return 'expense';
  });

  const [assetType, setAssetType] = useState(() => {
    if (!initialData) return 'chungkhoan';
    const label = initialData.subtitle.split(' • ')[0];
    const cat = assetCategories.find(c => c.label === label);
    return cat ? cat.id : 'khac';
  });

  const [amount, setAmount] = useState(() => {
    if (!initialData) return '';
    return initialData.amount.replace(/[-+]/g, '');
  });

  const [date, setDate] = useState(() => {
    return new Date().toISOString().split('T')[0]; // Mock date mapping for simplicity
  });

  const [title, setTitle] = useState(initialData?.title || '');
  const [txStatus, setTxStatus] = useState(initialData?.status || 'HOÀN THÀNH');
  
  const [showPopup, setShowPopup] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    if (!rawValue) {
      setAmount('');
      return;
    }
    const formatted = formatCurrency(parseInt(rawValue, 10));
    setAmount(formatted);
  };

  const handleSubmit = () => {
    const catObject = assetCategories.find(c => c.id === assetType);
    
    let cashFlowLabel = '';
    let sign = '';
    let amountColor = '';
    let iconBg = '';

    if (cashFlow === 'expense') {
      cashFlowLabel = 'Chi tiêu';
      sign = '-';
      amountColor = 'text-primary';
      iconBg = 'bg-rose-100 text-rose-700';
    } else if (cashFlow === 'income') {
      cashFlowLabel = 'Thu nhập';
      sign = '+';
      amountColor = 'text-amber-700';
      iconBg = 'bg-green-100 text-green-700';
    } else if (cashFlow === 'investment') {
      cashFlowLabel = 'Đầu tư';
      sign = '-'; 
      amountColor = 'text-primary'; 
      iconBg = 'bg-blue-100 text-blue-700';
    }

    const parsedAmount = parseCurrency(amount);

    const payload = {
      date: new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' }) + '\n10:00 AM',
      title: title || 'Giao dịch mới',
      subtitle: `${catObject?.label || 'Khác'} • ${cashFlowLabel}`,
      icon: catObject?.icon || MoreHorizontal,
      iconBg: iconBg,
      status: txStatus,
      statusBg: txStatus === 'HOÀN THÀNH' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700',
      amount: `${sign}${new Intl.NumberFormat('vi-VN').format(parsedAmount)}`,
      amountColor,
      type: cashFlow as 'income' | 'expense' | 'investment'
    };

    if (isEditMode) {
      updateTransaction(transactionId, payload);
    } else {
      addTransaction(payload);
    }

    setShowPopup(true);
  };

  const resetForm = () => {
    if (isEditMode) {
      router.push('/transactions');
    } else {
      setAmount('');
      setTitle('');
      setShowPopup(false);
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-border-subtle overflow-hidden relative">
      <div className="absolute top-0 left-12 right-12 h-1 bg-gradient-to-r from-primary-light via-primary to-primary-light rounded-b-lg opacity-80"></div>

      {/* Header */}
      <div className="text-center mb-12 mt-4">
        <h1 className="text-3xl font-bold text-primary mb-3">
          {isEditMode ? 'Cập Nhật Giao Dịch' : 'Ghi Nhận Giao Dịch'}
        </h1>
        <div className="flex items-center justify-center gap-4">
          <div className="h-px bg-gray-100 w-16"></div>
          <p className="text-sm font-medium text-text-muted">Tiêu chuẩn quản lý tài sản Legacy Wealth</p>
          <div className="h-px bg-gray-100 w-16"></div>
        </div>
      </div>

      <div className="space-y-10">
        {/* ROW 1: LOẠI GIAO DỊCH */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-4">
            Loại giao dịch
          </label>
          <div className="flex bg-gray-50/50 p-2 rounded-2xl border border-gray-100">
            <button 
              onClick={() => setCashFlow('expense')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all ${
                cashFlow === 'expense' 
                  ? 'bg-blue-50 text-blue-800 shadow-sm border border-blue-200' 
                  : 'text-text-muted hover:text-text-main hover:bg-gray-50'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Chi tiêu
            </button>
            <button 
              onClick={() => setCashFlow('income')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all ${
                cashFlow === 'income' 
                  ? 'bg-blue-50 text-blue-800 shadow-sm border border-blue-200' 
                  : 'text-text-muted hover:text-text-main hover:bg-gray-50'
              }`}
            >
              <Wallet className="w-4 h-4" />
              Thu nhập
            </button>
            <button 
              onClick={() => setCashFlow('investment')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all ${
                cashFlow === 'investment' 
                  ? 'bg-blue-50 text-blue-800 shadow-sm border border-blue-200' 
                  : 'text-text-muted hover:text-text-main hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Đầu tư
            </button>
          </div>
        </div>

        {/* ROW 2: GIÁ TRỊ GIAO DỊCH */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px bg-gray-100 flex-1"></div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted">
              Giá trị giao dịch
            </label>
            <div className="h-px bg-gray-100 flex-1"></div>
          </div>
          <div className="border border-gray-200 rounded-3xl p-6 sm:p-8 flex items-center justify-between bg-white focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-colors">
            <div className="flex items-baseline gap-4 w-full">
              <span className="text-4xl sm:text-5xl font-bold text-gray-300">VND</span>
              <input 
                type="text" 
                value={amount}
                onChange={handleAmountChange}
                placeholder="0"
                className="text-5xl sm:text-6xl font-bold text-primary w-full bg-transparent focus:outline-none placeholder-gray-300"
              />
            </div>
          </div>
        </div>

        {/* ROW 3: PHÂN LOẠI GIAO DỊCH */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted">
              Phân loại giao dịch
            </label>
            <button className="text-[11px] font-bold text-primary hover:underline">
              Tùy chỉnh danh mục
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {assetCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = assetType === cat.id;
              return (
                <button 
                  key={cat.id}
                  onClick={() => setAssetType(cat.id)}
                  className={`relative flex flex-col items-center justify-center gap-4 p-6 rounded-3xl border transition-all ${
                    isActive 
                      ? 'border-primary shadow-md' 
                      : 'border-gray-100 hover:border-gray-200 bg-white'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isActive ? 'bg-primary text-white' : 'bg-gray-50 text-text-muted'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-bold ${isActive ? 'text-primary' : 'text-text-main'}`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ROW 4: THỜI GIAN & MÔ TẢ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-4">
              Thời gian giao dịch
            </label>
            <div className="border border-gray-100 rounded-2xl p-4 flex items-center gap-3 bg-white focus-within:border-primary transition-colors hover:border-gray-200 group">
              <Calendar className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors shrink-0" />
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-sm font-bold text-text-main bg-transparent focus:outline-none cursor-text [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-4">
              Mô tả & Chứng từ
            </label>
            <div className="border border-gray-100 rounded-2xl p-4 flex items-center gap-3 bg-white focus-within:border-primary transition-colors hover:border-gray-200">
              <Receipt className="w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Thanh toán đợt 2 căn hộ Legacy Heights..."
                className="w-full text-sm font-medium text-text-main bg-transparent focus:outline-none placeholder-gray-300"
              />
            </div>
          </div>
        </div>

        {/* ROW 5: TRẠNG THÁI GIAO DỊCH */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-4">
            Trạng thái giao dịch
          </label>
          <div className="flex bg-gray-50/50 p-2 rounded-2xl border border-gray-100 w-full md:w-1/2">
            <button 
              onClick={() => setTxStatus('HOÀN THÀNH')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                txStatus === 'HOÀN THÀNH' 
                  ? 'bg-white text-green-700 shadow-sm border border-green-200/50' 
                  : 'text-text-muted hover:text-text-main hover:bg-gray-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Hoàn thành
            </button>
            <button 
              onClick={() => setTxStatus('ĐANG XỬ LÝ')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                txStatus === 'ĐANG XỬ LÝ' 
                  ? 'bg-white text-orange-700 shadow-sm border border-orange-200/50' 
                  : 'text-text-muted hover:text-text-main hover:bg-gray-50'
              }`}
            >
              <Clock className="w-4 h-4" />
              Đang xử lý
            </button>
          </div>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
        <button 
          onClick={() => router.push('/transactions')}
          className="text-sm font-bold text-text-muted hover:text-text-main flex items-center gap-2 px-6 py-4"
        >
          <X className="w-4 h-4" />
          Hủy bỏ sửa đổi
        </button>
        <button 
          onClick={handleSubmit}
          className="bg-primary hover:bg-primary-dark text-white text-sm font-bold flex items-center gap-2 px-10 py-4 rounded-xl shadow-lg shadow-primary/20 transition-transform hover:scale-105"
        >
          <ShieldCheck className="w-5 h-5" />
          {isEditMode ? 'Lưu thay đổi' : 'Xác nhận ghi nhận'}
        </button>
      </div>

      {/* Success Modal Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl animate-fade-in border border-gray-100">
            <h3 className="text-2xl font-bold text-primary mb-2 text-center">
              {isEditMode ? 'Đã cập nhật!' : 'Đã lưu giao dịch!'}
            </h3>
            <p className="text-sm text-text-muted text-center mb-8">
              {isEditMode ? 'Giao dịch của bạn đã được cập nhật.' : 'Bạn có muốn tiếp tục tạo thêm giao dịch mới không?'}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => router.push('/transactions')}
                className="flex-1 py-4 px-4 bg-gray-50 text-text-muted hover:bg-gray-100 hover:text-text-main rounded-xl font-bold text-sm transition-colors border border-gray-200"
              >
                {isEditMode ? 'Về Danh sách' : 'Không'}
              </button>
              {!isEditMode && (
                <button 
                  onClick={resetForm}
                  className="flex-1 py-4 px-4 bg-primary text-white hover:bg-primary-dark rounded-xl font-bold text-sm transition-colors shadow-md shadow-primary/20"
                >
                  Có
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
