export default function ProjectsTableSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse flex space-x-4">
          <div className="h-6 w-6 bg-gray-700 rounded" />
          <div className="h-6 bg-gray-700 rounded flex-1" />
        </div>
      ))}
    </div>
  );
}
