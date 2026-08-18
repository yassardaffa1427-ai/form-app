import { Users } from 'lucide-react';

type HeaderProps = {
  count: number;
  averageRating: number | null;
};

export function Header({ count, averageRating }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-sm">
            <Users size={20} strokeWidth={2.2} />
          </div>
          <div className="leading-tight">
            <h1 className="text-base font-semibold text-slate-900 sm:text-lg">
              Masukan Workshop
            </h1>
            <p className="text-xs text-slate-500 sm:text-sm">
              Sampaikan pendapat Anda tentang workshop
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
            <span className="text-2xl font-bold tabular-nums text-slate-900 sm:text-3xl">
              {count}
            </span>
            <span className="text-xs font-medium leading-tight text-slate-500">
              respons
            </span>
          </div>
          {averageRating !== null && count > 0 && (
            <div className="hidden items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 sm:flex">
              <span className="text-2xl font-bold tabular-nums text-amber-600">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-xs font-medium text-amber-700/70">rata-rata</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
