'use client';

import { 
  Building2, TrendingUp, Gem, Landmark, PieChart, 
  X, ShieldCheck, CheckCircle2, Clock, Briefcase, Activity, Archive, MapPin, Calculator, Percent
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { usePortfolio, AssetType } from '@/store/PortfolioContext';
import { useGoals } from '@/store/GoalContext';

const assetCategories = [
  { id: 'tietkiem', label: 'Tiết kiệm & Quỹ', icon: Landmark },
  { id: 'vang', label: 'Vàng & kim loại', icon: Gem },
  { id: 'chungkhoan', label: 'Chứng khoán', icon: TrendingUp },
  { id: 'chungchiquy', label: 'Chứng chỉ quỹ', icon: PieChart },
  { id: 'bds', label: 'Bất động sản', icon: Building2 },
];

export function NewAssetForm({ 
  initialData, 
  assetId 
}: { 
  initialData?: AssetType; 
  assetId?: number; 
}) {
  const router = useRouter();
  const { addAsset, updateAsset } = usePortfolio();
  const { goals } = useGoals();

  const isEditMode = !!initialData && assetId !== undefined;

  const [selectedGoalId, setSelectedGoalId] = useState<number | ''>(initialData?.goalId || '');
  const availableGoals = goals.filter(g => g.targetAmount > 0 && (g.currentAmount / g.targetAmount) < 1);


  // Global standard 
  const [assetHorizon, setAssetHorizon] = useState<'daihan' | 'nganhan'>(initialData?.horizon || 'daihan');
  const [txStatus, setTxStatus] = useState(initialData?.status || 'HOẠT ĐỘNG');
  const [startDate, setStartDate] = useState(initialData?.startDate || new Date().toISOString().split('T')[0]);
  const [showPopup, setShowPopup] = useState(false);

  const [assetType, setAssetType] = useState(() => {
    if (!initialData) return 'tietkiem';
    const cat = assetCategories.find(c => c.label === initialData.type);
    return cat ? cat.id : 'tietkiem';
  });

  // Shared generic text attributes
  const [name, setName] = useState(initialData?.name || '');
  
  // Savings states
  const [monthTerm, setMonthTerm] = useState(() => {
    if (initialData?.type === 'Tiết kiệm & Quỹ') return parseFloat(initialData.quantity) || 0;
    return 6;
  });
  const [interestRate, setInterestRate] = useState(5.5);
  
  // Real Estate states
  const [bdsType, setBdsType] = useState('Căn hộ');
  const [bdsArea, setBdsArea] = useState(() => {
    if (initialData?.type === 'Bất động sản') return parseFloat(initialData.quantity) || 0;
    return 0;
  });

  // Number/Money tracking 
  // Unified helper parser
  const parseNum = (val: string) => parseInt(val.replace(/\./g, '').replace(/,/g, '') || '0', 10);
  const parseDecimal = (val: string) => {
    // Convert Vietnamese decimal (,) or generic (.) to standard float
    const cleaned = val.replace(/\./g, '').replace(/,/g, '.');
    return parseFloat(cleaned) || 0;
  };
  const parseStr = (num: number) => new Intl.NumberFormat('vi-VN').format(num);

  const [quantityVal, setQuantityVal] = useState<string>(() => {
    if (initialData && initialData.type !== 'Tiết kiệm & Quỹ' && initialData.type !== 'Bất động sản') {
      // Keep decimal if present in initial data
      const q = parseFloat(initialData.quantity.replace(/[^0-9,.]/g, '').replace(',', '.'));
      return isNaN(q) ? '' : new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 4 }).format(q);
    }
    return '';
  });

  // Manual Costs (For Savings, Real Estate)
  const [costManual, setCostManual] = useState<string>(initialData ? parseStr(initialData.cost) : '');
  const [valueManual, setValueManual] = useState<string>(initialData ? parseStr(initialData.value) : '');

  // Buying/Market Tracking (For Gold, Stocks, Mutual Funds)
  const [buyPrice, setBuyPrice] = useState<string>(() => {
    if (initialData && ['Vàng & kim loại', 'Chứng khoán', 'Chứng chỉ quỹ'].includes(initialData.type)) {
      const q = parseDecimal(initialData.quantity);
      if (q && q > 0) {
        return parseStr(Math.round(initialData.cost / q));
      }
    }
    return '';
  });
  
  const [marketPrice, setMarketPrice] = useState<string>(() => {
    if (initialData && ['Vàng & kim loại', 'Chứng khoán', 'Chứng chỉ quỹ'].includes(initialData.type)) {
      const q = parseDecimal(initialData.quantity);
      if (q && q > 0) {
        return parseStr(Math.round(initialData.value / q));
      }
    }
    return '';
  });

  // Handle Input Changes enforcing numeric formatting
  const handleVndFormat = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    setter(rawVal ? parseStr(parseInt(rawVal, 10)) : '');
  };

  const handleQtyFormat = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow digits and only ONE decimal separator (comma or dot)
    const val = e.target.value;
    const sanitized = val.replace(/[^0-9,.]/g, '');
    
    // Check if it's just a decimal dot/comma to allow typing it
    if (sanitized === ',' || sanitized === '.') {
      setQuantityVal('0,');
      return;
    }
    
    setQuantityVal(sanitized);
  };


  // Computations
  const computedVals = useMemo(() => {
    if (assetType === 'tietkiem') {
      const c = parseNum(costManual);
      const v = c + (c * (interestRate / 100) * (monthTerm / 12));
      return { cost: c, value: Math.round(v) };
    } 
    else if (['vang', 'chungkhoan', 'chungchiquy'].includes(assetType)) {
      const q = parseDecimal(quantityVal) || 0;

      const bp = parseNum(buyPrice);
      const mp = parseNum(marketPrice);
      return { cost: q * bp, value: q * mp };
    }
    else {
      // bds
      return { cost: parseNum(costManual), value: parseNum(valueManual) };
    }
  }, [assetType, costManual, interestRate, monthTerm, quantityVal, buyPrice, marketPrice, valueManual]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const catObject = assetCategories.find(c => c.id === assetType) || assetCategories[0];
      
      let iconBg = 'bg-gray-100 text-primary';
      if (assetType === 'bds') iconBg = 'bg-primary/10 text-primary';
      if (assetType === 'tietkiem') iconBg = 'bg-emerald-100 text-emerald-700';

      let finalQuantityString = '1';
      if (assetType === 'tietkiem') finalQuantityString = `1 Tài khoản`;
      if (assetType === 'vang') finalQuantityString = `${quantityVal || '0'} Chỉ`;
      if (assetType === 'chungkhoan') finalQuantityString = `${quantityVal || '0'} CP`;
      if (assetType === 'chungchiquy') finalQuantityString = `${quantityVal || '0'} CCQ`;
      if (assetType === 'bds') finalQuantityString = `${parseStr(bdsArea)} m2`;

      const payload = {
        name: name || 'Tài sản mới',
        type: catObject.label,
        // We don't send the icon function/component to Firestore
        iconBg: iconBg,
        quantity: finalQuantityString,
        cost: computedVals.cost,
        value: computedVals.value,
        status: txStatus,
        horizon: assetHorizon,
        startDate: startDate,
        goalId: selectedGoalId === '' ? null : Number(selectedGoalId)
      };


      if (isEditMode && assetId !== undefined) {
        await updateAsset(assetId, payload as any);
      } else {
        await addAsset(payload as any);
      }
      
      setShowPopup(true);
    } catch (error) {
      console.error("Lỗi khi lưu tài sản:", error);
      alert("Không thể lưu tài sản. Vui lòng kiểm tra lại kết nối hoặc cấu hình Firebase.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const resetForm = () => {
    if (isEditMode) {
      router.push('/portfolio');
    } else {
      setName('');
      setCostManual('');
      setValueManual('');
      setQuantityVal('');
      setBuyPrice('');
      setMarketPrice('');
      setMonthTerm(6);
      setInterestRate(5.5);
      setBdsArea(0);
      setSelectedGoalId('');
      setShowPopup(false);
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-border-subtle overflow-hidden relative">
      <div className="absolute top-0 left-12 right-12 h-1 bg-gradient-to-r from-primary-light via-primary to-primary-light rounded-b-lg opacity-80"></div>

      {/* Header */}
      <div className="text-center mb-12 mt-4">
        <h1 className="text-3xl font-bold text-primary mb-3">
          {isEditMode ? 'Cập Nhật Tài Sản' : 'Thêm Tài Sản Mới'}
        </h1>
        <div className="flex items-center justify-center gap-4">
          <div className="h-px bg-gray-100 w-16"></div>
          <p className="text-sm font-medium text-text-muted">Tiêu chuẩn bản đồ tài sản Legacy Wealth</p>
          <div className="h-px bg-gray-100 w-16"></div>
        </div>
      </div>

      <div className="space-y-10">
        
        {/* ROW 1: TẦM NHÌN ĐẦU TƯ */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-4">
            Định hướng đầu tư
          </label>
          <div className="flex bg-gray-50/50 p-2 rounded-2xl border border-gray-100 w-full md:w-1/2">
            <button 
              onClick={() => setAssetHorizon('daihan')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                assetHorizon === 'daihan' 
                  ? 'bg-blue-50 text-blue-800 shadow-sm border border-blue-200' 
                  : 'text-text-muted hover:text-text-main hover:bg-gray-50'
              }`}
            >
              <Activity className="w-4 h-4" />
              Dài hạn
            </button>
            <button 
              onClick={() => setAssetHorizon('nganhan')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                assetHorizon === 'nganhan' 
                  ? 'bg-amber-50 text-amber-800 shadow-sm border border-amber-200' 
                  : 'text-text-muted hover:text-text-main hover:bg-gray-50'
              }`}
            >
              <Clock className="w-4 h-4" />
              Ngắn hạn
            </button>
          </div>
        </div>

        {/* LINK GOAL */}
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-4">
            Liên kết Mục tiêu
          </label>
          <div className="border border-gray-100 rounded-2xl p-4 flex items-center bg-white focus-within:border-primary transition-colors">
            <select 
              value={selectedGoalId} 
              onChange={e => setSelectedGoalId(e.target.value === '' ? '' : parseInt(e.target.value))}
              className="w-full text-sm font-bold text-text-main bg-transparent outline-none cursor-pointer"
            >
              <option value="">-- Không liên kết --</option>
              {availableGoals.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ROW 2: PHÂN LOẠI TÀI SẢN */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted">
              Phân loại tài sản
            </label>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {assetCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = assetType === cat.id;
              return (
                <button 
                  key={cat.id}
                  onClick={() => setAssetType(cat.id)}
                  className={`relative flex flex-col items-center justify-center gap-4 p-4 rounded-3xl border transition-all ${
                    isActive 
                      ? 'border-primary shadow-md bg-white' 
                      : 'border-transparent hover:border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isActive ? 'bg-primary text-white shadow-inner shadow-black/10' : 'bg-white text-text-muted border border-gray-100'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs text-center font-bold ${isActive ? 'text-primary' : 'text-text-main'}`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-gray-100 w-full" />

        {/* DYNAMICS: TIẾT KIỆM & QUỸ */}
        {assetType === 'tietkiem' && (
          <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-4">Tên Ngân hàng / Tổ chức</label>
                <div className="border border-gray-100 rounded-2xl p-4 flex items-center bg-white focus-within:border-primary transition-colors">
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ví dụ: Techcombank, VCB..." className="w-full text-sm font-bold text-text-main bg-transparent outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-4">Kỳ hạn (Tháng)</label>
                  <div className="border border-gray-100 rounded-2xl p-4 flex items-center justify-between bg-white focus-within:border-primary">
                    <input type="number" value={monthTerm || ''} onChange={e => setMonthTerm(parseInt(e.target.value) || 0)} placeholder="6" className="w-full text-sm font-bold text-text-main bg-transparent outline-none" />
                    <span className="text-xs font-bold text-gray-400">Tháng</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-4">Lãi suất</label>
                  <div className="border border-gray-100 rounded-2xl p-4 flex items-center justify-between bg-white focus-within:border-primary">
                    <input type="number" step="0.1" value={interestRate || ''} onChange={e => setInterestRate(parseFloat(e.target.value) || 0)} placeholder="5.5" className="w-full text-sm font-bold text-text-main bg-transparent outline-none" />
                    <Percent className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-4">Giá vốn (Tiền gửi gốc)</label>
                <div className="border border-gray-100 rounded-3xl p-6 flex justify-between items-center bg-gray-50 focus-within:bg-white focus-within:border-primary transition-all">
                  <span className="text-xl font-bold text-gray-300 mr-4">VND</span>
                  <input type="text" value={costManual} onChange={handleVndFormat(setCostManual)} placeholder="0" className="w-full text-3xl font-bold text-text-main bg-transparent outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-primary mb-4">Giá trị hiện tại tính toán</label>
                <div className="border border-primary/20 rounded-3xl p-6 flex justify-between items-center bg-primary/5">
                  <span className="text-xl font-bold text-primary/30 mr-4">VND</span>
                  <input type="text" value={parseStr(computedVals.value)} readOnly className="w-full text-3xl font-bold text-primary bg-transparent outline-none pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DYNAMICS: VÀNG & CHỨNG KHOÁN & CCQ */}
        {['vang', 'chungkhoan', 'chungchiquy'].includes(assetType) && (
          <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-4">
                  {assetType === 'vang' ? 'Loại vàng' : assetType === 'chungkhoan' ? 'Mã Cổ phiếu' : 'Tên Chứng chỉ quỹ'}
                </label>
                <div className="border border-gray-100 rounded-2xl p-4 flex items-center bg-white focus-within:border-primary transition-colors">
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ví dụ: SJC, FPT, DCDS..." className="w-full text-sm font-bold text-text-main bg-transparent outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-4">Số lượng</label>
                <div className="border border-gray-100 rounded-2xl p-4 flex items-center justify-between bg-white focus-within:border-primary">
                  <input type="text" value={quantityVal} onChange={handleQtyFormat} placeholder="0" className="w-full text-sm font-bold text-text-main bg-transparent outline-none" />
                  <span className="text-xs font-bold text-gray-400">
                    {assetType === 'vang' ? 'Chỉ' : assetType === 'chungkhoan' ? 'CP' : 'CCQ'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-4">Đơn Giá Mua</label>
                <div className="border border-gray-100 rounded-2xl p-4 flex justify-between items-center bg-gray-50 focus-within:bg-white focus-within:border-primary transition-all">
                  <input type="text" value={buyPrice} onChange={handleVndFormat(setBuyPrice)} placeholder="0" className="w-full text-lg font-bold text-text-main bg-transparent outline-none" />
                  <span className="text-xs font-bold text-gray-400">VNĐ/{assetType === 'vang' ? 'Chỉ' : assetType === 'chungkhoan' ? 'CP' : 'CCQ'}</span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-primary mb-4">Đơn Giá Thị Trường</label>
                <div className="border border-gray-100 rounded-2xl p-4 flex justify-between items-center bg-gray-50 focus-within:bg-white focus-within:border-primary transition-all">
                  <input type="text" value={marketPrice} onChange={handleVndFormat(setMarketPrice)} placeholder="0" className="w-full text-lg font-bold text-text-main bg-transparent outline-none" />
                  <span className="text-xs font-bold text-gray-400">VNĐ/{assetType === 'vang' ? 'Chỉ' : assetType === 'chungkhoan' ? 'CP' : 'CCQ'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest font-bold text-text-muted mb-2">Tổng giá vốn {assetType === 'chungkhoan' && '(gồm phí)'}</p>
                <p className="text-xl font-bold text-text-main">{parseStr(computedVals.cost)} <span className="text-sm font-semibold text-gray-400 ml-1">VNĐ</span></p>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-2">Giá trị cập nhật</p>
                <p className="text-xl font-bold text-primary">{parseStr(computedVals.value)} <span className="text-sm font-semibold text-primary/50 ml-1">VNĐ</span></p>
              </div>
            </div>
          </div>
        )}

        {/* DYNAMICS: BẤT ĐỘNG SẢN */}
        {assetType === 'bds' && (
          <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-4">Định danh dự án / Vị trí</label>
                <div className="border border-gray-100 rounded-2xl p-4 flex items-center gap-3 bg-white focus-within:border-primary transition-colors hover:border-gray-200">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ví dụ: Căn hộ số 12 Landmark 81..." className="w-full text-sm font-bold text-text-main bg-transparent outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-4">Phân loại BĐS</label>
                  <div className="border border-gray-100 rounded-2xl p-4 flex items-center bg-white focus-within:border-primary transition-colors">
                    <input type="text" value={bdsType} onChange={e => setBdsType(e.target.value)} placeholder="Căn hộ" className="w-full text-sm font-bold text-text-main bg-transparent outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-4">Quy mô diện tích</label>
                  <div className="border border-gray-100 rounded-2xl p-4 flex items-center justify-between bg-white focus-within:border-primary transition-colors">
                    <input type="number" value={bdsArea || ''} onChange={e => setBdsArea(parseFloat(e.target.value) || 0)} placeholder="60" className="w-full text-sm font-bold text-text-main bg-transparent outline-none" />
                    <span className="text-xs font-bold text-gray-400">m2</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-4">Tổng giá vốn (Sở hữu + Phí)</label>
                <div className="border border-gray-100 rounded-3xl p-6 flex justify-between items-center bg-gray-50 focus-within:bg-white focus-within:border-primary transition-all">
                  <span className="text-xl font-bold text-gray-300 mr-4">VND</span>
                  <input type="text" value={costManual} onChange={handleVndFormat(setCostManual)} placeholder="0" className="w-full text-3xl font-bold text-text-main bg-transparent outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-primary mb-4">Giá trị định giá thanh khoản</label>
                <div className="border border-gray-200 rounded-3xl p-6 flex justify-between items-center bg-white focus-within:border-primary transition-all shadow-sm">
                  <span className="text-xl font-bold text-gray-300 mr-4">VND</span>
                  <input type="text" value={valueManual} onChange={handleVndFormat(setValueManual)} placeholder="0" className="w-full text-3xl font-bold text-primary bg-transparent outline-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="h-px bg-gray-100 w-full" />

        {/* ROW LAST: TRẠNG THÁI & NGÀY SỞ HỮU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-4">
              Thời gian bắt đầu sở hữu
            </label>
            <div className="border border-gray-100 rounded-2xl p-3 flex items-center bg-white focus-within:border-primary transition-colors">
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full text-sm font-bold text-text-main bg-transparent outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-4">
              Trạng thái quản lý
            </label>
            <div className="flex bg-gray-50/50 p-2 rounded-2xl border border-gray-100 w-full">
              <button 
                onClick={() => setTxStatus('HOẠT ĐỘNG')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                  txStatus === 'HOẠT ĐỘNG' 
                    ? 'bg-white text-emerald-700 shadow-sm border border-emerald-200/50' 
                    : 'text-text-muted hover:text-text-main hover:bg-gray-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Đang hoạt động
              </button>
              <button 
                onClick={() => setTxStatus('ĐÃ TẤT TOÁN')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                  txStatus === 'ĐÃ TẤT TOÁN' 
                    ? 'bg-white text-text-muted shadow-sm border border-gray-200/50' 
                    : 'text-text-muted hover:text-text-main hover:bg-gray-50'
                }`}
              >
                <Archive className="w-4 h-4" />
                Đã tất toán
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col-reverse md:flex-row justify-end items-center gap-4">
        <button 
          onClick={() => router.push('/portfolio')}
          className="text-sm font-bold text-text-muted hover:text-text-main flex items-center gap-2 px-6 py-4"
        >
          <X className="w-4 h-4" />
          Hủy bỏ {isEditMode && 'thay đổi'}
        </button>
        <button 
          onClick={handleSubmit}
          className="bg-primary hover:bg-primary-dark text-white text-sm font-bold flex items-center gap-2 px-10 py-4 rounded-xl shadow-lg shadow-primary/20 transition-transform hover:scale-105"
        >
          <ShieldCheck className="w-5 h-5" />
          {isEditMode ? 'Lưu thay đổi' : 'Lưu tài sản mới'}
        </button>
      </div>

      {/* Success Modal Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl animate-fade-in border border-gray-100">
            <h3 className="text-2xl font-bold text-primary mb-2 text-center">
              {isEditMode ? 'Đã cập nhật!' : 'Đã thêm tài sản!'}
            </h3>
            <p className="text-sm text-text-muted text-center mb-8">
              {isEditMode ? 'Dữ liệu tài sản đã được cập nhật.' : 'Bạn có muốn tiếp tục khai báo thêm tài sản khác vào danh mục không?'}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => router.push('/portfolio')}
                className="flex-1 py-4 px-4 bg-gray-50 text-text-muted hover:bg-gray-100 hover:text-text-main rounded-xl font-bold text-sm transition-colors border border-gray-200"
              >
                Về Danh sách
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
