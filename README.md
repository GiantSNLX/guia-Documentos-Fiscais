# GuiaDF-e — Explorador Interativo de Modelos de Notas Fiscais

Aplicação web interativa desenvolvida em **React + TypeScript + Tailwind CSS** que replica o layout real dos principais documentos fiscais eletrônicos brasileiros (**DANFE**, **DANFE NFC-e**, **NFS-e**, **DACTE** e **DAMDFE**), explicando cada campo e código com os exemplos mais usados na operação.

## Modelos incluídos

- **NF-e (Modelo 55 — DANFE):** Layout completo com canhoto, código de barras Code-128 real, destinatário completo, **Fatura/Duplicatas**, cálculo de impostos (ICMS, ST, IPI, PIS, COFINS, FCP), **IBS/CBS (Reforma Tributária)**, transportador/volumes, tabela de produtos com **NCM/CEST, CST, CFOP** e dados adicionais.
- **NFC-e (Modelo 65 — DANFE NFC-e):** Layout de cupom térmico 80mm com itens, meios de pagamento (`tPag`), contingência offline (`tpEmis = 9`) e QR Code real.
- **NFS-e (Padrão Nacional / Municipal):** Espelho DANFSE com chave de 50 dígitos, QR Code, DPS/RPS, `cTribNac` (LC 116) + `cNBS`, `opSimpNac`, `tribISSQN`/`tpRetISSQN` e tabela de retenções federais.
- **CT-e (Modelo 57 — DACTE):** Conhecimento de transporte com canhoto, código de barras, modal/CFOP de transporte, tomador, componentes do frete, NF-es vinculadas e RNTRC.
- **MDF-e (Modelo 58 — DAMDFE):** Manifesto rodoviário com código de barras + QR Code, UFs de percurso, placa/condutor, seguro/CIOT, documentos vinculados e regra de encerramento.

## Funcionalidades

- **Espelho real totalmente interativo:** Passe o mouse sobre qualquer célula ou coluna da nota (ex.: CFOP, NCM/CEST, CST, Chave de Acesso, Fatura, IBS/CBS, Totais) para inspecionar em tempo real, ou clique para fixar no painel lateral.
- **Abrir XML Local (100% offline no navegador):** Carregue qualquer XML real de NF-e, NFC-e, NFS-e Padrão Nacional, CT-e ou MDF-e direto no navegador sem enviar dados a servidores — com botão de **ocultar/anonimizar dados sensíveis** ativo por padrão.
- **Anatomia dos códigos e exemplos mais usados:** Decodificador visual dos 44 dígitos da Chave de Acesso, estrutura do NCM, regra do 1º dígito do CFOP com tabela dos CFOPs mais usados (`5.102/6.102`, `5.405`, `5.915`, `5.202`, etc.), CST/CSOSN, `tPag`, LC 116 e alíquotas de retenção.
- **Briefing rápido da operação:** Cada modelo traz um resumo direto de *o que é / quando emitir*, *atividades envolvidas*, *onde entra no fluxo* e *impacto na operação*.
- **Filtro de Campos Críticos & Busca Global:** Destaque os campos de maior risco operacional ou pesquise qualquer código/termo entre os 5 modelos.

## Stack utilizada

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [JsBarcode](https://lindell.me/JsBarcode/) (código de barras Code-128 real) & [qrcode.react](https://zpao.github.io/qrcode.react/) (QR Code real)
- [Lucide Icons](https://lucide.dev/)

## Como rodar localmente

```bash
npm install
npm run dev
```
