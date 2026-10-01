/* Gemini Style — motor de domínio (puro, sem DOM): parser, conflitos, composição, busca, recomendação */
(function (g) {
  'use strict';
  const D = g.GS_DATA;
  const { RULES, STYLE_MODS, FORMATS, PLATFORMS, CODES, byCode } = D;
  const PLACEHOLDER = '[INSIRA A PASSAGEM, PERSONAGEM OU TEMA]';

  const fold = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const lcFirst = s => s.charAt(0).toLowerCase() + s.slice(1);
  const trimDot = s => s.replace(/[.\s]+$/, '');
  const list = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' e ' + a[a.length - 1];
  const uniq = a => Array.from(new Set(a));
  const get = c => byCode[c];

  /* ---------- Parser: "Davi contra Golias /cinematic /epic" ---------- */
  function parseInput(str) {
    const s = String(str || '').trim();
    const codes = [];
    const unknown = [];
    const re = /(?:^|\s)(\/[^\s]+)/g;
    let m;
    while ((m = re.exec(s))) {
      const c = m[1].toLowerCase().replace(/[.,;]+$/, '');
      (get(c) ? codes : unknown).push(c);
    }
    const first = s.search(/(?:^|\s)\/[^\s]+/);
    const ref = (first === -1 ? s : s.slice(0, first)).trim().replace(/^["“]|["”]$/g, '');
    return { ref, codes: uniq(codes), unknown };
  }

  /* ---------- Exclusividade: apenas um formato por vez ---------- */
  const isFmt = c => get(c) && get(c).kind === 'fmt';
  function add(selected, code) {
    if (!get(code) || selected.includes(code)) return { list: selected, replaced: null };
    let replaced = null;
    let out = selected;
    if (isFmt(code)) {
      replaced = selected.find(isFmt) || null;
      out = selected.filter(c => !isFmt(c));
    }
    return { list: out.concat(code), replaced };
  }
  function normalize(codes) {
    return codes.reduce((acc, c) => add(acc, c).list, []);
  }

  /* ---------- Composição do prompt final ---------- */
  const VISUAL = new Set(['scene', 'layout', 'style', 'meta']);
  const IMAGEISH = new Set(['/imageprompt', '/videoprompt', '/scenelist', '/shotlist', '/consistency', '/characterref', '/negative', '/broll']);
  const CONNECT = ['Em seguida, ', 'Depois, ', 'Além disso, '];

  function compose(input, opts) {
    opts = opts || {};
    const ref = (input.ref || '').trim() || PLACEHOLDER;
    const codes = normalize(input.codes || []).filter(get);
    if (!codes.length) return '';
    const items = codes.map(get);
    const by = k => items.filter(i => i.kind === k);

    const hasVisual = items.some(i => VISUAL.has(i.kind) && i.code !== '/voiceprompt');
    const imageRules = hasVisual || items.some(i => IMAGEISH.has(i.code) || i.kind === 'full');
    const styles = by('style');
    const scenes = items.filter(i => i.kind === 'scene' || i.kind === 'layout' || (i.kind === 'meta' && i.code !== '/voiceprompt'));
    const platforms = items.filter(i => i.kind === 'platform');
    const fmt = items.find(i => i.kind === 'fmt');
    const hasCinematic = codes.includes('/cinematic') || codes.includes('/biblicalcinema') || codes.includes('/epicmovie');
    const visualOnlyFromStyle = scenes.length === 0 && styles.length > 0;

    // 1) Tarefas textuais em ordem de fase
    const textual = items.filter(i => !VISUAL.has(i.kind) && i.kind !== 'fmt' && !(i.kind === 'platform' && hasVisual));
    textual.sort((a, b) => a.phase - b.phase);
    const studyN = textual.filter(i => i.kind === 'study').length;
    const many = studyN >= 3 || (studyN >= 2 && hasVisual);
    const sentences = textual.map(i => {
      const base = many && i.clause ? i.clause : trimDot(i.prompt);
      return { s: base, clause: many && !!i.clause, item: i };
    });

    const paras = [];
    if (sentences.length) {
      let idx = 0;
      const parts = sentences.map((x, n) => {
        const body = n === 0 ? lcFirst(x.s) : lcFirst(x.s);
        if (n === 0) return 'Utilizando ' + ref + ' como referência, ' + body + '.';
        const pre = n === sentences.length - 1 && sentences.length > 2 ? 'Por fim, ' : CONNECT[idx++ % CONNECT.length];
        return pre + body + '.';
      });
      paras.push(parts.join(' '));
    }

    // 2) Parágrafo visual
    if (hasVisual) {
      const vis = [];
      const lead = sentences.length ? '' : 'Utilizando ' + ref + ' como referência, ';
      if (visualOnlyFromStyle || scenes.length === 0) {
        vis.push(lead + (lead ? 'transforme' : 'Transforme') + ' o momento mais representativo da narrativa em uma cena ' + (hasCinematic ? 'cinematográfica ' : '') + 'historicamente inspirada, com personagens, vestimentas, arquitetura e ambiente compatíveis com a época e o local descritos.');
      } else {
        scenes.forEach((s, n) => {
          const t = trimDot(s.prompt);
          if (n === 0) vis.push(lead ? lead + lcFirst(t) + '.' : t + '.');
          else vis.push('Além disso, ' + lcFirst(t) + '.');
        });
      }
      const mods = styles.map(s => STYLE_MODS[s.code]).filter(Boolean);
      if (mods.length) vis.push('Utilize ' + (mods.some(m => / e /.test(m)) ? mods.join('; ') : list(mods)) + '.');
      paras.push(vis.join(' '));
    }

    // 3) Composição / plataforma
    const platNames = uniq(platforms.map(p => PLATFORMS[p.code]).concat(fmt && FORMATS[fmt.code].platform ? [FORMATS[fmt.code].platform] : []).filter(Boolean));
    if (hasVisual) {
      const f = fmt ? FORMATS[fmt.code] : null;
      const needText = platNames.length > 0 || codes.some(c => ['/thumbnail', '/verse', '/versecard', '/poster', '/quote', '/wallpaper', '/dramatictext', '/headline', '/clickworthy', '/mysterythumbnail', '/biblicalposter', '/cinematicposter'].includes(c));
      let s = 'A composição deverá ' + (f ? 'ser ' + f.orient + (f.ratio ? ' ' + f.ratio : '') : 'ter orientação adequada ao uso');
      if (platNames.length) s += ' e otimizada para ' + list(platNames);
      s += ', com ponto focal claro' + (needText ? ' e espaço adequado para inserção de texto' : '') + '.';
      paras.push(s);
    } else if (fmt) {
      paras.push(trimDot(fmt.prompt) + '.');
    }

    // 4) Regras globais
    if (opts.rules !== false) {
      const rules = [RULES.fidelity];
            if (imageRules) {
        rules.push(RULES.image);
        if (codes.includes('/realistic') || codes.includes('/cinematic') || codes.includes('/photorealistic') || codes.includes('/ultrarealistic')) rules.push(RULES.imageRealistic);
      }
      if (imageRules) rules.push(RULES.character);
      paras.push('Regras:\n' + rules.map(r => '- ' + r).join('\n'));
    }

    // 5) Alvo Gemini
    const target = opts.target || 'auto';
    const tgt = target === 'auto' ? (hasVisual && !sentences.length ? 'imagem' : 'texto') : target;
    if (opts.target && opts.target !== 'none') {
      const T = {
        texto: 'Responda em português do Brasil, com títulos e tópicos claros.',
        imagem: 'Gere a imagem diretamente, sem texto explicativo adicional.',
        video: 'Gere um vídeo curto com movimento de câmera natural e continuidade entre os planos.'
      };
      if (T[tgt]) paras.splice(opts.rules === false ? paras.length : paras.length - 1, 0, T[tgt]);
    }
    return paras.join('\n\n');
  }

  /* ---------- Busca inteligente ---------- */
  const SYN = {
    video: ['roteiro', 'script', 'reels', 'shorts', 'tiktok', 'narracao', 'documentario'],
    mapa: ['map', 'geografia', 'jornada'], foto: ['imagem', 'cena'], imagem: ['cena', 'visual'],
    resumo: ['summary', 'sintese'], oracao: ['prayer'], estudo: ['context', 'deepstudy'],
    viral: ['hook', 'gancho', 'retencao'], filme: ['cinema', 'cinematico'], youtube: ['thumbnail', 'shorts', 'script']
  };
  const index = CODES.map(c => ({
    c,
    code: fold(c.code),
    name: fold(c.name),
    desc: fold(c.description),
    tags: c.tags.map(fold)
  }));
  const stem = t => t.length > 3 ? t.replace(/(s|es)$/, '') : t;

  function scoreTerm(ix, t) {
    const bare = ix.code.replace(/^\//, '');
    if (bare === t) return 100;
    if (bare.startsWith(t)) return 80;
    if (bare.length >= 3 && t.startsWith(bare)) return 90;
    if (ix.tags.includes(t)) return 60;
    if (ix.name.includes(t)) return 50;
    if (ix.tags.some(x => x.startsWith(t) || (t.length > 3 && x.includes(t)))) return 40;
    if (bare.includes(t)) return 35;
    if (ix.desc.includes(t)) return 20;
    return 0;
  }
  function search(q, pool) {
    const terms = fold(q).replace(/\//g, ' ').split(/\s+/).filter(Boolean).map(stem);
    if (!terms.length) return [];
    const allowed = pool ? new Set(pool.map(c => c.code)) : null;
    const rows = index.filter(ix => !allowed || allowed.has(ix.c.code)).map(ix => {
      let total = 0, hits = 0;
      terms.forEach(t => {
        let s = scoreTerm(ix, t);
        if (!s && SYN[t]) s = Math.floor(Math.max.apply(null, SYN[t].map(x => scoreTerm(ix, x))) * 0.6);
        if (s) { total += s; hits++; }
      });
      return { c: ix.c, total, hits };
    }).filter(r => r.hits > 0);
    const full = rows.filter(r => r.hits === terms.length);
    return (full.length ? full : rows).sort((a, b) => b.total - a.total || a.c.code.localeCompare(b.c.code)).map(r => r.c);
  }

  /* ---------- Recomendação / "combine com" ---------- */
  function recommend(selected, limit) {
    limit = limit || 6;
    if (!selected.length) return ['/context', '/reflection', '/cinematic', '/verse', '/viralhook', '/storytelling'].slice(0, limit);
    const score = {};
    selected.forEach(c => (get(c) ? get(c).compatibleWith : []).forEach((x, i) => {
      if (!selected.includes(x) && get(x)) score[x] = (score[x] || 0) + (10 - i);
    }));
    const hasFmt = selected.some(isFmt);
    return Object.keys(score).filter(x => !(hasFmt && isFmt(x))).sort((a, b) => score[b] - score[a]).slice(0, limit);
  }

  /* ---------- CRIAR PARA MIM ---------- */
  const INTENTS = [
    { re: /(full ?reels|reels completo)/, codes: ['/fullreels', '/reels', '/9:16'], why: 'Reels completo' },
    { re: /(full ?short|short completo)/, codes: ['/fullshort', '/shorts', '/9:16'], why: 'Short completo' },
    { re: /(full ?video|video completo)/, codes: ['/fullvideo', '/16:9'], why: 'Vídeo completo' },
    { re: /(full ?documentario|documentario completo)/, codes: ['/fulldocumentary', '/16:9'], why: 'Documentário completo' },
    { re: /\breels?\b/, codes: ['/viralhook', '/storytelling', '/cinematic', '/dramatic', '/reels', '/9:16'], why: 'Reels' },
    { re: /\b(shorts?)\b/, codes: ['/viralhook', '/storytelling', '/cinematicvoice', '/ending', '/shorts', '/9:16'], why: 'Short' },
    { re: /tik ?tok/, codes: ['/viralhook', '/tiktokscript', '/storytelling', '/cinematicvoice', '/tiktok', '/9:16'], why: 'TikTok' },
    { re: /(thumb|miniatura)/, codes: ['/thumbnail', '/cinematic', '/dramatic', '/headline', '/16:9'], why: 'Thumbnail' },
    { re: /(documentario)/, codes: ['/documentary', '/history', '/timeline', '/map', '/cinematic', '/16:9'], why: 'Documentário' },
    { re: /(story|stories)\b/, codes: ['/story', '/storytelling', '/cinematic', '/9:16'], why: 'Story' },
    { re: /carrossel|carousel/, codes: ['/carousel', '/themes', '/application', '/4:5'], why: 'Carrossel' },
    { re: /(sermao|pregacao|pregar)/, codes: ['/sermon', '/context', '/application'], why: 'Sermão' },
    { re: /devocional/, codes: ['/devotional', '/verse', '/reflection', '/prayer'], why: 'Devocional' },
    { re: /(oracao|orar)/, codes: ['/prayer'], why: 'Oração' },
    { re: /(mapa|rota)/, codes: ['/map', '/geography', '/journey', '/history'], why: 'Mapa' },
    { re: /linha do tempo|cronologia/, codes: ['/timeline', '/history', '/people', '/context'], why: 'Linha do tempo' },
    { re: /(biografia|personagem|quem foi)/, codes: ['/biography', '/timeline', '/faith', '/mistakes', '/legacy'], why: 'Personagem' },
    { re: /profecia|profecias/, codes: ['/prophecy', '/context', '/symbolism', '/crossreference', '/cinematic'], why: 'Profecia' },
    { re: /misterio/, codes: ['/mystery', '/unknown', '/history', '/symbolism', '/cinematic'], why: 'Mistério' },
    { re: /(curiosidade|voce sabia)/, codes: ['/didyouknow', '/curiosity', '/unknown', '/facts', '/shortscript'], why: 'Curiosidade' },
    { re: /(estudo profundo|aprofundad)/, codes: ['/deepstudy', '/context', '/theology', '/doctrine', '/crossreference', '/application'], why: 'Estudo profundo' },
    { re: /(estudo|explicar|explica|significado)/, codes: ['/context', '/history', '/meaning', '/crossreference', '/application'], why: 'Estudo' },
    { re: /reflexao|reflexoes/, codes: ['/reflection', '/application'], why: 'Reflexão' },
    { re: /(versiculo|arte de versiculo)/, codes: ['/verse', '/minimalist', '/premium', '/4:5'], why: 'Versículo' },
    { re: /(imagem|cena|arte|ilustracao|foto)/, codes: ['/scene', '/cinematic', '/realistic', '/dramatic', '/4:5'], why: 'Imagem' },
    { re: /\bquiz\b|\bprova\b/, codes: ['/quiz', '/flashcards'], why: 'Quiz' },
    { re: /natal/, codes: ['/christmas', '/verse', '/reflection'], why: 'Natal' },
    { re: /pascoa/, codes: ['/easter', '/verse', '/reflection'], why: 'Páscoa' },
    { re: /\bluto\b/, codes: ['/grief', '/verse', '/prayer'], why: 'Luto' },
    { re: /ansiedade|ansioso/, codes: ['/anxiety', '/verse', '/prayer'], why: 'Ansiedade' },
    { re: /podcast/, codes: ['/podcast', '/storytelling', '/context'], why: 'Podcast' },
    { re: /\bblog\b|artigo/, codes: ['/blogpost', '/context', '/application', '/seo'], why: 'Blog' },
    { re: /storyboard|cenas/, codes: ['/scenelist', '/shotlist', '/consistency'], why: 'Storyboard' },
    { re: /(video|roteiro)/, codes: ['/script', '/storytelling', '/cinematicvoice', '/ending'], why: 'Vídeo' }
  ];
  const MODIFIERS = [
    { re: /(escuro|dark|sombrio)/, code: '/dark' }, { re: /(dourad|gold)/, code: '/gold' },
    { re: /minimalista/, code: '/minimalist' }, { re: /(realista|fotorrealis)/, code: '/realistic' },
    { re: /(crianca|infantil)/, code: '/kids' }, { re: /(adolescente|teen)/, code: '/teen' }, { re: /ingles|english/, code: '/english' },
        { re: /epic/, code: '/epic' }, { re: /premium/, code: '/premium' }
  ];
  function createForMe(text) {
    const raw = String(text || '').trim();
    const f = fold(raw);
    const m = raw.match(/\bsobre\s+(.+?)[.!?]*$/i);
    let ref = m ? m[1] : raw.replace(/^(quero|preciso de|crie|criar|faça|faca|gere|gerar)\s+(um|uma|uns|umas)?\s*/i, '');
    ref = ref.replace(/[.!?]+$/, '').trim();
    const intent = INTENTS.find(i => i.re.test(f));
    let codes = intent ? intent.codes.slice() : ['/context', '/meaning', '/application'];
    MODIFIERS.forEach(mo => { if (mo.re.test(f) && !codes.includes(mo.code)) codes.splice(Math.max(codes.length - 2, 0), 0, mo.code); });
    codes = normalize(codes);
    return { ref, codes, why: intent ? intent.why : 'Estudo (padrão — nenhum formato reconhecido)', recognized: !!intent };
  }

  /* ---------- CONSTRUTOR DE PROMPT BÍBLICO (seção 13) ---------- */
  const GUIDED = {
    fonte: { 'Versículo': [], 'Passagem': [], 'Capítulo': ['/chapter'], 'Livro': ['/summary'], 'Personagem': ['/character'], 'Local': ['/place'], 'Tema': ['/themes'], 'Evento': ['/history'], 'Profecia': ['/prophecies'] },
    objetivo: {
      'Estudo': ['/context', '/meaning', '/application'], 'Reflexão': ['/reflection', '/application'], 'Sermão': ['/sermon'],
      'Devocional': ['/devotional', '/prayer'], 'Imagem': ['/scene'], 'Reels': ['/viralhook', '/reelsscript', '/reels'],
      'Shorts': ['/viralhook', '/shortsscript', '/shorts'], 'TikTok': ['/viralhook', '/tiktokscript', '/tiktok'],
      'YouTube': ['/script', '/youtube'], 'Documentário': ['/documentary', '/history', '/timeline'],
      'Thumbnail': ['/thumbnail', '/headline'], 'Carrossel': ['/carousel'], 'Story': ['/story']
    },
    tipo: { 'Educativo': ['/explain'], 'Devocional': ['/reflection'], 'Histórico': ['/history'], 'Cinematográfico': ['/cinematic'], 'Curiosidade': ['/curiosity'], 'Mistério': ['/mystery'], 'Storytelling': ['/storytelling'], 'Documentário': ['/documentary'] },
    estilo: { 'Realista': ['/realistic'], 'Cinematográfico': ['/cinematic'], 'Épico': ['/epic'], 'Histórico': ['/historical'], 'Escuro': ['/dark'], 'Minimalista': ['/minimalist'], 'Premium': ['/premium'], 'Pergaminho': ['/ancientpaper'], 'Preto e dourado': ['/gold'] },
    formato: { '9:16': ['/9:16'], '4:5': ['/4:5'], '1:1': ['/1:1'], '16:9': ['/16:9'] }
  };
  const VISUAL_GOALS = ['Imagem', 'Reels', 'Shorts', 'TikTok', 'YouTube', 'Documentário', 'Thumbnail', 'Carrossel', 'Story'];
  function guided(sel) {
    const pick = (k) => (GUIDED[k][sel[k]] || []);
    const visual = VISUAL_GOALS.includes(sel.objetivo);
    let codes = [].concat(pick('fonte'), pick('objetivo'), pick('tipo'));
    if (visual) codes = codes.concat(pick('estilo'), pick('formato'));
    if (sel.objetivo === 'Imagem' && !codes.includes('/scene')) codes.push('/scene');
    return normalize(uniq(codes));
  }

  const api = { PLACEHOLDER, fold, parseInput, add, normalize, compose, search, recommend, createForMe, guided, GUIDED, isFmt };
  g.GS = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
