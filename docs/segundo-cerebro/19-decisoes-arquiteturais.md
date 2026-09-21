# 19 — Decisões arquiteturais

Última revisão: 2026-09-21

## ADR-0001 — GitHub como fonte de verdade dos ativos

Status: **IMPLEMENTADO por prática atual**.

Evidência: o repositório contém os ativos e histórico de evolução. Não existe storage alternativo versionado no projeto.

Consequência: mudanças devem ser rastreáveis por commit; nomes e organização de arquivos tornam-se parte da governança.

## ADR-0002 — Manter PNG e SVG para logos

Status: **IMPLEMENTADO**.

Evidência: cada uma das quatro variações observadas possui versão PNG e SVG.

Benefício: cobre consumo raster e vetorial.

## ADR-0003 — Mascotes em PNG

Status: **IMPLEMENTADO**.

Evidência: 10 assets em assets/mascotes/.

Ponto aberto: não foram localizadas versões vetoriais/editáveis dos mascotes.

Novas decisões devem usar o template [decisao-adr.md](templates/decisao-adr.md).
