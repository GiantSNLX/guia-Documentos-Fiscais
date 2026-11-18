import type { ImportedDocData } from '../../types/fiscal';
import { RealQrCode } from '../RealBarcode';
import { InteractiveBox, type TemplateSharedProps } from './InteractiveZone';

const DEFAULT_NFSE_DATA: ImportedDocData = {
  modelId: 'nfse',
  fileName: 'exemplo-danfse-v2-ficticio.xml',
  chave: '35503082212345678000199000000000029626119081726354',
  numero: '296',
  serie: '70000',
  tpNF: '1',
  natOp: 'Suporte técnico em informática',
  protocolo: 'NFS-e Gerada',
  dhEmi: '18/11/2026 10:35:34',
  dhSaiEnt: '17/11/2026',
  emit: {
    xNome: 'TK SISTEMAS E CONSULTORIA LTDA',
    cnpj: '12.345.678/0001-99',
    ie: '45102218',
    ender: 'Av. Paulista, 1.374 — Bela Vista',
    munUf: 'São Paulo / SP',
    fone: '(11) 3100-2200',
  },
  dest: {
    xNome: 'INDÚSTRIA ALPHA S.A.',
    doc: '33.444.555/0001-66',
    ie: '8821904',
    ender: 'Rua das Indústrias, 900, Vila Leopoldina',
    bairro: 'Vila Leopoldina',
    cep: '05302-000',
    mun: 'São Paulo',
    uf: 'SP',
    fone: '(11) 3880-9000',
  },
  totais: {
    vBC: '10.000,00',
    vICMS: '500,00',
    vBCST: '0,00',
    vST: '0,00',
    vProd: '10.000,00',
    vFrete: '0,00',
    vSeg: '0,00',
    vDesc: '0,00',
    vOutro: '0,00',
    vIPI: '0,00',
    vPIS: '65,00',
    vCOFINS: '300,00',
    vFCP: '0,00',
    vNF: '9.385,00',
    vBCIBSCBS: '0,00',
    vIBS: '0,00',
    vCBS: '0,00',
  },
  fatura: {
    nFat: '304',
    vOrig: '10.000,00',
    vLiq: '9.385,00',
    tPag: 'NFS-e Padrão Nacional',
    duplicatas: [],
  },
  transp: {
    modFrete: '9 - Sem Frete',
    xNome: '—',
    cnpj: '—',
    placa: '—',
    qVol: '—',
    esp: '—',
    pesoB: '0,000',
    pesoL: '0,000',
  },
  items: [],
  infCpl:
    'Manutenção preventiva e suporte técnico mensal em servidores ref. Nov/2026 conforme Contrato #CT-884 e Pedido PO-77210.',
  extra: {
    nNFSe: '296',
    nDPS: '304',
    serieDPS: '70000',
    dCompet: '17/11/2026',
    dhProc: '18/11/2026 10:35:34',
    emitenteLabel: 'Prestador',
    situacao: 'NFS-e Gerada',
    finalidade: '-',
    emitIbgeCep: '35.50308 / 01310-100',
    emitEmail: 'fiscal@tksistemas.exemplo.br',
    destIbgeCep: '35.50308 / 05302-000',
    destEmail: '-',
    regApurSN: '-',
    xLocEmi: 'São Paulo / SP',
    xLocPrestacao: 'São Paulo / SP / -',
    cTribNac: '01.07.01 / -',
    xTribNac: 'Suporte técnico em informática, inclusive instalação, configuração e manutenção.',
    cNBS: '1.1502.20.00',
    opSimpNac: 'Não optante',
    tribISSQN: 'Operação Tributável (Alíq. 5,00% • ISS R$ 500,00 • Não Retido)',
    descContribSoc: '1 - PIS/COFINS/CSLL Retidos (4,65%)',
    totalRetencoes: 'R$ 615,00',
    vIRRF: 'R$ 150,00',
    vCSLL: 'R$ 100,00',
    vINSS: '-',
    vTotTribFed: 'R$ 1.345,00',
    vTotTribEst: 'R$ 0,00',
    vTotTribMun: 'R$ 500,00',
  },
};

export function NfseTemplate(props: TemplateSharedProps) {
  const { importedData } = props;
  const data =
    importedData && importedData.modelId === 'nfse'
      ? importedData
      : DEFAULT_NFSE_DATA;
  const ex = { ...DEFAULT_NFSE_DATA.extra!, ...(data.extra ?? {}) };
  const rawChave = data.chave.replace(/\s+/g, '');

  return (
    <div className="doc-paper overflow-x-auto rounded-lg border border-slate-300 bg-white p-4 sm:p-6">
      <div className="min-w-[740px] font-sans text-slate-900">
        {/* TOPO DANFSe v2.0 */}
        <div className="grid grid-cols-12 items-center border border-slate-900 px-3 py-2">
          <div className="col-span-3 flex items-center gap-2">
            <div className="text-xl font-black tracking-tighter text-emerald-700">
              NFS<span className="text-sky-600">e</span>
            </div>
            <div className="text-[8.5px] leading-tight font-semibold text-slate-600">
              Nota Fiscal de
              <br />
              Serviço eletrônica
            </div>
          </div>
          <div className="col-span-6 text-center">
            <div className="text-xs font-extrabold">DANFSe v2.0</div>
            <div className="text-[10.5px] font-bold">
              Documento Auxiliar da NFS-e
            </div>
          </div>
          <div className="col-span-3 text-right text-[8.5px] leading-snug text-slate-700">
            <div>Ambiente Gerador: 2</div>
            <div>Tipo de Ambiente: 1</div>
          </div>
        </div>

        {/* BLOCO IDENTIFICAÇÃO + QR CODE */}
        <div className="grid grid-cols-12 border-x border-b border-slate-900">
          <div className="col-span-9 border-r border-slate-900">
            <InteractiveBox
              {...props}
              fieldId="nfse-numero-verif"
              docLabel="CHAVE DE ACESSO DA NFS-e"
              className="border-b border-slate-300 px-2.5 py-1.5"
            >
              <div className="font-mono text-[10.5px] font-medium tracking-tight">
                {rawChave || '—'}
              </div>
            </InteractiveBox>

            <div className="grid grid-cols-3 border-b border-slate-300">
              <InteractiveBox
                {...props}
                fieldId="nfse-numero-verif"
                docLabel="NÚMERO DA NFS-e"
                className="px-2.5 py-1"
              >
                <span className="text-[11px] font-semibold">{ex.nNFSe}</span>
              </InteractiveBox>
              <InteractiveBox
                {...props}
                fieldId="nfse-competencia"
                docLabel="COMPETÊNCIA DA NFS-e"
                className="px-2.5 py-1"
              >
                <span className="font-mono text-[11px]">{ex.dCompet}</span>
              </InteractiveBox>
              <InteractiveBox
                {...props}
                fieldId="nfse-competencia"
                docLabel="DATA E HORA DA EMISSÃO DA NFS-e"
                className="px-2.5 py-1"
              >
                <span className="font-mono text-[11px]">{ex.dhProc}</span>
              </InteractiveBox>
            </div>

            <div className="grid grid-cols-3 border-b border-slate-300">
              <InteractiveBox
                {...props}
                fieldId="nfse-numero-verif"
                docLabel="NÚMERO DA DPS"
                className="px-2.5 py-1"
              >
                <span className="font-mono text-[11px]">{ex.nDPS}</span>
              </InteractiveBox>
              <InteractiveBox
                {...props}
                fieldId="nfse-numero-verif"
                docLabel="SÉRIE DA DPS"
                className="px-2.5 py-1"
              >
                <span className="font-mono text-[11px]">{ex.serieDPS}</span>
              </InteractiveBox>
              <InteractiveBox
                {...props}
                fieldId="nfse-competencia"
                docLabel="DATA E HORA DA EMISSÃO DA DPS"
                className="px-2.5 py-1"
              >
                <span className="font-mono text-[11px]">{ex.dhProc}</span>
              </InteractiveBox>
            </div>

            <div className="grid grid-cols-3">
              <InteractiveBox
                {...props}
                fieldId="nfse-partes"
                docLabel="EMITENTE DA NFS-e"
                className="px-2.5 py-1"
              >
                <span className="text-[10.5px]">{ex.emitenteLabel}</span>
              </InteractiveBox>
              <InteractiveBox
                {...props}
                fieldId="nfse-numero-verif"
                docLabel="SITUAÇÃO DA NFS-e"
                className="px-2.5 py-1"
              >
                <span className="text-[10.5px]">{ex.situacao}</span>
              </InteractiveBox>
              <InteractiveBox
                {...props}
                fieldId="nfse-numero-verif"
                docLabel="FINALIDADE"
                className="px-2.5 py-1"
              >
                <span className="text-[10.5px]">{ex.finalidade}</span>
              </InteractiveBox>
            </div>
          </div>

          <div className="col-span-3 flex flex-col items-center justify-center p-2 text-center">
            <RealQrCode
              value={`https://www.nfse.gov.br/ConsultaPublica/?tpc=1&chave=${rawChave || '000000'}`}
              size={84}
            />
            <div className="mt-1.5 text-[7.5px] leading-tight text-slate-600">
              A autenticidade desta NFS-e pode ser verificada pela leitura deste código QR ou pela consulta da chave de acesso no portal nacional da NFS-e
            </div>
          </div>
        </div>

        {/* PRESTADOR / FORNECEDOR */}
        <InteractiveBox
          {...props}
          fieldId="nfse-partes"
          className="border-x border-b border-slate-900"
        >
          <div className="grid grid-cols-12 px-2.5 pt-1.5 pb-1">
            <div className="col-span-3 text-[8.5px] font-extrabold uppercase">
              PRESTADOR / FORNECEDOR
            </div>
            <div className="col-span-3">
              <div className="text-[7.5px] font-bold text-slate-600">CNPJ / CPF / NIF</div>
              <div className="font-mono text-[10.5px]">{data.emit.cnpj}</div>
            </div>
            <div className="col-span-4">
              <div className="text-[7.5px] font-bold text-slate-600">Indicador Municipal (Inscrição)</div>
              <div className="font-mono text-[10.5px]">{data.emit.ie}</div>
            </div>
            <div className="col-span-2">
              <div className="text-[7.5px] font-bold text-slate-600">Telefone</div>
              <div className="font-mono text-[10.5px]">{data.emit.fone}</div>
            </div>
          </div>
          <div className="grid grid-cols-12 px-2.5 py-1">
            <div className="col-span-6">
              <div className="text-[7.5px] font-bold text-slate-600">Nome / Nome Empresarial</div>
              <div className="text-[10.5px] font-medium">{data.emit.xNome}</div>
            </div>
            <div className="col-span-4">
              <div className="text-[7.5px] font-bold text-slate-600">Município / Sigla UF</div>
              <div className="text-[10.5px]">{data.emit.munUf}</div>
            </div>
            <div className="col-span-2">
              <div className="text-[7.5px] font-bold text-slate-600">Código IBGE / CEP</div>
              <div className="font-mono text-[10px]">{ex.emitIbgeCep}</div>
            </div>
          </div>
          <div className="grid grid-cols-12 px-2.5 py-1">
            <div className="col-span-6">
              <div className="text-[7.5px] font-bold text-slate-600">Endereço</div>
              <div className="text-[10.5px]">{data.emit.ender}</div>
            </div>
            <div className="col-span-6">
              <div className="text-[7.5px] font-bold text-slate-600">E-mail</div>
              <div className="text-[10.5px]">{ex.emitEmail}</div>
            </div>
          </div>
          <div className="grid grid-cols-12 px-2.5 pb-1.5 pt-0.5">
            <div className="col-span-4">
              <div className="text-[7.5px] font-bold text-slate-600">Simples Nacional na Data de Competência</div>
              <div className="text-[10.5px]">{ex.opSimpNac}</div>
            </div>
            <div className="col-span-8">
              <div className="text-[7.5px] font-bold text-slate-600">Regime de Apuração Tributária pelo SN</div>
              <div className="text-[10.5px]">{ex.regApurSN}</div>
            </div>
          </div>
        </InteractiveBox>

        {/* TOMADOR / ADQUIRENTE */}
        <InteractiveBox
          {...props}
          fieldId="nfse-partes"
          className="border-x border-b border-slate-900"
        >
          <div className="grid grid-cols-12 px-2.5 pt-1.5 pb-1">
            <div className="col-span-3 text-[8.5px] font-extrabold uppercase">
              TOMADOR / ADQUIRENTE
            </div>
            <div className="col-span-3">
              <div className="text-[7.5px] font-bold text-slate-600">CNPJ / CPF / NIF</div>
              <div className="font-mono text-[10.5px]">{data.dest.doc}</div>
            </div>
            <div className="col-span-4">
              <div className="text-[7.5px] font-bold text-slate-600">Indicador Municipal (Inscrição)</div>
              <div className="font-mono text-[10.5px]">{data.dest.ie}</div>
            </div>
            <div className="col-span-2">
              <div className="text-[7.5px] font-bold text-slate-600">Telefone</div>
              <div className="font-mono text-[10.5px]">{data.dest.fone}</div>
            </div>
          </div>
          <div className="grid grid-cols-12 px-2.5 py-1">
            <div className="col-span-6">
              <div className="text-[7.5px] font-bold text-slate-600">Nome / Nome Empresarial</div>
              <div className="text-[10.5px] font-medium">{data.dest.xNome}</div>
            </div>
            <div className="col-span-4">
              <div className="text-[7.5px] font-bold text-slate-600">Município / Sigla UF</div>
              <div className="text-[10.5px]">
                {data.dest.mun} {data.dest.uf !== '—' ? `/ ${data.dest.uf}` : ''}
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-[7.5px] font-bold text-slate-600">Código IBGE / CEP</div>
              <div className="font-mono text-[10px]">{ex.destIbgeCep}</div>
            </div>
          </div>
          <div className="grid grid-cols-12 px-2.5 pb-1.5 pt-0.5">
            <div className="col-span-6">
              <div className="text-[7.5px] font-bold text-slate-600">Endereço</div>
              <div className="text-[10.5px]">{data.dest.ender}</div>
            </div>
            <div className="col-span-6">
              <div className="text-[7.5px] font-bold text-slate-600">E-mail</div>
              <div className="text-[10.5px]">{ex.destEmail}</div>
            </div>
          </div>
        </InteractiveBox>

        {/* FAIXAS DESTINATÁRIO / INTERMEDIÁRIO */}
        <div className="border-x border-b border-slate-900 py-0.5 text-center text-[8.5px] font-bold uppercase text-slate-700">
          DESTINATÁRIO DA OPERAÇÃO NÃO IDENTIFICADO NA NFS-e
        </div>
        <div className="border-x border-b border-slate-900 py-0.5 text-center text-[8.5px] font-bold uppercase text-slate-700">
          INTERMEDIÁRIO DA OPERAÇÃO NÃO IDENTIFICADO NA NFS-e
        </div>

        {/* SERVIÇO PRESTADO */}
        <div className="border-x border-b border-slate-900">
          <div className="grid grid-cols-12 px-2.5 pt-1.5 pb-1">
            <div className="col-span-3 text-[8.5px] font-extrabold uppercase">
              SERVIÇO PRESTADO
            </div>
            <InteractiveBox
              {...props}
              fieldId="nfse-cod-servico"
              docLabel="Código de Tributação Nacional/Municipal"
              className="col-span-4 px-1"
            >
              <span className="font-mono text-[10.5px] font-semibold">
                {ex.cTribNac}
              </span>
            </InteractiveBox>
            <InteractiveBox
              {...props}
              fieldId="nfse-cod-servico"
              docLabel="Código da NBS"
              className="col-span-2 px-1"
            >
              <span className="font-mono text-[10.5px]">{ex.cNBS}</span>
            </InteractiveBox>
            <InteractiveBox
              {...props}
              fieldId="nfse-local-incidencia"
              docLabel="Local da Prestação / Sigla UF / País"
              className="col-span-3 px-1"
            >
              <span className="text-[10.5px]">{ex.xLocPrestacao}</span>
            </InteractiveBox>
          </div>

          <InteractiveBox
            {...props}
            fieldId="nfse-cod-servico"
            className="px-2.5 py-0.5"
          >
            <div className="text-[10px] text-slate-800">{ex.xTribNac}</div>
          </InteractiveBox>

          <InteractiveBox
            {...props}
            fieldId="nfse-discriminacao"
            docLabel="Descrição do Serviço"
            className="px-2.5 pb-2 pt-1"
          >
            <div className="text-[10.5px] leading-snug">{data.infCpl}</div>
          </InteractiveBox>
        </div>

        {/* TRIBUTAÇÃO MUNICIPAL (ISSQN) */}
        <InteractiveBox
          {...props}
          fieldId="nfse-iss"
          className="border-x border-b border-slate-900 px-2.5 py-1.5"
        >
          <div className="text-center text-[8.5px] font-extrabold uppercase">
            TRIBUTAÇÃO MUNICIPAL (ISSQN) — {ex.tribISSQN}
          </div>
        </InteractiveBox>

        {/* TRIBUTAÇÃO FEDERAL (EXCETO CBS) */}
        <InteractiveBox
          {...props}
          fieldId="nfse-retencoes"
          className="border-x border-b border-slate-900 px-2.5 py-1.5"
        >
          <div className="grid grid-cols-12 pb-1">
            <div className="col-span-4 text-[8.5px] font-extrabold uppercase">
              TRIBUTAÇÃO FEDERAL (EXCETO CBS)
            </div>
            <div className="col-span-2">
              <div className="text-[7.5px] font-bold text-slate-600">IRRF</div>
              <div className="font-mono text-[10.5px]">{ex.vIRRF}</div>
            </div>
            <div className="col-span-3">
              <div className="text-[7.5px] font-bold text-slate-600">Contribuição Previdenciária - Retida</div>
              <div className="font-mono text-[10.5px]">{ex.vINSS}</div>
            </div>
            <div className="col-span-3">
              <div className="text-[7.5px] font-bold text-slate-600">Contribuições Sociais - Retidas</div>
              <div className="font-mono text-[10.5px]">R$ {ex.vCSLL} / R$ {data.totais.vPIS} / R$ {data.totais.vCOFINS}</div>
            </div>
          </div>
          <div className="grid grid-cols-12 pt-0.5">
            <div className="col-span-3">
              <div className="text-[7.5px] font-bold text-slate-600">PIS - Débito Apuração Própria</div>
              <div className="font-mono text-[10px]">R$ {data.totais.vPIS}</div>
            </div>
            <div className="col-span-3">
              <div className="text-[7.5px] font-bold text-slate-600">COFINS - Débito Apuração Própria</div>
              <div className="font-mono text-[10px]">R$ {data.totais.vCOFINS}</div>
            </div>
            <div className="col-span-6">
              <div className="text-[7.5px] font-bold text-slate-600">Descrição Contrib. Sociais - Retidas</div>
              <div className="text-[10px]">{ex.descContribSoc}</div>
            </div>
          </div>
        </InteractiveBox>

        {/* TRIBUTAÇÃO IBS/CBS (4 LINHAS OFICIAIS DO DANFSe v2.0) */}
        <InteractiveBox
          {...props}
          fieldId="nfse-ibscbs"
          className="border-x border-b border-slate-900 px-2.5 py-1.5"
        >
          <div className="grid grid-cols-12 pb-1">
            <div className="col-span-3 text-[8.5px] font-extrabold uppercase">
              TRIBUTAÇÃO IBS/CBS
            </div>
            <div className="col-span-3">
              <div className="text-[7.5px] font-bold text-slate-600">CST / cClassTrib</div>
              <div className="font-mono text-[10px]">- / -</div>
            </div>
            <div className="col-span-6">
              <div className="text-[7.5px] font-bold text-slate-600">
                Indicador de Operação / Código IBGE Incidência / Município Incidência / Sigla UF
              </div>
              <div className="font-mono text-[10px]">- / - / - / -</div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 py-0.5 text-[9.5px]">
            <div>
              <div className="text-[7.5px] font-bold text-slate-600">Exclusões e Reduções da Base de Cálculo</div>
              <div className="font-mono">R$ 0,00</div>
            </div>
            <div>
              <div className="text-[7.5px] font-bold text-slate-600">Base de Cálculo Após Exclusões e Reduções</div>
              <div className="font-mono">-</div>
            </div>
            <div>
              <div className="text-[7.5px] font-bold text-slate-600">Red. Alíquota IBS / Red. Alíquota CBS</div>
              <div className="font-mono">- / -</div>
            </div>
            <div>
              <div className="text-[7.5px] font-bold text-slate-600">Alíquota - IBS UF / IBS Mun</div>
              <div className="font-mono">- / -</div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 py-0.5 text-[9.5px]">
            <div>
              <div className="text-[7.5px] font-bold text-slate-600">Alíq. Efetiva Municipal - IBS</div>
              <div>-</div>
            </div>
            <div>
              <div className="text-[7.5px] font-bold text-slate-600">Valor Apurado Municipal - IBS</div>
              <div>-</div>
            </div>
            <div>
              <div className="text-[7.5px] font-bold text-slate-600">Alíq. Efetiva Estadual - IBS</div>
              <div>-</div>
            </div>
            <div>
              <div className="text-[7.5px] font-bold text-slate-600">Valor Apurado Estadual - IBS</div>
              <div>-</div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 pt-0.5 text-[9.5px]">
            <div>
              <div className="text-[7.5px] font-bold text-slate-600">Valor Total Apurado - IBS</div>
              <div>-</div>
            </div>
            <div>
              <div className="text-[7.5px] font-bold text-slate-600">Alíquota - CBS</div>
              <div>-</div>
            </div>
            <div>
              <div className="text-[7.5px] font-bold text-slate-600">Alíquota Efetiva - CBS</div>
              <div>-</div>
            </div>
            <div>
              <div className="text-[7.5px] font-bold text-slate-600">Valor Total Apurado - CBS</div>
              <div>-</div>
            </div>
          </div>
        </InteractiveBox>

        {/* VALOR TOTAL DA NFS-e */}
        <InteractiveBox
          {...props}
          fieldId="nfse-retencoes"
          className="border-x border-b border-slate-900 px-2.5 py-1.5"
        >
          <div className="grid grid-cols-4 gap-2 pb-1">
            <div className="text-[8.5px] font-extrabold uppercase">
              VALOR TOTAL DA NFS-e
            </div>
            <div>
              <div className="text-[7.5px] font-bold text-slate-600">VALOR DA OPERAÇÃO / SERVIÇO</div>
              <div className="font-mono text-[11px] font-semibold">R$ {data.totais.vProd}</div>
            </div>
            <div>
              <div className="text-[7.5px] font-bold text-slate-600">Desconto Incondicionado</div>
              <div className="font-mono text-[10.5px]">-</div>
            </div>
            <div>
              <div className="text-[7.5px] font-bold text-slate-600">Desconto Condicionado</div>
              <div className="font-mono text-[10.5px]">-</div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 pt-0.5">
            <div>
              <div className="text-[7.5px] font-bold text-slate-600">Total das Retenções (ISSQN / Federais)</div>
              <div className="font-mono text-[10.5px]">{ex.totalRetencoes}</div>
            </div>
            <div>
              <div className="text-[7.5px] font-bold text-slate-600">VALOR LÍQUIDO DA NFS-e</div>
              <div className="font-mono text-[11px] font-bold">R$ {data.totais.vNF}</div>
            </div>
            <div>
              <div className="text-[7.5px] font-bold text-slate-600">Total do IBS/CBS</div>
              <div className="font-mono text-[10.5px]">R$ 0,00</div>
            </div>
            <div>
              <div className="text-[7.5px] font-bold text-slate-600">VALOR LÍQUIDO DA NFS-e + IBS/CBS</div>
              <div className="font-mono text-[10.5px]">R$ {data.totais.vNF}</div>
            </div>
          </div>
        </InteractiveBox>

        {/* INFORMAÇÕES COMPLEMENTARES */}
        <div className="min-h-[56px] border-x border-b border-slate-900 px-2.5 py-1.5">
          <div className="text-[8.5px] font-extrabold uppercase">
            INFORMAÇÕES COMPLEMENTARES
          </div>
          <div className="mt-1 font-mono text-[9.5px] text-slate-700">
            Totais aproximados dos Tributos cfe. Lei nº 12.741/2012: Federais: {ex.vTotTribFed}; Estaduais: {ex.vTotTribEst}; Municipais: {ex.vTotTribMun};
          </div>
        </div>

        {/* RODAPÉ / CIENTIFICAÇÃO (NA BASE DO DANFSe v2.0) */}
        <div className="mt-4 grid grid-cols-12 border border-slate-900 text-[9px]">
          <div className="col-span-3 border-r border-slate-900 px-2 py-1.5">
            <div className="text-[7.5px] font-bold uppercase">DATA CIENTIFICAÇÃO:</div>
            <div className="h-5" />
          </div>
          <div className="col-span-3 border-r border-slate-900 px-2 py-1.5">
            <div className="text-[7.5px] font-bold uppercase">IDENTIFICAÇÃO E ASSINATURA</div>
            <div className="h-5" />
          </div>
          <div className="col-span-6 px-2 py-1.5">
            <div className="text-[7.5px] font-bold uppercase">Nº NFS-e / CHAVE NFS-e</div>
            <div className="mt-0.5 font-mono text-[9.5px] break-all">
              {ex.nNFSe} / {rawChave || '—'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
