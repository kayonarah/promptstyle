/* PromptStyle Hub — catálogo no mesmo modelo do Gemini Style.
   Converte os presets/receitas originais (presets.js) para {code, name, category, description, prompt, tags,
   compatibleWith, examples, featured}. Para adicionar presets, edite presets.js; para novas categorias, VIEWS. */
(function (g) {
  'use strict';
  const PRESETS = g.PS_PRESETS, RECIPES = g.PS_RECIPES;

  const ROLE_PT = {
    PURPOSE: 'Propósito', SUBJECT: 'Assunto', PRESENTATION: 'Apresentação', MATERIAL: 'Material', STYLE: 'Estilo',
    LIGHTING: 'Iluminação', EFFECT: 'Efeito', ENVIRONMENT: 'Ambiente', BACKGROUND: 'Fundo', PROMOTION: 'Promoção',
    PLATFORM: 'Plataforma', MARKETPLACE: 'Marketplace', FORMAT: 'Formato', AUDIENCE: 'Público', DECORATION: 'Decoração', CAMERA: 'Câmera'
  };
  /* Ordem canônica do prompt (papel funcional) */
  const ORDER = ['PURPOSE', 'SUBJECT', 'PRESENTATION', 'MATERIAL', 'STYLE', 'LIGHTING', 'EFFECT', 'ENVIRONMENT', 'BACKGROUND', 'PROMOTION', 'PLATFORM', 'MARKETPLACE', 'FORMAT', 'AUDIENCE'];
  const EXCLUSIVE = ['FORMAT', 'PLATFORM', 'MARKETPLACE', 'BACKGROUND'];
  const CONFLICTS = [['/whitebg', '/blackbg'], ['/transparent', '/whitebg'], ['/transparent', '/blackbg']];

  const ROLE_MOTIF = {
    PURPOSE: 'megaphone', SUBJECT: 'gift', PRESENTATION: 'camera', MATERIAL: 'cube', STYLE: 'palette', LIGHTING: 'sun', EFFECT: 'star',
    ENVIRONMENT: 'frame', BACKGROUND: 'square', PROMOTION: 'tag', PLATFORM: 'phone', MARKETPLACE: 'cart', FORMAT: 'frame', AUDIENCE: 'group',
    DECORATION: 'gift', CAMERA: 'camera'
  };
  const CODE_MOTIF = {
    '/jerusalem': 'city', '/belen': 'star', '/deserto': 'desert', '/localbiblico': 'mountain', '/versiculo': 'book', '/devocional': 'prayer',
    '/evento-igreja': 'calendar', '/natal-cristao': 'gift', '/fe': 'dove', '/dark': 'moon', '/minimalist': 'frame', '/premium': 'crown',
    '/anuncio-comercial': 'megaphone', '/lancamento': 'star', '/oferta-limitada': 'tag', '/prova-social': 'heart', '/chamada-para-acao': 'megaphone',
    '/conteudo-educativo': 'book', '/retrato-profissional': 'person', '/foto-culinaria': 'camera', '/foto-imobiliaria': 'city',
    '/cinematografico': 'clapper', '/scrollstopper': 'eye', '/floating3d': 'cube', '/3dprint-real': 'cube', '/keychain3d': 'key',
    '/companykeychain': 'key', '/shopee-cover': 'cart', '/instagram-feed': 'phone', '/instagram-story': 'phone', '/9:16': 'phone',
    '/colorful': 'palette', '/kidsproduct': 'shapes', '/whitebg': 'square', '/blackbg': 'square', '/transparent': 'square'
  };
  const SAMPLE = 'chaveiro personalizado';

  /* Compatibilidade: coocorrência nas receitas + padrões */
  const co = {};
  RECIPES.forEach(r => r[1].forEach(a => r[1].forEach(b => { if (a !== b) { (co[a] = co[a] || {})[b] = (co[a][b] || 0) + 1; } })));
  const DEFAULT_COMPAT = ['/producthero', '/premium', '/instagram-feed', '/4:5'];

  const CODES = [];
  const byCode = {};
  PRESETS.forEach(([code, name, role, desc, keys, fragment]) => {
    const compat = Object.keys(co[code] || {}).sort((a, b) => co[code][b] - co[code][a]).concat(DEFAULT_COMPAT).filter((x, i, a) => x !== code && a.indexOf(x) === i).slice(0, 5);
    const item = {
      code, name, category: ROLE_PT[role] || role, role, description: desc, prompt: fragment,
      tags: (keys + ' ' + name + ' ' + code.replace(/^\//, '').replace(/[-:]/g, ' ')).split(/\s+/).filter(Boolean),
      compatibleWith: compat,
      examples: [{ input: SAMPLE + ' ' + code, output: desc }],
      featured: false, kind: 'preset', illusLabel: (ROLE_PT[role] || role).toLowerCase(),
      motif: CODE_MOTIF[code] || ROLE_MOTIF[role] || 'palette', views: []
    };
    CODES.push(item); byCode[code] = item;
  });
  (RECIPES[0] ? RECIPES[0][1] : []).forEach(c => byCode[c] && (byCode[c].featured = true));

  /* Menu (mesmo modelo do Gemini Style) */
  const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const VIEWS = [
    { id: 'tudo', icon: '✦', label: 'Todos os códigos', group: 'Explorar', all: true },
    { id: 'produto', icon: '📦', label: 'Produto e Apresentação', group: 'Explorar', roles: ['PRESENTATION', 'SUBJECT', 'MATERIAL'] },
    { id: 'estilo', icon: '🎨', label: 'Estilo e Luz', group: 'Explorar', roles: ['STYLE', 'LIGHTING', 'EFFECT', 'CAMERA'] },
    { id: 'ambiente', icon: '🏞', label: 'Ambiente e Fundo', group: 'Explorar', roles: ['ENVIRONMENT', 'BACKGROUND', 'DECORATION'] },
    { id: 'plataformas', icon: '📱', label: 'Plataformas e Formatos', group: 'Explorar', roles: ['PLATFORM', 'MARKETPLACE', 'FORMAT'] },
    { id: 'proposito', icon: '🎯', label: 'Propósito e Público', group: 'Explorar', roles: ['PURPOSE', 'AUDIENCE', 'PROMOTION'] },
    { id: 'religiosos', icon: '✝', label: 'Bíblicos e religiosos', group: 'Categorias', terms: ['biblia', 'biblico', 'cristao', 'igreja', 'fe', 'oracao', 'jerusalem', 'belem', 'devocional', 'versiculo', 'natal', 'pascoa'] },
    { id: 'comercial', icon: '🛒', label: 'Comercial e vendas', group: 'Categorias', terms: ['comercial', 'venda', 'oferta', 'produto', 'marketplace', 'shopee', 'empresa', 'marca', 'preco'] },
    { id: 'marketing', icon: '📣', label: 'Marketing e redes sociais', group: 'Categorias', terms: ['anuncio', 'marketing', 'instagram', 'tiktok', 'campanha', 'cta', 'conteudo', 'prova social'] },
    { id: 'fotografia', icon: '📷', label: 'Fotografia', group: 'Categorias', terms: ['fotografia', 'foto', 'retrato', 'culinaria', 'imobiliaria', 'luz', 'cinematografico', 'estudio'] },
    { id: 'datas', icon: '🎉', label: 'Datas comemorativas', group: 'Categorias', terms: ['natal', 'pascoa', 'dia das maes', 'dia dos pais', 'data comemorativa', 'black friday', 'namorados', 'volta as aulas'] },
    { id: 'infantil', icon: '🧸', label: 'Infantil e educativo', group: 'Categorias', terms: ['infantil', 'crianca', 'educativo', 'brinquedo', 'kids', 'escolar'] },
    { id: 'combos', icon: '⚡', label: 'Combinações', group: 'Ferramentas', special: true },
    { id: 'favoritos', icon: '⭐', label: 'Favoritos', group: 'Ferramentas', special: true },
    { id: 'criador', icon: '🧩', label: 'Criador de Prompt', group: 'Ferramentas', special: true }
  ];
  /* Casamento por palavra inteira (evita "fé" casar com "café") */
  const words = c => ' ' + norm(c.code + ' ' + c.name + ' ' + c.description + ' ' + c.tags.join(' ')).replace(/[^a-z0-9]+/g, ' ') + ' ';
  CODES.forEach(c => {
    const w = words(c);
    VIEWS.forEach(v => {
      if (v.all || (v.roles && v.roles.includes(c.role)) || (v.terms && v.terms.some(t => w.includes(' ' + t + ' ')))) c.views.push(v.id);
    });
  });

  const CATEGORY_BY_RECIPE = ['Produto', 'Produto', 'Chaveiro', 'Corporativo', 'Marketplace', 'Anúncio', 'Produto', 'Infantil'];
  const COMBOS = RECIPES.map((r, i) => ({
    name: r[0], category: CATEGORY_BY_RECIPE[i] || 'Receita', description: r[2] + ' · ' + r[3], codes: r[1], badge: r[3], score: 96 - i * 3
  }));

  g.PS_DATA = { ROLE_PT, ORDER, EXCLUSIVE, CONFLICTS, VIEWS, CODES, COMBOS, DARK_COMBOS: [], RULES: {}, byCode };
  if (typeof module !== 'undefined') module.exports = g.PS_DATA;
})(typeof window !== 'undefined' ? window : globalThis);
