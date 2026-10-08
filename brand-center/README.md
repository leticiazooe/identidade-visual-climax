# CLIMAX · Brand Center Mestre

Versão: 2.0  
Última revisão: 2026-10-07

Este diretório é o sistema operacional da marca CLIMAX Refrigeração.

## Núcleos

- `sections/brand-book.html` — Brand Book Mestre.
- `sections/downloads.html` — biblioteca oficial de assets.
- `sections/tokens.html` + `data/tokens.css` + `data/tokens.json` — Design Tokens.
- `sections/ui-system.html` + `data/ui.css` — UI / Digital Design System.
- `sections/editorial.html` + `editorial/` — sistema editorial e conteúdo.
- `sections/motion-production.html` + `motion-production/` — pacote de motion para produção.
- `sections/production-templates.html` + `templates/` — templates realmente editáveis.

## Automatizar Posts

O [Studio Social](post-studio/index.html) reutiliza logos e mascotes oficiais e organiza os presets, formatos e cores em arquivos JSON. Há edição de conteúdo e exportação PNG/JPEG/ZIP.

O [pacote Remotion](../motion/remotion/README.md) gera vídeos longos em React/TypeScript. Os MP4s devem ser renderizados antes da publicação.

## Masters visuais

Os logos e mascotes oficiais continuam em `../assets/`; não são duplicados aqui.

## Regra

Qualquer atualização relevante de identidade deve manter sincronizados o Brand Book, os tokens, os componentes e os templates afetados.
