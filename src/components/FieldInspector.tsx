import { useEffect } from 'react';
import {
  AlertOctagon,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Layers,
  Terminal,
  Users,
  X,
} from 'lucide-react';
import type { NoteField, NoteModel } from '../types/fiscal';
import { CRITICALITY_CONFIG, MODEL_ACCENT } from '../utils/theme';

interface FieldInspectorProps {
  model: NoteModel;
  field: NoteField | null;
  isOpen: boolean;
  onClose: () => void;
  onStepField: (direction: 'prev' | 'next') => void;
}

export function FieldInspector({
  model,
  field,
  isOpen,
  onClose,
  onStepField,
}: FieldInspectorProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !field) return null;

  const accent = MODEL_ACCENT[model.accentColor];
  const crit = CRITICALITY_CONFIG[field.criticality];
  const currentIndex = model.fields.findIndex((f) => f.id === field.id);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop suave */}
      <div
        className="animate-backdrop-in fixed inset-0 bg-zinc-950/35 backdrop-blur-[1.5px] dark:bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer */}
      <aside
        aria-modal="true"
        role="dialog"
        aria-label={`Detalhes do campo ${field.label}`}
        className="animate-drawer-in relative z-10 flex h-full w-full max-w-md flex-col border-l border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        {/* Top Status Bar */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-zinc-100 px-5 py-3.5 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <Layers className="h-3.5 w-3.5 text-zinc-400" />
            <span className="truncate">{field.block}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <X className="h-3.5 w-3.5" />
            Fechar
          </button>
        </div>

        {/* Scrollable Main Content */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${crit.badgeClass}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${crit.dotClass}`} />
                {crit.label}
              </span>
              <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
                Campo {currentIndex + 1} de {model.fields.length}
              </span>
            </div>

            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {field.label}
            </h2>
            <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              <Terminal className="h-3 w-3 text-zinc-400" />
              {field.technicalName}
            </div>
          </div>

          <div>
            <h3 className="mb-1.5 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
              O que significa na prática
            </h3>
            <p className="text-[14px] leading-relaxed text-zinc-700 dark:text-zinc-300">
              {field.description}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200/90 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/60">
            <div className="mb-1 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
              Exemplo na nota
            </div>
            <p className="font-mono text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
              {field.example}
            </p>
          </div>

          {field.codeGuide && (
            <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
              <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-zinc-900 uppercase dark:text-zinc-100">
                <BookOpen className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                {field.codeGuide.title}
              </div>
              <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                {field.codeGuide.summary}
              </p>

              {field.codeGuide.segments && field.codeGuide.segments.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex flex-wrap gap-1">
                    {field.codeGuide.segments.map((seg) => (
                      <div
                        key={`${seg.code}-${seg.label}`}
                        className={`rounded-md border px-2 py-1 text-center ${
                          seg.colorClass ?? 'border-zinc-300 bg-white text-zinc-800'
                        }`}
                      >
                        <div className="font-mono text-xs font-bold leading-tight">
                          {seg.code}
                        </div>
                        <div className="text-[9.5px] font-semibold tracking-tight opacity-85">
                          {seg.label}
                        </div>
                      </div>
                    ))}
                  </div>
                  <ul className="space-y-1 text-xs leading-snug text-zinc-700 dark:text-zinc-300">
                    {field.codeGuide.segments.map((seg) => (
                      <li key={`desc-${seg.code}-${seg.label}`} className="flex gap-1.5">
                        <span className="shrink-0 font-mono font-semibold text-zinc-900 dark:text-white">
                          {seg.code}:
                        </span>
                        <span>{seg.detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {field.codeGuide.commonExamples &&
                field.codeGuide.commonExamples.length > 0 && (
                  <div className="divide-y divide-zinc-200/80 rounded-lg border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
                    {field.codeGuide.commonExamples.map((row) => (
                      <div key={row.code} className="p-3 text-xs">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-white dark:bg-blue-600">
                            {row.code}
                          </span>
                          <span className="text-[12.5px] font-semibold text-zinc-900 dark:text-white">
                            {row.meaning}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                          {row.whenUsed}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}

          <div className="rounded-xl border border-zinc-200 border-l-3 border-l-red-600 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:border-l-red-500 dark:bg-zinc-800/60">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-zinc-700 uppercase dark:text-zinc-300">
              <AlertOctagon className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
              Impacto se preenchido errado
            </div>
            <p className="text-[13.5px] leading-relaxed text-zinc-800 dark:text-zinc-200">
              {field.operationalImpact}
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
              <Users className="h-3.5 w-3.5 text-zinc-400" />
              Áreas envolvidas
            </div>
            <div className="flex flex-wrap gap-1.5">
              {field.stakeholders.map((area) => (
                <span
                  key={area}
                  className={`rounded-md border px-2.5 py-0.5 text-xs font-medium ${accent.badge}`}
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Prev/Next Navigation */}
        <div className="flex shrink-0 items-center justify-between border-t border-zinc-100 bg-zinc-50/90 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => onStepField('prev')}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 sm:px-3 sm:py-1.5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Anterior
          </button>
          <span className="hidden text-[11px] text-zinc-400 sm:inline dark:text-zinc-500">
            Esc para fechar
          </span>
          <button
            type="button"
            onClick={() => onStepField('next')}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 sm:px-3 sm:py-1.5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            Próximo
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </aside>
    </div>
  );
}
