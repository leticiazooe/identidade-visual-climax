# CLIMAX · Brand Center / Brand Book Mestre

Versão: 2.2
Última revisão: 2026-10-07

Este diretório é o sistema operacional da marca **CLIMAX Refrigeração**: identidade, implementação digital, conteúdo, produção e governança.

## Núcleos

- `sections/brand-book.html` — Brand Book Mestre.
- `sections/downloads.html` — biblioteca oficial de assets.
- `sections/tokens.html`, `data/tokens.css`, `data/tokens.json` — Design Tokens.
- `sections/ui-system.html`, `data/ui.css`, `data/component-manifest.json` — UI / Digital Design System.
- `sections/editorial.html`, `editorial/` — sistema editorial e conteúdo.
- `sections/motion-production.html`, `motion-production/` — pacote de motion para produção.
- `sections/production-templates.html`, `templates/` — templates realmente editáveis.
- `post-studio/index.html` — módulo **Automatizar Posts**, com editor multiformato.

## Biblioteca oficial

Os catálogos estruturados estão em:

- `data/assets-manifest.json` — logos, mascotes e arquivos de produção;
- `data/brand-kit.json` — integração com o Studio e motion em outros projetos;
- `templates/metadata/template-manifest.json` — templates e formatos;
- `motion-production/motion-manifest.json` — clips, resoluções e specs de export;
- `data/component-manifest.json` — componentes, estados e acessibilidade.

## Automatizar Posts

O [Studio Social](post-studio/index.html) usa os logos e mascotes oficiais e organiza os 14 presets em `post-studio/posts.json`, as sete proporções em `post-studio/formats.json` e a identidade em `post-studio/brand.config.json`.

Permite editar textos, benefícios e CTA; compor para Instagram, Facebook e WhatsApp; exportar PNG/JPEG/ZIP e salvar rascunho local. **Não publica automaticamente nas redes sociais.**

## Motion de produção

O [pacote Remotion](../motion/remotion/README.md) contém um filme institucional de oito cenas (68,4 segundos) para 16:9, 9:16, 4:5 e 1:1, com React e TypeScript. Vídeos MP4 são produzidos no pipeline GitHub Actions e devem passar por aprovação visual antes da distribuição.

## Templates Office

O repositório contém um PPTX master e um RTF/Word master. `templates/office/generate-office-templates.html` gera PPTX e DOCX editáveis diretamente no navegador, com texto, formas, headings e tabelas.

## Fundamentos digitais

- Master Blue: `#0B5BA5`
- Master White: `#F1F2F2`
- Navy: `#042F4C`
- Ice: `#8DE8F7`
- Display: League Spartan
- Texto/UI: Inter
- Base mínima de leitura: 16 px
- Grid de espaçamento: 4 px

## Governança

Os logos e mascotes oficiais continuam em `../assets/`, sem duplicação.

Mudanças em masters visuais, tipografia, tokens globais, componentes base, regras editoriais ou motion devem ser versionadas e revisadas antes de substituir as versões vigentes.

Mantenha o Brand Book, os tokens, a biblioteca, os componentes, os templates e o editor sincronizados após mudanças relevantes.

## Estúdio de Áudio e Locução

- [Estúdio de Áudio](sections/audio-production.html): editor de roteiro por oito cenas, cronologia, exportação JSON e cue-sheet CSV.
- [Manifest de voz](data/audio-production.json): roteiros, interpretação, mixagem e trilha.
- [CLI ElevenLabs, Audition e Remotion](../motion/remotion/README.md): produção de takes, export para mixagem e render de vídeo narrado.

**Segurança:** a chave ElevenLabs fica somente no terminal local; o site público nunca solicita ou grava credenciais. O Audition opera por arquivos WAV, sem alegar edição remota automática.
