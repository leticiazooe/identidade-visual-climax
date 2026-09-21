# 04 — Arquitetura

Última revisão: 2026-09-21

## Arquitetura atual

A arquitetura é de **repositório estático de assets**:

- README.md: entrada humana e catálogo resumido;
- assets/logos/: variantes do logotipo;
- assets/mascotes/: personagens e poses;
- docs/segundo-cerebro/: conhecimento operacional e histórico.

Não existem camadas de frontend, backend, banco, API, fila, worker, desktop ou mobile.

## Persistência

A persistência é o próprio Git: cada arquivo é versionado por blob, tree e commit. O histórico de commits funciona como trilha de evolução.

## Comunicação entre componentes

Não há comunicação em runtime. Consumidores externos usam os arquivos diretamente por download, cópia ou referência no GitHub.

## Concorrência e recuperação

A concorrência é a do Git. Conflitos podem ocorrer se duas pessoas alterarem o mesmo arquivo de documentação ou substituírem o mesmo asset. A recuperação depende do histórico de commits.

## Ponto de atenção

Arquivos binários PNG não geram diffs semânticos úteis. Para alterações relevantes, o commit e o changelog devem explicar exatamente o que mudou visualmente.
