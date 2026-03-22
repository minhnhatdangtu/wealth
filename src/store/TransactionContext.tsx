'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  collection, addDoc, updateDoc, doc, onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Building2, LineChart, ShoppingBag, Landmark, Gem, PieChart } from 'lucide-react';

export type TransactionType = {
  id: number;
  date: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconBg: string;
  status: string;
  statusBg: string;
  amount: string;
  amountColor: string;
  type?: 'income' | 'expense' | 'investment';
  _docId?: string;
};

// Icon can't be stored in Firestore — resolve from subtitle/type at render
function resolveIcon(subtitle: string, type?: string): React.ElementType {
  const s = (subtitle ?? '').toLowerCase();
  if (s.includes('bất động sản')) return Building2;
  if (s.includes('chứng khoán') || s.includes('chứng chỉ')) return LineChart;
  if (s.includes('vàng')) return Gem;
  if (s.includes('quỹ') || s.includes('tiết kiệm')) return PieChart;
  if (s.includes('tiền mặt') || s.includes('lãi')) return Landmark;
  return ShoppingBag;
}

export type DateRange = { start: string; end: string };

export type SortConfig = {
  key: 'date' | 'amount' | null;
  direction: 'asc' | 'desc';
};

export const parseTxDate = (dateStr: string) => {
  const match1 = dateStr.match(/(\d{1,2})\s*thg\s*(\d{1,2}),\s*(\d{4})/i);
  if (match1) return new Date(parseInt(match1[3]), parseInt(match1[2]) - 1, parseInt(match1[1]));
  const match2 = dateStr.match(/(\d{1,2})\s*Th(\d{2}),\s*(\d{4})/i);
  if (match2) return new Date(parseInt(match2[3]), parseInt(match2[2]) - 1, parseInt(match2[1]));
  const fallbackDate = new Date(dateStr.split('\n')[0]);
  return isNaN(fallbackDate.getTime()) ? new Date() : fallbackDate;
};

type TransactionContextType = {
  transactions: TransactionType[];
  loading: boolean;
  addTransaction: (tx: Omit<TransactionType, 'id'>) => Promise<void>;
  updateTransaction: (id: number, tx: Partial<TransactionType>) => Promise<void>;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  filterType: string;
  setFilterType: (value: string) => void;
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  filterSearch: string;
  setFilterSearch: (value: string) => void;
  sortConfig: SortConfig;
  setSortConfig: (config: SortConfig) => void;
};

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const formatISO = (date: Date) =>
    new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];

  const [dateRange, setDateRange] = useState<DateRange>({
    start: formatISO(firstDay),
    end: formatISO(today)
  });
  const [filterType, setFilterType] = useState('Tất cả');
  const [filterCategory, setFilterCategory] = useState('Tất cả danh mục');
  const [filterStatus, setFilterStatus] = useState('Tất cả trạng thái');
  const [filterSearch, setFilterSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'desc' });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'transactions'), (snapshot) => {
      const loaded = snapshot.docs.map(d => {
        const data = d.data();
        return {
          ...data,
          id: data.id ?? Date.now(),
          _docId: d.id,
          icon: resolveIcon(data.subtitle ?? '', data.type),
        } as TransactionType;
      });
      setTransactions(loaded);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const addTransaction = async (newTx: Omit<TransactionType, 'id'>) => {
    const id = Date.now();
    const { icon: _i, _docId: _d, ...rest } = newTx as any;
    await addDoc(collection(db, 'transactions'), { ...rest, id });
  };

  const updateTransaction = async (id: number, updatedTx: Partial<TransactionType>) => {
    const existing = transactions.find(t => t.id === id);
    if (!existing?._docId) return;
    const { icon: _i, _docId: _d, ...rest } = updatedTx as any;
    await updateDoc(doc(db, 'transactions', existing._docId), rest);
  };

  return (
    <TransactionContext.Provider value={{
      transactions, loading, addTransaction, updateTransaction,
      dateRange, setDateRange,
      filterType, setFilterType,
      filterCategory, setFilterCategory,
      filterStatus, setFilterStatus,
      filterSearch, setFilterSearch,
      sortConfig, setSortConfig
    }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}
