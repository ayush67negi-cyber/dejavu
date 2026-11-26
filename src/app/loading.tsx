export default function Loading() {
  return (
    <div className="min-h-[100svh] bg-ivory px-5 py-10 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 animate-pulse bg-ink/10" />
          <div className="h-3 w-20 animate-pulse bg-ink/10" />
        </div>

        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="h-3 w-24 animate-pulse bg-ink/10" />
            <div className="mt-7 space-y-4">
              <div className="h-[clamp(2.5rem,6vw,4.5rem)] w-[92%] animate-pulse bg-ink/10" />
              <div className="h-[clamp(2.5rem,6vw,4.5rem)] w-[70%] animate-pulse bg-ink/10" />
            </div>
            <div className="mt-8 space-y-3">
              <div className="h-3.5 w-[64%] animate-pulse bg-ink/[0.07]" />
              <div className="h-3.5 w-[52%] animate-pulse bg-ink/[0.07]" />
            </div>
          </div>
          <div className="aspect-[4/5] w-full animate-pulse bg-beige/70" />
        </div>

        <div className="mt-20 grid gap-6 border-t border-ink/10 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-3 w-10 animate-pulse bg-cherry/20" />
              <div className="h-3.5 w-[85%] animate-pulse bg-ink/10" />
              <div className="h-3 w-[60%] animate-pulse bg-ink/[0.07]" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">DEJAVU wird geladen …</span>
    </div>
  );
}
