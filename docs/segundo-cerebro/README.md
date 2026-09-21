# Segundo cérebro — Identidade Visual CLIMAX

Última revisão: 2026-09-21

Este diretório é a fonte documental de continuidade do repositório de identidade visual da CLIMAX Refrigeração. A auditoria inicial foi feita sobre a branch main no commit 1e0073a2ad48ae72980967dfb31f7a6ff82f0ced.

## Estado resumido

O repositório é atualmente um acervo de ativos visuais, não uma aplicação de software. Há 10 mascotes em PNG e 8 arquivos de logo em PNG/SVG. Não foram localizados código-fonte executável, banco de dados, autenticação, pipelines, testes automatizados, configuração de deploy ou pasta de paleta de cores na branch main auditada.

Os SVGs confirmam o uso recorrente de:
- azul institucional: #0B5BA5;
- branco: #FFFFFF;
- branco/cinza muito claro: #F1F2F2.

A existência desses valores nos SVGs é evidência técnica de uso, mas não substitui uma especificação formal de paleta. A definição oficial da paleta permanece **PRECISA DE VALIDAÇÃO HUMANA** enquanto não houver um arquivo dedicado de brand guide/paleta versionado.

## Como ler

Comece por:
1. [00 — Índice geral](00-indice-geral.md)
2. [01 — Visão executiva](01-visao-executiva.md)
3. [03 — Estado atual](03-estado-atual.md)
4. [07 — Módulos e funcionalidades](07-modulos-e-funcionalidades.md)
5. [26 — Mapa de evidências](26-mapa-de-evidencias.md)
6. [25 — Guia para próxima conversa](25-guia-para-proxima-conversa.md)

## Estados documentais

- **IMPLEMENTADO**: existe evidência direta no repositório.
- **PARCIAL**: existe parte da entrega, mas falta cobertura ou padronização relevante.
- **PLANEJADO**: intenção registrada, sem implementação comprovada.
- **QUEBRADO**: evidência de falha funcional.
- **LEGADO**: material mantido por histórico, mas não vigente.
- **NÃO LOCALIZADO**: procurado na branch auditada e não encontrado.
- **PRECISA DE VALIDAÇÃO HUMANA**: não é possível concluir apenas pelo repositório.

## Protocolo de atualização

Após cada mudança relevante:
- atualizar o estado do módulo afetado;
- registrar decisões importantes em um ADR;
- registrar bugs relevantes e suas correções;
- manter roadmap, riscos e changelog sincronizados;
- atualizar a data “Última revisão” nos arquivos alterados;
- revisar itens PARCIAL, QUEBRADO e PRECISA DE VALIDAÇÃO HUMANA;
- nunca apagar decisões antigas: marcá-las como substituídas e apontar a decisão nova;
- registrar um resumo curto do que mudou e por quê.

## Automação sugerida

Semanalmente, comparar a branch principal com o último commit registrado em [27 — Changelog](27-changelog-segundo-cerebro.md), identificar arquivos de assets, documentação ou configuração alterados, atualizar somente os documentos afetados e abrir um Pull Request para revisão humana. Evitar merge automático.
