'use client';

import { usePortfolio } from '@/store/PortfolioContext';
import { NewAssetForm } from '@/components/portfolio/new-asset-form';
import { notFound } from 'next/navigation';
import { use } from 'react';

export function EditAssetClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { assets } = usePortfolio();
  const assetId = parseInt(id, 10);
  const asset = assets.find(a => a.id === assetId);

  if (!asset) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 max-w-5xl mx-auto pb-24 h-full relative z-10">
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary/5 to-transparent -z-10 pointer-events-none"></div>
      <NewAssetForm initialData={asset} assetId={assetId} />
    </div>
  );
}
