# CLIMAX · Automatizar Posts

Versão: 1.0.0
Última revisão: 2026-10-07

## Escopo
Editor de posts estáticos para Instagram, Facebook e WhatsApp. Os assets vêm do repositório oficial, sem cópias extras no módulo.

## Fontes anexadas para migração
- climax-conteudo-profissional-unico-v2.html: fonte dos 14 modelos, legendas e mascotes.
- climax-conteudo-7-dias-instagram.html: calendário-base de sete dias.
- post-manutencao-preventiva-climax-oficial.html: estudo alternativo de layout.

## Estrutura
- index.html: interface e controles.
- studio.css: composição gráfica adaptativa, com utilitários Tailwind.
- studio.js: estado, edição, preview, exportação e persistência.
- posts.json: 14 presets completos.
- formats.json: 7 formatos e áreas seguras.
- brand.config.json: configuração reutilizável.

## Funcionalidades
- Troca de modelo, layout e mascote.
- Edição de título, descrição, benefícios, CTA e legenda.
- Instagram 4:5, 1:1 e Story/Reel 9:16.
- Facebook 1:1 e 1200x630.
- WhatsApp Status 9:16 e compartilhar 1:1.
- Guia de área segura, exportação PNG/JPEG em tamanho real.
- Exportação da primeira semana em ZIP, cópia de legenda e JSON.
- Rascunho salvo em localStorage.

## Executar
Sem build obrigatório: a aplicação é servida junto com o Brand Center no Cloudflare. Para executar localmente, na raiz do repositório:

    python -m http.server 8000

Abra http://localhost:8000/brand-center/post-studio/ . O protocolo file:// não é compatível com fetch de JSON.

## Dependências
Tailwind CSS Browser v4 (utilitários no editor), html2canvas 1.4.1 (imagens), fflate 0.8.2 (ZIP) e Google Fonts. O CSS local mantém a base visual quando Tailwind estiver indisponível. Antes de produção intensiva, compilar o Tailwind e empacotar dependências para eliminar as CDNs.

## Limitações
- Automação de criação/exportação; não publica diretamente em redes sociais.
- Campos são armazenados apenas no navegador.
- Sem fila agendada, login ou integração com APIs sociais.
- Revisar manualmente conteúdo técnico, margens e informações comerciais.
- Validar a exportação em um navegador conectado, pois esta revisão não executou render real.

## Próximos passos
Compilação do Tailwind, testes screenshot por formato, API para programação de posts com OAuth e auditoria de contraste.