import type { Metadata } from "next";
import "./globals.css";

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
        <nav className="sticky top-0 z-50 border-b border-[#1a3a5c] bg-[#080d1a]/95 backdrop-blur-md">
          <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
            <a href="/tabla" className="flex items-center gap-2">
              <span className="text-2xl">⚽</span>
              <span className="font-['Barlow_Condensed'] font-extrabold text-xl tracking-wide text-white">
                PRODE <span className="text-emerald-400">2026</span>
              </span>
            </a>
            <div className="flex gap-1">
              <a href="/tabla" className="px-3 py-1.5 text-sm font-semibold rounded-lg hover:bg-[#0d1b2e] text-slate-300 hover:text-white transition-colors">
                Tabla
              </a>
              <a href="/jugar" className="px-3 py-1.5 text-sm font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors">
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
