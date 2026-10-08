# Arquitetura do módulo Automatizar Posts

Última revisão: 2026-10-07

## Camadas
1. Configuração de marca: brand-center/post-studio/brand.config.json.
2. Conteúdo editorial: brand-center/post-studio/posts.json.
3. Dimensões de plataforma: brand-center/post-studio/formats.json.
4. UI e layout: index.html, studio.css.
5. Estado e exportação: studio.js.
6. Vídeo: motion/remotion/ (React/TypeScript independente).

## Preservação
O Brand Center original usa a mesma estrutura de navegação; o oitavo item abre o módulo novo no iframe. wrangler.jsonc permanece inalterado.

## Riscos e débitos
- CDNs externas para Tailwind, html2canvas e fflate; migrar para build local.
- render DOM para imagem requer verificação visual em vários navegadores.
- logos/mascotes devem estar disponíveis antes de exportar.
- filme Remotion precisa de npm install, render e QA para MP4.
- publicação direta no Instagram/Facebook/WhatsApp exige API oficial e autenticação.