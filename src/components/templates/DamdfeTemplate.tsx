import { RealBarcode, RealQrCode } from '../RealBarcode';
import { InteractiveBox, type TemplateSharedProps } from './InteractiveZone';

const DEFAULT_MDFE_CHAVE = '3526 1112 3456 7800 0199 5800 1000 0041 2010 9283 7465';

export function DamdfeTemplate(props: TemplateSharedProps) {
  const { importedData } = props;
  const data =
    importedData && importedData.modelId === 'mdfe' ? importedData : null;
  const chave = data?.chave || DEFAULT_MDFE_CHAVE;

  return (
    <div className="doc-paper overflow-x-auto rounded-lg border border-slate-300 bg-white p-4 sm:p-6">
      <div className="min-w-[760px] font-sans text-slate-900">
        {/* CABEÇALHO OFICIAL DAMDFE */}
        <div className="grid grid-cols-12 border border-slate-900">
          <div className="col-span-4 border-r border-slate-900 px-3 py-2.5">
            <div className="text-[7.5px] font-bold uppercase text-slate-600">
              IDENTIFICAÇÃO DO EMITENTE
            </div>
            <div className="mt-1 text-sm font-black leading-tight uppercase">
              {data ? data.emit.xNome : 'TRANSPORTADORA ROTA EXPRESS LTDA'}
            </div>
            <div className="mt-1 font-mono text-[9.5px] leading-snug text-slate-800">
              CNPJ: {data ? data.emit.cnpj : '98.765.432/0001-55'} • IE:{' '}
              {data ? data.emit.ie : '336.110.220.118'}
              <br />
              {data ? data.emit.ender : 'Rod. Pres. Dutra, Km 212 — Cumbica'}
              <br />
              {data ? data.emit.munUf : 'Guarulhos / SP'}
            </div>
          </div>

          <div className="col-span-3 flex flex-col justify-between border-r border-slate-900 px-2.5 py-2 text-center">
            <div>
              <div className="text-base font-black tracking-wide">DAMDFE</div>
              <div className="text-[8px] leading-tight text-slate-700">
                Documento Auxiliar de Manifesto Eletrônico de Documentos Fiscais
              </div>
            </div>
            <div className="my-1 border border-slate-900 px-2 py-1 font-mono text-[9.5px]">
              <div className="font-bold">MODELO 58 • SÉRIE {data ? data.serie : '001'}</div>
              <div className="text-xs font-extrabold">Nº {data ? data.numero : '000.004.120'}</div>
              <div className="text-[8.5px] text-slate-600">Folha 1/1 • Emissão: {data ? data.dhEmi : '18/11/2026 11:20'}</div>
            </div>
          </div>

          <div className="col-span-5 flex items-center gap-2.5 p-2">
            <div className="min-w-0 flex-1">
              <RealBarcode
                value={chave.includes('*') ? DEFAULT_MDFE_CHAVE : chave}
                height={34}
              />
              <InteractiveBox
                {...props}
                fieldId="mdfe-chave"
                docLabel="CHAVE DE ACESSO E TIPO DE EMITENTE"
                className="mt-1 border border-slate-300 px-1.5 py-1"
              >
                <div className="font-mono text-[9px] font-bold leading-tight">
                  {chave}
                </div>
                <div className="text-[8.5px] text-slate-700">
                  tpEmit: 1 (Transportadora) • Prot: {data ? data.protocolo : '935260011223344'}
                </div>
              </InteractiveBox>
            </div>
            <div className="shrink-0 border border-slate-300 p-1">
              <RealQrCode
                value={`https://dfe-portal.svrs.rs.gov.br/mdfe/qr?chMDFe=${chave.replace(/\D/g, '') || '000000'}`}
                size={68}
              />
            </div>
          </div>
        </div>

        {/* ROTA + TOTALIZADORES DA CARGA */}
        <div className="mt-2 grid grid-cols-12 border border-slate-900">
          <InteractiveBox
            {...props}
            fieldId="mdfe-rota"
            docLabel="UF CARREGAMENTO • UFs DE PERCURSO • UF DESCARREGAMENTO"
            className="col-span-6 border-r border-slate-900 px-2.5 py-1.5"
          >
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-extrabold">
              <span className="border border-slate-900 px-2 py-0.5">
                UF INI: {data?.extra?.UFIni || 'SP'}
              </span>
              <span>→</span>
              <span className="border border-slate-400 px-2 py-0.5">
                PERCURSO: RJ
              </span>
              <span>→</span>
              <span className="border border-slate-900 px-2 py-0.5">
                UF FIM: {data?.extra?.UFFim || 'MG'}
              </span>
            </div>
          </InteractiveBox>

          <div className="col-span-6 grid grid-cols-4 divide-x divide-slate-900 font-mono text-[10px]">
            <div className="px-2 py-1.5 text-center">
              <div className="font-sans text-[7.5px] font-bold uppercase text-slate-700">QTD. CT-e</div>
              <strong className="text-xs">1</strong>
            </div>
            <div className="px-2 py-1.5 text-center">
              <div className="font-sans text-[7.5px] font-bold uppercase text-slate-700">QTD. NF-e</div>
              <strong className="text-xs">13</strong>
            </div>
            <div className="px-2 py-1.5 text-right">
              <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">PESO TOTAL (kg)</div>
              <strong className="text-xs">4.820,00</strong>
            </div>
            <div className="px-2 py-1.5 text-right">
              <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">VALOR CARGA</div>
              <strong className="text-xs">R$ 189.400</strong>
            </div>
          </div>
        </div>

        {/* MODAL RODOVIÁRIO DE CARGA (VEÍCULO + CONDUTOR EM 2 COLUNAS OFICIAIS) */}
        <div className="mt-2 mb-0.5 text-[8.5px] font-extrabold tracking-wide uppercase">
          MODAL RODOVIÁRIO DE CARGA
        </div>
        <div className="grid grid-cols-12 border border-slate-900">
          <InteractiveBox
            {...props}
            fieldId="mdfe-veiculo"
            className="col-span-7 border-r border-slate-900"
          >
            <table className="w-full border-collapse font-mono text-[10px]">
              <thead>
                <tr className="border-b border-slate-900 text-[7.5px] font-bold uppercase text-slate-700">
                  <th className="border-r border-slate-900 px-2 py-1 text-left">PLACA</th>
                  <th className="border-r border-slate-900 px-2 py-1 text-left">UF</th>
                  <th className="border-r border-slate-900 px-2 py-1 text-left">RENAVAM</th>
                  <th className="border-r border-slate-900 px-2 py-1 text-right">TARA / CAP.</th>
                  <th className="px-2 py-1 text-left">RNTRC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                <tr>
                  <td className="border-r border-slate-900 px-2 py-1.5 font-bold">
                    {data?.transp.placa && data.transp.placa !== '—' ? data.transp.placa : 'BRA-2E19'}
                  </td>
                  <td className="border-r border-slate-900 px-2 py-1.5">SP</td>
                  <td className="border-r border-slate-900 px-2 py-1.5">00981234567</td>
                  <td className="border-r border-slate-900 px-2 py-1.5 text-right">7.200 / 14.000 kg</td>
                  <td className="px-2 py-1.5 font-bold">04829103</td>
                </tr>
                <tr>
                  <td className="border-r border-slate-900 px-2 py-1 text-slate-500">REBOQUE —</td>
                  <td className="border-r border-slate-900 px-2 py-1 text-slate-500">—</td>
                  <td className="border-r border-slate-900 px-2 py-1 text-slate-500">—</td>
                  <td className="border-r border-slate-900 px-2 py-1 text-right text-slate-500">—</td>
                  <td className="px-2 py-1 text-slate-500">—</td>
                </tr>
              </tbody>
            </table>
          </InteractiveBox>

          <InteractiveBox
            {...props}
            fieldId="mdfe-condutor"
            className="col-span-5"
          >
            <table className="w-full border-collapse font-mono text-[10px]">
              <thead>
                <tr className="border-b border-slate-900 text-[7.5px] font-bold uppercase text-slate-700">
                  <th className="w-28 border-r border-slate-900 px-2 py-1 text-left">CPF CONDUTOR</th>
                  <th className="px-2 py-1 text-left">NOME DO CONDUTOR</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-r border-slate-900 px-2 py-1.5">234.567.890-12</td>
                  <td className="px-2 py-1.5 font-bold">CARLOS EDUARDO SILVA</td>
                </tr>
              </tbody>
            </table>
          </InteractiveBox>
        </div>

        {/* SEGURO, CIOT E VALE-PEDÁGIO */}
        <div className="mt-2 mb-0.5 text-[8.5px] font-extrabold tracking-wide uppercase">
          SEGURO DA CARGA / CIOT / VALE-PEDÁGIO
        </div>
        <InteractiveBox
          {...props}
          fieldId="mdfe-seguro-ciot"
          className="border border-slate-900"
        >
          <div className="grid grid-cols-12 divide-x divide-slate-900 font-mono text-[10px]">
            <div className="col-span-3 px-2 py-1.5">
              <div className="font-sans text-[7.5px] font-bold uppercase text-slate-700">SEGURADORA</div>
              Porto Seguro Cia.
            </div>
            <div className="col-span-3 px-2 py-1.5">
              <div className="font-sans text-[7.5px] font-bold uppercase text-slate-700">Nº APÓLICE / AVERBAÇÃO</div>
              99812 / AVB-4410
            </div>
            <div className="col-span-3 px-2 py-1.5">
              <div className="font-sans text-[7.5px] font-bold uppercase text-slate-700">CIOT (ANTT)</div>
              112233445566 (TAC)
            </div>
            <div className="col-span-3 px-2 py-1.5">
              <div className="font-sans text-[7.5px] font-bold uppercase text-slate-700">VALE-PEDÁGIO</div>
              Sem Parar • R$ 148,00
            </div>
          </div>
        </InteractiveBox>

        {/* DOCUMENTOS FISCAIS VINCULADOS */}
        <div className="mt-2 mb-0.5 text-[8.5px] font-extrabold tracking-wide uppercase">
          RELAÇÃO DOS DOCUMENTOS FISCAIS VINCULADOS
        </div>
        <InteractiveBox
          {...props}
          fieldId="mdfe-docs"
          className="border border-slate-900"
        >
          <div className="border-b border-slate-900 bg-slate-50 px-2 py-1 text-[9.5px] font-bold">
            Município de Descarregamento: 3106705 — BETIM / MG (14 documentos)
          </div>
          <div className="grid grid-cols-1 gap-1 p-2 font-mono text-[9.5px] sm:grid-cols-2">
            <div>CT-e 3526 1198 7654 3200 0155 5700 1000 0123 4510 2938 4756</div>
            <div>NF-e 3526 1112 3456 7800 0199 5500 1000 0482 9110 8492 0194</div>
            <div>NF-e 3526 1112 3456 7800 0199 5500 1000 0482 9210 1122 8831</div>
            <div>NF-e 3526 1112 3456 7800 0199 5500 1000 0482 9310 5544 1129</div>
            <div className="text-slate-500 sm:col-span-2">
              + 10 outros documentos vinculados no XML (agrupados por município de entrega)
            </div>
          </div>
        </InteractiveBox>

        {/* OBSERVAÇÕES + CICLO DE VIDA (ENCERRAMENTO) */}
        <div className="mt-2 mb-0.5 text-[8.5px] font-extrabold tracking-wide uppercase">
          OBSERVAÇÕES / STATUS DE ENCERRAMENTO NA SEFAZ
        </div>
        <InteractiveBox
          {...props}
          fieldId="mdfe-encerramento"
          className="border border-slate-900 px-2.5 py-2"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
            <span className="font-extrabold">
              STATUS ATUAL: AUTORIZADO (EM ABERTO)
            </span>
            <span className="font-mono text-[9.5px] text-slate-700">
              Obrigatório transmitir evento evEncMDFe após concluir as entregas em MG (senão bloqueia nova emissão p/ a placa)
            </span>
          </div>
        </InteractiveBox>
      </div>
    </div>
  );
}
