import { ListTree } from 'lucide-react';
import type { NoteField, NoteModel } from '../types/fiscal';
import { CRITICALITY_CONFIG } from '../utils/theme';

interface FieldSummaryProps {
  model: NoteModel;
  activeFieldId: string | null;
  highlightCriticalOnly: boolean;
  onSelectFromSummary: (fieldId: string) => void;
  onHoverFromSummary: (fieldId: string) => void;
}

interface BlockGroup {
  name: string;
  fields: NoteField[];
}

function groupByBlock(fields: NoteField[]): BlockGroup[] {
  const map = new Map<string, NoteField[]>();
  for (const field of fields) {
    const arr = map.get(field.block);
    if (arr) arr.push(field);
    else map.set(field.block, [field]);
  }
  return Array.from(map.entries()).map(([name, groupFields]) => ({
    name,
    fields: groupFields,
  }));
}

function compactBlockTitle(name: string): string {
  const map: Record<string, string> = {
    'Cabeçalho e Autorização': 'Cabeçalho',
    'Fatura / Duplicatas e Pagamento': 'Fatura / Pagamento',
    'Reforma Tributária (2026+)': 'IBS / CBS (2026)',
    'Transportador e Volumes': 'Transporte',
    'Identificação e Autenticidade': 'Identificação',
    'Prestador e Tomador': 'Partes',
    'Tributação Municipal (ISSQN)': 'ISSQN Municipal',
    'Tributação Federal e Totais': 'Federais e Totais',
    'Tributação IBS/CBS (Reforma Tributária)': 'IBS / CBS (2026)',
    'Autorização e Contingência': 'QR / Contingência',
    'Transparência Fiscal': 'Transparência',
    'Participantes e Tomador': 'Partes e Tomador',
    'Documentos Originários': 'NF-es Vinculadas',
    'Informações da Carga': 'Carga',
    'Composição do Frete e Impostos': 'Frete e ICMS',
    'Seguro, CIOT e Vale-Pedágio': 'Seguro / CIOT',
    'Ciclo de Vida (Pós-Viagem)': 'Encerramento',
  };
  return map[name] ?? name;
}

export function FieldSummary({
  model,
  activeFieldId,
  highlightCriticalOnly,
  onSelectFromSummary,
  onHoverFromSummary,
}: FieldSummaryProps) {
  const blocks = groupByBlock(model.fields);

  return (
    <aside
      aria-label="Sumário dos campos da nota"
      className="rounded-xl border border-zinc-200 bg-white p-3 shadow-xs transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900"
    >
      {/* Header */}
      <div className="mb-2 flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-zinc-700 uppercase dark:text-zinc-200">
          <ListTree className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          Sumário
        </div>
        <span className="font-mono text-[10.5px] font-medium text-zinc-400 dark:text-zinc-500">
          {model.fields.length} campos
        </span>
      </div>

      {/* Lista em linha única sem barra de rolagem */}
      <nav className="space-y-2">
        {blocks.map((block) => (
          <div key={block.name}>
            <div className="mb-0.5 px-2 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
              {compactBlockTitle(block.name)}
            </div>
            <ul className="border-l border-zinc-200 dark:border-zinc-800">
              {block.fields.map((field) => {
                const isActive = activeFieldId === field.id;
                const crit = CRITICALITY_CONFIG[field.criticality];
                const dimmed =
                  highlightCriticalOnly && field.criticality !== 'critico';
                const displayLabel = field.shortLabel ?? field.label;

                return (
                  <li key={field.id}>
                    <button
                      type="button"
                      title={field.label}
                      onMouseEnter={() => onHoverFromSummary(field.id)}
                      onClick={() => onSelectFromSummary(field.id)}
                      className={`-ml-px flex w-full cursor-pointer items-center gap-2 border-l-2 py-1 pr-2 pl-2.5 text-left text-xs leading-tight transition-colors duration-200 ${
                        isActive
                          ? 'border-blue-600 bg-blue-50/70 font-semibold text-zinc-950 dark:border-blue-400 dark:bg-blue-950/50 dark:text-white'
                          : 'border-transparent text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100'
                      } ${dimmed ? 'opacity-35' : ''}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${crit.dotClass}`}
                      />
                      <span className="truncate">{displayLabel}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Legenda inline de 1 linha */}
      <div className="mt-2.5 flex items-center justify-between border-t border-zinc-100 pt-2 text-[10px] text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        {(['critico', 'alto', 'atencao', 'informativo'] as const).map((lvl) => (
          <span key={lvl} className="inline-flex items-center gap-1">
            <span
              className={`h-1.5 w-1.5 rounded-full ${CRITICALITY_CONFIG[lvl].dotClass}`}
            />
            {lvl === 'critico'
              ? 'Crít.'
              : lvl === 'alto'
                ? 'Alto'
                : lvl === 'atencao'
                  ? 'Aten.'
                  : 'Info'}
          </span>
        ))}
      </div>
    </aside>
  );
}
