/* Gemini Style — ilustrações por código (SVG inline, sem imagens externas).
   Cada ilustração mostra "passagem → resultado": um mini-documento à esquerda e o motivo do código à direita. */
(function (g) {
  'use strict';
  const D = g.GS_DATA;

  /* Motivos 48×48 (traço). Para criar um novo, basta adicionar uma chave. */
  const M = {
    book: '<path d="M6 10h15a4 4 0 0 1 4 4v24a3 3 0 0 0-3-3H6z"/><path d="M42 10H27a2 2 0 0 0-2 2v26a3 3 0 0 1 3-3h14z"/>',
    scroll: '<path d="M14 10h22v24a4 4 0 0 1-4 4H12a4 4 0 0 0 4-4V10z"/><path d="M14 10a4 4 0 0 0-4 4v2h4M20 18h12M20 24h12M20 30h8"/>',
    map: '<path d="M6 12l12-4 12 4 12-4v28l-12 4-12-4-12 4z"/><path d="M18 8v28M30 12v28"/>',
    timeline: '<path d="M6 24h36"/><circle cx="12" cy="24" r="3"/><circle cx="24" cy="24" r="3"/><circle cx="36" cy="24" r="3"/><path d="M12 14v7M24 27v7M36 14v7"/>',
    person: '<circle cx="24" cy="15" r="6"/><path d="M10 40c0-8 6-13 14-13s14 5 14 13"/>',
    group: '<circle cx="24" cy="16" r="5"/><circle cx="12" cy="20" r="4"/><circle cx="36" cy="20" r="4"/><path d="M14 38c0-6 4-10 10-10s10 4 10 10M3 36c0-5 3-8 8-8M45 36c0-5-3-8-8-8"/>',
    city: '<path d="M6 40V20h10v20M16 40V10h12v30M28 40V22h14v18M4 40h40"/><path d="M20 16h4M20 22h4M20 28h4"/>',
    temple: '<path d="M6 18L24 8l18 10zM10 18v18M18 18v18M30 18v18M38 18v18M6 38h36M4 42h40"/>',
    mountain: '<path d="M4 38l12-20 8 12 6-8 14 16z"/><circle cx="36" cy="12" r="3"/>',
    desert: '<circle cx="24" cy="18" r="7"/><path d="M24 6v3M12 18H9M39 18h-3M15 9l2 2M33 9l-2 2"/><path d="M4 40c8-8 14-8 20 0s14 8 20 0"/>',
    moon: '<path d="M32 10a14 14 0 1 0 6 24 12 12 0 0 1-6-24z"/>',
    flame: '<path d="M24 6c2 8 10 12 10 22a10 10 0 0 1-20 0c0-6 4-8 5-14 3 2 4 5 5 8 1-4 0-10 0-16z"/>',
    star: '<path d="M24 6l5.5 11.5L42 19l-9 9 2 13-11-6-11 6 2-13-9-9 12.5-1.5z"/>',
    eye: '<path d="M3 24c6-10 14-14 21-14s15 4 21 14c-6 10-14 14-21 14S9 34 3 24z"/><circle cx="24" cy="24" r="6"/>',
    camera: '<rect x="5" y="14" width="38" height="25" rx="4"/><path d="M16 14l3-5h10l3 5"/><circle cx="24" cy="26" r="7"/>',
    clapper: '<rect x="6" y="18" width="36" height="22" rx="2"/><path d="M6 18l4-9 8 2-4 7M20 11l8 2-4 5M30 13l8 2-3 4"/>',
    mic: '<rect x="18" y="5" width="12" height="22" rx="6"/><path d="M11 24a13 13 0 0 0 26 0M24 37v7M17 44h14"/>',
    wave: '<path d="M4 24h4M12 16v16M18 8v32M24 14v20M30 6v36M36 16v16M42 22v4"/>',
    play: '<rect x="5" y="9" width="38" height="30" rx="6"/><path d="M20 17l12 7-12 7z"/>',
    phone: '<rect x="14" y="4" width="20" height="40" rx="4"/><path d="M21 38h6"/>',
    carousel: '<rect x="14" y="10" width="20" height="28" rx="3"/><path d="M8 14v20M40 14v20"/>',
    poster: '<rect x="9" y="5" width="30" height="38" rx="2"/><path d="M14 30l8-9 6 7 4-4 5 6M16 12h16"/>',
    quote: '<path d="M8 30h10v10H8zM26 30h10v10H26z"/><path d="M8 30c0-8 3-13 9-15M26 30c0-8 3-13 9-15"/>',
    lines: '<path d="M8 12h32M8 20h32M8 28h32M8 36h20"/>',
    list: '<path d="M8 12l3 3 5-6M20 12h20M8 26l3 3 5-6M20 26h20M8 40h4M20 40h20"/>',
    question: '<circle cx="24" cy="24" r="18"/><path d="M18 19a6 6 0 1 1 8 5c-2 1-2 3-2 5M24 34v2"/>',
    bulb: '<path d="M17 33c0-4-6-6-6-14a13 13 0 0 1 26 0c0 8-6 10-6 14zM18 39h12M20 44h8"/>',
    magnifier: '<circle cx="21" cy="21" r="13"/><path d="M31 31l12 12"/>',
    link: '<path d="M20 28a7 7 0 0 0 10 0l8-8a7 7 0 0 0-10-10l-3 3M28 20a7 7 0 0 0-10 0l-8 8a7 7 0 0 0 10 10l3-3"/>',
    scale: '<path d="M24 6v34M12 40h24M10 14h28M10 14l-6 14a6 6 0 0 0 12 0zM38 14l-6 14a6 6 0 0 0 12 0z"/>',
    heart: '<path d="M24 41S6 30 6 17a9 9 0 0 1 18-3 9 9 0 0 1 18 3c0 13-18 24-18 24z"/>',
    prayer: '<path d="M24 6c-6 6-10 14-10 22l10 12 10-12c0-8-4-16-10-22zM24 14v24"/>',
    calendar: '<rect x="6" y="10" width="36" height="32" rx="3"/><path d="M6 20h36M15 5v9M33 5v9M14 28h4M22 28h4M30 28h4M14 35h4M22 35h4"/>',
    globe: '<circle cx="24" cy="24" r="18"/><path d="M6 24h36M24 6c-8 9-8 27 0 36M24 6c8 9 8 27 0 36"/>',
    table: '<rect x="5" y="8" width="38" height="32" rx="2"/><path d="M5 18h38M5 28h38M19 8v32"/>',
    mindmap: '<circle cx="24" cy="24" r="6"/><circle cx="8" cy="10" r="4"/><circle cx="40" cy="10" r="4"/><circle cx="8" cy="38" r="4"/><circle cx="40" cy="38" r="4"/><path d="M11 13l8 7M37 13l-8 7M11 35l8-7M37 35l-8-7"/>',
    cards: '<rect x="8" y="14" width="26" height="24" rx="3"/><path d="M14 10h26a2 2 0 0 1 2 2v22M14 24h14"/>',
    shield: '<path d="M24 5l16 6v12c0 10-7 17-16 20C15 40 8 33 8 23V11z"/><path d="M17 24l5 5 9-10"/>',
    crown: '<path d="M6 36L4 16l10 9 10-15 10 15 10-9-2 20zM6 41h36"/>',
    sword: '<path d="M34 6l8-2-2 8-20 22-6-6zM14 30l-6 6 4 4 6-6"/>',
    tree: '<path d="M24 42V26M24 30l-10-8M24 24l10-8M24 14V6"/><circle cx="14" cy="20" r="4"/><circle cx="34" cy="14" r="4"/><circle cx="24" cy="6" r="3"/>',
    hourglass: '<path d="M12 6h24M12 42h24M14 6c0 10 10 12 10 18S14 32 14 42M34 6c0 10-10 12-10 18s10 8 10 18"/>',
    bubble: '<path d="M6 10h36v22H20l-9 8v-8H6z"/>',
    hash: '<path d="M18 8l-4 32M34 8l-4 32M8 18h34M6 30h34"/>',
    megaphone: '<path d="M6 20v8h8l16 10V10L14 20zM36 18a8 8 0 0 1 0 12M16 28l3 12h6l-3-9"/>',
    film: '<rect x="5" y="8" width="38" height="32" rx="2"/><path d="M13 8v32M35 8v32M5 16h8M5 24h8M5 32h8M35 16h8M35 24h8M35 32h8"/>',
    frame: '<path d="M6 16V6h10M32 6h10v10M42 32v10H32M16 42H6V32"/><circle cx="24" cy="24" r="5"/>',
    palette: '<path d="M24 5C12 5 5 14 5 24s8 19 18 19c4 0 5-3 3-6s0-6 4-6h6c4 0 7-3 7-7C43 11 35 5 24 5z"/><circle cx="14" cy="22" r="2"/><circle cx="22" cy="13" r="2"/><circle cx="32" cy="15" r="2"/>',
    ban: '<circle cx="24" cy="24" r="18"/><path d="M11 37L37 11"/>',
    pen: '<path d="M8 40l2-8L32 10l6 6-22 22zM28 14l6 6"/>',
    pulpit: '<path d="M10 12h28v8H10zM14 20l4 22h12l4-22M24 12V6"/>',
    gift: '<rect x="6" y="18" width="36" height="24" rx="2"/><path d="M4 12h40v6H4zM24 12v30M24 12c-6-8-14-4-10 0M24 12c6-8 14-4 10 0"/>',
    rings: '<circle cx="18" cy="28" r="10"/><circle cx="30" cy="28" r="10"/><path d="M14 14l4-6 4 6"/>',
    water: '<path d="M24 6c8 10 12 16 12 22a12 12 0 0 1-24 0c0-6 4-12 12-22z"/>',
    cloud: '<path d="M14 34a8 8 0 0 1 0-16 11 11 0 0 1 21-2 8 8 0 0 1 0 18z"/>',
    dove: '<path d="M6 26c8 0 12-4 14-10l8 6c4 3 10 3 14-2-2 10-10 16-20 16l-6 4 1-8c-5-1-8-3-11-6z"/>',
    sprout: '<path d="M24 42V24M24 24C24 14 16 10 8 10c0 10 6 14 16 14zM24 28c0-8 6-12 16-12 0 8-6 12-16 12z"/>',
    sun: '<circle cx="24" cy="24" r="8"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M38 10l-4 4M14 34l-4 4"/>',
    code: '<path d="M16 14L6 24l10 10M32 14l10 10-10 10M28 8l-8 32"/>',
    ruler: '<path d="M6 16h36v16H6zM12 16v6M18 16v9M24 16v6M30 16v9M36 16v6"/>',
    shapes: '<circle cx="14" cy="14" r="8"/><rect x="26" y="6" width="16" height="16" rx="2"/><path d="M24 44l-10-18h20z"/>',
    glasses: '<circle cx="14" cy="28" r="8"/><circle cx="34" cy="28" r="8"/><path d="M22 28h4M6 28L8 14M42 28l-2-14"/>',
    feather: '<path d="M38 6C20 8 10 20 10 36l-4 6M10 36c14 0 24-10 28-30zM16 30h12"/>',
    smile: '<circle cx="24" cy="24" r="18"/><path d="M16 28c4 6 12 6 16 0M17 18v2M31 18v2"/>',
    fork: '<path d="M24 6v12M24 18L10 42M24 18l14 24"/>',
    compare: '<path d="M6 12h14v28H6zM28 12h14v28H28zM21 26h6"/>',
    doc: '<path d="M12 6h18l8 8v28H12z"/><path d="M30 6v8h8M18 24h14M18 31h14"/>',
    headphones: '<path d="M8 30v-6a16 16 0 0 1 32 0v6"/><rect x="6" y="28" width="9" height="14" rx="3"/><rect x="33" y="28" width="9" height="14" rx="3"/>',
    mail: '<rect x="5" y="10" width="38" height="28" rx="3"/><path d="M5 14l19 14 19-14"/>',
    subtitle: '<rect x="5" y="9" width="38" height="30" rx="4"/><path d="M12 28h10M26 28h10M12 34h6M22 34h14"/>',
    letters: '<path d="M8 12h14M15 12v20M8 32h14M28 38l8-26 8 26M31 30h10"/>',
    cross: '<path d="M20 6h8v12h12v8H28v16h-8V26H8v-8h12z"/>'
  };

  /* Código → motivo */
  const BY = {
    book: '/meaning /explain /deepstudy /chapter /gospel /keywords /doctrine /theology /themes /connections /reflection',
    scroll: '/ancientpaper /summary /law /original',
    map: '/map /geography /place /city',
    timeline: '/timeline /journey /history /event /rise /fall',
    person: '/character /biography /faith /mistakes /lessons /death /legacy /characterref /scholarly',
    group: '/people /tribes /relationships /family /comparison /youth /familymessage',
    city: '/ancientcity /kingdom',
    temple: '/temple /templescene /archaeology',
    mountain: '/biblicaldesert /desert',
    desert: '/biblicaldesert /desert',
    moon: '/moonlight /night',
    flame: '/firelight /preaching',
    star: '/miracle /miraclelist /heaven /angel /goldenhour /premium /gold',
    eye: '/vision /apocalyptic /hiddenmeaning /secrets /unknown',
    camera: '/photorealistic /ultrarealistic /documentaryphoto /realistic /scene /imageprompt',
    clapper: '/cinematic /biblicalcinema /epicmovie /cinematiclight /cinematicposter /biblicalposter /epic /battle /videoprompt',
    mic: '/narration /voiceover /voiceprompt /dramaticvoice /cinematicvoice /whisper /pronunciation',
    wave: '/ssml /podcast',
    play: '/fullvideo /fullshort /fullreels /fulldocumentary /youtubelong /script /shortscript /reelsscript /shortsscript /tiktokscript',
    phone: '/instagram /reels /shorts /tiktok /story /storyformat /wallpaper /9:16 /portrait',
    carousel: '/carousel',
    poster: '/poster /versecard /verse /thumbnail /clickworthy /mysterythumbnail /scrollstopper',
    quote: '/quote /dramatictext /headline /viralheadline /curiositygap /caption',
    lines: '/sermon /sermonoutline /outline /blogpost /short /long',
    list: '/facts /question /miraclelist /parablelist /sources',
    question: '/quiz /curiosity /didyouknow /mystery /controversy /skeptic',
    bulb: '/lesson /application /wisdom /proverb /lifelesson /leadership /hook /viralhook /unknown',
    magnifier: '/seo /verifyverse /archaeology',
    link: '/crossreference /covenant /oldnew /connections /prophecies /fulfilled',
    scale: '/law /neutral',
    heart: '/hope /encouragement /faithmessage /gentle /gratitude /pastoral /meditation',
    prayer: '/prayer /devotional /morning /grief /funeral /anxiety',
    calendar: '/feasts /newyear /christmas /easter /pentecost /mothersday',
    globe: '/english /spanish /bilingual /translations /versions',
    table: '/table /tableformat /9:16 /4:5 /1:1 /16:9',
    mindmap: '/mindmap /symbolism /numbers /names',
    cards: '/flashcards /glossary',
    shield: '/noinvent /verifyverse',
    crown: '/kingdom',
    tree: '/genealogy',
    hourglass: '/churchhistory /ending',
    bubble: '/storytelling /parable /whatsapp /explain /dramatic /ancient',
    hash: '/hashtags',
    megaphone: '/cta',
    film: '/scenelist /shotlist /broll /consistency',
    frame: '/feedformat /youtube /landscape /minimal /minimalist /storyboard',
    palette: '/dark /softlight /dramaticlight /volumetric /historical /ancient',
    ban: '/negative',
    pen: '/poetry /psalm /original',
    pulpit: '/sermon /preaching',
    gift: '/christmas',
    rings: '/wedding',
    water: '/baptism',
    cloud: '/anxiety /grief',
    dove: '/pentecost /hope',
    sprout: '/newbeliever /newyear /rise',
    sun: '/goldenhour /gratitude',
    code: '/json',
    ruler: '/long /short',
    shapes: '/kids',
    glasses: '/scholarly /teen',
    feather: '/gentle /whisper',
    smile: '/humorsafe',
    fork: '/denominations',
    compare: '/translations /versions /comparison',
    doc: '/sources /blogpost',
    headphones: '/podcast',
    mail: '/newsletter /epistle',
    subtitle: '/subtitles',
    letters: '/original /keywords',
    cross: '/doctrine'
  };
  const CODE_MOTIF = {};
  Object.keys(BY).forEach(m => BY[m].split(' ').forEach(c => { if (!CODE_MOTIF[c]) CODE_MOTIF[c] = m; }));
  // Sobrescritas explícitas (primeira correspondência manda; estes têm prioridade)
  Object.assign(CODE_MOTIF, {
    '/sermon': 'pulpit', '/preaching': 'pulpit', '/christmas': 'gift', '/pentecost': 'dove', '/anxiety': 'cloud', '/grief': 'cloud',
    '/translations': 'compare', '/versions': 'compare', '/comparison': 'compare', '/original': 'letters', '/keywords': 'letters',
    '/kingdom': 'crown', '/doctrine': 'cross', '/law': 'scale', '/scholarly': 'glasses', '/teen': 'glasses', '/whisper': 'feather',
    '/podcast': 'headphones', '/newsletter': 'mail', '/epistle': 'mail', '/sources': 'doc', '/blogpost': 'doc', '/noinvent': 'shield',
    '/verifyverse': 'shield', '/gratitude': 'sun', '/hope': 'dove', '/newyear': 'sprout', '/newbeliever': 'sprout', '/rise': 'sprout',
    '/biblicaldesert': 'desert', '/ancientcity': 'city', '/ancient': 'bubble', '/minimal': 'frame', '/minimalist': 'frame',
    '/9:16': 'phone', '/4:5': 'frame', '/1:1': 'frame', '/16:9': 'frame', '/short': 'ruler', '/long': 'ruler',
    '/gold': 'crown', '/premium': 'crown', '/goldenhour': 'sun', '/ssml': 'wave', '/poetry': 'pen', '/psalm': 'pen',
    '/unknown': 'eye', '/hook': 'bulb', '/viralhook': 'megaphone', '/dramatic': 'palette', '/explain': 'bubble'
  });
  const KIND_MOTIF = { study: 'book', text: 'lines', scene: 'camera', layout: 'poster', style: 'palette', platform: 'phone', fmt: 'frame', voice: 'mic', full: 'play', meta: 'film', mod: 'lines' };

  const motifFor = c => CODE_MOTIF[c.code] || KIND_MOTIF[c.kind] || 'book';

  /* Rótulo curto "saída" sob o motivo, por tipo de código */
  const KIND_LABEL = { study: 'análise', text: 'texto', scene: 'cena', layout: 'peça', style: 'estilo', platform: 'formato', fmt: 'proporção', voice: 'voz', full: 'pacote', meta: 'prompt', mod: 'ajuste' };

  function illus(c) {
    const m = M[motifFor(c)] || M.book;
    const label = (KIND_LABEL[c.kind] || '').toUpperCase();
    return '<svg class="illus" viewBox="0 0 160 70" role="img" aria-label="Ilustração: ' + c.code + ' transforma a passagem em ' + (KIND_LABEL[c.kind] || 'resultado') + '" focusable="false">' +
      '<g class="il-doc"><rect x="8" y="9" width="36" height="46" rx="4"/><path d="M15 21h22M15 29h22M15 37h14"/></g>' +
      '<g class="il-arrow"><path d="M52 32h30"/><path d="M76 26l6 6-6 6"/></g>' +
      '<g class="il-out" transform="translate(92 6) scale(1.0)">' + m + '</g>' +
      '<text class="il-lbl" x="116" y="64" text-anchor="middle">' + label + '</text></svg>';
  }

  g.GS_ILLUS = { illus, motifFor, MOTIFS: M };
  if (typeof module !== 'undefined') module.exports = g.GS_ILLUS;
})(typeof window !== 'undefined' ? window : globalThis);
