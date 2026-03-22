'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePortfolio } from '@/store/PortfolioContext';
import { NewAssetForm } from '@/components/portfolio/new-asset-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

function EditContent() {
  const searchParams = useSearchParams();
  const idStr = searchParams.get('id');
  const assetId = idStr ? parseInt(idStr) : null;
  
  const { assets, loading } = usePortfolio();
  const asset = assets.find(a => a.id === assetId);

  if (loading) return <div className="p-8 text-center text-text-muted">Đang tải dữ liệu...</div>;
  if (!asset) return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold text-rose-500 mb-4">Không tìm thấy tài sản</h2>
      <Link href="/portfolio/assets" className="text-primary hover:underline font-bold">Quay lại danh sách</Link>
    </div>
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <Link href="/portfolio/assets" className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-bold text-sm">
        <ArrowLeft className="w-4 h-4" />
        Hủy và quay lại
      </Link>
      <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-sm border border-border-subtle overflow-hidden">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-8">Chỉnh sửa tài sản</h1>
        <NewAssetForm initialData={asset} assetId={asset.id} />
      </div>
    </div>
  );
}

export default function EditAssetPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-text-muted">Đang chuẩn bị...</div>}>
      <EditContent />
    </Suspense>
  );
}
