import type { ReactNode } from 'react';
import { Lock } from 'lucide-react';
import type { ImportedDocData, NoteField } from '../../types/fiscal';

export interface TemplateSharedProps {
  fieldsById: Record<string, NoteField>;
  activeFieldId: string | null;
  pinnedFieldId: string | null;
  highlightCriticalOnly: boolean;
  onHoverField: (fieldId: string, anchorEl?: HTMLElement | null) => void;
  onClickField: (fieldId: string) => void;
  importedData?: ImportedDocData | null;
}

interface InteractiveBoxProps extends TemplateSharedProps {
  fieldId: string;
  docLabel?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Célula fiel a documentos fiscais A4: visual limpo em repouso (como PDF real)
 * e destaque nítido no hover, foco ou modo de campos críticos.
 */
export function InteractiveBox({
  fieldId,
  docLabel,
  children,
  className = '',
  fieldsById,
  activeFieldId,
  pinnedFieldId,
  highlightCriticalOnly,
  onHoverField,
  onClickField,
}: InteractiveBoxProps) {
  const field = fieldsById[fieldId];
  const isActive = activeFieldId === fieldId;
  const isPinned = pinnedFieldId === fieldId;
  const isCritical = field?.criticality === 'critico';
  const dimmed = highlightCriticalOnly && !isCritical;
  const critHighlight = highlightCriticalOnly && isCritical;

  return (
    <div
      id={`doc-field-${fieldId}`}
      data-field-id={fieldId}
      role="button"
      tabIndex={0}
      onMouseEnter={(e) => onHoverField(fieldId, e.currentTarget)}
      onFocus={(e) => onHoverField(fieldId, e.currentTarget)}
      onClick={() => onClickField(fieldId)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClickField(fieldId);
        }
      }}
      className={`group relative cursor-pointer transition-colors duration-150 select-text focus:outline-none ${
        isActive
          ? 'z-10 bg-blue-50/90 ring-2 ring-inset ring-blue-600'
          : critHighlight
            ? 'bg-red-50/85 ring-2 ring-inset ring-red-500'
            : 'hover:bg-blue-50/45'
      } ${dimmed ? 'opacity-35' : 'opacity-100'} ${className}`}
    >
      {docLabel && (
        <div className="mb-0.5 flex items-center justify-between gap-1">
          <span className="text-[7.5px] leading-none font-bold tracking-wide text-slate-700 uppercase">
            {docLabel}
          </span>
          {isPinned && (
            <Lock className="h-2.5 w-2.5 shrink-0 text-blue-700" />
          )}
        </div>
      )}
      {!docLabel && isPinned && (
        <Lock className="absolute top-1 right-1 h-2.5 w-2.5 text-blue-700" />
      )}
      <div className="text-[10.5px] leading-tight text-slate-900">{children}</div>
    </div>
  );
}
