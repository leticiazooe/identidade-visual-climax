# CLIMAX Studio — fluxo guiado de produção

Última revisão: 2026-10-13.

## Para quem vai produzir um vídeo pela primeira vez

Abra **Brand Center → 06 Criar Vídeo**. O novo módulo concentra o fluxo em quatro telas:

1. **Motion** — filme institucional de 68,4 segundos e formato (16:9, 9:16, 4:5 ou 1:1). A prévia ilustrativa carrega o source de motion na própria CLIMAX, sem incorporar GitHub.
2. **Narração** — escolha ElevenLabs, gravação própria ou sem locução; veja o roteiro de oito cenas e baixe o JSON, caso precise.
3. **Sons** — ative/desative música e efeitos, ajuste volumes e consulte a lista de nove efeitos.
4. **Finalizar** — revise escolhas, copie comandos necessários e selecione um MP4 renderizado para reproduzir e baixar.

Não há chave de API no navegador. O editor salva apenas as preferências de criação no navegador e não faz chamadas pagas a APIs externas.

## Como produzir um MP4 real

O Brand Center é estático. Não gera vídeos Remotion diretamente no navegador. Após selecionar suas opções, vá à etapa **Finalizar** e copie os comandos adequados. Será necessário um computador com Node.js, FFmpeg, arquivos de áudio para a opção de voz escolhida e acesso às ferramentas de produção.

Se escolher ElevenLabs, a geração de locuções e efeitos pode consumir créditos. O script exige `--generate` para autorização explícita.

Depois do render, utilize o campo **Já renderizou?** e escolha o MP4 final. O botão de download só é habilitado quando há um arquivo carregado ou URL HTTPS publicada no manifesto `brand-center/data/final-exports.json`. O arquivo local não é enviado a um servidor.

## Preservação

- Os manifests originais e os roteiros existentes permanecem intactos.
- Os módulos técnicos `sections/motion-production.html` e `sections/audio-production.html` continuam disponíveis por links **avançados**, sem aparecerem como etapas concorrentes do menu.
- O fluxo é desacoplado em `production-studio/index.html`, `studio.css` e `studio.js`.
- O script `render-final.mjs` ganhou modo `silent`, permitindo gerar vídeo sem narração, mas com música/efeitos opcionais, sem exigir takes inexistentes.

## Validação

Playwright: etapas, navegação, oito cenas, nove efeitos, seleção de formato, export JSON, coerência dos comandos, preview local, download condicionado e responsividade.
GitHub Actions: a regressão audiovisual valida render curto com locução e sem locução.

### Estado real

O código e a prévia estão disponíveis na CLIMAX. A geração de narrações e efeitos ElevenLabs reais depende de conta/créditos e consentimento do operador. Nenhum MP4 final narrado será apresentado como existente sem renderização e publicação.
