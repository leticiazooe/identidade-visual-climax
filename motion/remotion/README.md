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


## Pipeline cinematográfico de áudio

Consulte [docs/audio-production.md](../../../docs/audio-production.md) para ElevenLabs, entrega Audition, mixagem e Remotion.

## Exportação final: motion + narração + música ambiente

**Entrega única:** um MP4 H.264 com áudio AAC, 68,4 segundos, nas proporções oficiais.

Depois de gerar as oito locuções ElevenLabs (ou gravadas por locutor), execute:

```bash
cd motion/remotion
npm install
npm run music:generate
npm run final:render -- --format=wide --music=original --music-volume=0.16
npm run final:render -- --format=vertical --music=original --music-volume=0.16
```

A faixa `CLIMAX Ambient Original` é criada proceduralmente, sem amostras externas. É uma base musical leve, pensada como opção inicial. Ouça e faça aprovação artística antes de divulgar.

Para usar trilha própria com licença comercial:

```bash
npm run final:render -- --format=portrait --music=/caminho/para/trilha-licenciada.mp3 --music-volume=0.13
```

O comando converte a trilha para WAV local e faz ducking durante as falas; `--music-volume` aceita 0.00 a 0.32. Os MP4s ficam em `motion/remotion/out/climax-final-[proporção].mp4`, e são validados com FFprobe.

Para quem finaliza no Adobe Audition, o WAV exportado já deve incluir voz e música; não se deve duplicar a trilha:

```bash
npm run audition:import
npm run final:render -- --format=wide --mode=master --music=off
```

### Botão Baixar MP4 no Brand Center

O módulo 09 permite escolher o formato, controlar o volume da trilha, pré-visualizar e baixar o MP4 final. Como o Brand Center é um site estático, não há renderização de vídeo no navegador: o botão depende de um arquivo final já renderizado.

- **Arquivo local:** selecione o MP4 final no campo do editor; a prévia aparece e o botão baixa esse arquivo sem upload.
- **Arquivo publicado:** opcionalmente publique o vídeo como um asset de GitHub Release após aprovação.

```bash
# requer GitHub CLI (gh) já autenticado e permissão para releases
npm run final:publish -- --format=wide --tag=climax-motion-final-v1 --publish
```

O comando faz o upload do MP4 e registra o link em `brand-center/data/final-exports.json`. Depois revise a mudança e versione o JSON para habilitar o botão público. Não inclui MP3s privados, projetos Audition ou chaves de API.

**Situação inicial:** manifesto `awaiting-render` sem links ativos. Nenhum vídeo com locução real foi gerado até que a conta ElevenLabs e os takes sejam configurados.

## Sound design contextual com ElevenLabs

**Direção audiovisual CLIMAX:** HVAC realista, tecnológico e discreto. Não há efeitos estridentes, tempestades, gelo ou alarmes. O manifesto [sound-design.json](../brand-center/data/sound-design.json) mapeia **9 efeitos únicos e 11 entradas sonoras em oito cenas**, com prompts em inglês para facilitar o controle de timbre, duração, volumes e momentos de entrada.

| Cena | Efeitos previstos |
|---|---|
| A assinatura | Entrada aérea e brilho delicado da marca |
| O desconforto | Ambiência térmica contida, sem dramatização |
| Diagnóstico técnico | Click de instrumento e varredura técnica discreta |
| Manutenção preventiva | Ferramenta metálica cuidadosamente manuseada |
| Fluxo de ar | Ar climatizado natural e contínuo |
| Soluções CLIMAX | Três transições de cards usando um único efeito reutilizado |
| Padrão profissional | Confirmação sonora acolhedora |
| Chamada para ação | Assinatura sonora final calorosa |

### Gerar efeitos em ElevenLabs (usa créditos)

Requer ELEVENLABS_API_KEY em variável de ambiente e permissões de sound generation na conta. Nunca coloque a chave no Brand Center ou GitHub.

```bash
cd motion/remotion
npm run sfx:plan
npm run sfx:generate -- --asset=cool-airflow --generate
npm run sfx:generate -- --all --generate
npm run sfx:check -- --files
```

O comando gera MP3s em `motion/remotion/public/audio/sfx` (não versionados). A API é POST `/v1/sound-generation`, modelo `eleven_text_to_sound_v2`, duração definida por efeito, `prompt_influence=0.48`, com geração condicionada à opção `--generate`. Os créditos dependem do plano. O sistema **não executa pagamentos nem gera sons sem autorização**.

Na interface 09 há edição dos prompts, duração, volume, reprodução de takes locais e exportação `CLIMAX-SOUND-DESIGN.json`. Para usar esse roteiro editado com o motor Remotion, revise o arquivo exportado e substitua `brand-center/data/sound-design.json` antes de gerar/renderizar, preservando `assetId`, `scene` e `filename`.

### Vídeo final com todas as camadas

```bash
npm run final:render -- --format=wide --music=original --music-volume=0.16 --sfx=on --sfx-volume=0.75
npm run final:render -- --format=vertical --music=original --music-volume=0.16 --sfx=on --sfx-volume=0.75
```

O áudio fica em três camadas: voz em primeiro plano, música ambiente com ducking e SFX com volume independente, fade-in/fade-out e atenuação adicional durante falas. O script verifica os nove arquivos de efeitos antes de iniciar: se algum não existir, informa quais faltam e não produz um MP4 incompleto.

Use `--sfx=off` para um render sem efeitos. Em `--mode=master`, presume-se que a trilha completa já foi mixada no Audition; não duplica SFX no Remotion.

**Revisão obrigatória:** ouvir todos os efeitos, confirmar adequação às cenas, conferir a mixagem e os direitos de uso comercial. A documentação oficial da ElevenLabs descreve os controles de geração e o custo associado à duração. O MP4 completo com efeitos reais depende da conta e aprovação humana.

Documentação API: https://elevenlabs.io/docs/api-reference/text-to-sound-effects/convert
