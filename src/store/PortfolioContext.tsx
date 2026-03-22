'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type AssetType = {
  id: number;
  name: string;
  type: string;
  icon: any;
  iconBg: string;
  quantity: string;
  cost: number;
  value: number;
  status: string;
  horizon: 'daihan' | 'nganhan';
  startDate?: string;
  isCustomPriced?: boolean;
  goalId?: number;
  _docId?: string; // Firestore document ID
};

export const initialMarketPrices: Record<string, number> = {};

type PortfolioContextType = {
  assets: AssetType[];
  loading: boolean;
  addAsset: (asset: Omit<AssetType, 'id'>) => Promise<void>;
  updateAsset: (id: number, asset: Omit<AssetType, 'id'>) => Promise<void>;
  deleteAsset: (id: number) => Promise<void>;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  marketPrices: Record<string, number>;
  updateMarketPrice: (ticker: string, price: number) => void;
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// Map Firestore doc to AssetType (icons are not stored in Firestore)
function mapDocToAsset(docId: string, data: any): AssetType {
  return {
    ...data,
    id: data.id ?? Date.now(),
    _docId: docId,
    icon: undefined, // icon is resolved at render time from type
    iconBg: data.iconBg ?? 'bg-gray-100 text-gray-500',
  };
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<AssetType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [marketPrices, setMarketPrices] = useState<Record<string, number>>(initialMarketPrices);

  // Real-time listener from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'assets'), (snapshot) => {
      const loaded = snapshot.docs.map(d => mapDocToAsset(d.id, d.data()));
      setAssets(loaded);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const addAsset = async (newAsset: Omit<AssetType, 'id'>) => {
    const id = Date.now();
    const { icon: _icon, _docId: _d, ...rest } = newAsset as any;
    await addDoc(collection(db, 'assets'), { ...rest, id });
  };

  const updateAsset = async (id: number, updatedAsset: Omit<AssetType, 'id'>) => {
    const existing = assets.find(a => a.id === id);
    if (!existing?._docId) return;
    const { icon: _icon, _docId: _d, ...rest } = updatedAsset as any;
    await updateDoc(doc(db, 'assets', existing._docId), { ...rest, id });
  };

  const deleteAsset = async (id: number) => {
    const existing = assets.find(a => a.id === id);
    if (!existing?._docId) return;
    await deleteDoc(doc(db, 'assets', existing._docId));
  };

  const updateMarketPrice = (ticker: string, price: number) => {
    setMarketPrices(prev => ({ ...prev, [ticker]: price }));
  };

  // Resolve icon from type at render time
  const computedAssets = assets.map(a => {
    let icon = a.icon;
    if (!icon) {
      // Lazily resolved in components via getAssetIcon(type) 
      icon = null;
    }
    return { ...a, icon, isCustomPriced: false };
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
