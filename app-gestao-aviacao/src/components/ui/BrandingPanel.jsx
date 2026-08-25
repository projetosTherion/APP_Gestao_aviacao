import { LuPlane } from 'react-icons/lu';

/**
 * BrandingPanel
 * Painel de branding azul navy do lado esquerdo das telas de auth.
 * Reutilizado em Login e Cadastro.
 */
export default function BrandingPanel() {
  return (
    <div className="hidden lg:flex lg:w-2/5 bg-brand flex-col items-center justify-center p-12 relative overflow-hidden">
      {/* Decoração de fundo — círculos sutis */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/5" />
      <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-white/5" />
      <div className="absolute top-1/2 left-0 w-32 h-32 rounded-full bg-white/3 -translate-y-1/2" />

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center text-center animate-fade-in">
        <div className="mb-6 p-4 rounded-2xl bg-white/10 border border-white/10">
          <LuPlane size={40} className="text-white" aria-hidden="true" />
        </div>

        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
          AeroGestão
        </h1>
        <p className="text-white/60 text-sm font-normal tracking-wide uppercase">
          Sistema de Gestão
        </p>

        {/* Divisor */}
        <div className="mt-10 flex items-center gap-3 w-full max-w-[180px]">
          <div className="flex-1 h-px bg-white/15" />
          <div className="w-1 h-1 rounded-full bg-white/30" />
          <div className="flex-1 h-px bg-white/15" />
        </div>

        {/* Tagline */}
        <p className="mt-6 text-white/40 text-sm text-center max-w-xs leading-relaxed">
          Controle total dos seus pedidos,<br />documentos e agenda em um só lugar.
        </p>
      </div>
    </div>
  );
}
