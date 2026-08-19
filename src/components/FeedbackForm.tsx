import { useState, type ReactNode } from 'react';
import { CalendarDays, CheckCircle2, ChevronDown, Loader2, Send, ThumbsDown, ThumbsUp } from 'lucide-react';
import { supabase, type FeedbackInput } from '@/lib/supabase';
import { StarRating } from './StarRating';

type FeedbackFormProps = {
  onSubmitted: () => void;
};

const emptyForm: FeedbackInput = {
  attendee_name: '',
  email: '',
  workshop_date: '',
  event_name: '',
  overall_rating: 0,
  content_rating: null,
  speaker_rating: null,
  would_recommend: true,
  most_valuable: '',
  improvements: '',
  additional_comments: '',
};

const dividerClass = 'h-px w-full bg-[linear-gradient(90deg,rgba(71,69,85,0)_0%,rgba(71,69,85,0.1)_50%,rgba(71,69,85,0)_100%)]';
const inputClass = 'w-full border-0 bg-[#00000008] text-lg text-[#474555] placeholder:text-[#47455566] shadow-[inset_0px_2px_6px_#0000000d] outline-none transition focus:ring-2 focus:ring-[#573be5]/30';

export function FeedbackForm({ onSubmitted }: FeedbackFormProps) {
  const [form, setForm] = useState<FeedbackInput>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const update = <K extends keyof FeedbackInput>(key: K, value: FeedbackInput[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (form.overall_rating === 0) return;

    setSubmitting(true);
    setError(null);
    const payload: FeedbackInput = {
      attendee_name: form.attendee_name?.trim() || 'Anonim',
      email: form.email?.trim() || null,
      workshop_date: form.workshop_date || null,
      event_name: form.event_name?.trim() || "Seminar AI (Markaz Al-Ma'tuq)",
      overall_rating: form.overall_rating,
      content_rating: form.content_rating,
      speaker_rating: form.speaker_rating,
      would_recommend: form.would_recommend,
      most_valuable: form.most_valuable?.trim() || null,
      improvements: form.improvements?.trim() || null,
      additional_comments: form.additional_comments?.trim() || null,
    };

    let { error: insertError } = await supabase.from('workshop_feedback').insert(payload);

    // Fallback if event_name column is not created yet in database
    if (insertError && (insertError.message?.includes('event_name') || insertError.code === '42703' || insertError.code === 'PGRST204')) {
      const { event_name, ...payloadWithoutEvent } = payload;
      const retryResult = await supabase.from('workshop_feedback').insert(payloadWithoutEvent);
      insertError = retryResult.error;
    }

    setSubmitting(false);

    if (insertError) {
      setError('Terjadi kesalahan saat mengirim masukan Anda. Silakan coba lagi.');
      return;
    }

    setSubmitted(true);
    onSubmitted();
  };

  const resetForm = () => {
    setForm(emptyForm);
    setTouched(false);
    setSubmitted(false);
    setError(null);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[32px] bg-[#fcf8ffb2] px-6 py-14 text-center shadow-[0px_12px_40px_#0000000f,inset_0px_1px_1px_#ffffff80]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eee9fa]"><CheckCircle2 size={36} className="text-[#573be5]" strokeWidth={1.8} /></div>
        <h3 className="mt-5 font-['Hanken_Grotesk'] text-xl font-semibold text-[#1c1a24]">Terima kasih atas masukan Anda!</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-[#474555]">Respons Anda telah tercatat. Kami menghargai waktu Anda untuk berbagi pendapat.</p>
        <button type="button" onClick={resetForm} className="mt-6 rounded-[32px] bg-[linear-gradient(90deg,#573be5_0%,#7059ff_100%)] px-6 py-3 text-base font-semibold text-white shadow-[0px_8px_24px_#573be54c]">Kirim respons lain</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 rounded-[32px] bg-[#fcf8ffb2] p-8 shadow-[0px_12px_40px_#0000000f,inset_0px_1px_1px_#ffffff80] backdrop-blur-[10px]">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="pl-4 font-['Hanken_Grotesk'] text-xs font-bold leading-4 tracking-[0.6px] text-[#474555]">NAMA OPSIONAL</label>
          <input id="name" type="text" value={form.attendee_name} onChange={(event) => update('attendee_name', event.target.value)} placeholder="budi@contoh.com" className={`${inputClass} h-14 rounded-full px-6`} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="workshop-date" className="pl-4 font-['Hanken_Grotesk'] text-xs font-bold leading-4 tracking-[0.6px] text-[#474555]">TANGGAL WORKSHOP (OPSIONAL)</label>
          <div className="relative">
            <input id="workshop-date" type="date" value={form.workshop_date ?? ''} onChange={(event) => update('workshop_date', event.target.value)} className={`${inputClass} h-14 rounded-full py-[17px] pl-6 pr-12`} />
            <CalendarDays className="pointer-events-none absolute right-5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#474555]" strokeWidth={1.8} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="event-name" className="pl-4 font-['Hanken_Grotesk'] text-xs font-bold leading-4 tracking-[0.6px] text-[#474555]">NAMA ACARA</label>
          <div className="relative">
            <select
              id="event-name"
              value={form.event_name ?? ''}
              onChange={(event) => update('event_name', event.target.value)}
              className={`${inputClass} h-14 rounded-full py-[17px] pl-6 pr-12 appearance-none cursor-pointer ${
                !form.event_name ? 'text-[#47455566]' : 'text-[#474555]'
              }`}
            >
              <option value="" className="text-[#47455566]">
                Pilih acara
              </option>
              <option value="Seminar AI (Markaz Al-Ma'tuq)" className="text-[#474555]">
                Seminar AI (Markaz Al-Ma'tuq)
              </option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#474555]" strokeWidth={1.8} />
          </div>
        </div>
      </div>

      <div className={dividerClass} />

      <section className="flex flex-col gap-6" aria-label="Penilaian workshop">
        <div><StarRating label={<>Penilaian keseluruhan <span className="text-[#ba1a1a]">*</span></>} value={form.overall_rating || null} onChange={(value) => update('overall_rating', value)} size={28} />{touched && form.overall_rating === 0 && <p className="mt-1 pl-2 text-xs text-[#ba1a1a]">Silakan pilih penilaian.</p>}</div>
        <StarRating label="Kualitas konten" value={form.content_rating ?? null} onChange={(value) => update('content_rating', value)} size={28} />
        <StarRating label="Pembicara / presenter" value={form.speaker_rating ?? null} onChange={(value) => update('speaker_rating', value)} size={28} />
      </section>

      <div className={dividerClass} />

      <section className="flex flex-col gap-4">
        <h2 className="text-base font-medium leading-7 text-[#1c1a24]">Apakah Anda akan merekomendasikan workshop ini?</h2>
        <div className="flex gap-4">
          <button type="button" onClick={() => update('would_recommend', true)} className={`flex items-center rounded-3xl px-7 py-3.5 text-lg font-semibold leading-[27px] transition ${form.would_recommend === true ? 'bg-[linear-gradient(165deg,#ff9d7e_0%,#573be5_100%)] text-white shadow-[0px_8px_24px_#573be540]' : 'bg-[#f1ecfa] text-[#474555]'}`}><ThumbsUp className="mr-2 h-5 w-[21px]" strokeWidth={1.8} />Ya</button>
          <button type="button" onClick={() => update('would_recommend', false)} className={`flex items-center rounded-3xl px-7 py-3.5 text-lg font-semibold leading-[27px] transition ${form.would_recommend === false ? 'bg-[#e4dcf2] text-[#474555]' : 'bg-[#f1ecfa] text-[#474555]'}`}><ThumbsDown className="mr-2 h-5 w-[21px]" strokeWidth={1.8} />Tidak</button>
        </div>
      </section>

      <div className={dividerClass} />

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-3"><label htmlFor="valuable-part" className="pl-2 text-lg font-medium leading-7 text-[#1c1a24]">Apa bagian paling berharga?</label><textarea id="valuable-part" value={form.most_valuable ?? ''} onChange={(event) => update('most_valuable', event.target.value)} placeholder="Latihan praktik tentang..." className={`${inputClass} min-h-[144px] resize-none rounded-3xl px-6 py-6 leading-7`} /></div>
        <div className="flex flex-col gap-3"><label htmlFor="suggestion" className="pl-2 text-lg font-medium leading-7 text-[#1c1a24]">Saran untuk ke depannya?</label><textarea id="suggestion" value={form.improvements ?? ''} onChange={(event) => update('improvements', event.target.value)} placeholder="Latihan praktik tentang..." className={`${inputClass} min-h-[144px] resize-none rounded-3xl px-6 py-6 leading-7`} /></div>
      </section>

      {error && <div className="rounded-2xl border border-[#e7b7b7] bg-[#fff1f1] px-4 py-3 text-sm text-[#ba1a1a]">{error}</div>}
      <button type="submit" disabled={submitting} className="flex h-auto w-full items-center justify-center rounded-[32px] bg-[linear-gradient(90deg,#573be5_0%,#7059ff_100%)] px-10 py-[22px] text-xl font-semibold leading-[30px] text-white shadow-[0px_8px_24px_#573be54c] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">
        {submitting ? <><Loader2 size={20} className="mr-2 animate-spin" />Mengirim...</> : <><Send size={19} className="mr-2" />Kirim Masukan</>}
      </button>
    </form>
  );
}
