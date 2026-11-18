import { useMemo } from 'react';
import type { ImportedDocData, NoteField, NoteModel } from '../types/fiscal';
import { DanfeTemplate } from './templates/DanfeTemplate';
import { NfceTemplate } from './templates/NfceTemplate';
import { NfseTemplate } from './templates/NfseTemplate';
import { DacteTemplate } from './templates/DacteTemplate';
import { DamdfeTemplate } from './templates/DamdfeTemplate';

interface DocumentCanvasProps {
  model: NoteModel;
  activeFieldId: string | null;
  pinnedFieldId: string | null;
  highlightCriticalOnly: boolean;
  importedData: ImportedDocData | null;
  onHoverField: (fieldId: string, anchorEl?: HTMLElement | null) => void;
  onClickField: (fieldId: string) => void;
}

export function DocumentCanvas({
  model,
  activeFieldId,
  pinnedFieldId,
  highlightCriticalOnly,
  importedData,
  onHoverField,
  onClickField,
}: DocumentCanvasProps) {
  const fieldsById = useMemo(() => {
    const map: Record<string, NoteField> = {};
    for (const f of model.fields) {
      map[f.id] = f;
    }
    return map;
  }, [model.fields]);

  const sharedProps = {
    fieldsById,
    activeFieldId,
    pinnedFieldId,
    highlightCriticalOnly,
    onHoverField,
    onClickField,
    importedData,
  };

  const renderTemplate = () => {
    switch (model.id) {
      case 'nfe':
        return <DanfeTemplate {...sharedProps} />;
      case 'nfce':
        return <NfceTemplate {...sharedProps} />;
      case 'nfse':
        return <NfseTemplate {...sharedProps} />;
      case 'cte':
        return <DacteTemplate {...sharedProps} />;
      case 'mdfe':
        return <DamdfeTemplate {...sharedProps} />;
    }
  };

  return (
    <div>
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600 dark:text-zinc-400">
        <span>
          Espelho real interativo:{' '}
          <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
            {model.auxiliaryDocName}
          </strong>{' '}
          ({model.modelCode})
        </span>
        <span>Passe o mouse em qualquer campo para o balão explicativo · Clique para abrir códigos e guia</span>
      </div>

      <div key={model.id} className="animate-sheet-in">
        {renderTemplate()}
      </div>
    </div>
  );
}
