import type { NoteModel } from '../../types/fiscal';

export const cteModel: NoteModel = {
  id: 'cte',
  shortName: 'CT-e',
  fullName: 'Conhecimento de Transporte Eletrônico',
  modelCode: 'Modelo 57',
  auxiliaryDocName: 'DACTE',
  issuerScope: 'Estadual (SEFAZ / Transporte)',
  accentColor: 'amber',
  briefing: {
    whatIs:
      'É o documento fiscal emitido por transportadoras para acobertar a prestação do serviço de transporte de cargas (rodoviário, aéreo, ferroviário, aquaviário ou dutoviário) entre municípios ou estados.',
    whenToUse:
      'Sempre que houver contratação de frete intermunicipal ou interestadual com transportadora (transporte intramunicipal usa NFS-e).',
    activities: [
      'Emissão no TMS da Transportadora',
      'Coleta e Liberação na Portaria',
      'Auditoria e Conciliação de Frete',
      'Aproveitamento de Crédito de ICMS sobre Frete',
      'Logística Reversa e Redespacho',
    ],
    operationalImpact:
      'Sem CT-e autorizado e vinculado às chaves das NF-es transportadas, a carga fica irregular na rodovia, a auditoria de frete bloqueia o pagamento da fatura da transportadora e o embarcador perde o crédito fiscal do frete.',
    riskSummary: 'Carga irregular na estrada, bloqueio de pagamento de frete e perda de crédito.',
    processFlow: [
      { step: 'NF-e Emitida' },
      { step: 'Coleta / Embarque' },
      { step: 'Emissão CT-e + DACTE', active: true },
      { step: 'Inclusão no MDF-e' },
      { step: 'Auditoria e Pagamento' },
    ],
  },
  fields: [
    {
      id: 'cte-chave',
      block: 'Cabeçalho e Modal',
      label: 'Chave de Acesso e Tipo do CT-e',
      shortLabel: 'Chave e Tipo CT-e',
      technicalName: 'chCTe (Mod. 57) / tpCTe',
      sampleValue: '3526 1198 7654 3200 0155 5700 1000 0123 4510 2938 4756 • 0 - Normal',
      description:
        'Identificador único de 44 dígitos (modelo 57 na posição 21-22) e indicação do tipo de documento: Normal, Complementar, Anulação ou Substituto.',
      example: 'Tipo 0 - Normal (frete padrão) | Tipo 1 - Complementar (estadia, reentrega ou diferença de peso)',
      operationalImpact:
        'Emitir um segundo CT-e Normal para cobrar valor faltante em vez de usar Tipo 1 (Complementar) gera cobrança duplicada na auditoria de frete.',
      stakeholders: ['Transportadora (TMS)', 'Auditoria de Frete', 'Fiscal'],
      criticality: 'alto',
      codeGuide: {
        title: 'Tipos de CT-e (tpCTe) mais usados',
        summary: 'Define a finalidade do conhecimento de transporte:',
        commonExamples: [
          { code: '0 - Normal', meaning: 'CT-e padrão da viagem', whenUsed: 'Emissão regular vinculada às NF-es da coleta.' },
          { code: '1 - Complemento', meaning: 'Complemento de valores', whenUsed: 'Cobrança adicional após emissão (ex.: TDE, diária de descarga, reajuste de peso).' },
          { code: '3 - Substituto', meaning: 'Substituição de CT-e com erro de valor', whenUsed: 'Corrige valor cobrado a maior após prazo de cancelamento (com evento de desacordo do tomador).' },
        ],
      },
    },
    {
      id: 'cte-modal-cfop',
      block: 'Cabeçalho e Modal',
      label: 'Modal e CFOP do Transporte',
      shortLabel: 'Modal e CFOP',
      technicalName: 'modal (01..06) / CFOP',
      sampleValue: '01 - Rodoviário • CFOP 6.352',
      description:
        'Define o modal logístico (01 Rodoviário, 02 Aéreo...) e o CFOP específico do transporte, que varia conforme o ramo do tomador (indústria, comércio, não contribuinte).',
      example: '6.352 = Transporte interestadual prestado a estabelecimento industrial.',
      operationalImpact:
        'CFOP errado impede o ERP do embarcador de lançar o CT-e automaticamente no recebimento e pode impedir a tomada de crédito de ICMS sobre o frete.',
      stakeholders: ['Transportadora', 'Recebimento Fiscal', 'Contabilidade'],
      criticality: 'alto',
      codeGuide: {
        title: 'CFOPs de Transporte mais usados (CT-e)',
        summary: '5xxx dentro do estado | 6xxx interestadual (o final muda conforme o cliente):',
        commonExamples: [
          { code: '5.352 / 6.352', meaning: 'Transporte p/ estabelecimento industrial', whenUsed: 'Quando o tomador do frete é uma indústria.' },
          { code: '5.353 / 6.353', meaning: 'Transporte p/ estabelecimento comercial', whenUsed: 'Quando o tomador do frete é comércio, varejo ou distribuidor.' },
          { code: '5.357 / 6.357', meaning: 'Transporte p/ não contribuinte', whenUsed: 'Frete contratado por pessoa física ou empresa sem IE.' },
          { code: '5.351 / 6.351', meaning: 'Transporte p/ execução de serviço da mesma natureza', whenUsed: 'Subcontratação / Redespacho entre duas transportadoras.' },
        ],
      },
    },
    {
      id: 'cte-tomador',
      block: 'Participantes e Tomador',
      label: 'Tomador do Serviço (Quem paga o frete)',
      shortLabel: 'Tomador (CIF / FOB)',
      technicalName: 'toma3 (0=Rem, 1=Exp, 2=Rec, 3=Dest)',
      sampleValue: '0 - REMETENTE (CIF) • INDÚSTRIA TANAKA S.A.',
      description:
        'Indica quem contratou a transportadora e é o responsável financeiro pelo pagamento da fatura de frete e titular do crédito de ICMS.',
      example: '0 = Remetente (frete CIF na NF-e) | 3 = Destinatário (frete FOB na NF-e)',
      operationalImpact:
        'Divergência entre modFrete da NF-e (FOB) e Tomador do CT-e (Remetente) é a causa nº 1 de faturas bloqueadas e atraso no pagamento à transportadora.',
      stakeholders: ['Logística / TMS', 'Contas a Pagar', 'Transportadora'],
      criticality: 'critico',
      codeGuide: {
        title: 'Tabela do Tomador no CT-e (toma3)',
        summary: 'Deve espelhar exatamente quem contratou o frete na NF-e:',
        commonExamples: [
          { code: '0 - Remetente', meaning: 'Quem envia a carga paga (CIF)', whenUsed: 'Vendedor contratou a transportadora.' },
          { code: '3 - Destinatário', meaning: 'Quem recebe a carga paga (FOB)', whenUsed: 'Comprador contratou a coleta na fábrica/CD.' },
          { code: '1 / 2 - Expedidor / Recebedor', meaning: 'Redespacho ou armazém intermediário', whenUsed: 'Operações com mais de uma transportadora ou operador logístico.' },
        ],
      },
    },
    {
      id: 'cte-envolvidos',
      block: 'Participantes e Tomador',
      label: 'Remetente, Destinatário e Início/Fim',
      shortLabel: 'Início e Término',
      technicalName: 'rem / dest / xMunIni / xMunFim',
      sampleValue: 'Início: GUARULHOS / SP → Término: BETIM / MG',
      description:
        'Mostra os municípios exatos onde o transporte começa e termina — informação que define a alíquota interestadual de ICMS do frete (7% ou 12%).',
      example: 'Início Guarulhos/SP → Término Betim/MG (ICMS interestadual de 12%).',
      operationalImpact:
        'Município de início ou fim errado distorce o ICMS devido ao estado de origem e gera autuação caso o veículo passe por barreira fora da rota declarada.',
      stakeholders: ['Transportadora', 'Torre de Controle', 'Fiscal'],
      criticality: 'alto',
    },
    {
      id: 'cte-nfe-vinculadas',
      block: 'Documentos Originários',
      label: 'Chaves das NF-es Transportadas',
      shortLabel: 'Chaves das NF-es',
      technicalName: 'infDoc / infNFe / chave',
      sampleValue: '3526 1112 3456 7800 0199 5500 1000 0482 9110 8492 0194',
      description:
        'Lista as chaves de acesso (44 dígitos) de todas as NF-es de mercadoria vinculadas àquela prestação de frete.',
      example: '1 CT-e pode consolidar várias NF-es do mesmo remetente para o mesmo destinatário.',
      operationalImpact:
        'CT-e sem a chave da NF-e correta não consegue ser auditado contra a tabela de frete do pedido e impede o vínculo automático no MDF-e.',
      stakeholders: ['Expedição', 'Auditoria de Frete', 'Motorista'],
      criticality: 'critico',
    },
    {
      id: 'cte-carga',
      block: 'Informações da Carga',
      label: 'Produto Predominante, Valor da Carga e Peso',
      shortLabel: 'Produto, Valor e Peso',
      technicalName: 'proPred / vCarga / infQ (Peso Bruto)',
      sampleValue: 'ELETRÔNICOS • Carga: R$ 17.400,00 • Peso Bruto: 91,50 kg',
      description:
        'Resume o valor segurado das mercadorias, a natureza do produto e o peso real/cubado utilizado na formação do preço do frete.',
      example: 'Peso real 91,5 kg vs. Peso cubado 120 kg (prevalece o maior na tabela de frete).',
      operationalImpact:
        'Valor da carga menor que a soma das NF-es deixa a mercadoria subsegurada em caso de roubo; peso divergente gera diferença na auditoria de fatura.',
      stakeholders: ['Seguros / GR', 'Logística', 'Auditoria de Frete'],
      criticality: 'alto',
    },
    {
      id: 'cte-componentes',
      block: 'Composição do Frete e Impostos',
      label: 'Componentes do Frete e ICMS do Transporte',
      shortLabel: 'Componentes Frete',
      technicalName: 'vPrest / Comp (xNome, vComp) + imp',
      sampleValue: 'Frete Peso R$ 240,00 • Ad Valorem R$ 52,20 • GRIS R$ 34,80 • Pedágio R$ 23,00 • Total R$ 350,00',
      description:
        'Abre cada rubrica cobrada pela transportadora (Frete Peso, Ad Valorem, GRIS, Pedágio, TDE) e o ICMS destacado sobre o serviço.',
      example: 'Total da Prestação = R$ 350,00 (Base ICMS R$ 350,00 • Alíquota 12% • ICMS R$ 42,00).',
      operationalImpact:
        'Permite ao módulo de Auditoria de Frete validar cada componente contra a tabela contratada, barrando cobranças extras sem aprovação.',
      stakeholders: ['Auditoria de Frete', 'Compras Logísticas', 'Financeiro'],
      criticality: 'critico',
      codeGuide: {
        title: 'O que significa cada componente de frete no DACTE',
        summary: 'Rubricas mais comuns da composição tarifária:',
        commonExamples: [
          { code: 'Frete Peso', meaning: 'Tarifa base pelo peso/cubagem e distância', whenUsed: 'Calculado por faixa de kg ou fração x R$/tonelada.' },
          { code: 'Ad Valorem', meaning: 'Seguro contra acidentes (% sobre valor da NF)', whenUsed: 'Cobre risco rodoviário conforme o valor da mercadoria.' },
          { code: 'GRIS', meaning: 'Gerenciamento de Risco (% sobre valor da NF)', whenUsed: 'Custeia rastreamento, escolta e prevenção a roubo.' },
          { code: 'TDE / TRT', meaning: 'Taxa de Dificuldade de Entrega / Restrição Trânsito', whenUsed: 'Entregas em grandes varejistas com fila ou zonas restritas.' },
        ],
      },
    },
    {
      id: 'cte-rntrc',
      block: 'Dados Rodoviários',
      label: 'RNTRC da Transportadora',
      shortLabel: 'RNTRC (ANTT)',
      technicalName: 'rodo / RNTRC (Registro ANTT)',
      sampleValue: 'RNTRC: 04829103 • Lotação: NÃO',
      description:
        'Registro Nacional de Transportadores Rodoviários de Cargas na ANTT, obrigatório para qualquer transportadora remunerada.',
      example: 'RNTRC ativo vinculado ao CNPJ da transportadora emitente.',
      operationalImpact:
        'RNTRC vencido ou suspenso causa rejeição imediata do CT-e na SEFAZ e impede a contratação pelo compliance logístico.',
      stakeholders: ['Torre de Controle', 'Compliance / Cadastro', 'ANTT'],
      criticality: 'atencao',
    },
  ],
};
