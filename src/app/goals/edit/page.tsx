'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGoals } from '@/store/GoalContext';
import { GoalForm } from '@/components/goals/goal-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

function GoalEditContent() {
  const searchParams = useSearchParams();
  const idStr = searchParams.get('id');
  const goalId = idStr ? parseInt(idStr) : null;
  
  const { goals, loading } = useGoals();
  const goal = goals.find(g => g.id === goalId);

  if (loading) return <div className="p-8 text-center text-text-muted">Đang tải dữ liệu...</div>;
  if (!goal) return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold text-rose-500 mb-4">Không tìm thấy mục tiêu</h2>
      <Link href="/goals" className="text-primary hover:underline font-bold">Quay lại danh sách</Link>
    </div>
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <Link href="/goals" className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-bold text-sm">
        <ArrowLeft className="w-4 h-4" />
        Hủy và quay lại
      </Link>
      <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-sm border border-border-subtle overflow-hidden">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-8">Chỉnh sửa mục tiêu</h1>
        <GoalForm initialData={goal} />
      </div>
    </div>
  );
}

export default function EditGoalPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-text-muted">Đang chuẩn bị...</div>}>
      <GoalEditContent />
    </Suspense>
  );
}
