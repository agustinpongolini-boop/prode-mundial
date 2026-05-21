import { MESSI_HERO_URL } from '@/config';
import { SolDeMayo } from './SolDeMayo';

export function MessiHero({
  title,
  subtitle,
  imageUrl,
  imagePosition = 'center 18%',
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  imageUrl?: string;
  imagePosition?: string;
}) {
  const url = imageUrl ?? MESSI_HERO_URL;

  return (
    <div className="relative overflow-hidden rounded-3xl glass-strong hero-shimmer mb-6">
      {/* Banderas verticales celeste / blanca / celeste */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-b from-[#75AADB]/35 to-transparent" />
        <div className="absolute inset-y-0 left-1/3 w-1/3 bg-gradient-to-b from-white/15 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-b from-[#75AADB]/35 to-transparent" />
      </div>

      {/* Foto de Messi si se configura URL */}
      {url ? (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${url})`,
              backgroundSize: 'cover',
              backgroundPosition: imagePosition,
              filter: 'saturate(1.1) contrast(1.05)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#051838] via-[#051838]/60 to-[#051838]/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#051838]/40 via-transparent to-[#051838]/40" />
        </>
      ) : null}

      {/* Sol de Mayo de fondo (decorativo) */}
      <div className="absolute -right-8 -top-8 opacity-25 sol-spin pointer-events-none">
        <SolDeMayo size={180} />
      </div>

      {/* Contenido */}
      <div className="relative z-10 px-5 py-6 min-h-[280px] flex flex-col justify-end">
        {/* 3 estrellas de campeón */}
        <div className="flex gap-1 mb-2">
          <span className="text-[#F6B40E] text-lg drop-shadow-[0_2px_8px_rgba(246,180,14,0.6)]">★</span>
          <span className="text-[#F6B40E] text-lg drop-shadow-[0_2px_8px_rgba(246,180,14,0.6)]">★</span>
          <span className="text-[#F6B40E] text-lg drop-shadow-[0_2px_8px_rgba(246,180,14,0.6)]">★</span>
          <span className="ml-2 text-[10px] uppercase tracking-widest font-bold text-[#8FC1F0]">
            Campeones del Mundo
          </span>
        </div>
        <h1 className="font-['Barlow_Condensed'] font-black text-3xl text-white tracking-wide leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-slate-200 text-sm mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}
