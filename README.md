# PromptStyle Hub

Aplicação estática navegável do PromptStyle Hub: uma biblioteca de presets visuais com Builder determinístico.

## Executar

Abra `dist/index.html` no navegador ou publique a pasta `dist` como site estático.

## Motor de composição

- Presets têm `role`, termos de busca e fragmento de prompt.
- A ordem canônica é determinada pelo papel funcional, portanto a ordem do clique não altera o resultado.
- Formato, plataforma, marketplace e fundo são exclusivos no Builder.
- Conflitos de fundo são bloqueados antes de entrar na combinação.
- “Completar combinação” consulta somente receitas pré-validadas presentes na biblioteca.

## Evolução para produção

O domínio de dados está estruturado no script como `P` (presets) e `R` (receitas). Em uma implantação full-stack, mova estas coleções para Prisma/PostgreSQL e preserve as funções `canonical`, `valid` e `compose` como serviços de domínio, acionando o gerador em uma tarefa de manutenção.

## Gemini Style — Biblical Prompt Style

Página `dist/gemini-style.html` (link "✦ Gemini Style" no menu do Hub). Biblioteca de 232 códigos bíblicos reutilizáveis em 31 categorias, cada um com ilustração (`dist/gemini/illus.js`: motivos SVG reutilizáveis), independente dos presets do Hub (nada foi substituído).

- `dist/gemini/data.js`: catálogo (`SECTIONS`), menu (`VIEWS`), combinações (`COMBOS`, `DARK_COMBOS`) e regras globais. **Para expandir, basta adicionar linhas/itens aqui.** Cada código vira `{code, name, category, description, prompt, tags, compatibleWith, examples, featured}`.
- `dist/gemini/engine.js`: parser (`Davi /cinematic /9:16`), exclusividade de formato, composição coerente do prompt, busca por tags/sinônimos, recomendação, "Criar para mim" e construtor guiado. Testável em Node (`require`).
- `dist/gemini/app.js` + `style.css`: interface sem handlers inline; favoritos e combinações próprias (criar/editar/duplicar/excluir) em `localStorage`.

Correções no Hub: `showRecipes()` implementada, presets `/blackbg` e `/transparent` criados (já eram referenciados nos conflitos) e CSP liberando `fonts.googleapis.com`.
