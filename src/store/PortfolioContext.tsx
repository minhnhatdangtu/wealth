'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Building2, TrendingUp, Gem, Landmark, PieChart } from 'lucide-react';

export type AssetType = {
  id: number;
  name: string;
  type: string;
  icon: any;
  iconBg: string; // Tailwind class
  quantity: string;
  cost: number;
  value: number;
  status: string; // "ĐANG HOẠT ĐỘNG" or "ĐÃ TẤT TOÁN"
  horizon: 'daihan' | 'nganhan';
  startDate?: string;
  isCustomPriced?: boolean; // Flag if asset uses oracle pricing
  goalId?: number; // Connects asset to goal
};

export const initialMarketPrices: Record<string, number> = {
  'Vàng nhẫn SJC 9999': 74000000,
  'Danh mục Cổ phiếu VN30': 43333.3333,
  'Chứng chỉ quỹ DCDS': 11833.3333
};

const initialAssets: AssetType[] = [
  {
    id: 1,
    name: 'Vinhomes Riverside L3',
    type: 'Bất động sản',
    icon: Building2,
    iconBg: 'bg-primary/10 text-primary',
    quantity: '150 m2',
    cost: 16200000000,
    value: 18200000000,
    status: 'HOẠT ĐỘNG',
    horizon: 'daihan',
    startDate: '2024-01-15'
  },
  {
    id: 2,
    name: 'Vàng nhẫn SJC 9999',
    type: 'Vàng & kim loại',
    icon: Gem,
    iconBg: 'bg-amber-100 text-amber-500',
    quantity: '25 Chỉ',
    cost: 1625000000,
    value: 1850000000,
    status: 'HOẠT ĐỘNG',
    horizon: 'daihan',
    startDate: '2023-08-20'
  },
  {
    id: 3,
    name: 'Danh mục Cổ phiếu VN30',
    type: 'Chứng khoán',
    icon: TrendingUp,
    iconBg: 'bg-emerald-100 text-emerald-500',
    quantity: '120,000 CP',
    cost: 4500000000,
    value: 5200000000,
    status: 'HOẠT ĐỘNG',
    horizon: 'nganhan',
    startDate: '2024-03-01'
  },
  {
    id: 4,
    name: 'Quỹ mở DCDS',
    type: 'Chứng chỉ quỹ',
    icon: PieChart,
    iconBg: 'bg-purple-100 text-purple-500',
    quantity: '50,000 CCQ',
    cost: 850000000,
    value: 920000000,
    status: 'ĐÃ TẤT TOÁN',
    horizon: 'daihan',
    startDate: '2022-11-10'
  },
  {
    id: 5,
    name: 'Căn hộ The River',
    type: 'Bất động sản',
    icon: Building2,
    iconBg: 'bg-rose-100 text-rose-500',
    quantity: '90 m2',
    cost: 12500000000,
    value: 14500000000,
    status: 'HOẠT ĐỘNG',
    horizon: 'daihan',
    startDate: '2021-05-15',
  },
  {
    id: 6, // Corrected ID from 5 to 6 to maintain uniqueness
    name: 'Chứng chỉ quỹ DCDS',
    type: 'Chứng chỉ quỹ',
    icon: PieChart,
    iconBg: 'bg-gray-100 text-primary',
    quantity: '120,000 CCQ',
    cost: 1560000000,
    value: 1420000000,
    status: 'ĐÃ TẤT TOÁN',
    horizon: 'nganhan',
  }
];

type PortfolioContextType = {
  assets: AssetType[];
  addAsset: (asset: Omit<AssetType, 'id'>) => void;
  updateAsset: (id: number, asset: Omit<AssetType, 'id'>) => void;
  deleteAsset: (id: number) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  marketPrices: Record<string, number>;
  updateMarketPrice: (ticker: string, price: number) => void;
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<AssetType[]>(initialAssets);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [marketPrices, setMarketPrices] = useState<Record<string, number>>(initialMarketPrices);

  const addAsset = (newAsset: Omit<AssetType, 'id'>) => {
    setAssets(prev => [
      { id: Date.now(), ...newAsset },
      ...prev
    ]);
  };

  const updateAsset = (id: number, updatedAsset: Omit<AssetType, 'id'>) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...updatedAsset } : a));
  };

  const deleteAsset = (id: number) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  const updateMarketPrice = (ticker: string, price: number) => {
    setMarketPrices(prev => ({ ...prev, [ticker]: price }));
  };

  // Compute live values through Oracle dictionary dynamically
  const computedAssets = assets.map(a => {
    if (a.status === 'HOẠT ĐỘNG' && marketPrices[a.name] !== undefined) {
      const rawNumStr = a.quantity.split(' ')[0].replace(/,/g, '');
      const rawNum = parseFloat(rawNumStr);
      if (!isNaN(rawNum)) {
        return { ...a, value: Math.round(rawNum * marketPrices[a.name]), isCustomPriced: true };
      }
    }
    return { ...a, isCustomPriced: false };
  });

  return (
    <PortfolioContext.Provider value={{ 
      assets: computedAssets, 
      addAsset, 
      updateAsset, 
      deleteAsset,
      selectedCategory, 
      setSelectedCategory,
      marketPrices,
      updateMarketPrice
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
