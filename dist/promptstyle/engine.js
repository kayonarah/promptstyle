/* PromptStyle Hub — motor de domínio (puro, sem DOM). Preserva as regras originais:
   ordem canônica por papel funcional, papéis exclusivos, conflitos de fundo e "completar combinação". */
(function (g) {
  'use strict';
  const D = g.PS_DATA;
  const { ORDER, EXCLUSIVE, CONFLICTS, CODES, byCode, COMBOS } = D;
  const get = c => byCode[c];
  const fold = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const uniq = a => Array.from(new Set(a));
  const idx = r => { const i = ORDER.indexOf(r); return i < 0 ? 99 : i; };

  function canonical(a) {
    return a.slice().sort((x, y) => idx(get(x).role) - idx(get(y).role) || x.localeCompare(y));
  }
  const conflicts = (a, b) => CONFLICTS.some(p => p.includes(a) && p.includes(b));
  function valid(a) {
    const roles = {};
    for (const c of a) {
      const p = get(c); if (!p) continue;
      if (EXCLUSIVE.includes(p.role) && roles[p.role]) return false;
      roles[p.role] = (roles[p.role] || 0) + 1;
      for (const d of a) if (c !== d && conflicts(c, d)) return false;
    }
    return true;
  }
  const isFmt = c => !!get(c) && EXCLUSIVE.includes(get(c).role);

  function add(selected, code) {
    if (!get(code) || selected.includes(code)) return { list: selected, replaced: null };
    const p = get(code);
    const same = EXCLUSIVE.includes(p.role) ? selected.find(x => get(x).role === p.role) : null;
    let out = same ? selected.filter(x => x !== same) : selected;
    if (!valid(out.concat(code))) return { list: selected, replaced: null, conflict: true };
    return { list: canonical(out.concat(code)), replaced: same || null };
  }
  function normalize(codes) {
    return codes.filter(get).reduce((acc, c) => add(acc, c).list, []);
  }

  function parseInput(str) {
    const s = String(str || '').trim(), codes = [], unknown = [];
    const re = /(?:^|\s)(\/[^\s]+)/g; let m;
    while ((m = re.exec(s))) { const c = m[1].toLowerCase().replace(/[.,;]+$/, ''); (get(c) ? codes : unknown).push(c); }
    const first = s.search(/(?:^|\s)\/[^\s]+/);
    const ref = (first === -1 ? s : s.slice(0, first)).trim();
    return { ref, codes: uniq(codes), unknown };
  }

  /* Prompt: mesma composição original, agora com assunto opcional */
  function compose(input) {
    const codes = canonical(normalize(input.codes || []));
    if (!codes.length) return '';
    const ref = (input.ref || '').trim();
    return 'Crie uma imagem publicitária profissional' + (ref ? ' de ' + ref : '') + '. ' +
      codes.map(c => get(c).prompt).filter(Boolean).join(' ');
  }

  /* Busca: código, tags, nome e descrição, sem acento */
  const index = CODES.map(c => ({ c, code: fold(c.code).replace(/^\//, ''), name: fold(c.name), desc: fold(c.description), tags: c.tags.map(fold) }));
  const stem = t => t.length > 3 ? t.replace(/(s|es)$/, '') : t;
  function scoreTerm(ix, t) {
    if (ix.code === t) return 100;
    if (ix.code.startsWith(t)) return 80;
    if (ix.tags.includes(t)) return 60;
    if (ix.name.includes(t)) return 50;
    if (ix.tags.some(x => x.startsWith(t) || (t.length > 3 && x.includes(t)))) return 40;
    if (ix.code.includes(t)) return 35;
    if (ix.desc.includes(t)) return 20;
    return 0;
  }
  function search(q) {
    const terms = fold(q).replace(/\//g, ' ').split(/\s+/).filter(Boolean).map(stem);
    if (!terms.length) return [];
    const rows = index.map(ix => {
      let total = 0, hits = 0;
      terms.forEach(t => { const s = scoreTerm(ix, t); if (s) { total += s; hits++; } });
      return { c: ix.c, total, hits };
    }).filter(r => r.hits > 0);
    const full = rows.filter(r => r.hits === terms.length);
    return (full.length ? full : rows).sort((a, b) => b.total - a.total || a.c.code.localeCompare(b.c.code)).map(r => r.c);
  }

  /* "Combina bem com": receitas e compatibilidade, respeitando exclusividade (STYLE/LIGHTING/EFFECT sempre liberados) */
  const OPEN_ROLES = ['STYLE', 'LIGHTING', 'EFFECT'];
  function recommend(selected, limit) {
    limit = limit || 6;
    if (!selected.length) return ['/producthero', '/3dprint-real', '/premium', '/instagram-feed', '/4:5'].slice(0, limit);
    const score = {};
    selected.forEach(c => (get(c).compatibleWith || []).forEach((x, i) => { score[x] = (score[x] || 0) + (6 - i); }));
    COMBOS.forEach(r => { if (selected.some(c => r.codes.includes(c))) r.codes.forEach(x => { score[x] = (score[x] || 0) + 3; }); });
    return Object.keys(score)
      .filter(x => get(x) && !selected.includes(x) && valid(selected.concat(x)))
      .filter(x => !selected.some(s => get(s).role === get(x).role) || OPEN_ROLES.includes(get(x).role))
      .sort((a, b) => score[b] - score[a]).slice(0, limit);
  }

  /* "Completar combinação": somente receitas pré-validadas */
  function complete(selected) {
    if (!selected.length) return null;
    const m = COMBOS.filter(r => selected.every(c => r.codes.includes(c))).sort((a, b) => b.score - a.score)[0];
    return m ? { name: m.name, codes: normalize(m.codes) } : null;
  }

  /* CRIAR PARA MIM: encontra a receita mais próxima ou monta com os melhores presets de cada papel */
  function createForMe(text) {
    const raw = String(text || '').trim(), f = fold(raw);
    const m = raw.match(/\b(?:de|do|da|sobre|para)\s+(.+?)[.!?]*$/i);
    const ref = m ? m[1].trim() : '';
    const tokens = f.replace(/[^a-z0-9/ ]+/g, ' ').split(/\s+/).filter(t => t.length > 2).map(stem);
    let best = null, bestScore = 0;
    COMBOS.forEach(r => {
      const hay = fold(r.name + ' ' + r.description + ' ' + r.codes.join(' '));
      const nm = fold(r.name);
      const s = tokens.filter(t => hay.includes(t)).length + tokens.filter(t => nm.includes(t)).length;
      if (s > bestScore) { best = r; bestScore = s; }
    });
    if (best && bestScore >= 3) return { ref, codes: normalize(best.codes), why: 'Receita: ' + best.name, recognized: true };
    const found = search(raw), roles = new Set(), codes = [];
    found.forEach(c => { if (codes.length < 6 && !roles.has(c.role) && valid(codes.concat(c.code))) { roles.add(c.role); codes.push(c.code); } });
    if (codes.length) {
      ['/instagram-feed', '/4:5'].forEach(c => { if (!codes.some(x => get(x).role === get(c).role)) codes.push(c); });
      return { ref, codes: normalize(codes), why: 'Montado a partir da busca', recognized: true };
    }
    const d = COMBOS[0];
    return { ref, codes: normalize(d.codes), why: 'Padrão: ' + d.name + ' (nenhum termo reconhecido)', recognized: false };
  }

  /* CONSTRUTOR GUIADO */
  const GUIDED = {
    tipo: { 'Produto 3D': ['/producthero', '/3dprint-real'], 'Chaveiro personalizado': ['/keychain3d', '/personalized', '/3dprint-real', '/producthero'], 'Brinde corporativo': ['/companykeychain', '/personalized', '/businessad', '/producthero'], 'Produto infantil': ['/kidsproduct', '/colorful'], 'Capa de marketplace': ['/productwhite', '/whitebg'], 'Anúncio comercial': ['/anuncio-comercial', '/producthero'], 'Conteúdo bíblico': ['/versiculo', '/fe'], 'Fotografia de produto': ['/foto-de-produto'] },
    estilo: { 'Premium': ['/premium'], 'Dark': ['/dark'], 'Minimalista': ['/minimalist'], 'Colorido': ['/colorful'], 'Cinematográfico': ['/cinematografico'], 'Fotografia realista': ['/fotografia-realista'], 'Scroll stopper': ['/scrollstopper'], 'Floating 3D': ['/floating3d'] },
    luz: { 'Dramática': ['/dramaticlight'], 'Suave': ['/softlight'], 'Natural': ['/luz-natural'] },
    plataforma: { 'Instagram Feed': ['/instagram-feed'], 'Instagram Story': ['/instagram-story'], 'Shopee': ['/shopee-cover'] },
    formato: { '4:5': ['/4:5'], '9:16': ['/9:16'], '1:1': ['/1:1'] }
  };
  const GUIDED_META = [{ key: 'tipo', label: '1. O que criar' }, { key: 'estilo', label: '2. Estilo' }, { key: 'luz', label: '3. Iluminação' }, { key: 'plataforma', label: '4. Plataforma' }, { key: 'formato', label: '5. Formato' }];
  function guided(sel) {
    let codes = [];
    GUIDED_META.forEach(m => { codes = codes.concat(GUIDED[m.key][sel[m.key]] || []); });
    return normalize(uniq(codes));
  }

  const api = { fold, canonical, valid, parseInput, add, normalize, compose, search, recommend, complete, createForMe, guided, GUIDED, GUIDED_META, isFmt };
  g.PS = api;

  /* Configuração de interface consumida por core/app.js */
  g.GS_LIB = {
    id: 'promptstyle', D, G: api,
    ui: {
      sideTitle: 'PromptStyle Hub', defaultView: 'tudo', needsRef: false,
      refLabel: 'Assunto (opcional)', refPlaceholder: 'Ex.: chaveiro do Corinthians  (aceita: assunto /premium /4:5)',
      searchEmpty: 'Nenhum preset encontrado. Tente “produto”, “shopee”, “luz” ou “chaveiro”.',
      searchPlaceholder: 'Busque por estilo, produto, plataforma, efeito ou código…',
      features: { rules: false, target: false, complete: true },
      creator: {
        eyebrow: 'Biblioteca + motor de composição', title: '🧩 Criador de Prompt',
        sub: 'Encontre o estilo certo, combine, copie e crie. Descreva o que precisa ou monte passo a passo.',
        forMeTitle: '✨ Criar para mim', forMeHint: 'Descreva o que você quer. Ex.: “Anúncio de chaveiro personalizado para Instagram.”', forMePlaceholder: 'Chaveiro personalizado premium para Instagram',
        guidedTitle: 'Construtor guiado', guidedHint: 'Escolha as opções e receba a sequência de códigos validada (formato, plataforma e fundo são exclusivos).',
        quickTitle: 'Atalhos populares', quickHint: 'Clique para aplicar ao construtor.',
        quick: ['/producthero', '/premium', '/scrollstopper', '/floating3d', '/shopee-cover', '/instagram-story'], quickRef: ''
      },
      combosHero: { title: '⚡ Combinações em alta', sub: 'Receitas pré-validadas e as suas próprias. Duplique qualquer uma para personalizar.' },
      libs: [{ href: 'index.html', label: 'PromptStyle', id: 'promptstyle' }, { href: 'gemini-style.html', label: 'Gemini Style', id: 'gemini' }]
    }
  };
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
