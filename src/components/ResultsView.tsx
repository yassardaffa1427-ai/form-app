import { useState, useMemo } from 'react';
import { Star, TrendingUp, MessageSquareText, ThumbsUp, Trash2, Loader2 } from 'lucide-react';
import { supabase, type Feedback } from '@/lib/supabase';

type ResultsViewProps = {
  feedback: Feedback[];
  onRefresh?: () => void;
  onLogout?: () => void;
};

type RatingRow = {
  label: string;
  key: 'overall' | 'content' | 'speaker';
};

const RATING_ROWS: RatingRow[] = [
  { label: 'Keseluruhan', key: 'overall' },
  { label: 'Kualitas konten', key: 'content' },
  { label: 'Pembicara / presenter', key: 'speaker' },
];

function avg(values: Array<number | null | undefined>): number | null {
  const valid = values.filter((v): v is number => v !== null && v !== undefined);
  if (valid.length === 0) return null;
  return valid.reduce((sum, v) => sum + v, 0) / valid.length;
}

function RatingBar({ label, value, count }: { label: string; value: number | null; count: number }) {
  const pct = value !== null ? (value / 5) * 100 : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm tabular-nums text-slate-500">
          {value !== null ? value.toFixed(1) : '—'}
          <span className="ml-1 text-xs text-slate-400">({count})</span>
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function ResultsView({ feedback, onRefresh }: ResultsViewProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const overall = avg(feedback.map((f) => f.overall_rating));
    const content = avg(feedback.map((f) => f.content_rating));
    const speaker = avg(feedback.map((f) => f.speaker_rating));
    const recommendCount = feedback.filter((f) => f.would_recommend === true).length;
    const recommendPct =
      feedback.length > 0 ? Math.round((recommendCount / feedback.length) * 100) : 0;
    const withComments = feedback.filter(
      (f) => f.most_valuable || f.improvements || f.additional_comments
    ).length;

    return {
      overall,
      content,
      speaker,
      recommendCount,
      recommendPct,
      withComments,
      counts: {
        overall: feedback.filter((f) => f.overall_rating).length,
        content: feedback.filter((f) => f.content_rating !== null).length,
        speaker: feedback.filter((f) => f.speaker_rating !== null).length,
      },
    };
  }, [feedback]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Apakah Anda yakin ingin menghapus masukan ini? Tindakan ini tidak dapat dibatalkan.');
    if (!confirmed) return;

    setDeletingId(id);
    const { error } = await supabase.from('workshop_feedback').delete().eq('id', id);
    setDeletingId(null);

    if (error) {
      alert('Gagal menghapus data: ' + error.message);
      return;
    }

    onRefresh?.();
  };

  if (feedback.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <TrendingUp size={26} className="text-slate-400" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-700">Belum ada masukan</h3>
        <p className="mt-1 text-sm text-slate-500">
          Setelah orang mengirim masukan, hasilnya akan muncul di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Kartu ringkasan */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <Star size={16} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium uppercase tracking-wide">Rata-rata keseluruhan</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold tabular-nums text-slate-900">
              {stats.overall !== null ? stats.overall.toFixed(1) : '—'}
            </span>
            <span className="text-sm text-slate-400">/ 5</span>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <ThumbsUp size={16} className="text-emerald-500" />
            <span className="text-xs font-medium uppercase tracking-wide">Akan merekomendasikan</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold tabular-nums text-slate-900">{stats.recommendPct}%</span>
            <span className="text-sm text-slate-400">({stats.recommendCount})</span>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <MessageSquareText size={16} className="text-teal-500" />
            <span className="text-xs font-medium uppercase tracking-wide">Dengan komentar</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold tabular-nums text-slate-900">{stats.withComments}</span>
            <span className="text-sm text-slate-400">/ {feedback.length}</span>
          </div>
        </div>
      </div>

      {/* Rincian penilaian */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <h3 className="text-base font-semibold text-slate-900">Rincian penilaian</h3>
        <div className="mt-5 space-y-5">
          {RATING_ROWS.map((row) => (
            <RatingBar
              key={row.key}
              label={row.label}
              value={stats[row.key]}
              count={stats.counts[row.key]}
            />
          ))}
        </div>
      </div>

      {/* Respons terbaru */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Respons terbaru</h3>
            <p className="text-xs text-slate-400">Total {feedback.length} masukan responden</p>
          </div>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
            >
              Keluar Admin
            </button>
          )}
        </div>
        <ul className="mt-4 divide-y divide-slate-100">
          {feedback.slice(0, 10).map((f) => (
            <li key={f.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {f.attendee_name || 'Anonim'}
                    </p>
                    <span className="text-xs text-slate-300">•</span>
                    <p className="text-xs font-medium text-slate-500">
                      {new Date(f.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    {f.event_name && (
                      <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700">
                        {f.event_name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold tabular-nums text-amber-700">{f.overall_rating}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(f.id)}
                    disabled={deletingId === f.id}
                    title="Hapus respons ini (Admin)"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    {deletingId === f.id ? (
                      <Loader2 size={13} className="animate-spin text-red-500" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </div>
              {(f.most_valuable || f.improvements) && (
                <div className="mt-2 space-y-1.5 text-sm text-slate-600">
                  {f.most_valuable && (
                    <p className="line-clamp-2">
                      <span className="font-medium text-slate-700">Berharga: </span>
                      {f.most_valuable}
                    </p>
                  )}
                  {f.improvements && (
                    <p className="line-clamp-2">
                      <span className="font-medium text-slate-700">Perbaiki: </span>
                      {f.improvements}
                    </p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
