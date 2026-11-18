import { useEffect, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import type { NoteModel } from '../types/fiscal';
import { MODEL_ACCENT } from '../utils/theme';

interface OperationalBriefingProps {
  model: NoteModel;
}

export function OperationalBriefing({ model }: OperationalBriefingProps) {
  const [expanded, setExpanded] = useState(true);
  const lastScrollYRef = useRef(0);
  const autoCollapsedRef = useRef(false);
  const cooldownUntilRef = useRef(0);
  const manualClosedRef = useRef(false);
  const accent = MODEL_ACCENT[model.accentColor];

  useEffect(() => {
    if (window.scrollY <= 80 && !manualClosedRef.current) {
      setExpanded(true);
      autoCollapsedRef.current = false;
    }
  }, [model.id]);

  useEffect(() => {
    const onScroll = () => {
      const now = Date.now();
      const y = window.scrollY;
      const goingDown = y > lastScrollYRef.current;
      lastScrollYRef.current = y;

      if (now < cooldownUntilRef.current) return;

      const threshold = window.innerWidth < 768 ? 85 : 130;

      if (goingDown && y > threshold && expanded) {
        setExpanded(false);
        autoCollapsedRef.current = true;
        cooldownUntilRef.current = now + 450;
      } else if (
        !goingDown &&
        y <= 16 &&
        !expanded &&
        autoCollapsedRef.current &&
        !manualClosedRef.current
      ) {
        setExpanded(true);
        autoCollapsedRef.current = false;
        cooldownUntilRef.current = now + 450;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [expanded]);

  const handleToggle = () => {
    const next = !expanded;
    setExpanded(next);
    manualClosedRef.current = !next;
    autoCollapsedRef.current = false;
    cooldownUntilRef.current = Date.now() + 450;
  };

  return (
    <section
      className={`rounded-2xl border border-zinc-200 border-t-3 bg-white shadow-xs transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 ${accent.borderTop}`}
    >
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
        <div className="flex flex-wrap items-baseline gap-2.5">
          <span
            className={`rounded border px-2 py-0.5 text-[11px] font-semibold tracking-wide ${accent.badge}`}
          >
            {model.shortName} · {model.modelCode}
          </span>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-[22px] dark:text-zinc-50">
            {model.fullName}
          </h1>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Doc. Auxiliar:{' '}
            <strong className="font-semibold text-zinc-700 dark:text-zinc-200">
              {model.auxiliaryDocName}
            </strong>{' '}
            · {model.issuerScope}
          </span>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 transition duration-200 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {expanded ? (
            <>
              Recolher briefing <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              Ver briefing da operação <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-zinc-100 px-5 pt-3.5 pb-4 dark:border-zinc-800">
            {/* 3 Briefing Cards — paleta neutra limpa */}
            <div className="grid gap-3.5 md:grid-cols-3">
              {/* O que é */}
              <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/50">
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                  <Info className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  O que é e quando é usado
                </div>
                <p className="text-[13.5px] leading-relaxed text-zinc-800 dark:text-zinc-200">
                  {model.briefing.whatIs}
                </p>
                <p className="mt-2 border-t border-zinc-200/70 pt-2 text-xs leading-relaxed text-zinc-600 dark:border-zinc-700/70 dark:text-zinc-400">
                  <strong className="font-semibold text-zinc-800 dark:text-zinc-200">
                    Quando é usado:
                  </strong>{' '}
                  {model.briefing.whenToUse}
                </p>
              </div>

              {/* Atividades envolvidas */}
              <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/50">
                <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                  <Activity className="h-3.5 w-3.5 text-zinc-700 dark:text-zinc-300" />
                  Atividades envolvidas
                </div>
                <ul className="space-y-1.5">
                  {model.briefing.activities.map((activity) => (
                    <li
                      key={activity}
                      className="flex items-start gap-2 text-[13px] leading-snug text-zinc-700 dark:text-zinc-300"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Impacto na operação */}
              <div className="rounded-xl border border-zinc-200/80 border-l-3 border-l-red-600 bg-zinc-50/80 p-3.5 dark:border-zinc-800 dark:border-l-red-500 dark:bg-zinc-800/50">
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                  Impacto na operação
                </div>
                <p className="text-[13.5px] leading-relaxed text-zinc-800 dark:text-zinc-200">
                  {model.briefing.operationalImpact}
                </p>
                <div className="mt-2.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                  <span className="text-red-600 dark:text-red-400">Risco principal:</span>{' '}
                  {model.briefing.riskSummary}
                </div>
              </div>
            </div>

            {/* Fluxo na operação */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5 rounded-lg border border-zinc-200/80 bg-zinc-50/70 px-3.5 py-2 dark:border-zinc-800 dark:bg-zinc-800/40">
              <span className="mr-1.5 text-[10.5px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                Fluxo:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {model.briefing.processFlow.map((item, idx) => (
                  <div key={item.step} className="flex items-center gap-1.5">
                    <span
                      className={`rounded border px-2.5 py-0.5 text-xs font-medium ${
                        item.active
                          ? accent.stepActive
                          : 'border-zinc-200 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
                      }`}
                    >
                      {item.step}
                    </span>
                    {idx < model.briefing.processFlow.length - 1 && (
                      <ArrowRight className="h-3 w-3 text-zinc-400 dark:text-zinc-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
