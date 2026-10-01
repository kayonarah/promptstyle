/* Interface compartilhada (PromptStyle e Gemini Style). A biblioteca ativa vem de window.GS_LIB.
   Sem handlers inline: delegação via data-act. */
(function () {
  'use strict';
  const L = window.GS_LIB, D = L.D, G = L.G, UI = L.ui, CR = UI.creator || {};
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const attr = esc;

  /* ---------- Persistência segura ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('gs.' + L.id + '.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('gs.' + L.id + '.' + k, JSON.stringify(v)); } catch (e) { /* ignora */ } }
  };

  const S = {
    view: store.get('view', UI.defaultView),
    q: '',
    ref: store.get('ref', ''),
    sel: G.normalize((store.get('sel', []) || []).filter(c => D.byCode[c])),
    favCodes: store.get('favCodes', []),
    favCombos: store.get('favCombos', []),
    custom: store.get('custom', []),
    target: store.get('target', 'auto'),
    rules: store.get('rules', true),
    comboCat: 'Todas',
    guided: store.get('guided', {}),
    editing: null
  };
  const persist = () => {
    ['view', 'ref', 'sel', 'favCodes', 'favCombos', 'custom', 'target', 'rules', 'guided'].forEach(k => store.set(k, S[k]));
  };

  /* ---------- Utilidades ---------- */
  let toastT;
  function toast(t) {
    const e = $('#toast'); e.textContent = t; e.style.display = 'block';
    clearTimeout(toastT); toastT = setTimeout(() => { e.style.display = 'none'; }, 2400);
  }
  function copy(text, msg) {
    const done = () => toast(msg || 'Copiado para a área de transferência');
    const fallback = () => {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { toast('Não foi possível copiar'); }
      ta.remove();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
  }
  const allCombos = () => D.COMBOS.map(c => Object.assign({ id: 'b:' + c.name }, c)).concat(
    D.DARK_COMBOS.map(c => Object.assign({ id: 'b:dark:' + c.name }, c)),
    S.custom.map(c => Object.assign({ custom: true }, c)));
  const comboById = id => allCombos().find(c => c.id === id);
  const toggle = (arr, v) => { const i = arr.indexOf(v); i < 0 ? arr.push(v) : arr.splice(i, 1); };
  const line = () => (S.ref ? S.ref + ' ' : '') + S.sel.join(' ');
  const promptText = () => G.compose({ ref: S.ref, codes: S.sel }, { rules: S.rules, target: S.target });
  const featured = new Set(D.CODES.filter(c => c.featured).map(c => c.code));

  /* ---------- Componentes ---------- */
  function codeCard(c) {
    const fav = S.favCodes.includes(c.code), sel = S.sel.includes(c.code);
    const comp = c.compatibleWith.slice(0, 5).map(x => `<button data-act="add" data-code="${attr(x)}" title="Adicionar ${attr(x)}">${esc(x)}</button>`).join('');
    const ex = c.examples.map(e => `<div class="ex"><b>Entrada:</b> <code>${esc(e.input)}</code><br><b>Resultado:</b> ${esc(e.output)}</div>`).join('');
    return `<article class="card${sel ? ' sel' : ''}">
      <div class="il-wrap">${window.GS_ILLUS.illus(c)}</div>
      <div class="c-head"><span class="tag">${esc(c.category)}</span><button class="star${fav ? ' on' : ''}" data-act="fav-code" data-code="${attr(c.code)}" aria-pressed="${fav}" aria-label="Favoritar ${attr(c.code)}">${fav ? '★' : '☆'}</button></div>
      <h3>${esc(c.name)} <span class="code">${esc(c.code)}</span></h3>
      <p>${esc(c.description)}</p>
      <div class="meta"><b>Compatível com:</b></div><div class="codes">${comp}</div>
      <details><summary>Exemplo e tags</summary>${ex}<div class="meta" style="margin-top:6px">Tags: ${esc(c.tags.join(', '))}</div><div class="meta" style="margin-top:6px"><b>Prompt base:</b> ${esc(c.prompt)}</div></details>
      <div class="actions">
        <button class="small primary" data-act="${sel ? 'remove' : 'add'}" data-code="${attr(c.code)}">${sel ? '✓ Na combinação' : '+ Adicionar'}</button>
        <button class="small" data-act="copy-code" data-code="${attr(c.code)}">Copiar código</button>
        <button class="small" data-act="copy-base" data-code="${attr(c.code)}">Copiar prompt</button>
      </div></article>`;
  }
  function comboCard(c) {
    const fav = S.favCombos.includes(c.id);
    const missing = c.codes.filter(x => !D.byCode[x]);
    return `<article class="card">
      <div class="c-head"><span class="tag">${esc(c.category)}${c.custom ? ' · minha' : ''}</span><button class="star${fav ? ' on' : ''}" data-act="fav-combo" data-id="${attr(c.id)}" aria-pressed="${fav}" aria-label="Favoritar combinação">${fav ? '★' : '☆'}</button></div>
      <h3>${esc(c.name)}</h3>
      <p>${esc(c.description || '')}</p>
      <div class="codes">${c.codes.map(x => `<span${D.byCode[x] ? '' : ' style="color:#ff6b7a"'}>${esc(x)}</span>`).join('')}</div>
      ${missing.length ? `<div class="meta">Códigos desconhecidos: ${esc(missing.join(' '))}</div>` : ''}
      <div class="actions">
        <button class="small primary" data-act="use-combo" data-id="${attr(c.id)}">Usar</button>
        <button class="small" data-act="copy-combo" data-id="${attr(c.id)}">Copiar códigos</button>
        <button class="small" data-act="dup-combo" data-id="${attr(c.id)}">Duplicar</button>
        ${c.custom ? `<button class="small" data-act="edit-combo" data-id="${attr(c.id)}">Editar</button><button class="small ghost" data-act="del-combo" data-id="${attr(c.id)}">Excluir</button>` : ''}
      </div></article>`;
  }
  const grid = (items, fn, empty) => items.length ? `<div class="cards">${items.map(fn).join('')}</div>` : `<div class="empty">${empty}</div>`;
  const hero = (eyebrow, h, p) => `<section class="hero"><div class="eyebrow">${eyebrow}</div><h1>${h}</h1><p>${p}</p></section>`;
  const viewCodes = id => D.CODES.filter(c => c.views.includes(id));

  /* ---------- Views ---------- */
  function renderMain() {
    const main = $('#main');
    if (S.q.trim()) return main.innerHTML = renderSearch();
    const v = D.VIEWS.find(x => x.id === S.view) || D.VIEWS[0];
    let html = '';
    if (v.id === 'combos') html = renderCombos(D.COMBOS.map(c => Object.assign({ id: 'b:' + c.name }, c)).concat(S.custom.map(c => Object.assign({ custom: true }, c))), true);
    else if (v.id === 'dark') html = hero('Dark Bible Content', 'Modo Canal Dark', 'Presets para canais de conteúdo bíblico com estética escura, narração cinematográfica e alta retenção.') + grid(D.DARK_COMBOS.map(c => Object.assign({ id: 'b:dark:' + c.name }, c)), comboCard, 'Sem presets.');
    else if (v.id === 'favoritos') html = renderFavs();
    else if (v.id === 'criador') html = renderCreator();
    else {
      const list = viewCodes(v.id);
      html = hero(esc(v.icon + ' ' + 'Biblioteca'), esc(v.label), `${list.length} códigos reutilizáveis. Adicione ao construtor, combine e copie o prompt final.`) + grid(list, codeCard, 'Nenhum código nesta categoria.');
    }
    main.innerHTML = html;
  }
  function renderSearch() {
    const codes = G.search(S.q);
    const fq = G.fold(S.q);
    const combos = allCombos().filter(c => G.fold(c.name + ' ' + (c.description || '') + ' ' + c.codes.join(' ')).includes(fq));
    return hero('Busca inteligente', `Resultados para “${esc(S.q)}”`, `${codes.length} códigos e ${combos.length} combinações.`) +
      `<div class="sec"><h2>Códigos</h2></div>` + grid(codes, codeCard, (UI.searchEmpty || 'Nenhum código encontrado. Tente outro termo.')) +
      (combos.length ? `<div class="sec"><h2>Combinações</h2></div>` + grid(combos, comboCard, '') : '');
  }
  function renderCombos(list, withNew) {
    const cats = ['Todas'].concat(Array.from(new Set(list.map(c => c.category))));
    const shown = list.filter(c => S.comboCat === 'Todas' || c.category === S.comboCat);
    const ch = UI.combosHero || { title: '⚡ Combinações prontas', sub: 'Receitas pré-configuradas e as suas próprias. Duplique qualquer uma para personalizar.' };
    return hero('Combinações', ch.title, ch.sub) +
      `<div class="sec"><div class="filters">${cats.map(k => `<button class="chip${k === S.comboCat ? ' on' : ''}" data-act="combo-cat" data-cat="${attr(k)}">${esc(k)}</button>`).join('')}</div>
      ${withNew ? '<button class="small primary" data-act="new-combo">+ Nova combinação</button>' : ''}</div>` + grid(shown, comboCard, 'Nenhuma combinação.');
  }
  function renderFavs() {
    const codes = S.favCodes.map(c => D.byCode[c]).filter(Boolean);
    const combos = S.favCombos.map(comboById).filter(Boolean);
    return hero('Favoritos', '⭐ Seus favoritos', 'Códigos e combinações marcados por você (salvos neste navegador).') +
      `<div class="sec"><h2>Códigos</h2></div>` + grid(codes, codeCard, 'Toque na ☆ de um código para guardá-lo aqui.') +
      `<div class="sec"><h2>Combinações</h2></div>` + grid(combos, comboCard, 'Toque na ☆ de uma combinação para guardá-la aqui.') +
      `<div class="sec"><h2>Minhas combinações</h2><button class="small primary" data-act="new-combo">+ Nova combinação</button></div>` + grid(S.custom.map(c => Object.assign({ custom: true }, c)), comboCard, 'Você ainda não criou combinações próprias.');
  }
  function renderCreator() {
    const g = S.guided, G2 = G.GUIDED;
    const sel = m => `<label class="lbl" for="g-${m.key}">${esc(m.label)}<select class="field" id="g-${m.key}" data-guided="${m.key}"><option value="">—</option>${Object.keys(G2[m.key]).map(o => `<option${g[m.key] === o ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select></label>`;
    const codes = G.guided(g);
    return hero(esc(CR.eyebrow), esc(CR.title), esc(CR.sub)) +
      `<section class="panel"><h3>${esc(CR.forMeTitle)}</h3><p class="hint">${esc(CR.forMeHint)}</p>
        <textarea class="field" id="forMe" placeholder="${attr(CR.forMePlaceholder)}"></textarea>
        <div class="b-actions"><button class="small primary" data-act="for-me">CRIAR PARA MIM</button></div></section>
       <section class="panel"><h3>${esc(CR.guidedTitle)}</h3><p class="hint">${esc(CR.guidedHint)}</p>
        <div class="grid-sel">${G.GUIDED_META.map(sel).join('')}</div>
        <div class="lbl">Sequência recomendada</div><div class="chips">${codes.length ? codes.map(c => `<span class="pill">${esc(c)}</span>`).join('') : '<span class="none">Selecione ao menos uma opção.</span>'}</div>
        <div class="b-actions"><button class="small primary" data-act="apply-guided"${codes.length ? '' : ' disabled'}>Aplicar ao construtor</button></div></section>
       <section class="panel"><h3>${esc(CR.quickTitle)}</h3><p class="hint">${esc(CR.quickHint)}</p>
        <div class="codes">${(CR.quick || []).map(c => `<button data-act="quick-one" data-code="${attr(c)}">${esc(c)}</button>`).join('')}</div></section>`;
  }

  /* ---------- Barra lateral e construtor ---------- */
  function renderSide() {
    let lastGroup = '';
    $('#side').innerHTML = `<h4>${esc(UI.sideTitle || '')}</h4>` + D.VIEWS.map(v => {
      const n = v.special ? '' : viewCodes(v.id).length;
      const head = v.group !== lastGroup ? `<h5>${esc(v.group)}</h5>` : '';
      lastGroup = v.group;
      return head + `<button data-act="view" data-view="${v.id}" class="${v.id === S.view && !S.q ? 'active' : ''}"><span aria-hidden="true">${v.icon}</span>${esc(v.label)}<span class="n">${n}</span></button>`;
    }).join('');
  }
  function renderBuilder() {
    $('#selCount').textContent = S.sel.length;
    $('#ref').value !== S.ref && ($('#ref').value = S.ref);
    $('#refLabel').textContent = UI.refLabel; $('#ref').placeholder = UI.refPlaceholder;
    $('#optsRow').hidden = !(UI.features.rules || UI.features.target);
    $('#targetWrap').hidden = !UI.features.target; $('#rulesWrap').hidden = !UI.features.rules;
    $('#completeBtn').hidden = !UI.features.complete;
    $('#target').value = S.target; $('#rules').checked = S.rules;
    $('#chips').innerHTML = S.sel.length ? S.sel.map(c => `<span class="pill">${esc(c)}<button data-act="remove" data-code="${attr(c)}" aria-label="Remover ${attr(c)}">×</button></span>`).join('') : '<span class="none">Adicione códigos pelos cards ou digite acima.</span>';
    const sug = G.recommend(S.sel, 7);
    $('#suggest').innerHTML = sug.map(c => `<button class="chip" data-act="add" data-code="${attr(c)}">+ ${esc(c)}</button>`).join('');
    $('#out').textContent = S.sel.length ? promptText() : 'Selecione códigos para gerar o prompt.';
    const noRef = UI.needsRef && S.sel.length > 0 && !S.ref.trim();
    $('#status').textContent = S.sel.length ? (noRef ? 'SEM PASSAGEM' : 'VALIDADO') : 'VAZIO';
    $('#status').classList.toggle('bad', noRef);
  }
  function render() { renderSide(); renderMain(); renderBuilder(); persist(); }

  /* ---------- Ações ---------- */
  function addCode(c) {
    const r = G.add(S.sel, c);
    if (r.conflict) return toast('Estes códigos possuem instruções conflitantes.');
    if (r.list === S.sel) return;
    if (r.replaced) toast(`Substituído ${r.replaced} por ${c}`);
    S.sel = r.list; render();
  }
  function applyCodes(codes, ref) {
    S.sel = G.normalize(codes.filter(c => D.byCode[c]));
    if (ref != null) S.ref = ref;
    render();
  }
  function openModal(combo) {
    S.editing = combo || null;
    $('#mTitle').textContent = combo && combo.id ? 'Editar combinação' : 'Nova combinação';
    $('#cName').value = combo ? combo.name : '';
    $('#cCat').value = combo ? combo.category : 'Minhas';
    $('#cDesc').value = combo ? combo.description || '' : '';
    $('#cCodes').value = combo ? combo.codes.join(' ') : S.sel.join(' ');
    $('#cErr').textContent = '';
    $('#modal').hidden = false; $('#cName').focus();
  }
  const closeModal = () => { $('#modal').hidden = true; S.editing = null; };

  const actions = {
    view(el) { S.view = el.dataset.view; S.q = ''; $('#search').value = ''; document.body.classList.remove('menu-open'); render(); $('#main').scrollIntoView({ block: 'start' }); },
    add(el) { addCode(el.dataset.code); },
    remove(el) { S.sel = S.sel.filter(c => c !== el.dataset.code); render(); },
    'fav-code'(el) { toggle(S.favCodes, el.dataset.code); render(); },
    'fav-combo'(el) { toggle(S.favCombos, el.dataset.id); render(); },
    'copy-code'(el) { copy(el.dataset.code, 'Código copiado'); },
    'copy-base'(el) { copy(D.byCode[el.dataset.code].prompt, 'Prompt do código copiado'); },
    'copy-prompt'() { S.sel.length ? copy(promptText(), 'Prompt final copiado') : toast('Adicione ao menos um código'); },
    'copy-line'() { S.sel.length ? copy(line(), 'Códigos copiados') : toast('Adicione ao menos um código'); },
    clear() { S.sel = []; S.ref = ''; render(); },
    'toggle-builder'() { document.body.classList.toggle('builder-open'); },
    'toggle-menu'() { document.body.classList.toggle('menu-open'); },
    'combo-cat'(el) { S.comboCat = el.dataset.cat; renderMain(); },
    'use-combo'(el) {
      const c = comboById(el.dataset.id); if (!c) return;
      applyCodes(c.codes); toast(`Combinação “${c.name}” aplicada`);
      if (window.matchMedia('(max-width:1180px)').matches) document.body.classList.add('builder-open');
    },
    'copy-combo'(el) { const c = comboById(el.dataset.id); c && copy(c.codes.join(' '), 'Códigos da combinação copiados'); },
    'dup-combo'(el) {
      const c = comboById(el.dataset.id); if (!c) return;
      S.custom.push({ id: 'c:' + Date.now().toString(36), name: c.name + ' (cópia)', category: c.custom ? c.category : 'Minhas', description: c.description || '', codes: c.codes.slice() });
      toast('Combinação duplicada em “Minhas combinações”'); render();
    },
    'new-combo'() { openModal(null); },
    'edit-combo'(el) { const c = comboById(el.dataset.id); c && openModal(c); },
    'del-combo'(el) {
      const c = comboById(el.dataset.id);
      if (!c || !window.confirm(`Excluir a combinação “${c.name}”?`)) return;
      S.custom = S.custom.filter(x => x.id !== c.id); S.favCombos = S.favCombos.filter(x => x !== c.id); render();
    },
    'save-combo'() { S.sel.length ? openModal({ name: '', category: 'Minhas', description: '', codes: S.sel }) : toast('Adicione ao menos um código'); },
    'close-modal'() { closeModal(); },
    'for-me'() {
      const t = $('#forMe').value.trim(); if (!t) return toast('Descreva o que você quer criar');
      const r = G.createForMe(t);
      applyCodes(r.codes, r.ref);
      toast(r.recognized ? `Identificado: ${r.why}` : r.why);
      document.body.classList.add('builder-open');
    },
    'apply-guided'() { applyCodes(G.guided(S.guided)); toast('Sequência aplicada ao construtor'); document.body.classList.add('builder-open'); },
    'quick-one'(el) { applyCodes([el.dataset.code], S.ref || CR.quickRef || ''); document.body.classList.add('builder-open'); },
    complete() {
      if (!G.complete) return;
      if (!S.sel.length) return toast('Adicione ao menos um código.');
      const r = G.complete(S.sel);
      if (r) { applyCodes(r.codes); toast('Combinação pré-validada encontrada: ' + r.name); }
      else toast('Não há receita pré-calculada para essa seleção. Use os complementos sugeridos.');
    }
  };

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (el && actions[el.dataset.act]) { actions[el.dataset.act](el); return; }
    if (document.body.classList.contains('menu-open') && !e.target.closest('#side, #menuBtn')) document.body.classList.remove('menu-open');
  });

  /* Entradas */
  $('#search').addEventListener('input', e => { S.q = e.target.value; renderSide(); renderMain(); });
  $('#ref').addEventListener('input', e => {
    // Código digitado após a passagem é interpretado ao digitar espaço/Enter
    S.ref = e.target.value; renderBuilder(); persist();
  });
  $('#ref').addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const p = G.parseInput(e.target.value);
    if (p.codes.length) { S.ref = p.ref; p.codes.forEach(c => { S.sel = G.add(S.sel, c).list; }); render(); }
    if (p.unknown.length) toast('Código desconhecido: ' + p.unknown.join(' '));
  });
  $('#target').addEventListener('change', e => { S.target = e.target.value; renderBuilder(); persist(); });
  $('#rules').addEventListener('change', e => { S.rules = e.target.checked; renderBuilder(); persist(); });
  $('#main').addEventListener('change', e => {
    const k = e.target.dataset && e.target.dataset.guided;
    if (k) { S.guided[k] = e.target.value; persist(); renderMain(); }
  });
  $('#comboForm').addEventListener('submit', e => {
    e.preventDefault();
    const p = G.parseInput($('#cCodes').value.replace(/(^|\s)(?!\/)(\S+)/g, '$1/$2'));
    if (p.unknown.length) { $('#cErr').textContent = 'Códigos desconhecidos: ' + p.unknown.join(' '); return; }
    if (!p.codes.length) { $('#cErr').textContent = 'Informe ao menos um código.'; return; }
    const data = { name: $('#cName').value.trim(), category: $('#cCat').value.trim() || 'Minhas', description: $('#cDesc').value.trim(), codes: G.normalize(p.codes) };
    if (!data.name) { $('#cErr').textContent = 'Informe um nome.'; return; }
    const ed = S.editing;
    if (ed && ed.custom && ed.id) S.custom = S.custom.map(c => c.id === ed.id ? Object.assign({}, c, data) : c);
    else S.custom.push(Object.assign({ id: 'c:' + Date.now().toString(36) }, data));
    closeModal(); toast('Combinação salva'); render();
  });
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); document.body.classList.remove('menu-open', 'builder-open'); }
    if ((e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '')) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); $('#search').focus(); }
  });

  /* Alternador de bibliotecas e textos da página */
  $('#libs').innerHTML = (UI.libs || []).map(l => `<a class="lib${l.id === L.id ? ' on' : ''}" href="${attr(l.href)}"${l.id === L.id ? ' aria-current="page"' : ''}>${esc(l.label)}</a>`).join('');
  $('#search').placeholder = UI.searchPlaceholder || 'Buscar…';
  render();
})();
