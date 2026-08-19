import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BarChart3, ClipboardList } from 'lucide-react';
import { supabase, type Feedback } from '@/lib/supabase';
import { FeedbackForm } from '@/components/FeedbackForm';
import { ResultsView } from '@/components/ResultsView';

type Tab = 'form' | 'results';

export default function App() {
  const [tab, setTab] = useState<Tab>('form');
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = useCallback(async () => {
    const { data, error } = await supabase
      .from('workshop_feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Gagal memuat masukan:', error.message);
      return;
    }
    setFeedback((data ?? []) as Feedback[]);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchFeedback();
      setLoading(false);
    })();
  }, [fetchFeedback]);

  useEffect(() => {
    const channel = supabase
      .channel('workshop_feedback_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'workshop_feedback' },
        (payload) => setFeedback((prev) => [payload.new as Feedback, ...prev])
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'workshop_feedback' },
        (payload) => setFeedback((prev) => prev.filter((item) => item.id !== (payload.old as { id: string }).id))
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const count = feedback.length;
  const averageRating = useMemo(() => {
    if (count === 0) return null;
    return feedback.reduce((sum, item) => sum + item.overall_rating, 0) / count;
  }, [feedback, count]);

  return (
    <main className="min-h-screen bg-[radial-gradient(50%_50%_at_0%_0%,rgba(241,236,250,1)_0%,rgba(252,248,255,1)_100%),linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%)] text-[#1c1a24]">
      <header className="w-full bg-[#fcf8ff66] shadow-[0px_1px_8px_#00000005] backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-[800px] items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTab('form')}
              aria-label="Kembali ke formulir"
              className="flex h-11 w-11 items-center justify-center rounded-full text-[#1c1a24] transition hover:bg-[#f1ecfa]"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={2} />
            </button>
            <h1 className="font-['Hanken_Grotesk'] text-2xl font-semibold leading-8">Feedback Form</h1>
          </div>
          <button
            type="button"
            onClick={() => setTab(tab === 'form' ? 'results' : 'form')}
            aria-label={tab === 'form' ? 'Lihat hasil' : 'Kembali ke formulir'}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#474555] transition hover:bg-[#f1ecfa]"
          >
            {tab === 'form' ? <BarChart3 size={19} /> : <ClipboardList size={19} />}
          </button>
        </div>
      </header>

      {tab === 'form' ? (
        <div className="mx-auto flex w-full max-w-[800px] flex-col gap-6 px-4 py-8">
          <section className="relative overflow-hidden rounded-[48px] border-0 bg-[#fcf8ffb2] p-6 shadow-[0px_8px_32px_#0000000a,inset_0px_1px_1px_#ffffff66] backdrop-blur-[10px]">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,rgba(87,59,229,0.1)_0%,rgba(87,59,229,0)_50%,rgba(149,72,47,0.1)_100%)]" />
            <div className="relative flex items-start justify-between gap-4">
              <section className="flex min-w-0 flex-1 flex-col items-start justify-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#9f5de8_0%,#e889a5_100%)] text-white shadow-[0px_6px_16px_#8d5fce40]">
                  <ClipboardList size={25} strokeWidth={1.8} />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="font-['Hanken_Grotesk'] text-2xl font-semibold leading-8">Masukan<br />Workshop</h2>
                  <p className="text-sm leading-6 text-[#474555]">Sampaikan pendapat Anda<br />tentang workshop</p>
                </div>
              </section>
              <aside className="flex shrink-0 flex-col items-center justify-center rounded-2xl bg-[#ebe6f4] px-4 py-2 shadow-[inset_0px_1px_2px_#ffffffcc]">
                <strong className="font-['Hanken_Grotesk'] text-2xl font-semibold leading-8 text-[#573be5]">{count}</strong>
                <span className="font-['Hanken_Grotesk'] text-xs font-bold leading-4 tracking-[0.6px] text-[#474555]">RESPONS</span>
              </aside>
            </div>
          </section>
          <FeedbackForm onSubmitted={fetchFeedback} />
        </div>
      ) : (
        <div className="mx-auto w-full max-w-[800px] px-4 py-8">
          {loading ? (
            <div className="rounded-[32px] bg-[#fcf8ffb2] p-12 text-center text-sm text-[#474555]">Memuat hasil...</div>
          ) : (
            <ResultsView feedback={feedback} onRefresh={fetchFeedback} />
          )}
        </div>
      )}
    </main>
  );
}
