// Skeleton shimmer loader, per UI/UX brief ("not spinners")
export default function PostCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-white/5" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-4 w-16 bg-white/5 rounded-full" />
        <div className="h-5 w-3/4 bg-white/5 rounded" />
        <div className="h-3 w-full bg-white/5 rounded" />
        <div className="h-3 w-2/3 bg-white/5 rounded" />
      </div>
    </div>
  );
}
