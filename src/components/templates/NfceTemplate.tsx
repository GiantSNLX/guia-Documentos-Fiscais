import { RealQrCode } from '../RealBarcode';
import { InteractiveBox, type TemplateSharedProps } from './InteractiveZone';

const NFCE_QR_URL =
  'https://www.nfce.fazenda.sp.gov.br/qrcode?p=35261112345678000280650120000194829011223344|2|1|1|A1B2C3D4';

export function NfceTemplate(props: TemplateSharedProps) {
  const { importedData } = props;
  const data =
    importedData && importedData.modelId === 'nfce' ? importedData : null;

  const items = data?.items.length
    ? data.items
    : [
        { cod: '001', desc: 'CAFÉ TORRADO 500G', un: 'UN', qtd: '2', vTotal: '37,80' },
        { cod: '002', desc: 'AZEITE EXTRA VIRGEM', un: 'UN', qtd: '1', vTotal: '44,90' },
        { cod: '003', desc: 'QUEIJO MINAS FRESCAL', un: 'UN', qtd: '1', vTotal: '29,70' },
      ];

  const chave =
    data?.chave || '3526 1112 3456 7800 0280 6501 2000 0194 8290 1122 3344';

  return (
    <div className="flex justify-center">
      <div className="doc-paper w-full max-w-[440px] overflow-hidden rounded-t-xl border border-slate-300 bg-[#fffdf5] font-mono text-slate-900">
        <div className="space-y-2.5 p-4 text-[11px]">
          {/* Cabeçalho da Loja */}
          <InteractiveBox
            {...props}
            fieldId="nfce-emitente"
            docLabel="Emitente (Loja / Filial)"
            className="border border-dashed border-slate-300 bg-[#fffdf5] p-2 text-center"
          >
            <div className="text-xs font-extrabold">
              {data ? data.emit.xNome : 'SUPERMERCADO CENTRAL LTDA'}
            </div>
            <div className="text-[10px]">
              CNPJ: {data ? data.emit.cnpj : '12.345.678/0002-80'} • IE:{' '}
              {data ? data.emit.ie : '114.882.990.112'}
            </div>
            <div className="text-[10px]">
              {data
                ? `${data.emit.ender} - ${data.emit.munUf}`
                : 'Av. Brasil, 450 - Loja 02 - São Paulo/SP'}
            </div>
          </InteractiveBox>

          <div className="border-y border-dashed border-slate-400 py-1.5 text-center text-[10px] leading-tight">
            <strong>DANFE NFC-e</strong> - Documento Auxiliar da Nota Fiscal de Consumidor Eletrônica
            <div className="text-[9px] text-slate-600">
              Não permite aproveitamento de crédito de ICMS
            </div>
          </div>

          {/* Tabela de Itens */}
          <InteractiveBox
            {...props}
            fieldId="nfce-itens"
            docLabel="Itens do Cupom (Código • Descrição • Qtd • Vl. Total)"
            className="border border-dashed border-slate-300 bg-[#fffdf5] p-2"
          >
            <div className="mb-1 grid grid-cols-12 border-b border-dashed border-slate-400 pb-1 text-[9px] font-bold">
              <span className="col-span-2">CÓD</span>
              <span className="col-span-5">DESCRIÇÃO</span>
              <span className="col-span-2 text-right">QTD</span>
              <span className="col-span-3 text-right">VL TOTAL</span>
            </div>
            <div className="space-y-1 text-[10px]">
              {items.map((it, idx) => (
                <div key={`${it.cod}-${idx}`} className="grid grid-cols-12">
                  <span className="col-span-2 truncate">{it.cod}</span>
                  <span className="col-span-5 truncate">{it.desc}</span>
                  <span className="col-span-2 text-right">
                    {it.qtd} {it.un}
                  </span>
                  <span className="col-span-3 text-right">{it.vTotal}</span>
                </div>
              ))}
            </div>
          </InteractiveBox>

          {/* Totais e Descontos */}
          <InteractiveBox
            {...props}
            fieldId="nfce-descontos"
            docLabel="Totais e Descontos"
            className="border border-dashed border-slate-300 bg-[#fffdf5] p-2 text-[10.5px]"
          >
            <div className="flex justify-between">
              <span>Qtd. total de itens</span>
              <span>{items.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Valor total R$</span>
              <span>{data ? data.totais.vProd : '112,40'}</span>
            </div>
            <div className="flex justify-between text-emerald-800">
              <span>Desconto R$</span>
              <span>-{data ? data.totais.vDesc : '7,40'}</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-dashed border-slate-300 pt-1 text-xs font-extrabold">
              <span>VALOR A PAGAR R$</span>
              <span>{data ? data.totais.vNF : '105,00'}</span>
            </div>
          </InteractiveBox>

          {/* Forma de Pagamento */}
          <InteractiveBox
            {...props}
            fieldId="nfce-pagamento"
            docLabel="Forma de Pagamento (tPag) e Troco"
            className="border border-dashed border-slate-300 bg-[#fffdf5] p-2 text-[10.5px]"
          >
            <div className="flex justify-between font-semibold">
              <span>FORMA PAGAMENTO</span>
              <span>VALOR PAGO</span>
            </div>
            {data ? (
              <div className="flex justify-between">
                <span>{data.fatura.tPag}</span>
                <span>{data.totais.vNF}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <span>17 - PIX</span>
                  <span>60,00</span>
                </div>
                <div className="flex justify-between">
                  <span>03 - Cartão de Crédito</span>
                  <span>45,00</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Troco R$</span>
              <span>0,00</span>
            </div>
          </InteractiveBox>

          {/* Banner de Contingência */}
          <InteractiveBox
            {...props}
            fieldId="nfce-contingencia"
            docLabel="Status de Autorização / Contingência Offline"
            className="border border-slate-400 bg-[#fffdf5] p-2 text-center text-[10px]"
          >
            <div className="font-extrabold text-slate-900">
              {data ? `PROTOCOLO: ${data.protocolo}` : 'EMITIDA EM CONTINGÊNCIA (tpEmis = 9)'}
            </div>
            <div className="text-[9.5px] text-slate-600">
              {data
                ? 'Emissão online autorizada ou pendente conforme protocolo'
                : 'Pendente de transmissão à SEFAZ em até 24h'}
            </div>
          </InteractiveBox>

          {/* Chave de Acesso + QR Code */}
          <InteractiveBox
            {...props}
            fieldId="nfce-qrcode"
            docLabel="Chave de Acesso e QR Code de Consulta"
            className="border border-dashed border-slate-300 bg-[#fffdf5] p-2 text-center"
          >
            <div className="text-[9px] text-slate-600">
              Consulte pela Chave de Acesso no Portal Estadual da Fazenda
            </div>
            <div className="my-1 text-[9.5px] font-bold tracking-tight">
              {chave}
            </div>
            <div className="mt-2 flex items-center justify-center gap-3">
              <div className="rounded border border-slate-200 bg-white p-1.5">
                <RealQrCode value={NFCE_QR_URL} size={86} />
              </div>
              <div className="text-left text-[9.5px] leading-snug">
                <div><strong>NFC-e nº</strong> {data ? data.numero : '019482'}</div>
                <div><strong>Série</strong> {data ? data.serie : '012'}</div>
                <div><strong>Emissão</strong> {data ? data.dhEmi : '18/11/2026 11:18'}</div>
              </div>
            </div>
          </InteractiveBox>

          {/* Consumidor */}
          <InteractiveBox
            {...props}
            fieldId="nfce-consumidor"
            docLabel="Consumidor"
            className="border border-dashed border-slate-300 bg-[#fffdf5] p-2 text-center text-[10px]"
          >
            <strong>
              CONSUMIDOR - {data ? data.dest.doc : 'CPF 321.***.***-09'}
            </strong>
          </InteractiveBox>

          {/* Tributos Aproximados */}
          <InteractiveBox
            {...props}
            fieldId="nfce-tributos"
            docLabel="Transparência Fiscal (IBPT)"
            className="border border-dashed border-slate-300 bg-[#fffdf5] p-2 text-center text-[9.5px] text-slate-600"
          >
            Tributos Totais Incidentes (Lei Fed. 12.741/12):{' '}
            {data?.totais.vTotTrib
              ? `R$ ${data.totais.vTotTrib}`
              : 'R$ 19,42 Federal e R$ 18,90 Estadual'}{' '}
            — Fonte: IBPT
          </InteractiveBox>
        </div>

        <div className="receipt-edge h-3 bg-slate-200/60" />
      </div>
    </div>
  );
}
