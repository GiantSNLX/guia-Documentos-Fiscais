import type { CriticalityLevel, NoteModel } from '../types/fiscal';

export const CRITICALITY_CONFIG: Record<
  CriticalityLevel,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
    ringClass: string;
  }
> = {
  critico: {
    label: 'Crítico na Operação',
    badgeClass:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800/60',
    dotClass: 'bg-red-600',
    ringClass: 'ring-red-400/70 bg-red-50/60 border-red-300',
  },
  alto: {
    label: 'Alto Impacto',
    badgeClass:
      'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60',
    dotClass: 'bg-amber-500',
    ringClass: 'ring-amber-400/70 bg-amber-50/50 border-amber-300',
  },
  atencao: {
    label: 'Ponto de Atenção',
    badgeClass:
      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60',
    dotClass: 'bg-blue-600',
    ringClass: 'ring-blue-400/60 bg-blue-50/50 border-blue-300',
  },
  informativo: {
    label: 'Informativo / Compliance',
    badgeClass:
      'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
    dotClass: 'bg-zinc-400',
    ringClass: 'ring-zinc-300 bg-zinc-50 border-zinc-300',
  },
};

const UNIFIED_ACCENT = {
  pillActive:
    'bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-950',
  badge:
    'bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700',
  borderTop: 'border-t-zinc-900 dark:border-t-blue-500',
  stepActive:
    'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500',
  fieldActive:
    'border-blue-600 bg-blue-50/80 ring-2 ring-blue-600/20',
};

export const MODEL_ACCENT: Record<
  NoteModel['accentColor'],
  typeof UNIFIED_ACCENT
> = {
  indigo: UNIFIED_ACCENT,
  emerald: UNIFIED_ACCENT,
  violet: UNIFIED_ACCENT,
  amber: UNIFIED_ACCENT,
  sky: UNIFIED_ACCENT,
};
