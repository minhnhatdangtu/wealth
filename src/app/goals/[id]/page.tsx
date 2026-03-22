import { GoalDetailClient } from './goal-detail-client';

export function generateStaticParams() {
  // Pre-generate IDs for Static Export to be happy.
  return [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <GoalDetailClient params={params} />;
}
