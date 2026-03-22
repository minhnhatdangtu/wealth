import { EditAssetClient } from './edit-client';

export function generateStaticParams() {
  // Pre-generate IDs for Static Export to be happy.
  return [
    { id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' },
    { id: '6' }, { id: '7' }, { id: '8' }, { id: '9' }, { id: '10' }
  ];
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <EditAssetClient params={params} />;
}
