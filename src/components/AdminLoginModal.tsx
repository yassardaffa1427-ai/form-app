import { useState } from 'react';
import { Lock, X, Eye, EyeOff, ShieldCheck } from 'lucide-react';

type AdminLoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const ADMIN_EMAIL = 'yassar@idn.sch.id';
const ADMIN_PASS = 'yassardaffa27';

export function AdminLoginModal({ isOpen, onClose, onSuccess }: AdminLoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (trimmedEmail === ADMIN_EMAIL.toLowerCase() && trimmedPass === ADMIN_PASS) {
      sessionStorage.setItem('isAdmin', 'true');
      onSuccess();
      onClose();
      setEmail('');
      setPassword('');
    } else {
      setError('User ID atau password admin salah. Akses ditolak.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/40 bg-[#fcf8ff]/95 p-8 shadow-[0px_16px_48px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-[#474555] transition hover:bg-[#f1ecfa]"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#573be5_0%,#9f5de8_100%)] text-white shadow-[0px_6px_20px_rgba(87,59,229,0.35)]">
            <Lock size={26} strokeWidth={2} />
          </div>
          <h2 className="mt-4 font-['Hanken_Grotesk'] text-2xl font-semibold text-[#1c1a24]">
            Akses Khusus Admin
          </h2>
          <p className="mt-1 text-sm text-[#474555]">
            Halaman data responden hanya dapat diakses oleh admin
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="pl-3 font-['Hanken_Grotesk'] text-xs font-bold uppercase tracking-wider text-[#474555]">
              User ID / Email
            </label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yassar@idn.sch.id"
              className="h-12 w-full rounded-2xl border-0 bg-black/5 px-4 text-base text-[#1c1a24] shadow-[inset_0px_2px_4px_rgba(0,0,0,0.06)] outline-none transition focus:ring-2 focus:ring-[#573be5]/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="pl-3 font-['Hanken_Grotesk'] text-xs font-bold uppercase tracking-wider text-[#474555]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password admin"
                className="h-12 w-full rounded-2xl border-0 bg-black/5 pl-4 pr-12 text-base text-[#1c1a24] shadow-[inset_0px_2px_4px_rgba(0,0,0,0.06)] outline-none transition focus:ring-2 focus:ring-[#573be5]/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-xs font-medium text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#573be5_0%,#7059ff_100%)] font-semibold text-white shadow-[0px_6px_20px_rgba(87,59,229,0.3)] transition hover:opacity-95"
          >
            <ShieldCheck size={18} />
            Masuk sebagai Admin
          </button>
        </form>
      </div>
    </div>
  );
}
