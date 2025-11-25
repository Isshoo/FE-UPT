export default function CardSkeleton({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-lg border bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="mb-4 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-2 h-3 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      ))}
    </>
  );
}
