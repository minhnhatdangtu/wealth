import { AssetDetailClient } from './asset-detail-client';

export function generateStaticParams() {
  // Pre-generate asset group names for Static Export.
  return [
    { name: 'Sổ tiết kiệm VCB' },
    { name: 'Cổ phiếu VNM' },
    { name: 'Cổ phiếu FPT' },
    { name: 'Căn hộ Vinhomes' },
    { name: 'Vàng SJC' },
    { name: 'Quỹ VFMVF1' }
  ];
}

export default function Page() {
  return <AssetDetailClient />;
}
