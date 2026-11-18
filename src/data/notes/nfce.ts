import type { NoteModel } from '../../types/fiscal';

export const nfceModel: NoteModel = {
  id: 'nfce',
  shortName: 'NFC-e',
  fullName: 'Nota Fiscal de Consumidor Eletrônica',
  modelCode: 'Modelo 65',
  auxiliaryDocName: 'DANFE NFC-e',
  issuerScope: 'Estadual (Varejo / PDV)',
  accentColor: 'emerald',
  briefing: {
    whatIs:
      'É o documento fiscal do varejo presencial ou entrega local direta ao consumidor final (pessoa física ou jurídica não contribuinte), substituindo o antigo cupom fiscal de máquina ECF.',
    whenToUse:
      'Em vendas de balcão, lojas físicas, supermercados, restaurantes, farmácias e entregas rápidas locais para consumidor final (não serve para vendas B2B interestaduais).',
    activities: [
      'Operação de Frente de Caixa (PDV)',
      'Conciliação de Cartão, PIX e Dinheiro',
      'Troca e Devolução em Loja',
      'Contingência Offline quando cai a internet',
      'Fechamento de Caixa e Conferência Fiscal',
    ],
    operationalImpact:
      'Falha na emissão trava imediatamente a fila do caixa. Se operar em contingência offline e a loja não transmitir os XMLs pendentes em até 24 horas, as notas ficam irregulares e geram multa e quebra de caixa.',
    riskSummary: 'Fila parada no PDV, contingência vencida (>24h) e quebra de conciliação.',
    processFlow: [
      { step: 'Leitura no PDV' },
      { step: 'Pagamento (TEF/PIX)' },
      { step: 'Emissão NFC-e', active: true },
      { step: 'Entrega do Cupom / QR' },
      { step: 'Conciliação Diária' },
    ],
  },
  fields: [
    {
      id: 'nfce-emitente',
      block: 'Cabeçalho da Loja',
      label: 'Identificação da Loja Emitente',
      shortLabel: 'Loja Emitente',
      technicalName: 'emit (CNPJ, xFant, enderEmit)',
      sampleValue: 'SUPERMERCADO CENTRAL LTDA • CNPJ 12.345.678/0002-80 • Av. Brasil, 450',
      description:
        'Dados da filial exata onde a venda presencial ocorreu. Cada loja física possui seu próprio CNPJ/IE e numeração de série por PDV.',
      example: 'CNPJ Filial 0002-80 (Loja Shopping) — nunca usar o CNPJ da matriz se a venda saiu da filial.',
      operationalImpact:
        'Emitir com CNPJ da matriz ou de outra filial distorce o estoque físico da loja e gera erro na apuração estadual por estabelecimento.',
      stakeholders: ['Operador de Caixa', 'Gerente de Loja', 'TI / PDV'],
      criticality: 'alto',
    },
    {
      id: 'nfce-itens',
      block: 'Itens do Cupom',
      label: 'Itens, NCM, CFOP e Tributação no PDV',
      shortLabel: 'Itens / CFOP PDV',
      technicalName: 'det / prod (cProd, xProd, NCM, CFOP, CSOSN)',
      sampleValue: '001 7891000100103 CAFÉ TORRADO 500G | 2 UN x 18,90 = 37,80 (CFOP 5.405)',
      description:
        'Lista os produtos bipados no caixa com código EAN/interno, quantidade e valor. Por trás do cupom simplificado, cada item carrega NCM, CFOP e CSOSN/CST no XML.',
      example: 'Café com ICMS-ST na entrada sai no PDV com CFOP 5.405 e CSOSN 500.',
      operationalImpact:
        'Cadastro tributário errado no PDV (ex.: tributar produto monofásico ou ST) faz a loja pagar imposto duas vezes em cada venda passada no caixa.',
      stakeholders: ['Cadastro / Precificação', 'Operador de Caixa', 'Fiscal'],
      criticality: 'critico',
      codeGuide: {
        title: 'CFOPs mais comuns no PDV (Varejo)',
        summary: 'Na NFC-e quase 100% das vendas usam apenas 2 CFOPs:',
        commonExamples: [
          { code: '5.102', meaning: 'Venda de mercadoria tributada normalmente', whenUsed: 'Produtos sem Substituição Tributária (tributação normal de ICMS).' },
          { code: '5.405', meaning: 'Venda de mercadoria sujeita à ST', whenUsed: 'Bebidas, cigarros, cosméticos, autopeças e itens cujo ICMS já foi recolhido na indústria/atacado.' },
        ],
      },
    },
    {
      id: 'nfce-descontos',
      block: 'Totais e Pagamento',
      label: 'Descontos e Acréscimos',
      shortLabel: 'Descontos / Totais',
      technicalName: 'vDesc / vOutro',
      sampleValue: 'Subtotal R$ 112,40 • Desconto -R$ 7,40 • Valor a Pagar R$ 105,00',
      description:
        'Registra descontos promocionais (clube de fidelidade, cupom) ou taxas adicionais (como taxa de entrega local) aplicados sobre o subtotal da compra.',
      example: 'Desconto de R$ 7,40 registrado no PDV antes de enviar o valor líquido ao TEF.',
      operationalImpact:
        'Dar desconto direto na maquininha TEF sem registrar na NFC-e cria divergência entre o faturamento fiscal declarado e o dinheiro que cai no banco.',
      stakeholders: ['Frente de Caixa', 'Financeiro / Conciliação'],
      criticality: 'atencao',
    },
    {
      id: 'nfce-pagamento',
      block: 'Totais e Pagamento',
      label: 'Meios de Pagamento (tPag) e Troco',
      shortLabel: 'Pagamento (tPag)',
      technicalName: 'pag / detPag (tPag, vPag, vTroco)',
      sampleValue: '17-PIX: R$ 60,00 • 03-Cartão Crédito: R$ 45,00 • Troco: R$ 0,00',
      description:
        'Detalha exatamente qual forma de pagamento o cliente usou na tabela oficial tPag da SEFAZ. O total pago deve bater com o valor líquido da venda (menos troco).',
      example: 'Pagamento misto: R$ 60,00 no PIX (17) + R$ 45,00 no Crédito (03).',
      operationalImpact:
        'Se o operador selecionar "01-Dinheiro" quando o cliente passou "03-Crédito" ou "17-PIX", o fechamento de caixa dá quebra de dinheiro e a conciliação bancária não fecha.',
      stakeholders: ['Operador de Caixa', 'Tesouraria', 'Conciliação Financeira'],
      criticality: 'critico',
      codeGuide: {
        title: 'Códigos tPag mais usados na frente de caixa',
        summary: 'Tabela oficial da tag <tPag> no XML da NFC-e:',
        commonExamples: [
          { code: '01', meaning: 'Dinheiro', whenUsed: 'Pagamento em espécie (único que gera troco em vTroco).' },
          { code: '03', meaning: 'Cartão de Crédito', whenUsed: 'Exige CNPJ da credenciadora e código de autorização (TEF).' },
          { code: '04', meaning: 'Cartão de Débito', whenUsed: 'Débito em conta via TEF/POS.' },
          { code: '17', meaning: 'PIX (Pagamento Instantâneo)', whenUsed: 'PIX dinâmico integrado no PDV ou estático.' },
          { code: '10 / 11', meaning: 'Vale Alimentação / Vale Refeição', whenUsed: 'Supermercados, mercearias e restaurantes.' },
        ],
      },
    },
    {
      id: 'nfce-consumidor',
      block: 'Consumidor',
      label: 'CPF / CNPJ do Consumidor',
      shortLabel: 'CPF Consumidor',
      technicalName: 'dest (CPF / CNPJ)',
      sampleValue: 'CONSUMIDOR - CPF 321.***.***-09',
      description:
        'Identificação opcional na maioria das vendas (obrigatória acima de limites estaduais, ex. R$ 10 mil, ou quando o cliente pede CPF na nota para programas de pontos/garantia).',
      example: 'Cliente informa o CPF no início da compra antes de finalizar o cupom.',
      operationalImpact:
        'Digitar CPF errado ou esquecer de incluir antes de fechar a venda impede alteração posterior — exige cancelar a NFC-e em até 30 minutos e reemitir.',
      stakeholders: ['Operador de Caixa', 'Atendimento / SAC'],
      criticality: 'informativo',
    },
    {
      id: 'nfce-contingencia',
      block: 'Autorização e Contingência',
      label: 'Emissão Normal vs. Contingência Offline',
      shortLabel: 'Contingência (24h)',
      technicalName: 'tpEmis (1 = Normal | 9 = Contingência Off-line)',
      sampleValue: 'tpEmis=9 • EMITIDA EM CONTINGÊNCIA OFFLINE (Transmitir em até 24h)',
      description:
        'Modo de contingência permite que o caixa continue vendendo e imprimindo cupom mesmo quando a internet da loja cai ou o servidor da SEFAZ está instável.',
      example: 'Internet caiu às 14h → PDV emite com tpEmis=9 → envia automaticamente ao voltar.',
      operationalImpact:
        'Maior risco silencioso do varejo: se a loja não transmitir os XMLs offline em até 24 horas (prazo legal), a SEFAZ rejeita por atraso e a venda fica irregular.',
      stakeholders: ['TI / Suporte PDV', 'Gerente de Loja', 'Fiscal'],
      criticality: 'critico',
      codeGuide: {
        title: 'Tipos de emissão na NFC-e (tpEmis)',
        summary: 'Diferença operacional entre venda online e offline:',
        commonExamples: [
          { code: 'tpEmis = 1', meaning: 'Emissão Normal (Online)', whenUsed: 'PDV comunica na hora com a SEFAZ e imprime protocolo de autorização.' },
          { code: 'tpEmis = 9', meaning: 'Contingência Off-line', whenUsed: 'Sem internet: imprime sem protocolo ("Pendente de transmissão") e deve subir em até 24h.' },
        ],
      },
    },
    {
      id: 'nfce-qrcode',
      block: 'Autorização e Contingência',
      label: 'Chave de Acesso, Série PDV e QR Code',
      shortLabel: 'Chave e QR Code',
      technicalName: 'infNFeSupl / qrCode + chNFe (Modelo 65)',
      sampleValue: 'NFC-e nº 019482 Série 012 • Chave 3526 1112 3456 7800 0280 6501 2000 0194 8290 1122 3344',
      description:
        'Código de barras 2D (QR Code) obrigatório no DANFE NFC-e que permite ao cliente validar na hora pelo celular se o cupom existe na SEFAZ (inclusive se já subiu da contingência).',
      example: 'Modelo 65 na posição 21-22 da chave, Série 012 identificando o Caixa/PDV 12.',
      operationalImpact:
        'Impressora térmica sem papel/bobina ruim ou QR Code ilegível impede trocas em loja e gera autuação por embaraço à consulta do consumidor.',
      stakeholders: ['PDV / Hardware', 'Consumidor Final', 'Pós-venda'],
      criticality: 'alto',
    },
    {
      id: 'nfce-tributos',
      block: 'Transparência Fiscal',
      label: 'Tributos Aproximados (Lei da Transparência / IBPT)',
      shortLabel: 'Tributos (IBPT)',
      technicalName: 'vTotTrib (Lei 12.741/2012)',
      sampleValue: 'Trib aprox: R$ 19,42 Federal e R$ 18,90 Estadual (Fonte: IBPT)',
      description:
        'Estimativa informativa da carga tributária embutida no preço final pago pelo consumidor, calculada por NCM via tabela IBPT.',
      example: 'Total aproximado de tributos: 36,5% do cupom.',
      operationalImpact:
        'Tabela IBPT vencida não trava a venda no caixa, mas expõe a loja a autuações do Procon em fiscalizações de rotina.',
      stakeholders: ['TI / ERP', 'Fiscal'],
      criticality: 'informativo',
    },
  ],
};
