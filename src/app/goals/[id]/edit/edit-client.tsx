'use client';

import { GoalForm } from '@/components/goals/goal-form';
import { useGoals } from '@/store/GoalContext';
import { notFound } from 'next/navigation';
import { use } from 'react';

export function EditGoalClient({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { goals } = useGoals();
  
  const id = parseInt(resolvedParams.id);
  const goal = goals.find((g) => g.id === id);

  if (!goal) {
    return notFound();
  }

  return <GoalForm initialData={goal} />;
}
