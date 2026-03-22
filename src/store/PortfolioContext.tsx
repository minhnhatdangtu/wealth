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

const initialAssets: AssetType[] = [];

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
