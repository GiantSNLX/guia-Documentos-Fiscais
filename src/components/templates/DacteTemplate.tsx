import { RealBarcode } from '../RealBarcode';
import { InteractiveBox, type TemplateSharedProps } from './InteractiveZone';

const DEFAULT_CTE_CHAVE = '3526 1198 7654 3200 0155 5700 1000 0123 4510 2938 4756';

export function DacteTemplate(props: TemplateSharedProps) {
  const { importedData } = props;
  const data =
    importedData && importedData.modelId === 'cte' ? importedData : null;
  const chave = data?.chave || DEFAULT_CTE_CHAVE;

  return (
    <div className="doc-paper overflow-x-auto rounded-lg border border-slate-300 bg-white p-4 sm:p-6">
      <div className="min-w-[760px] font-sans text-slate-900">
        {/* CANHOTO DACTE */}
        <div className="grid grid-cols-12 border border-slate-900 text-[9.5px]">
          <div className="col-span-10 border-r border-slate-900">
            <div className="border-b border-slate-900 px-2 py-1 text-[8.5px]">
              DECLARO QUE RECEBI OS VOLUMES DESTE CONHECIMENTO EM PERFEITO ESTADO PELO QUE DOU POR CUMPRIDO O PRESENTE CONTRATO DE TRANSPORTE.
            </div>
            <div className="grid grid-cols-12">
              <div className="col-span-5 border-r border-slate-900 px-2 py-1.5">
                <div className="text-[7.5px] font-bold uppercase text-slate-700">NOME / RG DO RECEBEDOR</div>
                <div className="h-3.5" />
              </div>
              <div className="col-span-3 border-r border-slate-900 px-2 py-1.5">
                <div className="text-[7.5px] font-bold uppercase text-slate-700">DATA / HORA</div>
                <div className="h-3.5" />
              </div>
              <div className="col-span-4 px-2 py-1.5">
                <div className="text-[7.5px] font-bold uppercase text-slate-700">ASSINATURA / CARIMBO</div>
                <div className="h-3.5" />
              </div>
            </div>
          </div>
          <div className="col-span-2 flex flex-col items-center justify-center px-2 py-1 text-center">
            <div className="text-xs font-extrabold">CT-e</div>
            <div className="font-mono text-[10px] font-bold">
              Nº {data ? data.numero : '000.012.345'}
            </div>
            <div className="font-mono text-[9.5px]">
              Série {data ? data.serie : '001'}
            </div>
          </div>
        </div>

        <div className="my-2.5 border-b border-dashed border-slate-500" />

        {/* CABEÇALHO 3 COLUNAS DACTE */}
        <div className="grid grid-cols-12 border border-slate-900">
          <div className="col-span-5 flex flex-col justify-center border-r border-slate-900 px-3 py-2 text-center">
            <div className="mb-1 text-left text-[7.5px] font-bold uppercase text-slate-600">
              IDENTIFICAÇÃO DO EMITENTE / TRANSPORTADORA
            </div>
            <div className="text-sm font-black leading-tight uppercase">
              {data ? data.emit.xNome : 'TRANSPORTADORA ROTA EXPRESS LTDA'}
            </div>
            <div className="mt-1.5 text-[10px] leading-snug text-slate-800">
              {data ? data.emit.ender : 'Rod. Presidente Dutra, Km 212 — Cumbica'}
              <br />
              {data ? data.emit.munUf : 'Guarulhos / SP — CEP 07180-000'}
              <br />
              CNPJ: {data ? data.emit.cnpj : '98.765.432/0001-55'} • IE:{' '}
              {data ? data.emit.ie : '336.110.220.118'}
            </div>
          </div>

          <div className="col-span-2 flex flex-col justify-between border-r border-slate-900 px-2 py-2 text-center">
            <div>
              <div className="text-base font-black tracking-wide">DACTE</div>
              <div className="text-[8px] leading-tight text-slate-700">
                Documento Auxiliar do Conhecimento de Transporte Eletrônico
              </div>
            </div>
            <div className="my-1 border border-slate-900 px-1 py-1 text-[9px]">
              <div className="font-bold">MODAL</div>
              <div className="font-mono text-[10px] font-extrabold">RODOVIÁRIO</div>
            </div>
            <div className="font-mono text-[9.5px]">
              <div className="font-bold">MOD. 57 • SÉRIE {data ? data.serie : '001'}</div>
              <div className="font-extrabold">Nº {data ? data.numero : '000.012.345'}</div>
              <div className="text-[8.5px] text-slate-600">Folha 1/1</div>
            </div>
          </div>

          <div className="col-span-5 flex flex-col justify-between">
            <div className="border-b border-slate-900 px-3 py-2">
              <RealBarcode
                value={chave.includes('*') ? DEFAULT_CTE_CHAVE : chave}
                height={36}
              />
            </div>
            <InteractiveBox
              {...props}
              fieldId="cte-chave"
              docLabel="CHAVE DE ACESSO E TIPO DO CT-e"
              className="border-b border-slate-900 px-2.5 py-1.5"
            >
              <div className="font-mono text-[10px] font-bold">{chave}</div>
              <div className="mt-0.5 text-[9.5px] font-semibold">
                Tipo: 0 - Normal • Serviço: 0 - Normal
              </div>
            </InteractiveBox>
            <div className="px-2.5 py-1.5 text-center font-mono text-[9.5px]">
              <div className="font-sans text-[7.5px] font-bold uppercase text-slate-700">
                PROTOCOLO DE AUTORIZAÇÃO DE USO
              </div>
              {data ? data.protocolo : '135260112233445 - 18/11/2026 11:05:12'}
            </div>
          </div>
        </div>

        {/* CFOP + INÍCIO E TÉRMINO */}
        <div className="grid grid-cols-12 border-x border-b border-slate-900">
          <InteractiveBox
            {...props}
            fieldId="cte-modal-cfop"
            docLabel="CFOP - NATUREZA DA PRESTAÇÃO"
            className="col-span-6 border-r border-slate-900 px-2 py-1.5"
          >
            <div className="font-mono text-[10.5px] font-bold">
              6.352 — {data ? data.natOp : 'PRESTAÇÃO DE SERVIÇO DE TRANSPORTE A ESTABELECIMENTO INDUSTRIAL'}
            </div>
          </InteractiveBox>
          <InteractiveBox
            {...props}
            fieldId="cte-envolvidos"
            docLabel="INÍCIO DA PRESTAÇÃO"
            className="col-span-3 border-r border-slate-900 px-2 py-1.5"
          >
            <div className="font-mono text-[10.5px] font-bold">
              {data?.extra?.cMunIni || 'GUARULHOS / SP'}
            </div>
          </InteractiveBox>
          <InteractiveBox
            {...props}
            fieldId="cte-envolvidos"
            docLabel="TÉRMINO DA PRESTAÇÃO"
            className="col-span-3 px-2 py-1.5"
          >
            <div className="font-mono text-[10.5px] font-bold">
              {data?.extra?.cMunFim || 'BETIM / MG'}
            </div>
          </InteractiveBox>
        </div>

        {/* REMETENTE & DESTINATÁRIO (2 COLUNAS OFICIAIS) */}
        <InteractiveBox
          {...props}
          fieldId="cte-envolvidos"
          className="mt-2 border border-slate-900"
        >
          <div className="grid grid-cols-2 divide-x divide-slate-900">
            <div className="p-2">
              <div className="text-[7.5px] font-bold uppercase text-slate-700">REMETENTE</div>
              <div className="text-[10.5px] font-bold">INDÚSTRIA E COMÉRCIO TANAKA S.A.</div>
              <div className="text-[9.5px] text-slate-700">
                Av. das Nações Unidas, 14.200 — São Paulo / SP — CEP 04794-000
              </div>
              <div className="mt-0.5 font-mono text-[9.5px]">
                CNPJ: 12.345.678/0001-99 • IE: 114.882.990.112 • Fone: (11) 3000-4400
              </div>
            </div>
            <div className="p-2">
              <div className="text-[7.5px] font-bold uppercase text-slate-700">DESTINATÁRIO</div>
              <div className="text-[10.5px] font-bold">
                {data ? data.dest.xNome : 'DISTRIBUIDORA HORIZONTE LTDA'}
              </div>
              <div className="text-[9.5px] text-slate-700">
                {data ? `${data.dest.ender} — ${data.dest.mun} / ${data.dest.uf}` : 'Rod. Fernão Dias, Km 482 — Betim / MG — CEP 32689-000'}
              </div>
              <div className="mt-0.5 font-mono text-[9.5px]">
                CNPJ: {data ? data.dest.doc : '45.678.910/0001-22'} • IE:{' '}
                {data ? data.dest.ie : '110.482.991.114'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-slate-900 border-t border-slate-900">
            <div className="px-2 py-1.5">
              <div className="text-[7.5px] font-bold uppercase text-slate-700">EXPEDIDOR</div>
              <div className="text-[9.5px] text-slate-500">O mesmo do Remetente</div>
            </div>
            <div className="px-2 py-1.5">
              <div className="text-[7.5px] font-bold uppercase text-slate-700">RECEBEDOR</div>
              <div className="text-[9.5px] text-slate-500">O mesmo do Destinatário</div>
            </div>
          </div>
        </InteractiveBox>

        {/* TOMADOR DO SERVIÇO */}
        <InteractiveBox
          {...props}
          fieldId="cte-tomador"
          docLabel="TOMADOR DO SERVIÇO (QUEM PAGA O FRETE)"
          className="border-x border-b border-slate-900 px-2 py-1.5"
        >
          <div className="grid grid-cols-12 items-center gap-2 text-[10.5px]">
            <div className="col-span-6">
              <strong>0 - REMETENTE (CIF)</strong> — INDÚSTRIA E COMÉRCIO TANAKA S.A.
            </div>
            <div className="col-span-3 font-mono text-[9.5px]">
              CNPJ: 12.345.678/0001-99
            </div>
            <div className="col-span-3 font-mono text-[9.5px]">
              IE: 114.882.990.112 • UF: SP
            </div>
          </div>
        </InteractiveBox>

        {/* CARGA + PESO + SEGURO */}
        <InteractiveBox
          {...props}
          fieldId="cte-carga"
          className="mt-2 border border-slate-900"
        >
          <div className="grid grid-cols-12 divide-x divide-slate-900 font-mono text-[10px]">
            <div className="col-span-4 px-2 py-1.5">
              <div className="font-sans text-[7.5px] font-bold uppercase text-slate-700">PRODUTO PREDOMINANTE</div>
              <strong>{data?.extra?.proPred || 'ELETRÔNICOS / INFORMÁTICA'}</strong>
            </div>
            <div className="col-span-3 px-2 py-1.5">
              <div className="font-sans text-[7.5px] font-bold uppercase text-slate-700">OUTRAS CARACTERÍSTICAS</div>
              CAIXAS LACRADAS
            </div>
            <div className="col-span-3 px-2 py-1.5 text-right">
              <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">VALOR TOTAL DA CARGA</div>
              <strong>R$ 17.400,00</strong>
            </div>
            <div className="col-span-2 px-2 py-1.5 text-right">
              <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">PESO BRUTO / VOL.</div>
              <strong>91,50 kg / 6</strong>
            </div>
          </div>
        </InteractiveBox>

        {/* COMPONENTES DO VALOR DA PRESTAÇÃO + IMPOSTOS */}
        <div className="mt-2 mb-0.5 text-[8.5px] font-extrabold tracking-wide uppercase">
          COMPONENTES DO VALOR DA PRESTAÇÃO DO SERVIÇO E INFORMAÇÕES RELATIVAS AO IMPOSTO
        </div>
        <InteractiveBox
          {...props}
          fieldId="cte-componentes"
          className="border border-slate-900"
        >
          <div className="grid grid-cols-12 divide-x divide-slate-900 border-b border-slate-900 font-mono text-[10.5px]">
            <div className="col-span-2 px-2 py-1.5">
              <div className="font-sans text-[7.5px] font-bold uppercase text-slate-700">FRETE PESO</div>
              240,00
            </div>
            <div className="col-span-2 px-2 py-1.5">
              <div className="font-sans text-[7.5px] font-bold uppercase text-slate-700">AD VALOREM</div>
              52,20
            </div>
            <div className="col-span-2 px-2 py-1.5">
              <div className="font-sans text-[7.5px] font-bold uppercase text-slate-700">GRIS</div>
              34,80
            </div>
            <div className="col-span-2 px-2 py-1.5">
              <div className="font-sans text-[7.5px] font-bold uppercase text-slate-700">PEDÁGIO</div>
              23,00
            </div>
            <div className="col-span-2 bg-slate-50 px-2 py-1.5 font-bold">
              <div className="font-sans text-[7.5px] font-bold uppercase text-slate-700">VALOR TOTAL</div>
              R$ {data ? data.totais.vNF : '350,00'}
            </div>
            <div className="col-span-2 bg-slate-50 px-2 py-1.5 font-bold">
              <div className="font-sans text-[7.5px] font-bold uppercase text-slate-700">VALOR A RECEBER</div>
              R$ {data ? data.totais.vNF : '350,00'}
            </div>
          </div>
          <div className="grid grid-cols-12 divide-x divide-slate-900 font-mono text-[10px]">
            <div className="col-span-4 px-2 py-1">
              <div className="font-sans text-[7.5px] font-bold uppercase text-slate-700">SITUAÇÃO TRIBUTÁRIA</div>
              00 - Tributação Normal do ICMS
            </div>
            <div className="col-span-2 px-2 py-1 text-right">
              <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">BASE CÁLCULO</div>
              350,00
            </div>
            <div className="col-span-2 px-2 py-1 text-right">
              <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">ALÍQ. ICMS</div>
              12,00%
            </div>
            <div className="col-span-2 px-2 py-1 text-right">
              <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">VALOR ICMS</div>
              42,00
            </div>
            <div className="col-span-2 px-2 py-1 text-right">
              <div className="text-left font-sans text-[7.5px] font-bold uppercase text-slate-700">% RED. BC</div>
              0,00%
            </div>
          </div>
        </InteractiveBox>

        {/* DOCUMENTOS ORIGINÁRIOS */}
        <div className="mt-2 mb-0.5 text-[8.5px] font-extrabold tracking-wide uppercase">
          DOCUMENTOS ORIGINÁRIOS
        </div>
        <InteractiveBox
          {...props}
          fieldId="cte-nfe-vinculadas"
          className="border border-slate-900"
        >
          <table className="w-full border-collapse font-mono text-[10px]">
            <thead>
              <tr className="border-b border-slate-900 text-[7.5px] font-bold uppercase text-slate-700">
                <th className="w-20 border-r border-slate-900 px-2 py-1 text-left">TIPO DOC</th>
                <th className="border-r border-slate-900 px-2 py-1 text-left">CNPJ / CHAVE DE ACESSO DA NF-e</th>
                <th className="w-32 px-2 py-1 text-left">SÉRIE / NÚMERO</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-r border-slate-900 px-2 py-1.5 font-sans font-bold">NF-e</td>
                <td className="border-r border-slate-900 px-2 py-1.5">
                  3526 1112 3456 7800 0199 5500 1000 0482 9110 8492 0194
                </td>
                <td className="px-2 py-1.5">001 / 000.048.291</td>
              </tr>
            </tbody>
          </table>
        </InteractiveBox>

        {/* DADOS ESPECÍFICOS DO MODAL RODOVIÁRIO + OBSERVAÇÕES */}
        <div className="mt-2 mb-0.5 text-[8.5px] font-extrabold tracking-wide uppercase">
          DADOS ESPECÍFICOS DO MODAL RODOVIÁRIO / OBSERVAÇÕES
        </div>
        <InteractiveBox
          {...props}
          fieldId="cte-rntrc"
          className="border border-slate-900"
        >
          <div className="grid grid-cols-12 divide-x divide-slate-900 border-b border-slate-900 font-mono text-[10px]">
            <div className="col-span-3 px-2 py-1">
              <div className="font-sans text-[7.5px] font-bold uppercase text-slate-700">RNTRC DA TRANSPORTADORA</div>
              <strong>{data?.extra?.RNTRC || '04829103'}</strong>
            </div>
            <div className="col-span-3 px-2 py-1">
              <div className="font-sans text-[7.5px] font-bold uppercase text-slate-700">LOTAÇÃO</div>
              NÃO (CARGA FRACIONADA)
            </div>
            <div className="col-span-3 px-2 py-1">
              <div className="font-sans text-[7.5px] font-bold uppercase text-slate-700">DATA PREVISTA ENTREGA</div>
              20/11/2026
            </div>
            <div className="col-span-3 px-2 py-1">
              <div className="font-sans text-[7.5px] font-bold uppercase text-slate-700">CIOT</div>
              —
            </div>
          </div>
          <div className="min-h-[44px] px-2 py-1.5 text-[9.5px] text-slate-700">
            <div className="text-[7.5px] font-bold uppercase text-slate-700">OBSERVAÇÕES GERAIS</div>
            Carga fracionada coletada na Doca 2. Entrega sujeita a agendamento prévio no CD Betim.
          </div>
        </InteractiveBox>
      </div>
    </div>
  );
}
