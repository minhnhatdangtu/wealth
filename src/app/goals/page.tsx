import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { HeroGoal } from '@/components/goals/hero-goal';
import { SecondaryGoals } from '@/components/goals/secondary-goals';
import { ExpertAnalysis } from '@/components/goals/expert-analysis';

export default function GoalsPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">Mục tiêu Tài chính</h1>
          <p className="text-text-muted text-lg">
            Lộ trình kiến tạo di sản và sự an tâm tài chính cho gia đình bạn.
          </p>
        </div>
        <Link href="/goals/new" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-md">
          <PlusCircle className="w-5 h-5" />
          Thiết kế mục tiêu mới
        </Link>
      </div>

      <HeroGoal />
      <SecondaryGoals />
      <ExpertAnalysis />
    </div>
  );
}
