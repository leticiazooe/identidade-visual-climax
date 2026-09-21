# 10 — Dados e banco

Última revisão: 2026-09-21

**Estado: NÃO LOCALIZADO**

Não há banco de dados, migrations, seeds, schema, RLS, storage gerenciado ou modelos persistentes de aplicação.

Os “dados” do projeto são arquivos versionados pelo Git e seus metadados:
- caminho;
- nome;
- extensão;
- tamanho;
- hash/blob SHA;
- commit de introdução ou alteração.

## Retenção

O histórico Git é a retenção efetiva. Remover um arquivo da branch não o elimina automaticamente do histórico.

## Recomendação

Se surgir um catálogo estruturado de assets, considerar um manifesto versionado em JSON/YAML com identificador, categoria, variante, formato, cor, uso, status e data de aprovação.
