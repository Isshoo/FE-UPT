import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mb-6 max-w-md text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-[#fba635] hover:bg-[#fdac58]">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
