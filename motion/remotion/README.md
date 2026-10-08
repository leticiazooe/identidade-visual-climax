# CLIMAX · Motion Production (Remotion)

Pacote de vídeo autoral para a CLIMAX Refrigeração, feito em React/TypeScript e Remotion. São **oito cenas** com cerca de **68,4 segundos**, transições, kinetic typography, animação de ar, composição vetorial de ar-condicionado, cards e mascotes oficiais.

## Composições

- \`CLIMAX-Film-16x9\` — 1920×1080
- \`CLIMAX-Film-9x16\` — 1080×1920
- \`CLIMAX-Film-4x5\` — 1080×1350
- \`CLIMAX-Film-1x1\` — 1080×1080

Todos a 30 FPS, sem áudio incorporado. A trilha e os efeitos sonoros precisam ser licenciados e revisados antes da publicação.

## Executar

Requer Node.js 20+ e \`npm\`:

\`\`\`bash
cd motion/remotion
npm install
npm run validate
npm run studio
\`\`\`

## Exportar

\`\`\`bash
npm run render:wide
npm run render:vertical
npm run render:portrait
npm run render:square
\`\`\`

Os arquivos MP4 serão escritos em \`motion/remotion/out/\`. Renderizar requer Chrome/Chromium e FFmpeg conforme os requisitos da versão do Remotion.

## Estrutura

- \`film.config.json\` — roteiro, cenas, duração, proporções, política de publicação.
- \`src/ClimaxFilm.tsx\` — composições cinematográficas.
- \`src/Root.tsx\` — quatro formatos.
- \`scripts/sync-assets.mjs\` — copia logos e mascotes oficiais para a pasta pública de build, sem duplicação versionada.
- \`scripts/validate.mjs\` — valida roteiro e duração.
- \`public/\` — pasta **gerada localmente**, não commitada.

## Fontes oficiais

O pacote carrega League Spartan e Inter por @remotion/google-fonts antes de renderizar, evitando substituição tipográfica no vídeo. Requer conexão à internet durante a primeira renderização ou fontes disponíveis em cache.

## Regras de qualidade

- Evitar bounce, flashes e partículas aleatórias que prejudiquem leitura.
- Animações determinísticas por frame com spring, interpolate e @remotion/transitions.
- Manter as composições adequadas à proporção, não apenas cortar um 16:9.
- Não adicionar imagens ou áudio externos sem licença adequada.
- Revisar texto técnico e margens seguras antes de renderizar para cliente.

### Referências técnicas

- https://www.remotion.dev/docs/transitioning
- https://www.remotion.dev/docs/sequence
- https://www.remotion.dev/docs/animation
- https://www.remotion.dev/docs/options/public-dir
