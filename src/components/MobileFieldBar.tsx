import { ListTree } from 'lucide-react';
import type { NoteModel } from '../types/fiscal';
import { CRITICALITY_CONFIG } from '../utils/theme';

interface MobileFieldBarProps {
  model: NoteModel;
  activeFieldId: string | null;
  highlightCriticalOnly: boolean;
  onSelectField: (fieldId: string) => void;
}

/**
 * Barra horizontal compacta exclusiva para celular/tablet (< lg).
 * Evita que o sumário empurre a nota para baixo e permite saltar direto para qualquer campo.
 */
export function MobileFieldBar({
  model,
  activeFieldId,
  highlightCriticalOnly,
  onSelectField,
}: MobileFieldBarProps) {
  return (
    <div className="lg:hidden">
      <div className="mb-1.5 flex items-center justify-between px-0.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
          <ListTree className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          Navegar nos campos ({model.fields.length})
        </span>
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
          Deslize →
        </span>
      </div>

      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1.5">
        {model.fields.map((field) => {
          const isActive = activeFieldId === field.id;
          const crit = CRITICALITY_CONFIG[field.criticality];
          const dimmed = highlightCriticalOnly && field.criticality !== 'critico';
          const label = field.shortLabel ?? field.label;

          return (
            <button
              key={field.id}
              type="button"
              onClick={() => onSelectField(field.id)}
              className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                isActive
                  ? 'border-blue-600 bg-blue-600 text-white shadow-xs dark:border-blue-500 dark:bg-blue-600'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'
              } ${dimmed ? 'opacity-40' : ''}`}
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  isActive ? 'bg-white' : crit.dotClass
                }`}
              />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
