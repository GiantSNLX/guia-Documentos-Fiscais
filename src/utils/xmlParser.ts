import type {
  ImportedDanfeItem,
  ImportedDocData,
  ImportedDuplicate,
  NoteModelId,
} from '../types/fiscal';

function textOf(parent: Element | Document | null | undefined, tag: string): string {
  if (!parent) return '';
  const el = parent.getElementsByTagName(tag)[0];
  return el?.textContent?.trim() ?? '';
}

function firstEl(parent: Element | Document | null | undefined, tag: string): Element | null {
  if (!parent) return null;
  return parent.getElementsByTagName(tag)[0] ?? null;
}

function formatMoney(val: string | number): string {
  const num = typeof val === 'number' ? val : Number(String(val).replace(',', '.'));
  if (!Number.isFinite(num)) return '0,00';
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatCnpjCpf(doc: string): string {
  const d = doc.replace(/\D/g, '');
  if (d.length === 14) {
    return d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }
  if (d.length === 11) {
    return d.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }
  return doc;
}

function formatDateBr(iso: string): string {
  if (!iso) return '—';
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}:\d{2}:\d{2}))?/);
  if (!match) return iso;
  const [, y, m, d, time] = match;
  return time ? `${d}/${m}/${y} ${time}` : `${d}/${m}/${y}`;
}

function formatChave(chave: string): string {
  const d = chave.replace(/\D/g, '');
  return d.replace(/(.{4})/g, '$1 ').trim();
}

const TPAG_LABELS: Record<string, string> = {
  '01': '01 - Dinheiro',
  '02': '02 - Cheque',
  '03': '03 - Cartão de Crédito',
  '04': '04 - Cartão de Débito',
  '05': '05 - Crédito Loja',
  '10': '10 - Vale Alimentação',
  '11': '11 - Vale Refeição',
  '15': '15 - Boleto Bancário',
  '16': '16 - Depósito Bancário',
  '17': '17 - PIX',
  '18': '18 - Transferência',
  '90': '90 - Sem Pagamento',
  '99': '99 - Outros',
};

const MOD_FRETE_LABELS: Record<string, string> = {
  '0': '0 - Por conta do Remetente (CIF)',
  '1': '1 - Por conta do Destinatário (FOB)',
  '2': '2 - Por conta de Terceiros',
  '3': '3 - Transporte Próprio Remetente',
  '4': '4 - Transporte Próprio Destinatário',
  '9': '9 - Sem Ocorrência de Transporte',
};

const TRIB_ISSQN_LABELS: Record<string, string> = {
  '1': '1 - Operação Tributável',
  '2': '2 - Imunidade',
  '3': '3 - Exportação de Serviço',
  '4': '4 - Não Incidência',
};

const RET_ISSQN_LABELS: Record<string, string> = {
  '1': '1 - Não Retido',
  '2': '2 - Retido pelo Tomador',
  '3': '3 - Retido pelo Intermediário',
};

const SIMP_NAC_LABELS: Record<string, string> = {
  '1': '1 - Não Optante (Regime Normal)',
  '2': '2 - Optante MEI',
  '3': '3 - Optante ME/EPP (Simples Nacional)',
};

function parseNfseNacional(doc: Document, fileName: string): ImportedDocData {
  const infNFSe = firstEl(doc, 'infNFSe');
  const dps = firstEl(doc, 'infDPS') || firstEl(doc, 'DPS');
  const emitEl = firstEl(doc, 'emit');
  const prestEl = firstEl(dps, 'prest') || emitEl;
  const tomaEl = firstEl(dps, 'toma');
  const enderEmit = firstEl(emitEl, 'enderNac') || firstEl(emitEl, 'ender');
  const enderToma = firstEl(tomaEl, 'end') || firstEl(tomaEl, 'ender');
  const servEl = firstEl(dps, 'serv') || firstEl(doc, 'serv');
  const cServ = firstEl(servEl, 'cServ');
  const valores = firstEl(dps, 'valores') || firstEl(doc, 'valores');
  const vServPrest = firstEl(valores, 'vServPrest');
  const trib = firstEl(valores, 'trib');
  const tribMun = firstEl(trib, 'tribMun');
  const tribFed = firstEl(trib, 'tribFed');
  const totTrib = firstEl(valores, 'totTrib');
  const infValores = firstEl(infNFSe, 'valores');

  const rawChave =
    infNFSe?.getAttribute('Id')?.replace(/^NFS/, '') ||
    textOf(doc, 'chNFSe') ||
    '';

  const nNFSe = textOf(infNFSe, 'nNFSe') || textOf(doc, 'nNFSe') || '—';
  const nDPS = textOf(dps, 'nDPS') || '—';
  const serieDPS = textOf(dps, 'serie') || '—';
  const dCompet = formatDateBr(textOf(dps, 'dCompet'));
  const dhProc = formatDateBr(textOf(infNFSe, 'dhProc') || textOf(dps, 'dhEmi'));

  const vServ = formatMoney(textOf(vServPrest, 'vServ') || textOf(infValores, 'vLiq') || '0');
  const vLiq = formatMoney(textOf(infValores, 'vLiq') || textOf(vServPrest, 'vServ') || '0');
  const pAliq = textOf(tribMun, 'pAliq') || textOf(infValores, 'pAliqAplic') || '0,00';
  const vISS = formatMoney(textOf(infValores, 'vISSQN') || '0');

  const tribISSQNCode = textOf(tribMun, 'tribISSQN');
  const tpRetISSQNCode = textOf(tribMun, 'tpRetISSQN');
  const opSimpNacCode = textOf(doc, 'opSimpNac');

  const cTribNac = textOf(cServ, 'cTribNac');
  const xTribNac = textOf(infNFSe, 'xTribNac');
  const cNBS = textOf(cServ, 'cNBS');
  const xNBS = textOf(infNFSe, 'xNBS');

  const vIRRF = formatMoney(textOf(tribFed, 'vRetIRRF') || '0');
  const vPIS = formatMoney(textOf(tribFed, 'vPIS') || '0');
  const vCOFINS = formatMoney(textOf(tribFed, 'vCOFINS') || '0');
  const vCSLL = formatMoney(textOf(tribFed, 'vRetCSLL') || '0');
  const vINSS = formatMoney(textOf(tribFed, 'vRetCP') || '0');

  const vTotTribFed = formatMoney(textOf(totTrib, 'vTotTribFed') || '0');
  const vTotTribEst = formatMoney(textOf(totTrib, 'vTotTribEst') || '0');
  const vTotTribMun = formatMoney(textOf(totTrib, 'vTotTribMun') || '0');

  const emitCMun = textOf(enderEmit, 'cMun');
  const emitCep = textOf(enderEmit, 'CEP');
  const tomaCMun = textOf(enderToma, 'cMun');
  const tomaCep = textOf(enderToma, 'CEP');
  const tpRetPisCofins = textOf(tribFed, 'tpRetPisCofins');
  const cStat = textOf(infNFSe, 'cStat');

  return {
    modelId: 'nfse',
    fileName,
    chave: formatChave(rawChave),
    numero: nNFSe,
    serie: serieDPS,
    tpNF: '1',
    natOp: xTribNac || 'PRESTAÇÃO DE SERVIÇOS',
    protocolo: `nDFSe ${textOf(infNFSe, 'nDFSe') || '—'} • ${dhProc}`,
    dhEmi: dhProc,
    dhSaiEnt: dCompet,
    emit: {
      xNome: textOf(emitEl, 'xNome') || 'PRESTADOR DE SERVIÇOS',
      cnpj: formatCnpjCpf(textOf(emitEl, 'CNPJ') || textOf(prestEl, 'CNPJ') || textOf(prestEl, 'CPF')),
      ie: textOf(emitEl, 'IM') || textOf(prestEl, 'IM') || '—',
      ender: [textOf(enderEmit, 'xLgr'), textOf(enderEmit, 'nro'), textOf(enderEmit, 'xBairro')]
        .filter(Boolean)
        .join(', '),
      munUf: [textOf(infNFSe, 'xLocEmi'), textOf(enderEmit, 'UF')].filter(Boolean).join(' / '),
      fone: textOf(emitEl, 'fone') || '—',
    },
    dest: {
      xNome: textOf(tomaEl, 'xNome') || 'TOMADOR DE SERVIÇOS',
      doc: formatCnpjCpf(textOf(tomaEl, 'CNPJ') || textOf(tomaEl, 'CPF')) || 'Não informado',
      ie: textOf(tomaEl, 'IM') || '—',
      ender: [textOf(enderToma, 'xLgr'), textOf(enderToma, 'nro')].filter(Boolean).join(', ') || '—',
      bairro: textOf(enderToma, 'xBairro') || '—',
      cep: tomaCep || '—',
      mun: textOf(infNFSe, 'xLocPrestacao') || '—',
      uf: textOf(enderToma, 'UF') || '—',
      fone: textOf(tomaEl, 'fone') || '—',
    },
    totais: {
      vBC: vServ,
      vICMS: vISS,
      vBCST: '0,00',
      vST: '0,00',
      vProd: vServ,
      vFrete: '0,00',
      vSeg: '0,00',
      vDesc: '0,00',
      vOutro: '0,00',
      vIPI: '0,00',
      vPIS,
      vCOFINS,
      vFCP: '0,00',
      vNF: vLiq,
      vBCIBSCBS: '0,00',
      vIBS: '0,00',
      vCBS: '0,00',
    },
    fatura: {
      nFat: nDPS,
      vOrig: vServ,
      vLiq,
      tPag: 'NFS-e Padrão Nacional',
      duplicatas: [],
    },
    transp: {
      modFrete: '9 - Sem Ocorrência de Transporte',
      xNome: '—',
      cnpj: '—',
      placa: '—',
      qVol: '—',
      esp: '—',
      pesoB: '0,000',
      pesoL: '0,000',
    },
    items: [],
    infCpl: textOf(servEl, 'xDescServ') || 'Sem discriminação informada no XML.',
    extra: {
      nNFSe,
      nDPS,
      serieDPS,
      dCompet,
      dhProc,
      emitenteLabel: textOf(dps, 'tpEmit') === '1' ? 'Prestador' : 'Emitente',
      situacao: cStat === '100' ? 'NFS-e Gerada' : `Status ${cStat || '—'}`,
      finalidade: '-',
      emitIbgeCep: [emitCMun, emitCep].filter(Boolean).join(' / ') || '—',
      emitEmail: textOf(emitEl, 'email') || '-',
      destIbgeCep: [tomaCMun, tomaCep].filter(Boolean).join(' / ') || '—',
      destEmail: textOf(tomaEl, 'email') || '-',
      regApurSN: textOf(doc, 'regEspTrib') === '0' ? '-' : textOf(doc, 'regEspTrib') || '-',
      xLocEmi: textOf(infNFSe, 'xLocEmi') || '—',
      xLocPrestacao: textOf(infNFSe, 'xLocPrestacao') || '—',
      cTribNac: cTribNac ? `${cTribNac.replace(/(\d{2})(\d{2})(\d{2})/, '$1.$2.$3')} / -` : '—',
      xTribNac: xTribNac || '—',
      cNBS: cNBS ? cNBS.replace(/(\d)(\d{4})(\d{2})(\d{2})/, '$1.$2.$3.$4') : '—',
      xNBS: xNBS || '—',
      opSimpNac: SIMP_NAC_LABELS[opSimpNacCode] ?? (opSimpNacCode || '—'),
      tribISSQN: `${TRIB_ISSQN_LABELS[tribISSQNCode] ?? (tribISSQNCode || '—')} • ${RET_ISSQN_LABELS[tpRetISSQNCode] ?? ''}`,
      descContribSoc:
        tpRetPisCofins === '0'
          ? '0 - PIS/COFINS/CSLL Não Retidos'
          : tpRetPisCofins
            ? `Código ${tpRetPisCofins}`
            : '-',
      totalRetencoes: '-',
      tpRetISSQN: RET_ISSQN_LABELS[tpRetISSQNCode] ?? (tpRetISSQNCode || '—'),
      pAliq,
      vISS,
      vIRRF: vIRRF === '0,00' ? '-' : `R$ ${vIRRF}`,
      vCSLL,
      vINSS: vINSS === '0,00' ? '-' : `R$ ${vINSS}`,
      vTotTribFed: `R$ ${vTotTribFed}`,
      vTotTribEst: `R$ ${vTotTribEst}`,
      vTotTribMun: `R$ ${vTotTribMun}`,
    },
  };
}

export function parseFiscalXml(xmlText: string, fileName: string): ImportedDocData {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'application/xml');
  if (doc.getElementsByTagName('parsererror').length > 0) {
    throw new Error('Arquivo XML inválido ou malformado.');
  }

  // Detecta NFS-e Padrão Nacional (<NFSe> / <infNFSe>)
  if (firstEl(doc, 'infNFSe') || firstEl(doc, 'NFSe')) {
    return parseNfseNacional(doc, fileName);
  }

  const mod = textOf(doc, 'mod');
  let modelId: NoteModelId = 'nfe';
  if (mod === '65') modelId = 'nfce';
  else if (mod === '57') modelId = 'cte';
  else if (mod === '58') modelId = 'mdfe';
  else if (mod !== '55') {
    throw new Error(
      `Modelo de documento não suportado (${mod || 'desconhecido'}). Use XML de NF-e (55), NFC-e (65), NFS-e Nacional, CT-e (57) ou MDF-e (58).`,
    );
  }

  const ide = firstEl(doc, 'ide');
  const emitEl = firstEl(doc, 'emit');
  const enderEmit = firstEl(emitEl, 'enderEmit');
  const destEl = firstEl(doc, 'dest');
  const enderDest = firstEl(destEl, 'enderDest');
  const icmsTot = firstEl(doc, 'ICMSTot');
  const ibsCbsTot = firstEl(doc, 'IBSCBSTot');
  const transpEl = firstEl(doc, 'transp');
  const transportaEl = firstEl(transpEl, 'transporta');
  const veicEl = firstEl(transpEl, 'veicTransp');
  const volEl = firstEl(transpEl, 'vol');
  const fatEl = firstEl(doc, 'fat');
  const infAdic = firstEl(doc, 'infAdic');

  const rawChave =
    textOf(doc, 'chNFe') ||
    textOf(doc, 'chCTe') ||
    textOf(doc, 'chMDFe') ||
    (firstEl(doc, 'infNFe')?.getAttribute('Id')?.replace(/^NFe/, '') ?? '');

  const numero = textOf(ide, 'nNF') || textOf(ide, 'nCT') || textOf(ide, 'nMDF');
  const serie = textOf(ide, 'serie').padStart(3, '0');
  const tpNF = textOf(ide, 'tpNF') || '1';
  const natOp = textOf(ide, 'natOp') || 'OPERAÇÃO FISCAL';
  const nProt = textOf(doc, 'nProt');
  const dhRecbto = formatDateBr(textOf(doc, 'dhRecbto'));
  const protocolo = nProt ? `${nProt} - ${dhRecbto}` : 'Sem protocolo no XML';

  const detEls = Array.from(doc.getElementsByTagName('det'));
  const items: ImportedDanfeItem[] = detEls.slice(0, 12).map((det) => {
    const prod = firstEl(det, 'prod');
    const imp = firstEl(det, 'imposto');
    const icms = firstEl(imp, 'ICMS');
    const ipi = firstEl(imp, 'IPI');

    const orig = textOf(icms, 'orig');
    const cstVal = textOf(icms, 'CST') || textOf(icms, 'CSOSN');
    const fullCst = `${orig}${cstVal}`;

    return {
      cod: textOf(prod, 'cProd') || '—',
      cEAN: textOf(prod, 'cEAN') || 'SEM GTIN',
      desc: textOf(prod, 'xProd') || 'Item',
      ncm: textOf(prod, 'NCM') || '—',
      cest: textOf(prod, 'CEST') || '—',
      cst: fullCst || '—',
      cfop: textOf(prod, 'CFOP') || '—',
      un: textOf(prod, 'uCom') || 'UN',
      qtd: formatMoney(textOf(prod, 'qCom') || '0'),
      vUnit: formatMoney(textOf(prod, 'vUnCom') || '0'),
      vDesc: formatMoney(textOf(prod, 'vDesc') || '0'),
      vTotal: formatMoney(textOf(prod, 'vProd') || '0'),
      bcIcms: formatMoney(textOf(icms, 'vBC') || '0'),
      vIcms: formatMoney(textOf(icms, 'vICMS') || '0'),
      vIpi: formatMoney(textOf(ipi, 'vIPI') || '0'),
      aliq: textOf(icms, 'pICMS') ? `${Number(textOf(icms, 'pICMS')).toFixed(0)}%` : '0%',
      aliqIpi: textOf(ipi, 'pIPI') ? `${Number(textOf(ipi, 'pIPI')).toFixed(0)}%` : '0%',
    };
  });

  const dupEls = Array.from(doc.getElementsByTagName('dup'));
  const duplicatas: ImportedDuplicate[] = dupEls.slice(0, 6).map((dup) => ({
    nDup: textOf(dup, 'nDup') || '001',
    dVenc: formatDateBr(textOf(dup, 'dVenc')),
    vDup: formatMoney(textOf(dup, 'vDup') || '0'),
  }));

  const tPagCode = textOf(doc, 'tPag');
  const modFreteCode = textOf(transpEl, 'modFrete');

  const vIBS =
    textOf(ibsCbsTot, 'vIBS') ||
    textOf(firstEl(ibsCbsTot, 'gIBS'), 'vIBS') ||
    '0';
  const vCBS =
    textOf(ibsCbsTot, 'vCBS') ||
    textOf(firstEl(ibsCbsTot, 'gCBS'), 'vCBS') ||
    '0';

  const emitLogr = [textOf(enderEmit, 'xLgr'), textOf(enderEmit, 'nro')].filter(Boolean).join(', ');
  const destLogr = [textOf(enderDest, 'xLgr'), textOf(enderDest, 'nro')].filter(Boolean).join(', ');

  return {
    modelId,
    fileName,
    chave: formatChave(rawChave),
    numero: numero.padStart(9, '0').replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3'),
    serie,
    tpNF,
    natOp,
    protocolo,
    dhEmi: formatDateBr(textOf(ide, 'dhEmi')),
    dhSaiEnt: formatDateBr(textOf(ide, 'dhSaiEnt')),
    emit: {
      xNome: textOf(emitEl, 'xNome') || 'EMITENTE',
      cnpj: formatCnpjCpf(textOf(emitEl, 'CNPJ') || textOf(emitEl, 'CPF')),
      ie: textOf(emitEl, 'IE') || '—',
      ender: [emitLogr, textOf(enderEmit, 'xBairro')].filter(Boolean).join(' — '),
      munUf: [textOf(enderEmit, 'xMun'), textOf(enderEmit, 'UF')].filter(Boolean).join(' / '),
      fone: textOf(enderEmit, 'fone') || '—',
    },
    dest: {
      xNome: textOf(destEl, 'xNome') || 'DESTINATÁRIO / CONSUMIDOR',
      doc: formatCnpjCpf(textOf(destEl, 'CNPJ') || textOf(destEl, 'CPF')) || 'Não informado',
      ie: textOf(destEl, 'IE') || '—',
      ender: destLogr || '—',
      bairro: textOf(enderDest, 'xBairro') || '—',
      cep: textOf(enderDest, 'CEP') || '—',
      mun: textOf(enderDest, 'xMun') || '—',
      uf: textOf(enderDest, 'UF') || '—',
      fone: textOf(enderDest, 'fone') || '—',
    },
    totais: {
      vBC: formatMoney(textOf(icmsTot, 'vBC') || '0'),
      vICMS: formatMoney(textOf(icmsTot, 'vICMS') || '0'),
      vBCST: formatMoney(textOf(icmsTot, 'vBCST') || '0'),
      vST: formatMoney(textOf(icmsTot, 'vST') || '0'),
      vProd: formatMoney(textOf(icmsTot, 'vProd') || '0'),
      vFrete: formatMoney(textOf(icmsTot, 'vFrete') || '0'),
      vSeg: formatMoney(textOf(icmsTot, 'vSeg') || '0'),
      vDesc: formatMoney(textOf(icmsTot, 'vDesc') || '0'),
      vOutro: formatMoney(textOf(icmsTot, 'vOutro') || '0'),
      vIPI: formatMoney(textOf(icmsTot, 'vIPI') || '0'),
      vPIS: formatMoney(textOf(icmsTot, 'vPIS') || '0'),
      vCOFINS: formatMoney(textOf(icmsTot, 'vCOFINS') || '0'),
      vFCP: formatMoney(textOf(icmsTot, 'vFCP') || '0'),
      vTotTrib: formatMoney(textOf(icmsTot, 'vTotTrib') || '0'),
      vNF: formatMoney(textOf(icmsTot, 'vNF') || textOf(doc, 'vTPrest') || '0'),
      vBCIBSCBS: formatMoney(textOf(ibsCbsTot, 'vBCIBSCBS') || '0'),
      vIBS: formatMoney(vIBS),
      vCBS: formatMoney(vCBS),
    },
    fatura: {
      nFat: textOf(fatEl, 'nFat') || numero || '—',
      vOrig: formatMoney(textOf(fatEl, 'vOrig') || textOf(icmsTot, 'vNF') || '0'),
      vLiq: formatMoney(textOf(fatEl, 'vLiq') || textOf(icmsTot, 'vNF') || '0'),
      tPag: TPAG_LABELS[tPagCode] ?? (tPagCode ? `Cód. ${tPagCode}` : '—'),
      duplicatas,
    },
    transp: {
      modFrete: MOD_FRETE_LABELS[modFreteCode] ?? (modFreteCode || '0 - CIF'),
      xNome: textOf(transportaEl, 'xNome') || 'Transporte próprio / Não informado',
      cnpj: formatCnpjCpf(textOf(transportaEl, 'CNPJ') || textOf(transportaEl, 'CPF')) || '—',
      ie: textOf(transportaEl, 'IE') || '—',
      ender: textOf(transportaEl, 'xEnder') || '—',
      munUf: [textOf(transportaEl, 'xMun'), textOf(transportaEl, 'UF')].filter(Boolean).join(' / ') || '—',
      rntrc: textOf(veicEl, 'RNTRC') || '—',
      placa: textOf(veicEl, 'placa') || '—',
      placaUf: textOf(veicEl, 'UF') || '—',
      qVol: textOf(volEl, 'qVol') || '—',
      esp: textOf(volEl, 'esp') || 'VOLUMES',
      marca: textOf(volEl, 'marca') || '—',
      nVol: textOf(volEl, 'nVol') || '—',
      pesoB: textOf(volEl, 'pesoB') || '0,000',
      pesoL: textOf(volEl, 'pesoL') || '0,000',
    },
    items,
    infCpl: textOf(infAdic, 'infCpl') || 'Sem informações complementares no XML.',
    extra: {
      cMunIni: textOf(ide, 'xMunIni'),
      cMunFim: textOf(ide, 'xMunFim'),
      UFIni: textOf(ide, 'UFIni'),
      UFFim: textOf(ide, 'UFFim'),
      proPred: textOf(doc, 'proPred'),
      RNTRC: textOf(doc, 'RNTRC'),
    },
  };
}

/**
 * Mascara dados identificáveis (CNPJ, CPF, nomes, endereços, chaves, placas)
 * mantendo 100% visíveis os códigos fiscais (CFOP, NCM, CEST, CST, cTribNac, cNBS, modFrete, tPag).
 */
export function anonymizeDocData(data: ImportedDocData): ImportedDocData {
  const maskedChave = data.chave
    ? data.chave.replace(/^(\d{4}\s+\d{4}).*(\d{4})$/, '$1 **** **** **** **** **** **** **** **** **** $2')
    : '**** **** ****';

  return {
    ...data,
    chave: maskedChave,
    protocolo: data.modelId === 'nfse' ? 'nDFSe ***** • [DATA OCULTA]' : '135************ - [DATA OCULTA]',
    emit: {
      xNome: data.modelId === 'nfse' ? 'PRESTADOR DE SERVIÇOS (ANONIMIZADO)' : 'EMPRESA EMITENTE (ANONIMIZADO)',
      cnpj: '**.***.***/0001-**',
      ie: '***.***.***',
      ender: 'Logradouro Oculto, Nº *** — Bairro',
      munUf: 'Município / UF',
      fone: '(**) ****-****',
    },
    dest: {
      xNome: data.modelId === 'nfse' ? 'TOMADOR DE SERVIÇOS (ANONIMIZADO)' : 'DESTINATÁRIO / CLIENTE (ANONIMIZADO)',
      doc: '**.***.***/****-**',
      ie: '***.***.***',
      ender: 'Endereço Oculto, Nº ***',
      bairro: 'Bairro Oculto',
      cep: '*****-***',
      mun: 'Cidade Oculta',
      uf: data.dest.uf,
      fone: '(**) ****-****',
    },
    transp: {
      ...data.transp,
      xNome: data.transp.xNome.includes('Não informado') || data.transp.xNome === '—'
        ? data.transp.xNome
        : 'TRANSPORTADORA (ANONIMIZADA)',
      cnpj: data.transp.cnpj === '—' ? '—' : '**.***.***/****-**',
      ie: data.transp.ie === '—' ? '—' : '***.***.***',
      ender: data.transp.ender === '—' ? '—' : 'Endereço Oculto',
      munUf: data.transp.munUf === '—' ? '—' : 'Cidade / UF',
      placa: data.transp.placa === '—' ? '—' : '***-****',
    },
    items: data.items.map((item, idx) => ({
      ...item,
      cod: `ITEM-${String(idx + 1).padStart(2, '0')}`,
      desc: `PRODUTO REAL #${idx + 1} (DESCRIÇÃO OCULTA — NCM ${item.ncm})`,
    })),
    infCpl:
      data.modelId === 'nfse'
        ? '[Discriminação do serviço ocultada no modo anonimizado — códigos cTribNac, cNBS e tributação preservados]'
        : '[Informações Complementares ocultadas no modo anonimizado para proteção de dados]',
  };
}
