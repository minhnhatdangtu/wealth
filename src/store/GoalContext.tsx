'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type GoalType = {
  id: number;
  name: string;
  iconName: string; // 'Home' | 'GraduationCap' | 'ShieldCheck'
  iconBgColor: string;
  iconTextColor: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  description: string;
  isHero: boolean;
  statusText: string;
  statusBgColor?: string;
  statusTextColor?: string;
  progressColor?: string;
  trackColor?: string;
};

const defaultGoals: GoalType[] = [
  {
    id: 1,
    name: 'Mua biệt thự nghỉ dưỡng',
    iconName: 'Home',
    iconBgColor: 'bg-amber-100/60',
    iconTextColor: 'text-amber-700',
    targetAmount: 12500000000,
    currentAmount: 8500000000,
    deadline: 'Tháng 12, 2028',
    description: '',
    isHero: true,
    statusText: '',
    progressColor: 'bg-amber-600',
    trackColor: 'bg-amber-100',
  },
  {
    id: 2,
    name: 'Quỹ học vấn cho con',
    iconName: 'GraduationCap',
    iconBgColor: 'bg-primary',
    iconTextColor: 'text-white',
    targetAmount: 8000000000,
    currentAmount: 4200000000,
    deadline: '2032',
    description: 'Mục tiêu: Du học bậc Đại học tại Anh (2032)',
    isHero: false,
    statusText: 'Đang tăng trưởng',
    statusBgColor: 'bg-green-100',
    statusTextColor: 'text-green-700',
    progressColor: 'bg-[#182a5c]',
    trackColor: 'bg-gray-100',
  },
  {
    id: 3,
    name: 'Quỹ dự phòng khẩn cấp',
    iconName: 'ShieldCheck',
    iconBgColor: 'bg-amber-100',
    iconTextColor: 'text-amber-700',
    targetAmount: 2500000000,
    currentAmount: 2500000000,
    deadline: '',
    description: 'Tương đương 12 tháng chi tiêu gia đình',
    isHero: false,
    statusText: 'Sẵn sàng',
    statusBgColor: 'bg-amber-100',
    statusTextColor: 'text-amber-700',
    progressColor: 'bg-[#b46505]',
    trackColor: 'bg-amber-100/50',
  }
];

type GoalContextType = {
  goals: GoalType[];
  addGoal: (goal: Omit<GoalType, 'id'>) => void;
  updateGoal: (id: number, goal: Partial<GoalType>) => void;
  deleteGoal: (id: number) => void;
};

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export function GoalProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<GoalType[]>(defaultGoals);

  const addGoal = (goal: Omit<GoalType, 'id'>) => {
    setGoals(prev => [...prev, { ...goal, id: Date.now() }]);
  };

  const updateGoal = (id: number, updatedGoal: Partial<GoalType>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updatedGoal } : g));
  };

  const deleteGoal = (id: number) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  return (
    <GoalContext.Provider value={{ goals, addGoal, updateGoal, deleteGoal }}>
      {children}
    </GoalContext.Provider>
  );
}

export function useGoals() {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
}
