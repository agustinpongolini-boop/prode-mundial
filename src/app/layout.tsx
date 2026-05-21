import type { Metadata } from "next";
import "./globals.css";
import { SolDeMayo } from "@/components/SolDeMayo";

export const metadata: Metadata = {
  title: "Prode Mundial 2026 ⚽",
  description: "Cargá tus predicciones y competí con tus amigos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen">
        <nav className="sticky top-0 z-50 glass-nav">
          <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
            <a href="/tabla" className="flex items-center gap-2 group">
              <span className="relative w-8 h-8 flex items-center justify-center">
                <SolDeMayo size={32} className="drop-shadow-[0_2px_6px_rgba(246,180,14,0.5)]" />
              </span>
              <span className="font-['Barlow_Condensed'] font-black text-xl tracking-wide text-white">
                PRODE <span className="bg-gradient-to-r from-[#8FC1F0] to-[#FCD34D] bg-clip-text text-transparent">2026</span>
              </span>
            </a>
            <div className="flex gap-1">
              <a
                href="/tabla"
                className="px-3 py-1.5 text-sm font-semibold rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                Tabla
              </a>
              <a
                href="/jugar"
                className="px-4 py-1.5 text-sm rounded-lg btn-celeste"
              >
                Jugar
              </a>
            </div>
          </div>
        </nav>
        <main className="max-w-lg mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
