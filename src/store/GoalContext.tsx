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

const defaultGoals: GoalType[] = [];

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
