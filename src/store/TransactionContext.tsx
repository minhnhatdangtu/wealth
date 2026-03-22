'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Building2, LineChart, ShoppingBag, Landmark } from 'lucide-react';

export type TransactionType = {
  id: number;
  date: string;
  title: string;
  subtitle: string;
  icon: React.ElementType; // Lucide icon
  iconBg: string; // Legacy
  status: string;
  statusBg: string; 
  amount: string;
  amountColor: string; // Legacy
  type?: 'income' | 'expense' | 'investment'; 
};

// ... initial data
const initialTransactions: TransactionType[] = [];

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
  addTransaction: (tx: Omit<TransactionType, 'id'>) => void;
  updateTransaction: (id: number, tx: Partial<TransactionType>) => void;
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
  const [transactions, setTransactions] = useState<TransactionType[]>(initialTransactions);
  
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const formatISO = (date: Date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  };

  const [dateRange, setDateRange] = useState<DateRange>({
    start: formatISO(firstDay),
    end: formatISO(today)
  });

  const [filterType, setFilterType] = useState('Tất cả');
  const [filterCategory, setFilterCategory] = useState('Tất cả danh mục');
  const [filterStatus, setFilterStatus] = useState('Tất cả trạng thái');
  const [filterSearch, setFilterSearch] = useState('');
  
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'desc' });

  const addTransaction = (newTx: Omit<TransactionType, 'id'>) => {
    setTransactions(prev => [
      { id: Date.now(), ...newTx },
      ...prev
    ]);
  };

  const updateTransaction = (id: number, updatedTx: Partial<TransactionType>) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, ...updatedTx } : tx));
  };


  return (
    <TransactionContext.Provider value={{ 
      transactions, addTransaction, updateTransaction, 
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
