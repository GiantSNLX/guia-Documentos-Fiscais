export type NoteModelId = 'nfe' | 'nfce' | 'nfse' | 'cte' | 'mdfe';

export type CriticalityLevel = 'critico' | 'alto' | 'atencao' | 'informativo';

export interface CodeSegment {
  code: string;
  label: string;
  detail: string;
  colorClass?: string;
}

export interface CodeExampleRow {
  code: string;
  meaning: string;
  whenUsed: string;
}

export interface CodeGuide {
  title: string;
  summary: string;
  segments?: CodeSegment[];
  commonExamples?: CodeExampleRow[];
}

export interface NoteField {
  id: string;
  block: string;
  /** Nome comum usado pela equipe no dia a dia */
  label: string;
  /** Rótulo curto (1 linha) para o sumário lateral */
  shortLabel?: string;
  /** Nome técnico / tag XML ou campo do layout oficial */
  technicalName: string;
  /** Valor de exemplo exibido dentro do documento real */
  sampleValue: string;
  /** Explicação clara em linguagem acessível */
  description: string;
  /** Exemplo prático com contexto */
  example: string;
  /** O que acontece na operação se estiver errado ou ausente */
  operationalImpact: string;
  /** Áreas que conferem ou dependem deste campo */
  stakeholders: string[];
  criticality: CriticalityLevel;
  /** Guia didático dos códigos e exemplos mais usados na operação */
  codeGuide?: CodeGuide;
}

export interface OperationalStep {
  step: string;
  active?: boolean;
}

export interface NoteBriefing {
  whatIs: string;
  whenToUse: string;
  activities: string[];
  operationalImpact: string;
  riskSummary: string;
  processFlow: OperationalStep[];
}

export interface NoteModel {
  id: NoteModelId;
  shortName: string;
  fullName: string;
  modelCode: string;
  auxiliaryDocName: string;
  issuerScope: string;
  accentColor: 'indigo' | 'emerald' | 'violet' | 'amber' | 'sky';
  briefing: NoteBriefing;
  fields: NoteField[];
}

export interface ImportedDanfeItem {
  cod: string;
  cEAN?: string;
  desc: string;
  ncm: string;
  cest: string;
  cst: string;
  cfop: string;
  un: string;
  qtd: string;
  vUnit: string;
  vDesc?: string;
  vTotal: string;
  bcIcms: string;
  vIcms: string;
  vIpi: string;
  aliq: string;
  aliqIpi?: string;
}

export interface ImportedDuplicate {
  nDup: string;
  dVenc: string;
  vDup: string;
}

export interface ImportedDocData {
  modelId: NoteModelId;
  fileName: string;
  chave: string;
  numero: string;
  serie: string;
  tpNF: string;
  natOp: string;
  protocolo: string;
  dhEmi: string;
  dhSaiEnt: string;
  emit: {
    xNome: string;
    cnpj: string;
    ie: string;
    ender: string;
    munUf: string;
    fone: string;
  };
  dest: {
    xNome: string;
    doc: string;
    ie: string;
    ender: string;
    bairro: string;
    cep: string;
    mun: string;
    uf: string;
    fone: string;
  };
  totais: {
    vBC: string;
    vICMS: string;
    vBCST: string;
    vST: string;
    vProd: string;
    vFrete: string;
    vSeg: string;
    vDesc: string;
    vOutro: string;
    vIPI: string;
    vPIS: string;
    vCOFINS: string;
    vFCP: string;
    vTotTrib?: string;
    vNF: string;
    vBCIBSCBS: string;
    vIBS: string;
    vCBS: string;
  };
  fatura: {
    nFat: string;
    vOrig: string;
    vLiq: string;
    tPag: string;
    duplicatas: ImportedDuplicate[];
  };
  transp: {
    modFrete: string;
    xNome: string;
    cnpj: string;
    ie?: string;
    ender?: string;
    munUf?: string;
    rntrc?: string;
    placa: string;
    placaUf?: string;
    qVol: string;
    esp: string;
    marca?: string;
    nVol?: string;
    pesoB: string;
    pesoL: string;
  };
  items: ImportedDanfeItem[];
  infCpl: string;
  /** Campos resumidos para NFC-e / CT-e / MDF-e */
  extra?: Record<string, string>;
}
