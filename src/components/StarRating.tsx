import { useState, type ReactNode } from 'react';
import { Star } from 'lucide-react';

type StarRatingProps = {
  value: number | null;
  onChange: (value: number) => void;
  size?: number;
  label?: ReactNode;
};

export function StarRating({ value, onChange, size = 28, label }: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {label && <span className="pl-2 text-base font-medium leading-7 text-[#1c1a24]">{label}</span>}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const active = (hover ?? value ?? 0) >= star;
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
              className="rounded-full p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#573be5]"
              aria-label={`Beri penilaian ${star} dari 5`}
            >
              <Star
                size={size}
                strokeWidth={1.8}
                className={active ? 'fill-[#8b68ed] text-[#7059ff]' : 'fill-transparent text-[#d8d6df]'}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
