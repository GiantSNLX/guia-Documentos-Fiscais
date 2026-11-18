import type { NoteModel } from '../../types/fiscal';

export const mdfeModel: NoteModel = {
  id: 'mdfe',
  shortName: 'MDF-e',
  fullName: 'Manifesto Eletrônico de Documentos Fiscais',
  modelCode: 'Modelo 58',
  auxiliaryDocName: 'DAMDFE',
  issuerScope: 'Nacional / Interestadual e Intermunicipal',
  accentColor: 'sky',
  briefing: {
    whatIs:
      'É o documento consolidador que agrupa todas as NF-es e/ou CT-es de uma mesma viagem/veículo, agilizando a fiscalização de carga fechada ou fracionada em rodovias e postos fiscais.',
    whenToUse:
      'Obrigatório no transporte de cargas interestadual (e em muitos estados também no intermunicipal), tanto por transportadoras (vinculando CT-es) quanto por empresas com frota própria (vinculando NF-es).',
    activities: [
      'Roteirização e Romaneio de Carga',
      'Portaria e Liberação de Veículo na Doca',
      'Fiscalização em Postos de Barreira (SEFAZ/PRF)',
      'Gestão de Motoristas, Placas e CIOT',
      'Encerramento Obrigatório pós-Entrega',
    ],
    operationalImpact:
      'Esquecer de ENCERRAR o MDF-e após o término da viagem trava a empresa inteira: a SEFAZ bloqueia a emissão de novos MDF-es para a mesma placa/UF! Veículo viajando sem DAMDFE sofre retenção imediata e multa em posto fiscal.',
    riskSummary: 'Bloqueio de novos embarques por MDF-e aberto e retenção do veículo na barreira.',
    processFlow: [
      { step: 'NF-es / CT-es Prontos' },
      { step: 'Carregamento do Veículo' },
      { step: 'Emissão MDF-e + DAMDFE', active: true },
      { step: 'Viagem e Postos Fiscais' },
      { step: 'Encerramento na SEFAZ' },
    ],
  },
  fields: [
    {
      id: 'mdfe-chave',
      block: 'Cabeçalho e Status',
      label: 'Chave de Acesso, Tipo de Emitente e Número',
      shortLabel: 'Chave e tpEmit',
      technicalName: 'chMDFe (Mod. 58) / tpEmit (1 ou 2)',
      sampleValue: '3526 1112 3456 7800 0199 5800 1000 0041 2010 9283 7465 • Nº 4.120',
      description:
        'Identificador de 44 dígitos do Manifesto (modelo 58 na posição 21-22) e indicação de quem está transportando (Transportadora vs. Carga Própria).',
      example: 'tpEmit = 2 (Embarcador entregando produto próprio com frota própria, vinculando NF-es).',
      operationalImpact:
        'Usar tpEmit=1 (Transportadora) tentando vincular NF-e ou vice-versa gera rejeição imediata na validação do schema da SEFAZ.',
      stakeholders: ['Expedição', 'Torre de Controle', 'Portaria'],
      criticality: 'alto',
      codeGuide: {
        title: 'Quem emite o MDF-e? (tpEmit)',
        summary: 'O tipo de emitente define quais documentos podem ser vinculados:',
        commonExamples: [
          { code: '1 - Prestador de Serviço', meaning: 'Transportadora', whenUsed: 'Vincula CT-es (modelo 57) da viagem.' },
          { code: '2 - Carga Própria', meaning: 'Empresa com frota própria ou TAC agregado', whenUsed: 'Vincula NF-es (modelo 55) diretamente sem precisar de CT-e.' },
          { code: '3 - CT-e Globalizado', meaning: 'Transportadora em operação específica', whenUsed: 'Casos pontuais de transporte com CT-e globalizado.' },
        ],
      },
    },
    {
      id: 'mdfe-rota',
      block: 'Rota e Percurso',
      label: 'UF Carregamento, UFs de Percurso e Descarregamento',
      shortLabel: 'UFs e Percurso',
      technicalName: 'UFIni / infPercurso (UFPer) / UFFim',
      sampleValue: 'Carregamento: SP → Percurso: RJ → Descarregamento: MG',
      description:
        'Declara o estado de origem da carga, todos os estados intermediários por onde o caminhão vai trafegar (UFPer) e o estado de destino final.',
      example: 'Saída SP → Destino BA passando por MG e ES → UFPer: MG, ES.',
      operationalImpact:
        'Passar por uma divisa estadual que não foi listada em UFPer gera autuação automática em posto fiscal ou bloqueio na leitura de pórticos.',
      stakeholders: ['Roteirização', 'Torre de Controle', 'Motorista'],
      criticality: 'critico',
    },
    {
      id: 'mdfe-veiculo',
      block: 'Veículo e Motorista',
      label: 'Placa, RENAVAM, Tara e RNTRC do Veículo',
      shortLabel: 'Placa e RNTRC',
      technicalName: 'veicTracao (placa, RENAVAM, tara, capKG) + RNTRC',
      sampleValue: 'BRA-2E19 (SP) • Tara 7.200 kg • Cap 14.000 kg • RNTRC 04829103',
      description:
        'Dados completos do veículo de tração (e reboque/carreta se houver) que está levando a carga na rodovia.',
      example: 'Se o caminhão quebrar na rota, é preciso encerrar o MDF-e anterior e abrir novo com a placa substituta.',
      operationalImpact:
        'Placa divergente no DAMDFE durante leitura automática por câmeras OCR em pedágios/postos fiscais gera multa automática ao transportador.',
      stakeholders: ['Portaria', 'Manutenção / Frota', 'Motorista'],
      criticality: 'critico',
    },
    {
      id: 'mdfe-condutor',
      block: 'Veículo e Motorista',
      label: 'Nome e CPF do Condutor (Motorista)',
      shortLabel: 'Condutor (CPF)',
      technicalName: 'condutor (xNome, CPF)',
      sampleValue: 'CARLOS EDUARDO SILVA • CPF 234.567.890-12',
      description:
        'Identificação oficial do motorista responsável. Caso troque de motorista no meio da rota, basta enviar um evento eletrônico de Inclusão de Condutor sem cancelar o MDF-e.',
      example: 'Evento Inclusão de Condutor permite adicionar motorista reserva em viagens longas.',
      operationalImpact:
        'Motorista abordado na rodovia sem constar no DAMDFE tem o veículo retido na barreira até a empresa transmitir o evento de inclusão.',
      stakeholders: ['Portaria', 'Torre de Controle', 'Motorista'],
      criticality: 'critico',
    },
    {
      id: 'mdfe-docs',
      block: 'Documentos Vinculados',
      label: 'Relação de NF-es / CT-es Vinculados',
      shortLabel: 'Docs. Vinculados',
      technicalName: 'infMunDescarga (infCTe / infNFe)',
      sampleValue: 'Betim/MG: 14 NF-es vinculadas • Peso: 4.820,00 kg • Valor: R$ 189.400,00',
      description:
        'Agrupa, por município de descarregamento, todas as chaves de 44 dígitos das NF-es ou CT-es embarcados naquela viagem.',
      example: 'Viagem fracionada com entregas em Juiz de Fora/MG e Betim/MG lista cada cidade com suas chaves.',
      operationalImpact:
        'Mercadoria física dentro do baú sem a respectiva chave vinculada no MDF-e é tratada como carga irregular no posto fiscal.',
      stakeholders: ['Conferente de Doca', 'Expedição', 'Fiscalização'],
      criticality: 'critico',
    },
    {
      id: 'mdfe-seguro-ciot',
      block: 'Seguro, CIOT e Vale-Pedágio',
      label: 'Averbação de Seguro, CIOT e Vale-Pedágio',
      shortLabel: 'Seguro, CIOT e Pedágio',
      technicalName: 'seg (nApol, nAver) / infCIOT / valePed',
      sampleValue: 'Porto Seguro • Apólice 99812 • Averb. AVB-4410 • CIOT 112233445566',
      description:
        'Comprova o seguro obrigatório da carga (RCTR-C/RCF-DC), o CIOT (obrigatório ao contratar caminhoneiro autônomo TAC) e o Vale-Pedágio antecipado.',
      example: 'Contratação de autônomo (TAC) sem CIOT e Vale-Pedágio gera multa da ANTT.',
      operationalImpact:
        'Viajar sem averbação de seguro ou sem CIOT/Vale-Pedágio quando exigido resulta em multas severas da ANTT e risco de negativa de indenização em sinistro.',
      stakeholders: ['Gerenciamento de Risco', 'Logística', 'Financeiro Frete'],
      criticality: 'alto',
    },
    {
      id: 'mdfe-encerramento',
      block: 'Ciclo de Vida (Pós-Viagem)',
      label: 'Status na SEFAZ e Evento de Encerramento',
      shortLabel: 'Encerramento SEFAZ',
      technicalName: 'evEncMDFe (dtEnc, cUF, cMun)',
      sampleValue: 'STATUS: AUTORIZADO (ABERTO) — Encerrar após descarga em Betim/MG',
      description:
        'Evento eletrônico obrigatório enviado à SEFAZ assim que o veículo conclui a descarga na UF de destino.',
      example: 'Motorista confirma entrega final → Torre de Controle transmite o evEncMDFe no sistema.',
      operationalImpact:
        'ARMADILHA CLÁSSICA: enquanto existir um MDF-e aberto para uma placa + UF de destino, a SEFAZ BLOQUEIA a emissão de um novo MDF-e para aquele veículo na mesma rota, travando o próximo carregamento na doca.',
      stakeholders: ['Torre de Controle', 'Expedição', 'Motorista'],
      criticality: 'critico',
    },
  ],
};
