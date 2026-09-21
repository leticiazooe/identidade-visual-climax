# 06 — Estrutura do repositório

Última revisão: 2026-09-21

Estrutura auditada antes da criação deste segundo cérebro:

    /
    ├── README.md
    └── assets/
        ├── logos/
        │   ├── ESCRITA AZUL PNG.png
        │   ├── ESCRITA AZUL SVG.svg
        │   ├── ESCRITA BRANCA PNG.png
        │   ├── ESCRITA BRANCA SVG.svg
        │   ├── LOGO AZUL - ESCRITA BRANCA.png
        │   ├── LOGO AZUL - ESCRITA BRANCA.svg
        │   ├── LOGO FUNDO BRANCO - ESCRITA AZUL.png
        │   └── LOGO FUNDO BRANCO - ESCRITA AZUL.svg
        └── mascotes/
            └── 10 arquivos PNG numerados de 01 a 10

Após este trabalho, docs/segundo-cerebro/ passa a concentrar a documentação.

## Observações

- nomes de logos usam espaços, maiúsculas e caracteres descritivos; funcionam no Git, mas exigem URL encoding em links;
- mascotes seguem nomenclatura mais previsível, com prefixo numérico e slug;
- não existe pasta assets/paletas-cores/ na main auditada;
- não existem diretórios de aplicação, teste, infraestrutura ou CI.
