import { EditGoalClient } from './edit-client';

export function generateStaticParams() {
  // Pre-generate some default IDs for Static Export to be happy.
  // This allows the build to pass on GitHub Pages.
  return [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <EditGoalClient params={params} />;
}
