import { HeroStats } from '@/components/dashboard/hero-stats';
import { HealthScore } from '@/components/dashboard/health-score';
import { AssetAllocation } from '@/components/dashboard/asset-allocation';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';

export default function OverviewPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <HeroStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HealthScore />
        <AssetAllocation />
      </div>

      <RecentTransactions />
    </div>
  );
}
