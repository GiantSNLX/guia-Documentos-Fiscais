import type { NoteModel } from '../../types/fiscal';

export const nfeModel: NoteModel = {
  id: 'nfe',
  shortName: 'NF-e',
  fullName: 'Nota Fiscal Eletrônica',
  modelCode: 'Modelo 55',
  auxiliaryDocName: 'DANFE',
  issuerScope: 'Estadual (SEFAZ)',
  accentColor: 'indigo',
  briefing: {
    whatIs:
      'É o documento fiscal padrão que registra a circulação física ou contábil de mercadorias entre empresas (B2B), vendas interestaduais, remessas, devoluções e importações.',
    whenToUse:
      'Sempre que houver movimentação de produto físico (venda, transferência entre filiais, bonificação, remessa para conserto/industrialização ou devolução).',
    activities: [
      'Faturamento e Emissão no ERP',
      'Separação e Conferência na Expedição',
      'Entrada / Recebimento de Mercadorias',
      'Controle de Estoque e Inventário',
      'Apuração Fiscal e SPED',
    ],
    operationalImpact:
      'Sem NF-e autorizada pela SEFAZ, o caminhão não pode sair da doca. Erros em CFOP, NCM, quantidade ou destinatário causam recusa na portaria do cliente, retenção da carga em barreira fiscal, multa e divergência no estoque.',
    riskSummary: 'Bloqueio de embarque, recusa no recebimento e autuação em trânsito.',
    processFlow: [
      { step: 'Pedido de Venda' },
      { step: 'Separação (WMS)' },
      { step: 'Emissão NF-e + DANFE', active: true },
      { step: 'CT-e / MDF-e' },
      { step: 'Entrega e Recebimento' },
    ],
  },
  fields: [
    {
      id: 'nfe-chave',
      block: 'Cabeçalho e Autorização',
      label: 'Chave de Acesso (44 dígitos)',
      shortLabel: 'Chave de Acesso',
      technicalName: 'chNFe (44 dígitos numéricos)',
      sampleValue: '3526 1112 3456 7800 0199 5500 1000 0482 9110 8492 0194',
      description:
        'Identificador único nacional da NF-e na SEFAZ. Os 44 dígitos não são aleatórios: eles carregam o estado, ano/mês, CNPJ do emitente, modelo (55), série, número da nota e dígito verificador.',
      example: '35261112345678000199550010000482911084920194',
      operationalImpact:
        'É a chave usada para baixar o XML, vincular a nota ao CT-e/MDF-e e dar entrada no estoque do destinatário. Se o código de barras estiver cortado ou ilegível na impressão, a portaria não bipa a nota.',
      stakeholders: ['Expedição', 'Recebimento', 'Transportadora', 'Fiscal'],
      criticality: 'critico',
      codeGuide: {
        title: 'Anatomia dos 44 dígitos da Chave de Acesso',
        summary: 'Cada bloco da chave identifica uma informação exata da nota:',
        segments: [
          { code: '35', label: 'cUF (2)', detail: 'Estado (35 = SP, 31 = MG, 33 = RJ, 41 = PR)', colorClass: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
          { code: '2611', label: 'AAMM (4)', detail: 'Ano e Mês da emissão (Nov/2026)', colorClass: 'bg-sky-100 text-sky-800 border-sky-300' },
          { code: '12345678000199', label: 'CNPJ (14)', detail: 'CNPJ do emitente sem pontuação', colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
          { code: '55', label: 'mod (2)', detail: 'Modelo (55=NF-e, 65=NFC-e, 57=CT-e, 58=MDF-e)', colorClass: 'bg-amber-100 text-amber-800 border-amber-300' },
          { code: '001', label: 'série (3)', detail: 'Série da nota (001)', colorClass: 'bg-violet-100 text-violet-800 border-violet-300' },
          { code: '000048291', label: 'nNF (9)', detail: 'Número da NF-e (48.291)', colorClass: 'bg-rose-100 text-rose-800 border-rose-300' },
          { code: '1', label: 'tpEmis (1)', detail: 'Emissão (1=Normal, 6/7=SVC Contingência)', colorClass: 'bg-slate-200 text-slate-800 border-slate-300' },
          { code: '08492019', label: 'cNF (8)', detail: 'Código numérico aleatório de segurança', colorClass: 'bg-slate-100 text-slate-700 border-slate-300' },
          { code: '4', label: 'cDV (1)', detail: 'Dígito verificador (módulo 11)', colorClass: 'bg-teal-100 text-teal-800 border-teal-300' },
        ],
      },
    },
    {
      id: 'nfe-protocolo',
      block: 'Cabeçalho e Autorização',
      label: 'Protocolo de Autorização de Uso',
      shortLabel: 'Protocolo SEFAZ',
      technicalName: 'nProt / dhRecbto',
      sampleValue: '135260849201948 - 18/11/2026 10:42:15',
      description:
        'Comprova que o XML foi validado e autorizado pela SEFAZ antes da saída da mercadoria. DANFE sem protocolo não tem validade jurídica (exceto contingência formal).',
      example: '135260849201948 (os 3 primeiros dígitos indicam a UF autorizadora: 135 = SP)',
      operationalImpact:
        'Circular com DANFE "pré-nota" ou sem autorização caracteriza transporte de mercadoria desacobertada, sujeito à apreensão e multa pesada no posto fiscal.',
      stakeholders: ['Faturamento', 'Portaria / Expedição', 'Fiscalização'],
      criticality: 'critico',
    },
    {
      id: 'nfe-tipo-op',
      block: 'Cabeçalho e Autorização',
      label: 'Tipo de Operação (0-Entrada / 1-Saída)',
      shortLabel: 'Entrada / Saída',
      technicalName: 'tpNF (0 = Entrada | 1 = Saída)',
      sampleValue: '1 - SAÍDA',
      description:
        'Indica a direção da mercadoria sob a ótica de quem EMITIU a nota: 1 = Saída do estoque do emitente; 0 = Entrada no estoque do emitente.',
      example: '1 - Saída (venda, transferência, remessa) | 0 - Entrada (importação, devolução de PF)',
      operationalImpact:
        'Inverter Entrada/Saída inverte o sinal contábil e de estoque no ERP e gera erro imediato na escrituração fiscal (SPED) e na conferência do destinatário.',
      stakeholders: ['Faturamento', 'Estoque', 'Contabilidade'],
      criticality: 'alto',
      codeGuide: {
        title: 'Regra de ouro do tpNF',
        summary: 'Sempre olhe pelo ponto de vista do EMITENTE da nota:',
        commonExamples: [
          { code: '1 - Saída', meaning: 'Mercadoria sai do emitente', whenUsed: 'Vendas, transferências enviadas, remessas p/ conserto, devolução de compra.' },
          { code: '0 - Entrada', meaning: 'Mercadoria entra no emitente', whenUsed: 'Importação direta, compra de produtor rural sem NF-e, retorno de devolução de pessoa física.' },
        ],
      },
    },
    {
      id: 'nfe-natop',
      block: 'Cabeçalho e Autorização',
      label: 'Natureza da Operação',
      shortLabel: 'Natureza Operação',
      technicalName: 'natOp',
      sampleValue: 'VENDA DE MERCADORIA ADQUIRIDA DE TERCEIROS',
      description:
        'Texto descritivo que resume o motivo comercial/fiscal da movimentação (venda, transferência, devolução, remessa para conserto, demonstração).',
      example: 'Venda de mercadoria / Venda c/ Substituição Tributária / Remessa para conserto',
      operationalImpact:
        'Se a descrição não bater com o pedido de compra (ex.: era remessa sem cobrança e saiu como venda), o cliente trava o recebimento ou lança cobrança indevida.',
      stakeholders: ['Comercial', 'Faturamento', 'Recebimento do Cliente'],
      criticality: 'atencao',
    },
    {
      id: 'nfe-numero-serie',
      block: 'Cabeçalho e Autorização',
      label: 'Número e Série da NF-e',
      shortLabel: 'Número e Série',
      technicalName: 'nNF / serie',
      sampleValue: 'Nº 000.048.291 • SÉRIE 001',
      description:
        'Numeração sequencial da nota dentro daquela série e CNPJ. A série separa fluxos distintos (ex.: Série 1 faturamento B2B, Série 2 e-commerce, Série 3 devoluções).',
      example: 'Nº 48291, Série 001 (Série 890–899 reservada para NF-e avulsa SEFAZ)',
      operationalImpact:
        'Pular um número sem inutilizar a faixa na SEFAZ gera pendência fiscal; duplicidade de número trava o faturamento até o ERP sincronizar o próximo sequencial.',
      stakeholders: ['Faturamento', 'TI / ERP', 'Fiscal'],
      criticality: 'atencao',
    },
    {
      id: 'nfe-emit-dest',
      block: 'Participantes',
      label: 'Destinatário / Remetente (CNPJ, IE, Endereço, Saída)',
      shortLabel: 'Destinatário / IE',
      technicalName: 'emit / dest (CNPJ, IE, indIEDest, CEP, dhSaiEnt)',
      sampleValue: 'DISTRIBUIDORA HORIZONTE LTDA • CNPJ 45.678.910/0001-22 • IE 110.482.991.114 • MG',
      description:
        'Identifica quem recebe a mercadoria, endereço completo (CEP/Bairro/Município/UF), Inscrição Estadual (indIEDest: Contribuinte vs. Isento vs. Não Contribuinte) e datas de emissão e saída.',
      example: 'indIEDest = 1 (Contribuinte com IE ativa) permite aproveitamento de crédito de ICMS.',
      operationalImpact:
        'CNPJ da filial errada ou IE desatualizada/suspensa gera rejeição imediata na SEFAZ (Rejeição 232/302) ou faz a transportadora descarregar no endereço errado.',
      stakeholders: ['Cadastro / MDM', 'Faturamento', 'Logística'],
      criticality: 'critico',
    },
    {
      id: 'nfe-fatura',
      block: 'Fatura / Duplicatas e Pagamento',
      label: 'Fatura / Duplicatas e Forma de Pagamento',
      shortLabel: 'Fatura / Duplicatas',
      technicalName: 'cobr (fat, dup: nDup, dVenc, vDup) + pag (tPag)',
      sampleValue: 'Fat. 48291 • 001 (18/12/2026) R$ 8.700,00 • 002 (17/01/2027) R$ 8.700,00 • tPag: 15-Boleto',
      description:
        'Mostra o desdobramento financeiro da nota em parcelas/duplicatas (número, vencimento e valor) e o código do meio de pagamento (tPag). Em notas sem cobrança (bonificação/remessa), usa tPag=90.',
      example: '2 parcelas em Boleto Bancário (tPag=15): 30 e 60 dias.',
      operationalImpact:
        'Parcela ou vencimento errado na duplicata faz o Contas a Pagar do cliente contestar os boletos e bloquear o pagamento automático no banco.',
      stakeholders: ['Financeiro / Cobrança', 'Contas a Pagar', 'Comercial'],
      criticality: 'alto',
      codeGuide: {
        title: 'Códigos de pagamento (tPag) mais usados na NF-e B2B',
        summary: 'O DANFE e o XML cruzam o pagamento com as duplicatas:',
        commonExamples: [
          { code: '15 - Boleto Bancário', meaning: 'Cobrança a prazo via duplicata/boleto', whenUsed: 'Padrão B2B com parcelas listadas em Fatura/Duplicatas (<dup>).' },
          { code: '17 - PIX / 18 - TED', meaning: 'Pagamento à vista eletrônico', whenUsed: 'Vendas faturadas contra pagamento antecipado ou à vista.' },
          { code: '90 - Sem Pagamento', meaning: 'Operação sem fluxo financeiro', whenUsed: 'Obrigatório em remessas, transferências entre filiais, bonificações e devoluções.' },
        ],
      },
    },
    {
      id: 'nfe-ncm',
      block: 'Itens / Produtos',
      label: 'NCM/SH e CEST (Classificação Fiscal)',
      shortLabel: 'NCM / CEST',
      technicalName: 'NCM (8 dígitos) / CEST (7 dígitos)',
      sampleValue: '84713019 • CEST 1005800 (quando sujeito à ST)',
      description:
        'O NCM classifica o produto no Mercosul (define IPI, PIS/COFINS e ICMS). Quando o produto está sujeito à Substituição Tributária (ST), o campo CEST (7 dígitos) também é obrigatório para ligar o item ao convênio ICMS.',
      example: 'NCM 7318.16.00 (porcas/fixadores) + CEST 10.058.00 (materiais de construção/ST).',
      operationalImpact:
        'NCM ou CEST ausente/errado gera rejeição automática na SEFAZ (Rejeição 806) e cobrança de diferença de ST nas barreiras estaduais.',
      stakeholders: ['Cadastro Fiscal', 'Compras', 'Contabilidade'],
      criticality: 'critico',
      codeGuide: {
        title: 'Como ler os 8 dígitos do NCM + papel do CEST',
        summary: 'Estrutura hierárquica do NCM do geral para o específico:',
        segments: [
          { code: '84', label: 'Capítulo (2)', detail: 'Máquinas, aparelhos mecânicos e informática', colorClass: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
          { code: '71', label: 'Posição (2)', detail: 'Máquinas para processamento de dados', colorClass: 'bg-sky-100 text-sky-800 border-sky-300' },
          { code: '30', label: 'Subposição (2)', detail: 'Portáteis, peso inferior a 10 kg', colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
          { code: '19', label: 'Item (2)', detail: 'Especificação técnica no Mercosul', colorClass: 'bg-amber-100 text-amber-800 border-amber-300' },
        ],
        commonExamples: [
          { code: '8471.30.19', meaning: 'Notebooks e equipamentos portáteis', whenUsed: 'TI / Eletrônicos' },
          { code: '7318.15.00', meaning: 'Parafusos e pinos de aço/ferro', whenUsed: 'Materiais industriais / MRO (com CEST quando aplicável à ST)' },
          { code: '3923.10.90', meaning: 'Caixas e embalagens plásticas', whenUsed: 'Insumos e embalagens' },
        ],
      },
    },
    {
      id: 'nfe-cfop',
      block: 'Itens / Produtos',
      label: 'CFOP (Código Fiscal de Operações)',
      shortLabel: 'CFOP',
      technicalName: 'CFOP (4 dígitos)',
      sampleValue: '5.102 / 5.405',
      description:
        'Código de 4 dígitos por item que diz à SEFAZ qual é a natureza fiscal daquela linha (venda normal, venda com ST já retida, remessa, devolução). Uma mesma NF-e pode misturar CFOPs diferentes por item (ex.: 5.102 + 5.405)!',
      example: 'Item 1: CFOP 5.102 (tributado normal) | Item 2: CFOP 5.405 (ST já retida antes).',
      operationalImpact:
        'É o erro nº 1 na operação: CFOP errado gera pagamento indevido de imposto, trava a entrada no ERP do cliente e distorce a apuração.',
      stakeholders: ['Faturamento', 'Recebimento', 'Fiscal'],
      criticality: 'critico',
      codeGuide: {
        title: 'Regra do 1º dígito + CFOPs mais usados na operação',
        summary: 'O 1º dígito sempre indica Entrada/Saída e Origem/Destino:',
        segments: [
          { code: '5xxx', label: 'Saída Estadual', detail: 'Remetente e destinatário no MESMO estado (ex: SP → SP)', colorClass: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
          { code: '6xxx', label: 'Saída Interestadual', detail: 'Para OUTRO estado (ex: SP → MG)', colorClass: 'bg-amber-100 text-amber-800 border-amber-300' },
          { code: '1xxx / 2xxx', label: 'Entradas', detail: '1 = Mesmo estado | 2 = Outro estado (escrituração na entrada)', colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
          { code: '7xxx / 3xxx', label: 'Exterior', detail: '7 = Exportação | 3 = Importação', colorClass: 'bg-slate-100 text-slate-700 border-slate-300' },
        ],
        commonExamples: [
          { code: '5.102 / 6.102', meaning: 'Venda de mercadoria adquirida', whenUsed: 'Revenda padrão de comércio/distribuição (5.101/6.101 se for fabricação própria).' },
          { code: '5.405', meaning: 'Venda de mercadoria com ST já retida', whenUsed: 'Revenda dentro do estado de item que já veio com ICMS-ST recolhido na cadeia anterior.' },
          { code: '5.910 / 6.910', meaning: 'Remessa em bonificação / doação / brinde', whenUsed: 'Envio de amostra ou bonificação comercial sem cobrança.' },
          { code: '5.915 / 6.915', meaning: 'Remessa para conserto ou reparo', whenUsed: 'Envio de equipamento/peça para assistência técnica com retorno previsto.' },
          { code: '5.202 / 6.202', meaning: 'Devolução de compra p/ comercialização', whenUsed: 'Devolver mercadoria avariada ou em desacordo para o fornecedor.' },
          { code: '5.152 / 6.152', meaning: 'Transferência entre filiais', whenUsed: 'Movimentar estoque do CD matriz para uma filial.' },
          { code: '5.949 / 6.949', meaning: 'Outra saída não especificada', whenUsed: 'Operações atípicas sem CFOP próprio.' },
        ],
      },
    },
    {
      id: 'nfe-cst',
      block: 'Itens / Produtos',
      label: 'CST / CSOSN (Situação Tributária)',
      shortLabel: 'CST / CSOSN',
      technicalName: 'orig + CST (Regime Normal) / CSOSN (Simples)',
      sampleValue: '000 / 060',
      description:
        'Indica a origem da mercadoria (1º dígito) e a tributação de ICMS do item. Numa nota com mix de itens, os tributados usam CST 000 e os itens com ST retida usam CST 060.',
      example: '000 (Nacional, tributada integralmente) | 060 (Nacional, ICMS cobrado antes por ST)',
      operationalImpact:
        'CST errado faz o cliente perder crédito de ICMS na entrada ou pagar imposto em duplicidade (ex.: destacar ICMS normal em produto que já é CST 060).',
      stakeholders: ['Fiscal', 'Faturamento', 'Compras'],
      criticality: 'alto',
      codeGuide: {
        title: 'Como decifrar CST (Regime Normal) e CSOSN (Simples)',
        summary: '1º dígito = Origem da mercadoria + Tributação:',
        segments: [
          { code: '0', label: 'Origem', detail: '0=Nacional | 1=Importação direta | 2=Importada adquirida no mercado interno', colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
          { code: '00 / 60', label: 'Tributação ICMS', detail: '00=Integral | 10=Com ST | 20=Redução BC | 40=Isenta | 60=ST já retida', colorClass: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
        ],
        commonExamples: [
          { code: '000', meaning: 'Nacional, tributada integralmente', whenUsed: 'Operação padrão de Lucro Real / Presumido com destaque de ICMS (casa com CFOP 5.102/6.102).' },
          { code: '060', meaning: 'Nacional, ICMS cobrado antes por ST', whenUsed: 'Substituído revendendo item já tributado por ST (casa com CFOP 5.405).' },
          { code: '020', meaning: 'Nacional, com redução de base de cálculo', whenUsed: 'Produtos com benefício fiscal estadual.' },
          { code: '102 (CSOSN)', meaning: 'Simples Nacional sem permissão de crédito', whenUsed: 'Venda comum de empresa optante pelo Simples Nacional.' },
          { code: '500 (CSOSN)', meaning: 'Simples Nacional com ST cobrada antes', whenUsed: 'Equivalente ao CST 060 para empresas do Simples Nacional.' },
        ],
      },
    },
    {
      id: 'nfe-qtd-vlr',
      block: 'Itens / Produtos',
      label: 'Unidade, Quantidade e Valor do Item',
      shortLabel: 'Qtd, Unid. e Valores',
      technicalName: 'uCom / qCom / vUnCom / vProd',
      sampleValue: '10 UN × R$ 1.450,00 = R$ 14.500,00',
      description:
        'Mostra a unidade comercial faturada (UN, CX, KG, PC), a quantidade exata que deve estar nos volumes físicos e os valores unitário e total de cada item.',
      example: 'Faturado 2 CX (com 10 UN cada) vs. cliente espera 20 UN no recebimento',
      operationalImpact:
        'Divergência entre unidade da NF-e e unidade do pedido de compra (ex.: Caixa vs. Unidade) trava a conferência cega na doca e bagunça o estoque.',
      stakeholders: ['Expedição', 'Recebimento', 'Estoque', 'Financeiro'],
      criticality: 'alto',
    },
    {
      id: 'nfe-impostos',
      block: 'Cálculo do Imposto',
      label: 'Cálculo do Imposto (ICMS, ST, IPI, PIS, COFINS, FCP)',
      shortLabel: 'Cálculo do Imposto',
      technicalName: 'ICMSTot (vBC, vICMS, vBCST, vST, vIPI, vPIS, vCOFINS, vFCP, vNF)',
      sampleValue: 'BC ICMS: R$ 14.500,00 | ICMS: R$ 2.610,00 | PIS/COFINS: R$ 1.609,50 | Total NF: R$ 17.400,00',
      description:
        'Bloco horizontal clássico do DANFE que consolida as bases e totais de ICMS, ICMS-ST, FCP, Frete, Seguro, Desconto, IPI, PIS/COFINS e o Valor Total da Nota.',
      example: 'Itens com CST 060 (CFOP 5.405) não somam na Base de Cálculo do ICMS próprio.',
      operationalImpact:
        'Divergência entre o Total da NF e o pedido/duplicatas trava a entrada automática na portaria e atrasa o pagamento pelo Contas a Pagar.',
      stakeholders: ['Fiscal', 'Financeiro / Contas a Pagar', 'Comercial'],
      criticality: 'alto',
    },
    {
      id: 'nfe-ibscbs',
      block: 'Reforma Tributária (2026+)',
      label: 'IBS / CBS — Reforma Tributária',
      shortLabel: 'IBS / CBS (2026)',
      technicalName: 'IBSCBSTot (cClassTrib, vBCIBSCBS, vIBS, vCBS, vNFTot)',
      sampleValue: 'BC IBS/CBS: R$ 14.790,00 • IBS (UF/Mun): R$ 14,79 • CBS: R$ 133,11',
      description:
        'Novos campos introduzidos nas NF-es a partir de 2026 para a transição da Reforma Tributária (IBS estadual/municipal e CBS federal, com código de classificação cClassTrib).',
      example: 'Em 2026, alíquotas-teste (ex.: IBS 0,10% + CBS 0,90%) destacam valores informativos/compensáveis no XML.',
      operationalImpact:
        'ERP desatualizado sem o grupo <IBSCBS> ou com cClassTrib inválido sofre rejeição da SEFAZ no ambiente de produção conforme o cronograma da Reforma.',
      stakeholders: ['Fiscal', 'TI / ERP', 'Contabilidade'],
      criticality: 'atencao',
    },
    {
      id: 'nfe-frete',
      block: 'Transportador e Volumes',
      label: 'Modalidade do Frete (CIF / FOB)',
      shortLabel: 'Frete (CIF / FOB)',
      technicalName: 'modFrete (0, 1, 2, 3, 4, 9)',
      sampleValue: '0 - Por conta do Remetente (CIF)',
      description:
        'Código de 1 dígito que define quem contrata, paga e assume o risco pelo frete da carga até a entrega.',
      example: '0 = Remetente paga (CIF) | 1 = Destinatário paga/retira (FOB)',
      operationalImpact:
        'Se sair como CIF quando o pedido era FOB, a auditoria de frete paga fatura indevida ou a portaria libera a carga para a transportadora errada.',
      stakeholders: ['Logística / TMS', 'Expedição', 'Auditoria de Frete'],
      criticality: 'alto',
      codeGuide: {
        title: 'Códigos oficiais de modFrete',
        summary: 'Como aparece no campo "Frete por Conta" do DANFE:',
        commonExamples: [
          { code: '0 - Remetente (CIF)', meaning: 'Vendedor contrata e paga o frete', whenUsed: 'Entrega incluída no preço ou frete destacado na NF.' },
          { code: '1 - Destinatário (FOB)', meaning: 'Comprador contrata e paga', whenUsed: 'Cliente manda transportadora própria retirar na doca.' },
          { code: '2 - Terceiros', meaning: 'Frete pago por um terceiro', whenUsed: 'Operações triangulares ou por conta de operador logístico.' },
          { code: '3 / 4 - Próprio', meaning: 'Transporte próprio (Remetente/Destinatário)', whenUsed: 'Caminhão próprio da empresa fazendo a entrega ou coleta.' },
          { code: '9 - Sem Frete', meaning: 'Sem ocorrência de transporte', whenUsed: 'Retira em balcão ou nota complementar apenas financeira.' },
        ],
      },
    },
    {
      id: 'nfe-volumes',
      block: 'Transportador e Volumes',
      label: 'Transportadora, Volumes e Peso Bruto/Líquido',
      shortLabel: 'Transportadora / Vol.',
      technicalName: 'transporta + vol (qVol, esp, pesoL, pesoB)',
      sampleValue: 'ROTA EXPRESS LTDA • 6 CAIXAS • Peso Bruto: 91,50 kg • Peso Líq: 84,00 kg',
      description:
        'Identifica a transportadora autorizada a coletar (CNPJ/Placa/ANTT) e quantos volumes físicos (caixas, pallets) e quilos compõem a carga.',
      example: '6 Caixas, 91,50 kg de peso bruto (produto + embalagem)',
      operationalImpact:
        'Quantidade de volumes errada impede a conferência rápida na doca e dificulta comprovar falta/extravio junto à transportadora. Peso errado distorce o CT-e.',
      stakeholders: ['Expedição', 'Motorista', 'Recebimento'],
      criticality: 'atencao',
    },
    {
      id: 'nfe-infcpl',
      block: 'Dados Adicionais',
      label: 'Informações Complementares',
      shortLabel: 'Info. Complementares',
      technicalName: 'infCpl',
      sampleValue: 'Pedido Compra: PO-90412 | Entrega: CD Betim Doca 4 | Vencimentos e observações legais',
      description:
        'Campo livre vital para referenciar número do Pedido de Compra (PO) do cliente, endereço de entrega distinto, notas referenciadas (devolução/remessa) e embasamento legal.',
      example: 'Nº Pedido Compra: 4500192831 — exigido na maioria das entregas B2B e varejo.',
      operationalImpact:
        'Grandes varejistas e indústrias recusam o caminhão na portaria se o número do Pedido de Compra (PO) não estiver visível nas Informações Complementares.',
      stakeholders: ['Comercial', 'Expedição', 'Recebimento do Cliente'],
      criticality: 'atencao',
    },
  ],
};
