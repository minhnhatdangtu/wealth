'use client';

import { useGoals } from '@/store/GoalContext';
import { ArrowLeft, Pencil } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use } from 'react';

// Subcomponents
import { GoalProgressCard } from '@/components/goals/goal-progress-card';
import { GoalAllocationCard } from '@/components/goals/goal-allocation-card';
import { GoalHistoryTable } from '@/components/goals/goal-history-table';

export function GoalDetailClient({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { goals } = useGoals();
  
  const id = parseInt(resolvedParams.id);
  const goal = goals.find((g) => g.id === id);

  if (!goal) {
    return notFound();
  }

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-text-muted mb-3">
            <Link href="/goals" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Danh sách mục tiêu
            </Link>
            <span className="text-gray-300">›</span>
            <span className="text-primary font-bold">{goal.name}</span>
          </div>
          <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">
            {goal.name}
          </h1>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0">
          <Link href={`/goals/${goal.id}/edit`} className="bg-gray-100 hover:bg-gray-200 text-text-main px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-sm">
            <Pencil className="w-4 h-4" />
            Chỉnh sửa
          </Link>
          <Link href="/portfolio" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-md">
            Tích lũy thêm
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3 space-y-6">
          <GoalProgressCard goal={goal} />
          <GoalHistoryTable goalId={goal.id} />
        </div>
        <div className="w-full lg:w-1/3">
          <GoalAllocationCard goalId={goal.id} />
        </div>
      </div>
    </div>
  );
}
