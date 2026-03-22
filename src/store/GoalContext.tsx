'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type GoalType = {
  id: number;
  name: string;
  iconName: string;
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
  _docId?: string;
};

type GoalContextType = {
  goals: GoalType[];
  loading: boolean;
  addGoal: (goal: Omit<GoalType, 'id'>) => Promise<void>;
  updateGoal: (id: number, goal: Partial<GoalType>) => Promise<void>;
  deleteGoal: (id: number) => Promise<void>;
};

const GoalContext = createContext<GoalContextType | undefined>(undefined);

function mapDocToGoal(docId: string, data: any): GoalType {
  return { ...data, id: data.id ?? Date.now(), _docId: docId };
}

export function GoalProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<GoalType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'goals'), (snapshot) => {
      const loaded = snapshot.docs.map(d => mapDocToGoal(d.id, d.data()));
      setGoals(loaded);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const addGoal = async (goal: Omit<GoalType, 'id'>) => {
    const id = Date.now();
    const { _docId: _d, ...rest } = goal as any;
    await addDoc(collection(db, 'goals'), { ...rest, id });
  };

  const updateGoal = async (id: number, updatedGoal: Partial<GoalType>) => {
    const existing = goals.find(g => g.id === id);
    if (!existing?._docId) return;
    const { _docId: _d, ...rest } = updatedGoal as any;
    await updateDoc(doc(db, 'goals', existing._docId), rest);
  };

  const deleteGoal = async (id: number) => {
    const existing = goals.find(g => g.id === id);
    if (!existing?._docId) return;
    await deleteDoc(doc(db, 'goals', existing._docId));
  };

  return (
    <GoalContext.Provider value={{ goals, loading, addGoal, updateGoal, deleteGoal }}>
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
