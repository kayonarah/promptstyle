# PromptStyle

🌐 **Site no ar:** [mpjservice.com/promptstyle](https://mpjservice.com/promptstyle/) · [Gemini Style](https://mpjservice.com/promptstyle/gemini-style.html)

Sistema estático com duas bibliotecas de códigos de prompt no **mesmo modelo** (mesma interface, mesma arquitetura):

| Biblioteca | Página | Conteúdo |
|---|---|---|
| **PromptStyle Hub** | `dist/index.html` | 48 presets visuais e 8 receitas validadas (produto, marketplace, marketing, fotografia, infantil…) |
| **Gemini Style** | `dist/gemini-style.html` | 232 códigos bíblicos em 31 categorias (estudo, imagem, vídeo, narração, sermões…) |

## Executar

Abra `dist/index.html` no navegador (ou sirva a pasta `dist` como site estático). Para testar localmente com todos os arquivos relativos: `python -m http.server` dentro de `dist`.

## Arquitetura

```
dist/
  index.html, gemini-style.html   páginas (mesmo HTML; muda só a biblioteca carregada e o tema)
  core/app.js                     interface compartilhada (menu, cards, construtor, busca, favoritos, combinações próprias)
  core/illus.js                   ilustrações SVG por código (motivos reutilizáveis)
  core/style.css                  estilos e temas (violeta = Hub, dourado = Gemini Style)
  promptstyle/  presets.js        dados originais [code, nome, papel, descrição, palavras-chave, fragmento]
                data.js           catálogo no formato {code,name,category,description,prompt,tags,compatibleWith,examples,featured}
                engine.js         motor do Hub: ordem canônica por papel, papéis exclusivos, conflitos de fundo, completar combinação
  gemini/       data.js, engine.js  catálogo e motor bíblico (parser, composição coerente, regras de fidelidade e imagem)
```

Cada `engine.js` expõe `window.GS_LIB = { id, D, G, ui }`; o `core/app.js` só conhece essa interface. Para adicionar uma terceira biblioteca basta criar `data.js` + `engine.js` e uma página nova.

### Regras do Hub (preservadas)
- A ordem canônica é determinada pelo papel funcional; a ordem do clique não altera o resultado.
- Formato, plataforma, marketplace e fundo são exclusivos (o novo substitui o anterior).
- Conflitos de fundo (`/whitebg`, `/blackbg`, `/transparent`) são bloqueados.
- “Completar combinação” consulta somente receitas pré-validadas.

### Como expandir
- **Novo preset do Hub:** uma linha em `promptstyle/presets.js` (e, se preciso, um motivo em `core/illus.js`).
- **Novo código bíblico / categoria:** uma linha em `gemini/data.js` (`SECTIONS`, `VIEWS`, `COMBOS`).
- Favoritos e combinações próprias ficam no `localStorage` (separados por biblioteca).

## Publicação

O site é 100% estático. Para a Hostinger, envie o conteúdo de `dist/` para `public_html/promptstyle/`.

## Autoria e licença

© 2026 [kayonarah](https://github.com/kayonarah). Código aberto para **consulta e compartilhamento com crédito**, licenciado sob [CC BY-ND 4.0](LICENSE): não é permitido publicar versões modificadas. Somente o autor altera este repositório.
