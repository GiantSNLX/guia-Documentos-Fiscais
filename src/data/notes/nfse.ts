import type { NoteModel } from '../../types/fiscal';

export const nfseModel: NoteModel = {
  id: 'nfse',
  shortName: 'NFS-e',
  fullName: 'Nota Fiscal de Serviços Eletrônica',
  modelCode: 'DANFSe v2.0 (Nacional)',
  auxiliaryDocName: 'DANFSe v2.0',
  issuerScope: 'Municipal / Portal Nacional NFS-e',
  accentColor: 'violet',
  briefing: {
    whatIs:
      'É o documento fiscal que registra a prestação de serviços (consultoria, software, manutenção, limpeza, engenharia, frete intramunicipal etc.) e apura o ISS ou enquadramentos como imunidade/não incidência.',
    whenToUse:
      'Sempre que uma empresa ou autônomo PJ presta um serviço sem circulação de mercadoria (ou na parcela de serviço de contratos mistos).',
    activities: [
      'Faturamento de Contratos e Emissão de DPS/RPS',
      'Contas a Receber e Cobrança B2B',
      'Contas a Pagar / Conferência de Terceiros',
      'Apuração de Retenções (ISS, INSS, IRRF, CSRF)',
      'Fechamento Mensal por Competência',
    ],
    operationalImpact:
      'Erros no Código de Tributação Nacional (cTribNac/LC 116), NBS ou nas retenções (ISS retido, INSS 11%, IRRF 1,5%, PIS/COFINS/CSLL 4,65%) fazem o cliente reter/glosar o pagamento da fatura até a nota ser substituída ou cancelada dentro do prazo municipal.',
    riskSummary: 'Glosa de pagamento pelo tomador e perda de prazo de cancelamento municipal.',
    processFlow: [
      { step: 'Contrato / Medição' },
      { step: 'Emissão DPS / RPS' },
      { step: 'Autorização NFS-e', active: true },
      { step: 'Validação de Retenções' },
      { step: 'Pagamento Líquido' },
    ],
  },
  fields: [
    {
      id: 'nfse-numero-verif',
      block: 'Identificação e Autenticidade',
      label: 'Chave de Acesso (50 dígitos), Número da NFS-e e DPS',
      shortLabel: 'Chave / Nº / DPS',
      technicalName: 'chNFSe / nNFSe / nDPS / serie / cStat',
      sampleValue: 'NFS-e 296 • DPS 304 (Série 70000) • Chave 50 dígitos',
      description:
        'No DANFSe v2.0, o prestador envia uma DPS (Declaração de Prestação de Serviços) e o Portal Nacional gera a NFS-e definitiva com chave de acesso de 50 dígitos, situação ("NFS-e Gerada") e QR Code.',
      example: 'DPS 304 (Série 70000) convertida na NFS-e 296 com chave de 50 dígitos.',
      operationalImpact:
        'Enviar ao cliente apenas o recibo provisório (DPS/RPS) sem confirmar a situação "NFS-e Gerada" trava o lançamento no Contas a Pagar por falta de validade fiscal.',
      stakeholders: ['Faturamento', 'Contas a Pagar do Cliente', 'TI / ERP'],
      criticality: 'alto',
      codeGuide: {
        title: 'Anatomia da Chave da NFS-e Nacional (50 dígitos)',
        summary: 'Diferente da NF-e (44 dígitos), a NFS-e Nacional possui 50 dígitos:',
        segments: [
          { code: '3550308', label: 'IBGE Mun (7)', detail: 'Código IBGE do município emissor (ex: 3550308 = São Paulo)', colorClass: 'bg-violet-100 text-violet-800 border-violet-300' },
          { code: '2', label: 'Amb (1)', detail: 'Ambiente gerador (1=Prefeitura, 2=Sistema Nacional)', colorClass: 'bg-sky-100 text-sky-800 border-sky-300' },
          { code: '2', label: 'Tipo (1)', detail: 'Tipo de inscrição do emitente (1=CPF, 2=CNPJ)', colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
          { code: '12345678000199', label: 'CNPJ (14)', detail: 'CNPJ do prestador/emitente', colorClass: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
          { code: '0000000000296', label: 'nNFSe (13)', detail: 'Número sequencial da NFS-e', colorClass: 'bg-amber-100 text-amber-800 border-amber-300' },
          { code: '2611...', label: 'AAMM + Cód (14)', detail: 'Ano/Mês + código numérico + dígito verificador', colorClass: 'bg-slate-200 text-slate-800 border-slate-300' },
        ],
      },
    },
    {
      id: 'nfse-competencia',
      block: 'Identificação e Autenticidade',
      label: 'Competência e Data/Hora de Emissão (NFS-e e DPS)',
      shortLabel: 'Competência / Datas',
      technicalName: 'dCompet / dhProc / dhEmi',
      sampleValue: 'Competência: 17/11/2026 • Emissão: 18/11/2026 10:35:34',
      description:
        'Define em qual competência contábil/fiscal o serviço foi prestado (fato gerador do ISS) e o timestamp exato da emissão da DPS e da NFS-e.',
      example: 'Serviço prestado em Outubro faturado em 02/11 com competência 31/10/2026.',
      operationalImpact:
        'Empresas fecham o recebimento de NFS-e por volta do dia 25; emitir fora da janela ou com competência trocada empurra o pagamento para o mês seguinte.',
      stakeholders: ['Faturamento', 'Controladoria', 'Contas a Pagar'],
      criticality: 'alto',
    },
    {
      id: 'nfse-partes',
      block: 'Prestador e Tomador',
      label: 'Prestador / Fornecedor e Tomador / Adquirente',
      shortLabel: 'Prestador / Tomador',
      technicalName: 'prest / toma (CNPJ, IM, IBGE/CEP, opSimpNac, regApurTribSN)',
      sampleValue: 'TK SISTEMAS LTDA (Não optante SN) → TOMADOR (CNPJ, IM, IBGE/CEP)',
      description:
        'Identifica Prestador, Tomador (e eventuais Destinatário/Intermediário), Inscrição Municipal, código IBGE/CEP e o enquadramento no Simples Nacional (`opSimpNac`), que define se haverá retenção de IRRF e CSRF.',
      example: 'opSimpNac = 1 (Não Optante) sofre retenções federais; opSimpNac = 3 (Simples Nacional) em regra é dispensado de IRRF/CSRF.',
      operationalImpact:
        'Faturar contra o CNPJ da matriz quando o pedido pertence à filial ou errar o regime (Simples vs. Normal) trava o match automático e gera retenção indevida.',
      stakeholders: ['Comercial', 'Faturamento', 'Suprimentos do Tomador'],
      criticality: 'critico',
      codeGuide: {
        title: 'Códigos de regime no Padrão Nacional (opSimpNac)',
        summary: 'Define se o prestador recolhe impostos no DAS ou no regime normal:',
        commonExamples: [
          { code: '1 - Não Optante', meaning: 'Lucro Presumido ou Lucro Real', whenUsed: 'Sujeito às retenções padrão de IRRF (1,5%), CSRF (4,65%) e ISS/INSS conforme serviço.' },
          { code: '2 - Optante MEI', meaning: 'Microempreendedor Individual', whenUsed: 'Dispensado de retenções federais; atenção especial para serviços específicos (INSS patronal 20%).' },
          { code: '3 - Optante ME/EPP', meaning: 'Simples Nacional', whenUsed: 'Dispensado de IRRF e CSRF na fonte; pode ter retenção de ISS pela alíquota do Anexo.' },
        ],
      },
    },
    {
      id: 'nfse-cod-servico',
      block: 'Serviço Prestado',
      label: 'Código de Tributação Nacional (cTribNac) e NBS (cNBS)',
      shortLabel: 'cTribNac e NBS',
      technicalName: 'cTribNac (LC 116) / cNBS (9 dígitos)',
      sampleValue: 'cTribNac: 01.07.01 • NBS: 1.1502.20.00',
      description:
        'No DANFSe v2.0 aparecem lado a lado: o Código de Tributação Nacional/Municipal (baseado na LC 116/03) e o Código da NBS (Nomenclatura Brasileira de Serviços, essencial para classificação federal e IBS/CBS).',
      example: '01.07.01 (Suporte TI) | 07.02.01 (Obra civil) | 99.01.01 (Serviços sem incidência ISSQN/ICMS)',
      operationalImpact:
        'Código errado é o campeão de glosas: muda o município onde o ISS é devido, altera alíquotas e faz incidir ou faltar retenções obrigatórias.',
      stakeholders: ['Fiscal', 'Faturamento', 'Contas a Pagar'],
      criticality: 'critico',
      codeGuide: {
        title: 'Códigos cTribNac / LC 116 mais usados na operação B2B',
        summary: 'Exemplos práticos e impacto nas retenções:',
        commonExamples: [
          { code: '01.07.01', meaning: 'Suporte técnico em informática', whenUsed: 'Helpdesk, manutenção de sistemas/servidores. ISS devido no município do prestador.' },
          { code: '01.05.01', meaning: 'Licenciamento/cessão de software (SaaS)', whenUsed: 'Assinaturas B2B de software. Atenção às retenções contratuais.' },
          { code: '07.02.01', meaning: 'Execução de obra de construção civil', whenUsed: 'ISS devido no LOCAL DA OBRA e geralmente exige retenção de INSS (11%).' },
          { code: '07.10.01', meaning: 'Limpeza, manutenção e conservação predial', whenUsed: 'ISS no local do serviço + retenção de INSS 11%, IRRF e CSRF.' },
          { code: '14.01.01', meaning: 'Manutenção de máquinas e equipamentos', whenUsed: 'Reparos em equipamentos industriais/frota sem fornecimento de peça.' },
          { code: '99.01.01', meaning: 'Serviços sem incidência de ISSQN e ICMS', whenUsed: 'Operações específicas fora da incidência do ISS (ex.: cessão/locação de espaço sem prestação de serviço tributável).' },
        ],
      },
    },
    {
      id: 'nfse-local-incidencia',
      block: 'Serviço Prestado',
      label: 'Local da Prestação / Sigla UF / País',
      shortLabel: 'Local da Prestação',
      technicalName: 'xLocPrestacao / cLocPrestacao / cLocIncid',
      sampleValue: 'São Paulo / SP / —',
      description:
        'Define o município e UF onde o serviço foi fisicamente prestado. Nos casos de exceção da LC 116 (obra, limpeza, vigilância), o ISS vai para o município da prestação e não do prestador.',
      example: 'Prestador em São Paulo executa obra em Campinas → Local da Prestação: Campinas / SP.',
      operationalImpact:
        'Recolher ISS para a prefeitura errada gera bitributação: o município onde o serviço ocorreu cobra o imposto novamente do tomador por responsabilidade solidária.',
      stakeholders: ['Fiscal', 'Contabilidade', 'Tomador do Serviço'],
      criticality: 'critico',
    },
    {
      id: 'nfse-discriminacao',
      block: 'Serviço Prestado',
      label: 'Descrição do Serviço (xDescServ)',
      shortLabel: 'Descrição do Serviço',
      technicalName: 'xDescServ',
      sampleValue: 'Manutenção preventiva de servidores ref. Nov/2026 conforme Contrato #CT-884 e Pedido PO-77210.',
      description:
        'Texto livre detalhando o escopo executado, área/unidade atendida, período de medição, número do contrato/pedido de compra (PO) e dados bancários.',
      example: 'Sempre citar: Nº do PO + Mês de referência + Contrato.',
      operationalImpact:
        'Descrição genérica ("Serviços prestados") sem número do Pedido de Compra faz o sistema de recebimento do cliente devolver a nota por falta de rastreabilidade.',
      stakeholders: ['Gestor do Contrato', 'Faturamento', 'Contas a Pagar'],
      criticality: 'atencao',
    },
    {
      id: 'nfse-iss',
      block: 'Tributação Municipal (ISSQN)',
      label: 'Tributação Municipal (ISSQN) e Retenção',
      shortLabel: 'ISSQN e Retenção',
      technicalName: 'tribMun (tribISSQN, tpRetISSQN, pAliq, vISSQN)',
      sampleValue: 'Operação Tributável (ou Não Sujeita ao ISSQN) • Alíq: 5,00% • Não Retido',
      description:
        'Bloco dedicado do DANFSe v2.0 que informa se a operação é tributável ou não sujeita ao ISSQN (`tribISSQN`), a alíquota (2% a 5%) e quem recolhe (`tpRetISSQN`: 1-Não Retido, 2-Retido pelo Tomador).',
      example: 'tribISSQN=4 (Não Incidência) exibe a faixa "OPERAÇÃO NÃO SUJEITA AO ISSQN" no DANFSe.',
      operationalImpact:
        'Marcar "Retido" errado faz o tomador descontar ISS sem dever ou o prestador pagar em duplicidade. Confundir Não Incidência (4) com Tributável (1) gera autuação municipal.',
      stakeholders: ['Fiscal', 'Tesouraria', 'Contas a Pagar'],
      criticality: 'alto',
      codeGuide: {
        title: 'Códigos tribISSQN e tpRetISSQN (DANFSe v2.0)',
        summary: 'Combinação que define se há ISS e quem recolhe:',
        commonExamples: [
          { code: 'tribISSQN = 1', meaning: 'Operação Tributável pelo ISS', whenUsed: 'Regra geral para serviços previstos na lista da LC 116.' },
          { code: 'tribISSQN = 4', meaning: 'Não Incidência / Não Sujeita ao ISSQN', whenUsed: 'Operações fora do campo de incidência do ISS (ex.: locação pura).' },
          { code: 'tpRetISSQN = 1', meaning: 'ISS Não Retido', whenUsed: 'O próprio prestador recolhe o ISS na guia mensal.' },
          { code: 'tpRetISSQN = 2', meaning: 'ISS Retido pelo Tomador', whenUsed: 'O cliente desconta o ISS da fatura e recolhe à prefeitura.' },
        ],
      },
    },
    {
      id: 'nfse-retencoes',
      block: 'Tributação Federal e Totais',
      label: 'Tributação Federal (IRRF, INSS, CSRF, PIS/COFINS) e Valor Líquido',
      shortLabel: 'Retenções e Líquido',
      technicalName: 'tribFed (vRetIRRF, vRetCP, tpRetPisCofins) + Valor Líquido',
      sampleValue: 'Valor Serviço: R$ 10.000,00 • IRRF: R$ 150,00 • CSRF: R$ 465,00 • Líquido: R$ 9.385,00',
      description:
        'Agrupa as retenções federais (IRRF, Contribuição Previdenciária/INSS, Contribuições Sociais PIS/COFINS/CSLL) e o débito de apuração própria, fechando no bloco "VALOR TOTAL DA NFS-e" com Descontos e Valor Líquido.',
      example: 'Descrição Contrib. Sociais - Retidas: 0 - PIS/COFINS/CSLL Não Retidos (ou 4,65% retido).',
      operationalImpact:
        'Gerar boleto pelo Valor Bruto quando há retenções obrigatórias (ou errar a indicação tpRetPisCofins) gera glosa imediata no Contas a Pagar e atrasa o recebimento.',
      stakeholders: ['Fiscal', 'Contas a Receber', 'Contas a Pagar'],
      criticality: 'critico',
      codeGuide: {
        title: 'Alíquotas padrão das Retenções Federais na NFS-e',
        summary: 'Aplicáveis para prestadores Lucro Presumido/Real:',
        commonExamples: [
          { code: 'IRRF (1,5% ou 1%)', meaning: 'Imposto de Renda Retido na Fonte', whenUsed: '1,5% em serviços profissionais/consultoria/TI; 1,0% em limpeza, vigilância e locação de mão de obra.' },
          { code: 'CSRF (4,65%)', meaning: 'PIS (0,65%) + COFINS (3,0%) + CSLL (1,0%)', whenUsed: 'Serviços da Lei 10.833 (manutenção, consultoria, limpeza, TI) para retenção > R$ 10,00.' },
          { code: 'INSS (11% ou 3,5%)', meaning: 'Contribuição Previdenciária - Retida', whenUsed: 'Serviços com cessão de mão de obra ou empreitada.' },
        ],
      },
    },
    {
      id: 'nfse-ibscbs',
      block: 'Tributação IBS/CBS (Reforma Tributária)',
      label: 'Tributação IBS / CBS no DANFSe v2.0',
      shortLabel: 'IBS / CBS (2026)',
      technicalName: 'CST / cClassTrib / IBS UF & Mun / CBS',
      sampleValue: 'CST/cClassTrib • Exclusões BC • Alíq. Efetiva IBS/CBS • Valor Líquido + IBS/CBS',
      description:
        'Novo quadro oficial do DANFSe v2.0 preparado para a Reforma Tributária: traz CST/cClassTrib, indicador da operação, município de incidência, exclusões da base de cálculo e valores apurados de IBS (Estadual/Municipal) e CBS (Federal).',
      example: 'Durante a transição ou em operações fora da incidência, os campos permanecem zerados/traço ("-").',
      operationalImpact:
        'Quando obrigatório pelo cronograma da Reforma Tributária, o preenchimento incorreto de cClassTrib ou município de incidência rejeitará a emissão da DPS no Portal Nacional.',
      stakeholders: ['Fiscal', 'TI / ERP', 'Contabilidade'],
      criticality: 'atencao',
    },
  ],
};
