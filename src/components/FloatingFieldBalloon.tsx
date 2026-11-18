import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, BookOpen, Terminal } from 'lucide-react';
import type { NoteField } from '../types/fiscal';
import { CRITICALITY_CONFIG } from '../utils/theme';

export interface AnchorBox {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

interface FloatingFieldBalloonProps {
  field: NoteField | null;
  anchor: AnchorBox | null;
  visible: boolean;
  onOpenDrawer: () => void;
  onMouseEnterBalloon: () => void;
  onMouseLeaveBalloon: () => void;
}

export function FloatingFieldBalloon({
  field,
  anchor,
  visible,
  onOpenDrawer,
  onMouseEnterBalloon,
  onMouseLeaveBalloon,
}: FloatingFieldBalloonProps) {
  const balloonRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    placement: 'bottom' | 'top';
    arrowOffset: number;
  }>({ top: 0, left: 0, placement: 'bottom', arrowOffset: 24 });

  useLayoutEffect(() => {
    if (!visible || !anchor || !balloonRef.current) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rect = balloonRef.current.getBoundingClientRect();
    const bw = rect.width || 370;
    const bh = rect.height || 180;
    const margin = 12;
    const gap = 10;

    const spaceBelow = vh - anchor.bottom - margin;
    const spaceAbove = anchor.top - margin;

    let placement: 'bottom' | 'top' = 'bottom';
    let top = anchor.bottom + gap;

    if (spaceBelow < bh + gap && spaceAbove >= bh + gap) {
      placement = 'top';
      top = anchor.top - bh - gap;
    } else if (spaceBelow < bh + gap && spaceAbove < bh + gap) {
      placement = 'bottom';
      top = Math.max(margin, Math.min(vh - bh - margin, anchor.top + 12));
    }

    const anchorCenterX = anchor.left + anchor.width / 2;
    const rawLeft = anchorCenterX - bw / 2;
    const left = Math.max(margin, Math.min(vw - bw - margin, rawLeft));
    const arrowOffset = Math.max(20, Math.min(bw - 20, anchorCenterX - left));

    setCoords({ top, left, placement, arrowOffset });
  }, [visible, anchor, field?.id]);

  if (!visible || !field || !anchor) return null;

  const crit = CRITICALITY_CONFIG[field.criticality];

  return (
    <div
      ref={balloonRef}
      role="status"
      onMouseEnter={onMouseEnterBalloon}
      onMouseLeave={onMouseLeaveBalloon}
      style={{
        top: `${coords.top}px`,
        left: `${coords.left}px`,
      }}
      className="animate-balloon-in fixed z-40 w-[350px] max-w-[calc(100vw-24px)] rounded-xl border border-zinc-700/90 bg-zinc-900/95 p-4 text-zinc-100 shadow-2xl backdrop-blur-md transition-[top,left] duration-300 ease-out sm:w-[390px] dark:border-zinc-700 dark:bg-zinc-900/95"
    >
      {/* Seta indicativa apontando para o campo */}
      <span
        style={{ left: `${coords.arrowOffset}px` }}
        className={`absolute h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-zinc-700/90 bg-zinc-900/95 ${
          coords.placement === 'bottom'
            ? '-top-1.5 border-t border-l'
            : '-bottom-1.5 border-r border-b'
        }`}
      />

      {/* Cabeçalho do balão */}
      <div className="mb-2">
        <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 text-[10.5px] font-semibold text-zinc-100">
            <span className={`h-1.5 w-1.5 rounded-full ${crit.dotClass}`} />
            {crit.label}
          </span>
          <span className="inline-flex items-center gap-1 rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10.5px] text-zinc-300">
            <Terminal className="h-2.5 w-2.5 text-zinc-400" />
            {field.technicalName.split(' ')[0]}
          </span>
        </div>
        <h3 className="text-[14.5px] font-bold leading-snug text-white">
          {field.label}
        </h3>
      </div>

      {/* Explicação direta */}
      <p className="text-[12.5px] leading-relaxed text-zinc-300">
        {field.description}
      </p>

      {/* Impacto resumido */}
      <div className="mt-2.5 rounded-lg border border-zinc-700/80 border-l-2 border-l-red-500 bg-zinc-800/70 px-2.5 py-1.5 text-[11.5px] leading-snug text-zinc-200">
        <strong className="text-white">Impacto:</strong>{' '}
        {field.operationalImpact}
      </div>

      {/* Rodapé com ação */}
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-zinc-800 pt-2.5">
        <span className="text-[11px] text-zinc-400">
          {field.codeGuide ? (
            <span className="inline-flex items-center gap-1 text-blue-400">
              <BookOpen className="h-3 w-3" />
              Tem tabela de códigos
            </span>
          ) : (
            'Clique no campo para fixar'
          )}
        </span>

        <button
          type="button"
          onClick={onOpenDrawer}
          className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-[11.5px] font-semibold text-white transition hover:bg-blue-500"
        >
          {field.codeGuide ? 'Abrir códigos e guia' : 'Ver guia completo'}
          <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
