export default function FormSkeleton({ fields = 5 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="mb-2 h-4 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
      ))}
      <div className="flex gap-2 pt-4">
        <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  );
}
