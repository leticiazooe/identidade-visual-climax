# CLIMAX — Produção de Voz e Sound Design

Revisado em 2026-10-08.

## Fluxo profissional

1. O Estúdio de Áudio em brand-center/sections/audio-production.html edita os oito roteiros e exporta JSON e cue-sheet CSV.
2. O CLI ElevenLabs produz oito takes de locução em MP3 sem expor a chave no navegador.
3. O comando audition:prepare cria WAVs 48 kHz/24bit, voz alinhada à timeline e guia para sessão nativa SESX no Adobe Audition.
4. No Audition, edite pausas, EQ, compressão, de-esser, automação de volume, mixagem e loudness.
5. Após mixar, audition:import entrega o WAV final ao Remotion para gerar MP4 nos formatos oficiais.

## Instalação

Requer Node.js 22, FFmpeg e ffprobe.

```bash
cd motion/remotion
npm install
npm run voice:plan
npm run audio:check
```

Configure ELEVENLABS_API_KEY e ELEVENLABS_VOICE_ID no terminal local. Nunca coloque esses valores no repositório ou no HTML público.

```bash
npm run voice:list
npm run voice:generate -- --scene=signature --generate
npm run voice:generate -- --all --generate
```

A geração consome créditos ElevenLabs; o script exige a opção --generate explicitamente. É possível gerar uma única cena, e tomadas existentes não são sobrescritas sem --force.

Um roteiro exportado pela interface pode ser gerado com:

```bash
npm run voice:generate -- --manifest=/caminho/CLIMAX-VOICE-PROJECT.json --all --generate
```

## Audição, mixagem e mastering

```bash
npm run audition:prepare
```

Abra audio-workspace/audition/README-AUDITION.md. Importar WAVs, cue-sheet e música licenciada na sessão Audition; editar e exportar 04-mixdown/final-mix.wav.

```bash
npm run audition:import
npm run render:audio:wide -- --mode=master
npm run render:audio:vertical -- --mode=master
```

Render de locuções individuais sem mixagem final no Audition:

```bash
npm run render:audio:wide -- --mode=stems
```

## Diretrizes

- O áudio de voz só é autorizado quando houver chave e seleção de voz adequada ao uso comercial.
- Clonagem exige consentimento explícito e direitos adequados.
- Música e efeitos exigem autorização e licença para uso comercial.
- Revisar pronúncia de CLIMAX, temperatura, termos técnicos, tempos de cena, dinâmica, pausas e verdadeiro pico.
- O alvo do projeto é -16 LUFS integrado e -1,5 dBTP; esse número só é validado após medição da mixagem real.
- A integração Audition é uma entrega de arquivos; não é automação remota do aplicativo.
- Os materiais de voz e mixagem ficam privados e fora do Git.
- O comando original render:wide mantém o vídeo sem áudio; não quebra os projetos existentes.

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
