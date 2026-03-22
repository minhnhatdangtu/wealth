'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, setDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Building2, TrendingUp, Gem, Landmark, PieChart, Activity } from 'lucide-react';

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
  _docId?: string; // Firestore document ID
};

// These will be used as a fallback or starting point
export const initialMarketPrices: Record<string, number> = {
  'Vàng nhẫn SJC 9999': 74000000,
  'Danh mục Cổ phiếu VN30': 43333.3333,
  'Chứng chỉ quỹ DCDS': 11833.3333
};

const initialAssets: AssetType[] = [];

type PortfolioContextType = {
  assets: AssetType[];
  loading: boolean;
  addAsset: (asset: Omit<AssetType, 'id'>) => Promise<void>;
  updateAsset: (id: number, asset: Omit<AssetType, 'id'>) => Promise<void>;
  deleteAsset: (id: number) => Promise<void>;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  marketPrices: Record<string, number>;
  updateMarketPrice: (ticker: string, price: number) => Promise<void>;
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// Map Firestore doc to AssetType
function mapDocToAsset(docId: string, data: any): AssetType {
  return {
    ...data,
    id: data.id ?? Date.now(),
    _docId: docId,
    icon: null, // Resolved at render time via getAssetIcon
  } as AssetType;
}

// Resolve icon from type at render time
function getAssetIcon(type: string) {
  const t = (type || '').toLowerCase();
  if (t.includes('bất động sản')) return Building2;
  if (t.includes('chứng khoán')) return TrendingUp;
  if (t.includes('vàng')) return Gem;
  if (t.includes('quỹ') || t.includes('tiết kiệm')) return Landmark;
  if (t.includes('chứng chỉ')) return PieChart;
  return Activity;
}

// Helper to remove undefined for Firestore compat
const cleanData = (obj: any) => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach(key => 
    newObj[key] === undefined && delete newObj[key]
  );
  return newObj;
};

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<AssetType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [marketPrices, setMarketPrices] = useState<Record<string, number>>(initialMarketPrices);

  // Real-time listener for Assets
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'assets'), (snapshot) => {
      const loaded = snapshot.docs.map(d => mapDocToAsset(d.id, d.data()));
      setAssets(loaded);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Assets Listener Error:", error);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Real-time listener for Market Prices
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'market_prices'), (snapshot) => {
      const loadedPrices: Record<string, number> = { ...initialMarketPrices };
      snapshot.docs.forEach(d => {
        loadedPrices[d.id] = d.data().price;
      });
      setMarketPrices(loadedPrices);
    }, (error) => {
      console.error("Firestore Market Prices Listener Error:", error);
    });
    return () => unsub();
  }, []);

  const addAsset = async (newAsset: Omit<AssetType, 'id'>) => {
    const id = Date.now();
    const { icon: _icon, _docId: _d, ...rest } = newAsset as any;
    await addDoc(collection(db, 'assets'), cleanData({ ...rest, id }));
  };

  const updateAsset = async (id: number, updatedAsset: Omit<AssetType, 'id'>) => {
    const existing = assets.find(a => a.id === id);
    if (!existing?._docId) return;
    const { icon: _icon, _docId: _d, ...rest } = updatedAsset as any;
    await updateDoc(doc(db, 'assets', existing._docId), cleanData(rest));
  };

  const deleteAsset = async (id: number) => {
    const existing = assets.find(a => a.id === id);
    if (!existing?._docId) return;
    await deleteDoc(doc(db, 'assets', existing._docId));
  };

  const updateMarketPrice = async (ticker: string, price: number) => {
    // Update Firestore: using ticker as doc ID
    await setDoc(doc(db, 'market_prices', ticker), { 
      price, 
      updatedAt: new Date().toISOString() 
    });
  };

  // Resolve icons and compute live values through Oracle dictionary
  const computedAssets = assets.map(a => {
    let finalValue = a.value;
    let isCustom = false;
    
    if (a.status === 'HOẠT ĐỘNG' && marketPrices[a.name] !== undefined) {
      const rawNumStr = (a.quantity || '').split(' ')[0].replace(/,/g, '');
      const rawNum = parseFloat(rawNumStr);
      if (!isNaN(rawNum)) {
        finalValue = Math.round(rawNum * marketPrices[a.name]);
        isCustom = true;
      }
    }

    return { 
      ...a, 
      icon: getAssetIcon(a.type), 
      value: finalValue,
      isCustomPriced: isCustom 
    };
  });

  return (
    <PortfolioContext.Provider value={{ 
      assets: computedAssets, 
      loading,
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
