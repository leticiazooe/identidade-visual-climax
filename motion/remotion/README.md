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


## Produção de áudio / Voice Studio

Camadas disponíveis no Remotion:
- **silent** (padrão): filme existente sem áudio, para manter CI e renders anteriores compatíveis.
- **stems**: 8 locuções individuais alinhadas aos frames das cenas; trilha e SFX opcionais.
- **master**: mix final WAV 48kHz exportado pelo Adobe Audition.

### ElevenLabs (API segura no CLI)

1. Configure as variáveis \`ELEVENLABS_API_KEY\` e \`ELEVENLABS_VOICE_ID\` no terminal local (arquivo \`.env\` não é carregado automaticamente e nunca deve ser versionado).
2. \`npm run voice:plan\`: revisa roteiro e alinhamento sem chamadas à API.
3. \`npm run voice:list\`: lista vozes disponíveis na sua conta.
4. \`npm run voice:generate -- --scene=care --generate\`: uma cena; consome créditos.
5. \`npm run voice:generate -- --all --generate\`: todas as cenas; consome créditos.

Para consumir um roteiro personalizado exportado pelo editor web, use:
\`npm run voice:generate -- --manifest=/CAMINHO/CLIMAX-VOICE-PROJECT.json --all --generate\`.

### Audition (handoff nativo e mixagem)

Após gerar as 8 locuções, execute \`npm run audition:prepare\` (necessário FFmpeg + ffprobe).
Será criada uma pasta local \`audio-workspace/audition/\` com WAVs 48kHz, voiceover-aligned.wav, cue-sheet.csv e instruções de edição.

O Audition deve ser usado para criar e salvar a sessão nativa \`.sesx\`, equalização, compressão e mixagem. Não é anunciada integração direta com uma API inexistente do Audition.

Exporte \`04-mixdown/final-mix.wav\` estéreo 48kHz/24bit e execute \`npm run audition:import\`.

### Renderização

- \`npm run render:audio:wide -- --mode=stems\`
- \`npm run render:audio:vertical -- --mode=stems\`
- \`npm run render:audio:wide -- --mode=master\`
- \`npm run render:audio:portrait -- --mode=master\`

\`--mode=stems\` exige as oito vozes; \`--mode=master\` exige a mixagem final.
As locuções e o mix final ficam no diretório local \`public/audio/\` (gitignored), nunca no GitHub.

### Direitos, qualidade e segurança

- ElevenLabs é pago por uso/plano; o CLI exige \`--generate\` explícito.
- Não armazenar chaves em JS de navegador, repositório, commits ou JSON público.
- Usar voz própria/licenciada e obter consentimento específico para clonagem de voz.
- Selecionar música e efeitos com licenças comerciais documentadas.
- Conferir tempos da fala, pronúncia, mixagem, loudness/true peak e áreas seguras antes de publicar.
- Os scripts sem chave são testados na CI; chamadas cobradas dependem de credenciais do proprietário.
