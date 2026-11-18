import type { ImportedDanfeItem, ImportedDocData } from '../../types/fiscal';
import { RealBarcode } from '../RealBarcode';
import { InteractiveBox, type TemplateSharedProps } from './InteractiveZone';

const DEFAULT_DANFE_DATA: ImportedDocData = {
  modelId: 'nfe',
  fileName: 'exemplo-ficticio.xml',
  chave: '3526 1112 3456 7800 0199 5500 1000 0482 9110 8492 0194',
  numero: '000.048.291',
  serie: '001',
  tpNF: '1',
  natOp: 'VENDA DE MERCADORIA ADQUIRIDA DE TERCEIROS',
  protocolo: '135260849201948 - 18/11/2026 10:42:15',
  dhEmi: '18/11/2026 10:40:00',
  dhSaiEnt: '18/11/2026 11:15:00',
  emit: {
    xNome: 'INDÚSTRIA E COMÉRCIO TANAKA S.A.',
    cnpj: '12.345.678/0001-99',
    ie: '114.882.990.112',
    ender: 'Av. das Nações Unidas, 14.200 — Vila Gertrudes',
    munUf: 'São Paulo / SP — CEP 04794-000',
    fone: '(11) 3000-4400',
  },
  dest: {
    xNome: 'DISTRIBUIDORA HORIZONTE LTDA',
    doc: '45.678.910/0001-22',
    ie: '110.482.991.114',
    ender: 'Rod. Fernão Dias, Km 482',
    bairro: 'Distrito Industrial',
    cep: '32689-000',
    mun: 'Betim',
    uf: 'MG',
    fone: '(31) 3555-9000',
  },
  totais: {
    vBC: '14.500,00',
    vICMS: '2.610,00',
    vBCST: '0,00',
    vST: '0,00',
    vProd: '17.400,00',
    vFrete: '0,00',
    vSeg: '0,00',
    vDesc: '0,00',
    vOutro: '0,00',
    vIPI: '0,00',
    vPIS: '239,25',
    vCOFINS: '1.102,00',
    vFCP: '0,00',
    vTotTrib: '4.120,00',
    vNF: '17.400,00',
    vBCIBSCBS: '14.790,00',
    vIBS: '14,79',
    vCBS: '133,11',
  },
  fatura: {
    nFat: '48291',
    vOrig: '17.400,00',
    vLiq: '17.400,00',
    tPag: '15 - Boleto Bancário',
    duplicatas: [
      { nDup: '001', dVenc: '18/12/2026', vDup: '8.700,00' },
      { nDup: '002', dVenc: '17/01/2027', vDup: '8.700,00' },
    ],
  },
  transp: {
    modFrete: '0 - Por conta do emitente',
    xNome: 'TRANSPORTADORA ROTA EXPRESS LTDA',
    cnpj: '98.765.432/0001-55',
    ie: '336.110.220.118',
    ender: 'Rod. Pres. Dutra, Km 212',
    munUf: 'Guarulhos / SP',
    rntrc: '04829103',
    placa: 'BRA-2E19',
    placaUf: 'SP',
    qVol: '6',
    esp: 'VOLUME(S)',
    marca: 'TANAKA',
    nVol: '1 A 6',
    pesoB: '91,500',
    pesoL: '84,000',
  },
  items: [
    {
      cod: 'NB-4820',
      desc: 'NOTEBOOK PRO 14" CORE i7 16GB SSD 512GB',
      ncm: '84713019',
      cest: '—',
      cst: '000',
      cfop: '5102',
      un: 'PC',
      qtd: '10,0000',
      vUnit: '1.450,00',
      vTotal: '14.500,00',
      bcIcms: '14.500,00',
      vIcms: '2.610,00',
      vIpi: '0,00',
      aliq: '18,00',
      aliqIpi: '0,00',
    },
    {
      cod: 'FX-7318',
      desc: 'KIT FIXADORES INDUSTRIAIS AÇO INOX (COM ST)',
      ncm: '73181600',
      cest: '1005800',
      cst: '060',
      cfop: '5405',
      un: 'CT',
      qtd: '20,0000',
      vUnit: '145,00',
      vTotal: '2.900,00',
      bcIcms: '0,00',
      vIcms: '0,00',
      vIpi: '0,00',
      aliq: '0,00',
      aliqIpi: '0,00',
    },
  ] satisfies ImportedDanfeItem[],
  infCpl:
    'PV: 90412 | Obs. NF: MERCADORIA JA TRIBUTADA ANTERIORMENTE POR SUBSTITUICAO TRIBUTARIA NOS ITENS CFOP 5.405. | PRAZO DE CANCELAMENTO E DE 24H. | Pagamento(s): R$ 17.400,00 BOLETO BANCARIO - 30/60 DIAS | Valor Aproximado dos Tributos R$ 4.120,00. FONTE: IBPT',
};

export function DanfeTemplate(props: TemplateSharedProps) {
  const {
    activeFieldId,
    highlightCriticalOnly,
    fieldsById,
    onHoverField,
    onClickField,
    importedData,
  } = props;

  const data =
    importedData && importedData.modelId === 'nfe'
      ? importedData
      : DEFAULT_DANFE_DATA;

  const itemColClass = (fieldId: string) => {
    const isActive = activeFieldId === fieldId;
    const isCrit = fieldsById[fieldId]?.criticality === 'critico';
    const dimmed = highlightCriticalOnly && !isCrit;
    return `cursor-pointer border-r border-slate-900 px-1.5 py-1.5 transition-colors last:border-r-0 ${
      isActive
        ? 'bg-blue-100/85 font-semibold text-blue-950'
        : highlightCriticalOnly && isCrit
          ? 'bg-red-100/80 text-red-950'
          : 'hover:bg-blue-50/55'
    } ${dimmed ? 'opacity-35' : ''}`;
  };

  return (
    <div className="doc-paper overflow-x-auto rounded-lg border border-slate-300 bg-white p-4 sm:p-6">
      <div className="min-w-[780px] font-sans text-slate-900">
        {/* CANHOTO DE RECEBIMENTO OFICIAL */}
        <div className="grid grid-cols-12 border border-slate-900 text-[10px]">
          <div className="col-span-10 border-r border-slate-900">
            <div className="border-b border-slate-900 px-2 py-1 text-[8.5px] leading-snug">
              RECEBEMOS DE <strong>{data.emit.xNome}</strong> OS PRODUTOS E/OU SERVIÇOS CONSTANTES DA NOTA FISCAL ELETRÔNICA INDICADA AO LADO. EMISSÃO:{' '}
              {data.dhEmi.split(' ')[0]} · VALOR TOTAL: R$ {data.totais.vNF} · DESTINATÁRIO: {data.dest.xNome}
            </div>
            <div className="grid grid-cols-12">
              <div className="col-span-3 border-r border-slate-900 px-2 py-1.5">
                <div className="text-[7.5px] font-bold uppercase text-slate-700">DATA DE RECEBIMENTO</div>
                <div className="h-3.5" />
              </div>
              <div className="col-span-9 px-2 py-1.5">
                <div className="text-[7.5px] font-bold uppercase text-slate-700">IDENTIFICAÇÃO E ASSINATURA DO RECEBEDOR</div>
                <div className="h-3.5" />
              </div>
            </div>
          </div>
          <div className="col-span-2 flex flex-col items-center justify-center px-2 py-1 text-center">
            <div className="text-xs font-extrabold">NF-e</div>
            <div className="font-mono text-[10px] font-bold">Nº {data.numero}</div>
            <div className="font-mono text-[9.5px] font-semibold">Série {data.serie}</div>
          </div>
        </div>

        {/* LINHA PONTILHADA DE CORTE */}
        <div className="my-2.5 border-b border-dashed border-slate-500" />

        {/* CABEÇALHO PRINCIPAL DANFE (3 COLUNAS EXATAS DO PDF) */}
        <div className="grid grid-cols-12 border border-slate-900">
          {/* Col 1: Emitente (41%) */}
          <div className="col-span-5 flex flex-col justify-center border-r border-slate-900 px-3 py-2 text-center">
            <div className="mb-1 text-left text-[7.5px] font-bold uppercase text-slate-600">
              IDENTIFICAÇÃO DO EMITENTE
            </div>
            <div className="text-sm font-black leading-tight uppercase">
              {data.emit.xNome}
            </div>
            <div className="mt-1.5 text-[10px] leading-snug text-slate-800">
              {data.emit.ender}
              <br />
              {data.emit.munUf}
              <br />
              Fone: {data.emit.fone}
            </div>
          </div>

          {/* Col 2: DANFE + 0/1 + Número (19%) */}
          <div className="col-span-2 flex flex-col justify-between border-r border-slate-900 px-2 py-2 text-center">
            <div>
              <div className="text-base font-black tracking-wide">DANFE</div>
              <div className="text-[8.5px] leading-tight text-slate-700">
                Documento Auxiliar da Nota Fiscal Eletrônica
              </div>
            </div>

            <InteractiveBox
              {...props}
              fieldId="nfe-tipo-op"
              className="my-1 px-1 py-1 text-left"
            >
              <div className="flex items-center justify-between gap-1 text-[9px] leading-tight">
                <span>
                  0 - Entrada
                  <br />1 - Saída
                </span>
                <span className="border border-slate-900 px-2 py-0.5 font-mono text-sm font-bold">
                  {data.tpNF}
                </span>
              </div>
            </InteractiveBox>

            <InteractiveBox
              {...props}
              fieldId="nfe-numero-serie"
              className="py-0.5"
            >
              <div className="text-[11px] font-extrabold">Nº {data.numero}</div>
              <div className="text-[10px] font-bold">Série {data.serie}</div>
              <div className="text-[9px] text-slate-600">Folha 1/1</div>
            </InteractiveBox>
          </div>

          {/* Col 3: Código de Barras + Chave + Consulta (40%) */}
          <div className="col-span-5 flex flex-col justify-between">
            <div className="border-b border-slate-900 px-3 py-2">
              <RealBarcode
                value={
                  data.chave.includes('*')
                    ? DEFAULT_DANFE_DATA.chave
                    : data.chave
                }
                height={38}
              />
            </div>
            <InteractiveBox
              {...props}
              fieldId="nfe-chave"
              docLabel="CHAVE DE ACESSO"
              className="border-b border-slate-900 px-2.5 py-1.5 text-center"
            >
              <div className="font-mono text-[10.5px] font-bold tracking-tight">
                {data.chave}
              </div>
            </InteractiveBox>
            <div className="px-2.5 py-2 text-center text-[9px] leading-snug text-slate-700">
              Consulta de autenticidade no portal nacional da NF-e
              <br />
              www.nfe.fazenda.gov.br/portal ou no site da Sefaz Autorizadora
            </div>
          </div>
        </div>

        {/* NATUREZA DA OPERAÇÃO + PROTOCOLO */}
        <div className="grid grid-cols-12 border-x border-b border-slate-900">
          <InteractiveBox
            {...props}
            fieldId="nfe-natop"
            docLabel="NATUREZA DA OPERAÇÃO"
            className="col-span-7 border-r border-slate-900 px-2 py-1"
          >
            <span className="text-[11px] font-medium">{data.natOp}</span>
          </InteractiveBox>
          <InteractiveBox
            {...props}
            fieldId="nfe-protocolo"
            docLabel="PROTOCOLO DE AUTORIZAÇÃO DE USO"
            className="col-span-5 px-2 py-1 text-center"
          >
            <span className="font-mono text-[11px]">{data.protocolo}</span>
          </InteractiveBox>
        </div>

        {/* IE / IE SUBST / CNPJ EMITENTE */}
        <div className="grid grid-cols-12 border-x border-b border-slate-900">
          <div className="col-span-4 border-r border-slate-900 px-2 py-1">
            <div className="text-[7.5px] font-bold uppercase text-slate-700">INSCRIÇÃO ESTADUAL</div>
            <div className="font-mono text-[11px]">{data.emit.ie}</div>
          </div>
          <div className="col-span-4 border-r border-slate-900 px-2 py-1">
            <div className="text-[7.5px] font-bold uppercase text-slate-700">INSC. ESTADUAL DO SUBST. TRIB.</div>
            <div className="h-4" />
          </div>
          <div className="col-span-4 px-2 py-1">
            <div className="text-[7.5px] font-bold uppercase text-slate-700">CNPJ</div>
            <div className="font-mono text-[11px]">{data.emit.cnpj}</div>
          </div>
        </div>

        {/* DESTINATÁRIO / REMETENTE */}
        <div className="mt-2 mb-0.5 text-[8.5px] font-extrabold tracking-wide uppercase">
          DESTINATÁRIO / REMETENTE
        </div>
        <div className="border border-slate-900">
          <InteractiveBox {...props} fieldId="nfe-emit-dest">
            <div className="grid grid-cols-12 border-b border-slate-900">
              <div className="col-span-7 border-r border-slate-900 px-2 py-1">
                <div className="text-[7.5px] font-bold uppercase text-slate-700">NOME / RAZÃO SOCIAL</div>
                <div className="text-[11px] font-medium">{data.dest.xNome}</div>
              </div>
              <div className="col-span-3 border-r border-slate-900 px-2 py-1">
                <div className="text-[7.5px] font-bold uppercase text-slate-700">CNPJ / CPF</div>
                <div className="font-mono text-[11px]">{data.dest.doc}</div>
              </div>
              <div className="col-span-2 px-2 py-1 text-center">
                <div className="text-left text-[7.5px] font-bold uppercase text-slate-700">DATA DA EMISSÃO</div>
                <div className="font-mono text-[11px]">{data.dhEmi.split(' ')[0]}</div>
              </div>
            </div>
            <div className="grid grid-cols-12 border-b border-slate-900">
              <div className="col-span-5 border-r border-slate-900 px-2 py-1">
                <div className="text-[7.5px] font-bold uppercase text-slate-700">ENDEREÇO</div>
                <div className="text-[11px]">{data.dest.ender}</div>
              </div>
              <div className="col-span-3 border-r border-slate-900 px-2 py-1">
                <div className="text-[7.5px] font-bold uppercase text-slate-700">BAIRRO / DISTRITO</div>
                <div className="text-[11px]">{data.dest.bairro}</div>
              </div>
              <div className="col-span-2 border-r border-slate-900 px-2 py-1 text-center">
                <div className="text-left text-[7.5px] font-bold uppercase text-slate-700">CEP</div>
                <div className="font-mono text-[11px]">{data.dest.cep}</div>
              </div>
              <div className="col-span-2 px-2 py-1 text-center">
                <div className="text-left text-[7.5px] font-bold uppercase text-slate-700">DATA SAÍDA / ENTRADA</div>
                <div className="font-mono text-[11px]">{data.dhSaiEnt.split(' ')[0] || '—'}</div>
              </div>
            </div>
            <div className="grid grid-cols-12">
              <div className="col-span-4 border-r border-slate-900 px-2 py-1">
                <div className="text-[7.5px] font-bold uppercase text-slate-700">MUNICÍPIO</div>
                <div className="text-[11px]">{data.dest.mun}</div>
              </div>
              <div className="col-span-2 border-r border-slate-900 px-2 py-1">
                <div className="text-[7.5px] font-bold uppercase text-slate-700">FONE / FAX</div>
                <div className="font-mono text-[11px]">{data.dest.fone}</div>
              </div>
              <div className="col-span-1 border-r border-slate-900 px-2 py-1 text-center">
                <div className="text-left text-[7.5px] font-bold uppercase text-slate-700">UF</div>
                <div className="text-[11px]">{data.dest.uf}</div>
              </div>
              <div className="col-span-3 border-r border-slate-900 px-2 py-1">
                <div className="text-[7.5px] font-bold uppercase text-slate-700">INSCRIÇÃO ESTADUAL</div>
                <div className="font-mono text-[11px]">{data.dest.ie}</div>
              </div>
              <div className="col-span-2 px-2 py-1 text-center">
                <div className="text-left text-[7.5px] font-bold uppercase text-slate-700">HORA SAÍDA / ENTRADA</div>
                <div className="font-mono text-[11px]">{data.dhSaiEnt.split(' ')[1] || '00:00:00'}</div>
              </div>
            </div>
          </InteractiveBox>
        </div>

        {/* FATURA / DUPLICATAS (EXATAMENTE COMO NO PDF REAL) */}
        <div className="mt-2 mb-0.5 text-[8.5px] font-extrabold tracking-wide uppercase">
          FATURA / DUPLICATAS
        </div>
        <InteractiveBox
          {...props}
          fieldId="nfe-fatura"
          className="border border-slate-900"
        >
          <div className="flex flex-wrap">
            {(data.fatura.duplicatas.length > 0
              ? data.fatura.duplicatas
              : [{ nDup: '001', dVenc: data.dhEmi.split(' ')[0], vDup: data.fatura.vLiq }]
            ).map((dup) => (
              <div
                key={dup.nDup}
                className="w-36 border-r border-slate-900 px-2 py-1 font-mono text-[10px]"
              >
                <div className="flex justify-between">
                  <span className="font-sans text-[9px] text-slate-700">Núm.</span>
                  <strong>{dup.nDup}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-[9px] text-slate-700">Venc.</span>
                  <span>{dup.dVenc}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-[9px] text-slate-700">Valor</span>
                  <strong>R$ {dup.vDup}</strong>
                </div>
              </div>
            ))}
          </div>
        </InteractiveBox>

        {/* CÁLCULO DO IMPOSTO (EXATAS 2 LINHAS OFICIAIS DO PDF) */}
        <div className="mt-2 mb-0.5 text-[8.5px] font-extrabold tracking-wide uppercase">
          CÁLCULO DO IMPOSTO
        </div>
        <InteractiveBox
          {...props}
          fieldId="nfe-impostos"
          className="border border-slate-900"
        >
          <div className="grid grid-cols-7 border-b border-slate-900 text-right font-mono text-[11px]">
            <div className="border-r border-slate-900 px-2 py-1">
              <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">BASE CÁLC. ICMS</div>
              {data.totais.vBC}
            </div>
            <div className="border-r border-slate-900 px-2 py-1">
              <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">V. ICMS</div>
              {data.totais.vICMS}
            </div>
            <div className="border-r border-slate-900 px-2 py-1">
              <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">BASE CÁLC. ICMS ST</div>
              {data.totais.vBCST}
            </div>
            <div className="border-r border-slate-900 px-2 py-1">
              <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">V. ICMS SUBST.</div>
              {data.totais.vST}
            </div>
            <div className="border-r border-slate-900 px-2 py-1">
              <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">V. IMP. IMPORTAÇÃO</div>
              0,00
            </div>
            <div className="border-r border-slate-900 px-2 py-1">
              <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">V. FCP</div>
              {data.totais.vFCP}
            </div>
            <div className="px-2 py-1">
              <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">V. TOTAL PRODUTOS</div>
              {data.totais.vProd}
            </div>
          </div>
          <div className="grid grid-cols-8 text-right font-mono text-[11px]">
            <div className="border-r border-slate-900 px-2 py-1">
              <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">V. FRETE</div>
              {data.totais.vFrete}
            </div>
            <div className="border-r border-slate-900 px-2 py-1">
              <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">V. SEGURO</div>
              {data.totais.vSeg}
            </div>
            <div className="border-r border-slate-900 px-2 py-1">
              <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">DESCONTO</div>
              {data.totais.vDesc}
            </div>
            <div className="border-r border-slate-900 px-2 py-1">
              <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">OUTRAS DESP.</div>
              {data.totais.vOutro}
            </div>
            <div className="border-r border-slate-900 px-2 py-1">
              <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">V. IPI</div>
              {data.totais.vIPI}
            </div>
            <div className="border-r border-slate-900 px-2 py-1">
              <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">V. PIS</div>
              {data.totais.vPIS}
            </div>
            <div className="border-r border-slate-900 px-2 py-1">
              <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">V. COFINS</div>
              {data.totais.vCOFINS}
            </div>
            <div className="px-2 py-1 font-bold">
              <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">V. TOTAL DA NOTA</div>
              {data.totais.vNF}
            </div>
          </div>
        </InteractiveBox>

        {/* IBS / CBS - REFORMA TRIBUTÁRIA 2026 (DISCRETO, NO ESTILO DANFE) */}
        <InteractiveBox
          {...props}
          fieldId="nfe-ibscbs"
          className="mt-1 border border-slate-900 px-2 py-1"
        >
          <div className="grid grid-cols-4 gap-2 font-mono text-[10px]">
            <div>
              <span className="font-sans text-[7.5px] font-bold uppercase text-slate-700">BC IBS/CBS: </span>
              R$ {data.totais.vBCIBSCBS}
            </div>
            <div>
              <span className="font-sans text-[7.5px] font-bold uppercase text-slate-700">VALOR IBS: </span>
              R$ {data.totais.vIBS}
            </div>
            <div>
              <span className="font-sans text-[7.5px] font-bold uppercase text-slate-700">VALOR CBS: </span>
              R$ {data.totais.vCBS}
            </div>
            <div className="text-right font-sans text-[8.5px] text-slate-500">
              IBS / CBS (Reforma Tributária 2026)
            </div>
          </div>
        </InteractiveBox>

        {/* TRANSPORTADOR / VOLUMES TRANSPORTADOS (3 LINHAS EXATAS DO PDF) */}
        <div className="mt-2 mb-0.5 text-[8.5px] font-extrabold tracking-wide uppercase">
          TRANSPORTADOR / VOLUMES TRANSPORTADOS
        </div>
        <div className="border border-slate-900">
          <div className="grid grid-cols-12 border-b border-slate-900">
            <InteractiveBox
              {...props}
              fieldId="nfe-volumes"
              docLabel="NOME / RAZÃO SOCIAL"
              className="col-span-4 border-r border-slate-900 px-2 py-1"
            >
              <span className="text-[10.5px]">{data.transp.xNome}</span>
            </InteractiveBox>
            <InteractiveBox
              {...props}
              fieldId="nfe-frete"
              docLabel="FRETE POR CONTA"
              className="col-span-2 border-r border-slate-900 px-2 py-1"
            >
              <span className="text-[10.5px]">{data.transp.modFrete}</span>
            </InteractiveBox>
            <InteractiveBox
              {...props}
              fieldId="nfe-volumes"
              docLabel="CÓDIGO ANTT"
              className="col-span-2 border-r border-slate-900 px-2 py-1"
            >
              <span className="font-mono text-[10.5px]">{data.transp.rntrc ?? '—'}</span>
            </InteractiveBox>
            <InteractiveBox
              {...props}
              fieldId="nfe-volumes"
              docLabel="PLACA VEÍCULO"
              className="col-span-1 border-r border-slate-900 px-2 py-1"
            >
              <span className="font-mono text-[10.5px]">{data.transp.placa}</span>
            </InteractiveBox>
            <InteractiveBox
              {...props}
              fieldId="nfe-volumes"
              docLabel="UF"
              className="col-span-1 border-r border-slate-900 px-2 py-1"
            >
              <span className="text-[10.5px]">{data.transp.placaUf ?? '—'}</span>
            </InteractiveBox>
            <InteractiveBox
              {...props}
              fieldId="nfe-volumes"
              docLabel="CNPJ / CPF"
              className="col-span-2 px-2 py-1"
            >
              <span className="font-mono text-[10.5px]">{data.transp.cnpj}</span>
            </InteractiveBox>
          </div>

          <InteractiveBox {...props} fieldId="nfe-volumes">
            <div className="grid grid-cols-12 border-b border-slate-900 text-[10.5px]">
              <div className="col-span-5 border-r border-slate-900 px-2 py-1">
                <div className="text-[7.5px] font-bold uppercase text-slate-700">ENDEREÇO</div>
                {data.transp.ender ?? '—'}
              </div>
              <div className="col-span-4 border-r border-slate-900 px-2 py-1">
                <div className="text-[7.5px] font-bold uppercase text-slate-700">MUNICÍPIO</div>
                {data.transp.munUf ?? '—'}
              </div>
              <div className="col-span-1 border-r border-slate-900 px-2 py-1">
                <div className="text-[7.5px] font-bold uppercase text-slate-700">UF</div>
                {data.transp.placaUf ?? '—'}
              </div>
              <div className="col-span-2 px-2 py-1 font-mono">
                <div className="font-sans text-[7.5px] font-bold uppercase text-slate-700">INSCRIÇÃO ESTADUAL</div>
                {data.transp.ie ?? '—'}
              </div>
            </div>
            <div className="grid grid-cols-12 font-mono text-[10.5px]">
              <div className="col-span-2 border-r border-slate-900 px-2 py-1 text-right">
                <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">QUANTIDADE</div>
                {data.transp.qVol}
              </div>
              <div className="col-span-2 border-r border-slate-900 px-2 py-1">
                <div className="font-sans text-[7.5px] font-bold uppercase text-slate-700">ESPÉCIE</div>
                {data.transp.esp}
              </div>
              <div className="col-span-2 border-r border-slate-900 px-2 py-1">
                <div className="font-sans text-[7.5px] font-bold uppercase text-slate-700">MARCA</div>
                {data.transp.marca ?? '—'}
              </div>
              <div className="col-span-2 border-r border-slate-900 px-2 py-1">
                <div className="font-sans text-[7.5px] font-bold uppercase text-slate-700">NUMERAÇÃO</div>
                {data.transp.nVol ?? '—'}
              </div>
              <div className="col-span-2 border-r border-slate-900 px-2 py-1 text-right">
                <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">PESO BRUTO</div>
                {data.transp.pesoB}
              </div>
              <div className="col-span-2 px-2 py-1 text-right">
                <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">PESO LÍQUIDO</div>
                {data.transp.pesoL}
              </div>
            </div>
          </InteractiveBox>
        </div>

        {/* DADOS DOS PRODUTOS / SERVIÇOS (EXATAS 14 COLUNAS DO PDF REAL) */}
        <div className="mt-2 mb-0.5 text-[8.5px] font-extrabold tracking-wide uppercase">
          DADOS DOS PRODUTOS / SERVIÇOS
        </div>
        <div className="border border-slate-900">
          <table className="w-full border-collapse text-[9.5px]">
            <thead>
              <tr className="border-b border-slate-900 text-[7.5px] font-bold uppercase text-slate-800">
                <th className="border-r border-slate-900 px-1.5 py-1 text-left">CÓDIGO PRODUTO</th>
                <th className="border-r border-slate-900 px-1.5 py-1 text-left">DESCRIÇÃO DO PRODUTO / SERVIÇO</th>
                <th
                  data-field-id="nfe-ncm"
                  onMouseEnter={(e) => onHoverField('nfe-ncm', e.currentTarget)}
                  onClick={() => onClickField('nfe-ncm')}
                  className="cursor-pointer border-r border-slate-900 px-1.5 py-1 text-center hover:bg-blue-50"
                >
                  NCM/SH
                </th>
                <th
                  data-field-id="nfe-cst"
                  onMouseEnter={(e) => onHoverField('nfe-cst', e.currentTarget)}
                  onClick={() => onClickField('nfe-cst')}
                  className="cursor-pointer border-r border-slate-900 px-1.5 py-1 text-center hover:bg-blue-50"
                >
                  O/CST
                </th>
                <th
                  data-field-id="nfe-cfop"
                  onMouseEnter={(e) => onHoverField('nfe-cfop', e.currentTarget)}
                  onClick={() => onClickField('nfe-cfop')}
                  className="cursor-pointer border-r border-slate-900 px-1.5 py-1 text-center hover:bg-blue-50"
                >
                  CFOP
                </th>
                <th
                  data-field-id="nfe-qtd-vlr"
                  onMouseEnter={(e) => onHoverField('nfe-qtd-vlr', e.currentTarget)}
                  onClick={() => onClickField('nfe-qtd-vlr')}
                  className="cursor-pointer border-r border-slate-900 px-1.5 py-1 text-center hover:bg-blue-50"
                >
                  UN
                </th>
                <th
                  onMouseEnter={(e) => onHoverField('nfe-qtd-vlr', e.currentTarget)}
                  onClick={() => onClickField('nfe-qtd-vlr')}
                  className="cursor-pointer border-r border-slate-900 px-1.5 py-1 text-right hover:bg-blue-50"
                >
                  QUANT.
                </th>
                <th
                  onMouseEnter={(e) => onHoverField('nfe-qtd-vlr', e.currentTarget)}
                  onClick={() => onClickField('nfe-qtd-vlr')}
                  className="cursor-pointer border-r border-slate-900 px-1.5 py-1 text-right hover:bg-blue-50"
                >
                  VALOR UNIT.
                </th>
                <th
                  onMouseEnter={(e) => onHoverField('nfe-qtd-vlr', e.currentTarget)}
                  onClick={() => onClickField('nfe-qtd-vlr')}
                  className="cursor-pointer border-r border-slate-900 px-1.5 py-1 text-right hover:bg-blue-50"
                >
                  VALOR TOTAL
                </th>
                <th className="border-r border-slate-900 px-1.5 py-1 text-right">B. CÁLC. ICMS</th>
                <th className="border-r border-slate-900 px-1.5 py-1 text-right">VALOR ICMS</th>
                <th className="border-r border-slate-900 px-1.5 py-1 text-right">VALOR IPI</th>
                <th className="border-r border-slate-900 px-1.5 py-1 text-right">ALÍQ. ICMS</th>
                <th className="px-1.5 py-1 text-right">ALÍQ. IPI</th>
              </tr>
            </thead>
            <tbody className="font-mono text-[9.5px]">
              {data.items.map((item, idx) => (
                <tr key={`${item.cod}-${idx}`} className="border-b border-slate-200 last:border-b-0">
                  <td className="border-r border-slate-900 px-1.5 py-1.5">{item.cod}</td>
                  <td className="border-r border-slate-900 px-1.5 py-1.5 font-sans text-[10px]">
                    {item.desc}
                  </td>
                  <td
                    onMouseEnter={(e) => onHoverField('nfe-ncm', e.currentTarget)}
                    onClick={() => onClickField('nfe-ncm')}
                    className={`${itemColClass('nfe-ncm')} text-center`}
                  >
                    <div>{item.ncm}</div>
                    {item.cest !== '—' && (
                      <div className="text-[7.5px] text-slate-500">CEST {item.cest}</div>
                    )}
                  </td>
                  <td
                    onMouseEnter={(e) => onHoverField('nfe-cst', e.currentTarget)}
                    onClick={() => onClickField('nfe-cst')}
                    className={`${itemColClass('nfe-cst')} text-center`}
                  >
                    {item.cst}
                  </td>
                  <td
                    onMouseEnter={(e) => onHoverField('nfe-cfop', e.currentTarget)}
                    onClick={() => onClickField('nfe-cfop')}
                    className={`${itemColClass('nfe-cfop')} text-center`}
                  >
                    {item.cfop}
                  </td>
                  <td
                    onMouseEnter={(e) => onHoverField('nfe-qtd-vlr', e.currentTarget)}
                    onClick={() => onClickField('nfe-qtd-vlr')}
                    className={`${itemColClass('nfe-qtd-vlr')} text-center`}
                  >
                    {item.un}
                  </td>
                  <td
                    onMouseEnter={(e) => onHoverField('nfe-qtd-vlr', e.currentTarget)}
                    onClick={() => onClickField('nfe-qtd-vlr')}
                    className={`${itemColClass('nfe-qtd-vlr')} text-right`}
                  >
                    {item.qtd}
                  </td>
                  <td
                    onMouseEnter={(e) => onHoverField('nfe-qtd-vlr', e.currentTarget)}
                    onClick={() => onClickField('nfe-qtd-vlr')}
                    className={`${itemColClass('nfe-qtd-vlr')} text-right`}
                  >
                    {item.vUnit}
                  </td>
                  <td
                    onMouseEnter={(e) => onHoverField('nfe-qtd-vlr', e.currentTarget)}
                    onClick={() => onClickField('nfe-qtd-vlr')}
                    className={`${itemColClass('nfe-qtd-vlr')} text-right`}
                  >
                    {item.vTotal}
                  </td>
                  <td className="border-r border-slate-900 px-1.5 py-1.5 text-right">
                    {item.bcIcms}
                  </td>
                  <td className="border-r border-slate-900 px-1.5 py-1.5 text-right">
                    {item.vIcms}
                  </td>
                  <td className="border-r border-slate-900 px-1.5 py-1.5 text-right">
                    {item.vIpi}
                  </td>
                  <td className="border-r border-slate-900 px-1.5 py-1.5 text-right">
                    {item.aliq}
                  </td>
                  <td className="px-1.5 py-1.5 text-right">
                    {item.aliqIpi ?? '0,00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DADOS ADICIONAIS */}
        <div className="mt-2 mb-0.5 text-[8.5px] font-extrabold tracking-wide uppercase">
          DADOS ADICIONAIS
        </div>
        <div className="grid grid-cols-12 border border-slate-900">
          <InteractiveBox
            {...props}
            fieldId="nfe-infcpl"
            docLabel="INFORMAÇÕES COMPLEMENTARES"
            className="col-span-8 min-h-[64px] border-r border-slate-900 px-2 py-1.5"
          >
            <div className="text-[9.5px] leading-relaxed">{data.infCpl}</div>
          </InteractiveBox>
          <div className="col-span-4 px-2 py-1.5">
            <div className="text-[7.5px] font-bold uppercase text-slate-700">RESERVADO AO FISCO</div>
          </div>
        </div>
      </div>
    </div>
  );
}
