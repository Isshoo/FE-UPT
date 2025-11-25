export default function EventCardSkeleton({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-lg border bg-white dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
          <div className="p-6">
            <div className="mb-3 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="mb-2 h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="mb-4 h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex gap-2">
              <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-8 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
