import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Eye, EyeOff, PanelLeftClose, PanelLeftOpen, RotateCcw, ShieldCheck } from 'lucide-react';
import { NOTE_MODELS, NOTE_MODELS_BY_ID } from './data/notes';
import type { ImportedDocData, NoteModelId } from './types/fiscal';
import { Header } from './components/Header';
import { OperationalBriefing } from './components/OperationalBriefing';
import { DocumentCanvas } from './components/DocumentCanvas';
import { FieldInspector } from './components/FieldInspector';
import { FieldSummary } from './components/FieldSummary';
import { FloatingFieldBalloon, type AnchorBox } from './components/FloatingFieldBalloon';
import { anonymizeDocData, parseFiscalXml } from './utils/xmlParser';

function rectToBox(rect: DOMRect): AnchorBox {
  return {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  };
}

export function App() {
  const [activeModelId, setActiveModelId] = useState<NoteModelId>('nfe');
  const [hoveredFieldId, setHoveredFieldId] = useState<string | null>(
    NOTE_MODELS_BY_ID.nfe.fields[0]?.id ?? null,
  );
  const [pinnedFieldId, setPinnedFieldId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [highlightCriticalOnly, setHighlightCriticalOnly] = useState(false);
  const [showSummary, setShowSummary] = useState(true);

  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem('guiadfe-theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem('guiadfe-theme', isDark ? 'dark' : 'light');
    } catch {
      // ignore storage failure
    }
  }, [isDark]);

  const [balloonVisible, setBalloonVisible] = useState(false);
  const [anchorBox, setAnchorBox] = useState<AnchorBox | null>(null);
  const activeAnchorElRef = useRef<HTMLElement | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  const [rawImportedDoc, setRawImportedDoc] = useState<ImportedDocData | null>(null);
  const [anonymizeImported, setAnonymizeImported] = useState(true);
  const [importError, setImportError] = useState<string | null>(null);

  const activeModel = NOTE_MODELS_BY_ID[activeModelId];

  const displayImportedData = useMemo(() => {
    if (!rawImportedDoc || rawImportedDoc.modelId !== activeModelId) return null;
    return anonymizeImported ? anonymizeDocData(rawImportedDoc) : rawImportedDoc;
  }, [rawImportedDoc, activeModelId, anonymizeImported]);

  const inspectedFieldId = pinnedFieldId ?? hoveredFieldId;
  const inspectedField = useMemo(
    () =>
      activeModel.fields.find((f) => f.id === inspectedFieldId) ??
      activeModel.fields[0] ??
      null,
    [activeModel, inspectedFieldId],
  );

  const clearHideTimer = () => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const scheduleHideBalloon = () => {
    clearHideTimer();
    hideTimerRef.current = window.setTimeout(() => {
      setBalloonVisible(false);
    }, 180);
  };

  const syncAnchorFromEl = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    activeAnchorElRef.current = el;
    setAnchorBox(rectToBox(el.getBoundingClientRect()));
  }, []);

  const findFieldAnchorEl = useCallback((fieldId: string): HTMLElement | null => {
    return (
      document.getElementById(`doc-field-${fieldId}`) ??
      document.querySelector<HTMLElement>(`[data-field-id="${fieldId}"]`)
    );
  }, []);

  const handleSelectModel = (id: NoteModelId) => {
    clearHideTimer();
    setActiveModelId(id);
    setPinnedFieldId(null);
    setIsDrawerOpen(false);
    setBalloonVisible(false);
    setAnchorBox(null);
    activeAnchorElRef.current = null;
    setHoveredFieldId(NOTE_MODELS_BY_ID[id].fields[0]?.id ?? null);
  };

  const handleHoverField = (fieldId: string, anchorEl?: HTMLElement | null) => {
    clearHideTimer();
    if (!isDrawerOpen) {
      setHoveredFieldId(fieldId);
      const el = anchorEl ?? findFieldAnchorEl(fieldId);
      if (el) {
        syncAnchorFromEl(el);
        setBalloonVisible(true);
      }
    }
  };

  const handleHoverFromSummary = (fieldId: string) => {
    clearHideTimer();
    if (isDrawerOpen) return;
    setHoveredFieldId(fieldId);
    const el = findFieldAnchorEl(fieldId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      requestAnimationFrame(() => {
        syncAnchorFromEl(el);
        setBalloonVisible(true);
      });
      window.setTimeout(() => {
        syncAnchorFromEl(el);
      }, 280);
    }
  };

  const handleSelectFromSummary = (fieldId: string) => {
    clearHideTimer();
    setBalloonVisible(false);
    setPinnedFieldId(fieldId);
    setHoveredFieldId(fieldId);
    setIsDrawerOpen(true);

    requestAnimationFrame(() => {
      const el = findFieldAnchorEl(fieldId);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const handleClickField = (fieldId: string) => {
    clearHideTimer();
    setBalloonVisible(false);
    setPinnedFieldId(fieldId);
    setHoveredFieldId(fieldId);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setPinnedFieldId(null);
  };

  const handleStepField = (direction: 'prev' | 'next') => {
    const fields = activeModel.fields;
    if (fields.length === 0) return;

    const currentIdx = fields.findIndex((f) => f.id === inspectedField?.id);
    const baseIdx = currentIdx === -1 ? 0 : currentIdx;
    const nextIdx =
      direction === 'next'
        ? (baseIdx + 1) % fields.length
        : (baseIdx - 1 + fields.length) % fields.length;

    const target = fields[nextIdx];
    setHoveredFieldId(target.id);
    if (isDrawerOpen) {
      setPinnedFieldId(target.id);
    }
    const el = findFieldAnchorEl(target.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      requestAnimationFrame(() => syncAnchorFromEl(el));
    }
  };

  const handleSelectSearchResult = (modelId: NoteModelId, fieldId: string) => {
    clearHideTimer();
    setBalloonVisible(false);
    setActiveModelId(modelId);
    setPinnedFieldId(fieldId);
    setHoveredFieldId(fieldId);
    setIsDrawerOpen(true);

    requestAnimationFrame(() => {
      const el = findFieldAnchorEl(fieldId);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const handleUploadXml = async (file: File) => {
    try {
      setImportError(null);
      const text = await file.text();
      const parsed = parseFiscalXml(text, file.name);
      setRawImportedDoc(parsed);
      setAnonymizeImported(true);
      setActiveModelId(parsed.modelId);
      setPinnedFieldId(null);
      setIsDrawerOpen(false);
      setBalloonVisible(false);
      setHoveredFieldId(NOTE_MODELS_BY_ID[parsed.modelId].fields[0]?.id ?? null);
    } catch (err) {
      setImportError(
        err instanceof Error ? err.message : 'Não foi possível ler o XML selecionado.',
      );
    }
  };

  useEffect(() => {
    if (!balloonVisible) return;
    const updatePos = () => {
      if (activeAnchorElRef.current) {
        setAnchorBox(rectToBox(activeAnchorElRef.current.getBoundingClientRect()));
      }
    };
    window.addEventListener('scroll', updatePos, { passive: true });
    window.addEventListener('resize', updatePos);
    return () => {
      window.removeEventListener('scroll', updatePos);
      window.removeEventListener('resize', updatePos);
    };
  }, [balloonVisible]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setBalloonVisible(false);
        return;
      }
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      const idx = Number(e.key) - 1;
      if (idx >= 0 && idx < NOTE_MODELS.length) {
        handleSelectModel(NOTE_MODELS[idx].id);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 pb-12 text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
      <Header
        models={NOTE_MODELS}
        activeModelId={activeModelId}
        onSelectModel={handleSelectModel}
        onSelectSearchResult={handleSelectSearchResult}
        highlightCriticalOnly={highlightCriticalOnly}
        onToggleHighlightCritical={() => setHighlightCriticalOnly((v) => !v)}
        onUploadXml={handleUploadXml}
        isDark={isDark}
        onToggleTheme={() => setIsDark((d) => !d)}
      />

      <main className="mx-auto max-w-[1400px] space-y-4 px-4 py-5 sm:px-6 lg:px-8">
        {/* Briefing rápido da operação */}
        <OperationalBriefing model={activeModel} />

        {/* Aviso de erro ao abrir XML */}
        {importError && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/40 dark:bg-red-950/60 dark:text-red-200">
            <span>{importError}</span>
            <button
              type="button"
              onClick={() => setImportError(null)}
              className="rounded px-2 py-0.5 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Banner quando XML local está carregado */}
        {displayImportedData && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-xs text-zinc-800 shadow-2xs dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>
                <strong>XML aberto 100% offline no navegador:</strong>{' '}
                <span className="font-mono">{displayImportedData.fileName}</span>{' '}
                <span className="text-zinc-500 dark:text-zinc-400">
                  (nenhum dado foi enviado para servidores)
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAnonymizeImported((v) => !v)}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 font-medium transition ${
                  anonymizeImported
                    ? 'border-zinc-300 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'
                    : 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:border-amber-500/50 dark:bg-amber-950 dark:text-amber-200'
                }`}
              >
                {anonymizeImported ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    Dados sensíveis ocultos
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    Mostrando dados reais
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setRawImportedDoc(null)}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-zinc-300 bg-white px-2.5 py-1 font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Voltar ao exemplo padrão
              </button>
            </div>
          </div>
        )}

        {/* Barra de controle do Sumário */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowSummary((v) => !v)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-2xs transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {showSummary ? (
              <>
                <PanelLeftClose className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
                Ocultar sumário
              </>
            ) : (
              <>
                <PanelLeftOpen className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                Mostrar sumário
              </>
            )}
          </button>

          <span className="hidden text-xs text-zinc-500 sm:inline dark:text-zinc-400">
            Atalhos: teclas{' '}
            <kbd className="rounded border border-zinc-200 bg-white px-1 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              1
            </kbd>
            –
            <kbd className="rounded border border-zinc-200 bg-white px-1 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
              5
            </kbd>{' '}
            alternam os modelos
          </span>
        </div>

        {/* Layout principal: Sumário à esquerda + Folha A4 ampla à direita */}
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          {showSummary && (
            <div
              className="w-full shrink-0 lg:sticky lg:top-[116px] lg:w-52"
              onMouseLeave={scheduleHideBalloon}
            >
              <FieldSummary
                model={activeModel}
                activeFieldId={inspectedField?.id ?? null}
                highlightCriticalOnly={highlightCriticalOnly}
                onHoverFromSummary={handleHoverFromSummary}
                onSelectFromSummary={handleSelectFromSummary}
              />
            </div>
          )}

          <section
            onMouseLeave={scheduleHideBalloon}
            className="w-full min-w-0 flex-1 rounded-2xl border border-zinc-300/70 bg-zinc-200/70 p-3 transition-colors duration-300 sm:p-5 dark:border-zinc-800 dark:bg-zinc-900/75"
          >
            <div className="mx-auto max-w-[980px]">
              <DocumentCanvas
                model={activeModel}
                activeFieldId={inspectedField?.id ?? null}
                pinnedFieldId={pinnedFieldId}
                highlightCriticalOnly={highlightCriticalOnly}
                importedData={displayImportedData}
                onHoverField={handleHoverField}
                onClickField={handleClickField}
              />
            </div>
          </section>
        </div>
      </main>

      {/* Balão inteligente que acompanha cada campo ao passar o mouse */}
      <FloatingFieldBalloon
        field={inspectedField}
        anchor={anchorBox}
        visible={balloonVisible && !isDrawerOpen}
        onOpenDrawer={() => {
          if (inspectedField) handleClickField(inspectedField.id);
        }}
        onMouseEnterBalloon={clearHideTimer}
        onMouseLeaveBalloon={scheduleHideBalloon}
      />

      {/* Drawer deslizante sob demanda (abre ao clicar em qualquer campo) */}
      <FieldInspector
        model={activeModel}
        field={inspectedField}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onStepField={handleStepField}
      />
    </div>
  );
}

export default App;
