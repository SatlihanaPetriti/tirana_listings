export default function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(10,25,41,0.75)', border: '1px solid rgba(100,180,255,0.08)' }}
    >
      {/* Photo placeholder */}
      <div className="h-44 skeleton" />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between gap-2">
          <div className="h-6 w-28 skeleton rounded-lg" />
          <div className="h-5 w-16 skeleton rounded-full" />
        </div>
        <div className="h-4 w-full skeleton rounded-md" />
        <div className="h-4 w-3/4 skeleton rounded-md" />
        <div className="flex gap-2 mt-1">
          <div className="h-5 w-12 skeleton rounded-md" />
          <div className="h-5 w-12 skeleton rounded-md" />
          <div className="h-5 w-16 skeleton rounded-md" />
        </div>
        <div className="h-9 skeleton rounded-xl mt-1" />
      </div>
    </div>
  )
}
