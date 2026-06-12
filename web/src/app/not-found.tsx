import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-24 text-center">
      <p className="text-6xl font-bold neon-text">404</p>
      <h1 className="text-2xl font-semibold mt-4">Página no encontrada · Pagina non trovata</h1>
      <p className="text-muted mt-2">
        La ciudad o página que buscas no existe. · La città o pagina che cerchi non esiste.
      </p>
      <Link
        href="/"
        className="inline-block mt-8 px-6 py-3 rounded-full font-medium text-[#05070f] bg-gradient-to-r from-cyan to-violet hover:brightness-110 transition"
      >
        Volver al inicio · Torna alla home
      </Link>
    </main>
  );
}
