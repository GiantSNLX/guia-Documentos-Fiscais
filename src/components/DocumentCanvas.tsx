import { useEffect, useMemo, useRef, useState } from 'react';
import { Maximize2, ZoomIn } from 'lucide-react';
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
  const [mobileFit, setMobileFit] = useState(true);
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  );
  const [fitScale, setFitScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState<number | null>(null);

  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const fieldsById = useMemo(() => {
    const map: Record<string, NoteField> = {};
    for (const f of model.fields) {
      map[f.id] = f;
    }
    return map;
  }, [model.fields]);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Ajusta automaticamente a largura da folha A4 apenas no celular (< 768px)
  useEffect(() => {
    if (!isMobileViewport || !mobileFit) {
      setFitScale(1);
      setScaledHeight(null);
      return;
    }

    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const recalc = () => {
      const availWidth = outer.clientWidth;
      // Largura natural mínima dos layouts A4 vs cupom 80mm
      const naturalWidth = model.id === 'nfce' ? 440 : 780;
      const nextScale = availWidth < naturalWidth ? availWidth / naturalWidth : 1;
      setFitScale(nextScale);
      if (nextScale < 1) {
        setScaledHeight(Math.ceil(inner.scrollHeight * nextScale));
      } else {
        setScaledHeight(null);
      }
    };

    recalc();
    const ro = new ResizeObserver(recalc);
    ro.observe(outer);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [isMobileViewport, mobileFit, model.id, importedData]);

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

  const applyMobileScale = isMobileViewport && mobileFit && fitScale < 1;

  return (
    <div>
      {/* Barra de título + controles exclusivos para celular */}
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600 dark:text-zinc-400">
        <span>
          Espelho real interativo:{' '}
          <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
            {model.auxiliaryDocName}
          </strong>{' '}
          ({model.modelCode})
        </span>
        <span className="hidden md:inline">
          Passe o mouse em qualquer campo para o balão explicativo · Clique para abrir códigos e guia
        </span>

        {/* Controle de visualização apenas no celular (< md) */}
        <div className="flex w-full items-center justify-between gap-2 pt-0.5 md:hidden">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Toque em qualquer campo para explicar
          </span>
          <button
            type="button"
            onClick={() => setMobileFit((v) => !v)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-800 shadow-2xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            {mobileFit ? (
              <>
                <ZoomIn className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                Zoom 100%
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                Ajustar à tela
              </>
            )}
          </button>
        </div>
      </div>

      {/* Wrapper que mantém o PC 100% intacto e ajusta a escala no celular quando ativo */}
      <div
        ref={outerRef}
        style={
          applyMobileScale && scaledHeight
            ? { height: `${scaledHeight}px`, overflow: 'hidden' }
            : undefined
        }
        className="w-full"
      >
        <div
          key={model.id}
          ref={innerRef}
          style={
            applyMobileScale
              ? {
                  width: model.id === 'nfce' ? '440px' : '780px',
                  transform: `scale(${fitScale})`,
                  transformOrigin: 'top left',
                }
              : undefined
          }
          className="animate-sheet-in"
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}
