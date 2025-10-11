import { Card } from '@/components/ui/card';

export default function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  color = 'blue',
  compact = false,
}) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    teal: 'bg-teal-500',
  };

  if (compact) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
            {description && (
              <p className="mt-0.5 text-xs text-gray-500">{description}</p>
            )}
          </div>
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${colorClasses[color]}`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {description && (
            <p className="mt-1 text-xs text-gray-500">{description}</p>
          )}
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg ${colorClasses[color]}`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </Card>
  );
}
