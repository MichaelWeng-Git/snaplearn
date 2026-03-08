export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="h-12 w-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
      <p className="text-gray-600 dark:text-gray-300 font-medium">Analyzing your image...</p>
      <p className="text-sm text-gray-400 dark:text-gray-500">This may take a few seconds</p>
    </div>
  );
}
