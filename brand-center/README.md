# CLIMAX · Brand Center / Brand Book Mestre

Versão: 2.1  
Última revisão: 2026-10-07

Este diretório é o sistema operacional da marca **CLIMAX Refrigeração**: identidade, implementação digital, conteúdo, produção e governança.

## Núcleos

- `sections/brand-book.html` — Brand Book Mestre.
- `sections/downloads.html` — biblioteca oficial de assets.
- `sections/tokens.html` + `data/tokens.css` + `data/tokens.json` — Design Tokens.
- `sections/ui-system.html` + `data/ui.css` + `data/component-manifest.json` — UI / Digital Design System.
- `sections/editorial.html` + `editorial/` — sistema editorial e conteúdo.
- `sections/motion-production.html` + `motion-production/` — pacote de motion para produção.
- `sections/production-templates.html` + `templates/` — templates realmente editáveis.

## Biblioteca oficial

O catálogo estruturado está em:

- `data/assets-manifest.json` — logos, mascotes e fontes de produção;
- `templates/metadata/template-manifest.json` — templates e formatos;
- `motion-production/motion-manifest.json` — clips, resoluções e regras de export;
- `data/component-manifest.json` — componentes, estados e acessibilidade.

## Masters visuais

Os logos e mascotes oficiais continuam em `../assets/`; não são duplicados aqui.

## Templates Office

O repositório contém um PPTX master e um RTF/Word master. Além disso, `templates/office/generate-office-templates.html` gera **PPTX e DOCX editáveis diretamente no navegador**, com texto, shapes, headings e tabelas editáveis.

## Fundamentos digitais

- Master Blue: `#0B5BA5`
- Master White: `#F1F2F2`
- Navy: `#042F4C`
- Ice: `#8DE8F7`
- Display: League Spartan
- Texto/UI: Inter
- Base mínima de leitura: 16 px
- Grid de spacing: 4 px
- Motion: 140–900 ms

## Governança

Mudanças em master de logo, cor institucional, tipografia global, personagem, tokens, componentes base, regras editoriais ou motion devem ser versionadas e revisadas antes de substituir a referência vigente.

Qualquer atualização relevante de identidade deve manter sincronizados o Brand Book, os tokens, os componentes, a biblioteca e os templates afetados.
