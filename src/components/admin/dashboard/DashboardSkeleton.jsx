import { Card } from '@/components/ui/card';

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-20 w-64 animate-pulse rounded bg-gray-200"></div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="h-24 animate-pulse rounded bg-gray-200"></div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="h-80 animate-pulse rounded bg-gray-200"></div>
          </Card>
        ))}
      </div>
    </div>
  );
}
