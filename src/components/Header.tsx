import { useMemo, useRef, useState } from 'react';
import { FileUp, Moon, Search, ShieldAlert, Sun, X } from 'lucide-react';
import type { NoteField, NoteModel, NoteModelId } from '../types/fiscal';
import { MODEL_ACCENT } from '../utils/theme';

interface SearchResult {
  model: NoteModel;
  field: NoteField;
}

interface HeaderProps {
  models: NoteModel[];
  activeModelId: NoteModelId;
  onSelectModel: (id: NoteModelId) => void;
  onSelectSearchResult: (modelId: NoteModelId, fieldId: string) => void;
  highlightCriticalOnly: boolean;
  onToggleHighlightCritical: () => void;
  onUploadXml: (file: File) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Header({
  models,
  activeModelId,
  onSelectModel,
  onSelectSearchResult,
  highlightCriticalOnly,
  onToggleHighlightCritical,
  onUploadXml,
  isDark,
  onToggleTheme,
}: HeaderProps) {
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResult[] = [];
    for (const model of models) {
      for (const field of model.fields) {
        const haystack = [
          field.label,
          field.technicalName,
          field.description,
          field.operationalImpact,
          model.shortName,
        ]
          .join(' ')
          .toLowerCase();
        if (haystack.includes(q)) {
          results.push({ model, field });
        }
      }
    }
    return results.slice(0, 10);
  }, [models, query]);

  const handlePickResult = (result: SearchResult) => {
    onSelectSearchResult(result.model.id, result.field.id);
    setQuery('');
    setIsSearchOpen(false);
    inputRef.current?.blur();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/90 bg-white/95 backdrop-blur-md transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Top Row: Brand + Search + Actions + Theme Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-2.5 md:flex-nowrap">
          <div className="flex items-center gap-3">
            {/* Logo própria alinhada com o favicon */}
            <svg
              viewBox="0 0 64 64"
              fill="none"
              className="h-9 w-9 shrink-0 shadow-xs"
              aria-hidden="true"
            >
              <rect width="64" height="64" rx="14" className="fill-zinc-900 dark:fill-zinc-800" />
              <path
                d="M18 14h19l11 11v25a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3V17a3 3 0 0 1 3-3Z"
                fill="#FAFAFA"
              />
              <path d="M37 14v9a2 2 0 0 0 2 2h9" fill="#D4D4D8" />
              <rect x="21" y="30" width="22" height="3.5" rx="1.5" fill="#2563EB" />
              <rect x="21" y="37" width="15" height="3" rx="1.5" fill="#71717A" />
              <rect x="21" y="43" width="18" height="3" rx="1.5" fill="#A1A1AA" />
            </svg>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  GuiaDF-e
                </span>
                <span className="hidden rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-zinc-600 uppercase sm:inline-block dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                  Fiscal & Operação
                </span>
              </div>
              <p className="text-[11.5px] text-zinc-500 dark:text-zinc-400">
                Inspeção interativa de notas fiscais
              </p>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-end gap-2 sm:max-w-lg lg:max-w-xl">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => setTimeout(() => setIsSearchOpen(false), 180)}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                placeholder="Buscar campo (CFOP, NCM, CEST, retenção...)"
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-1.5 pr-8 pl-8.5 text-[13px] text-zinc-800 placeholder:text-zinc-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/15 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-500 dark:focus:bg-zinc-900"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Limpar busca"
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}

              {isSearchOpen && query.trim().length > 0 && (
                <div className="absolute right-0 left-0 z-50 mt-1.5 max-h-80 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                  {searchResults.length === 0 ? (
                    <div className="px-3 py-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
                      Nenhum campo encontrado para "{query}".
                    </div>
                  ) : (
                    searchResults.map(({ model, field }) => (
                      <button
                        key={`${model.id}-${field.id}`}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handlePickResult({ model, field });
                        }}
                        className="flex w-full cursor-pointer items-start justify-between gap-2 rounded-lg px-3 py-2 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
                            {field.label}
                          </div>
                          <div className="truncate font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                            {field.technicalName}
                          </div>
                        </div>
                        <span
                          className={`shrink-0 rounded border px-1.5 py-0.5 text-[10.5px] font-semibold ${
                            MODEL_ACCENT[model.accentColor].badge
                          }`}
                        >
                          {model.shortName}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onToggleHighlightCritical}
              title="Destacar apenas campos críticos que costumam travar a operação"
              className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition duration-200 ${
                highlightCriticalOnly
                  ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-500/40 dark:bg-red-950/70 dark:text-red-300'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Críticos</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xml,text/xml,application/xml"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onUploadXml(file);
                  e.target.value = '';
                }
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Abra um XML da sua máquina para visualizar offline no navegador"
              className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition duration-200 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <FileUp className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Abrir XML Local</span>
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              title={isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
              className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-white p-1.5 text-zinc-600 transition duration-200 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Bottom Row: Barra de Modelos Centralizada */}
        <div className="flex justify-center pb-2.5">
          <nav
            aria-label="Modelos de notas fiscais"
            className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-100/90 p-1 dark:border-zinc-800 dark:bg-zinc-900"
          >
            {models.map((model, index) => {
              const isActive = model.id === activeModelId;
              const accent = MODEL_ACCENT[model.accentColor];
              return (
                <button
                  key={model.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onSelectModel(model.id)}
                  className={`group flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all duration-300 ease-out sm:gap-2 sm:px-3.5 sm:text-[13px] ${
                    isActive
                      ? accent.pillActive
                      : 'text-zinc-600 hover:bg-white hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full font-mono text-[10px] font-bold transition-colors duration-300 ${
                      isActive
                        ? 'bg-white/20 text-white dark:bg-zinc-900/15 dark:text-zinc-950'
                        : 'bg-zinc-200/80 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span>{model.shortName}</span>
                  <span
                    className={`hidden rounded px-1.5 py-0.5 text-[10.5px] font-medium transition-colors duration-300 sm:inline ${
                      isActive
                        ? 'bg-white/15 text-zinc-100 dark:bg-zinc-950/10 dark:text-zinc-800'
                        : 'bg-white/90 text-zinc-500 dark:bg-zinc-950/70 dark:text-zinc-500'
                    }`}
                  >
                    {model.modelCode}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
