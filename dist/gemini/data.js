/* Gemini Style — Biblioteca de Comandos Bíblicos (dados)
   Para adicionar códigos/categorias: inclua uma linha em uma seção de SECTIONS,
   um item em VIEWS ou COMBOS. Nenhuma outra parte da arquitetura precisa mudar. */
(function (g) {
  'use strict';

  /* ---------- Regras globais (seções 18, 19 e 20) ---------- */
  const RULES = {
    fidelity: 'Fidelidade bíblica: não invente versículos, acontecimentos ou personagens inexistentes. Quando houver diferença entre texto bíblico, tradição religiosa, interpretação teológica, evidência histórica e hipótese acadêmica, deixe isso claramente identificado. Nunca apresente uma tradição posterior como se estivesse literalmente descrita na Bíblia.',
    image: 'Regras para imagens: preserve a coerência histórica; evite roupas e objetos modernos; use arquitetura plausível; respeite a localização geográfica e a descrição bíblica disponível; evite elementos fantasiosos não solicitados.',
    imageRealistic: 'Priorize realismo cinematográfico na imagem.',
    character: 'Personagens: quando a aparência física não for explicitamente descrita no texto bíblico, não declare características inventadas como fatos; crie uma aparência historicamente plausível com base na região, na época, na população e no contexto cultural.'
  };

  /* ---------- Seções: [code, nome, descrição, prompt, tags, (clause curta opcional)] ----------
     kind: study | text | scene | layout | style | platform | fmt | voice | full | meta
     phase (ordem no prompt final): 1 gancho, 2 análise, 3 narrativa, 4 voz, 5 visual, 6 plataforma/formato, 7 encerramento */
  const SECTIONS = [
    { cat: 'Estudo', views: ['estudo'], kind: 'study', phase: 2, sample: 'João 3:16', rows: [
      ['/reflection', 'Reflection', 'Cria uma reflexão profunda baseada no texto bíblico.', 'Analise a passagem bíblica fornecida e produza uma reflexão profunda, clara e espiritualmente relevante. Identifique a principal mensagem, sua aplicação prática e a lição central para a vida contemporânea. Não altere o significado original da passagem.', 'reflexão meditação mensagem lição espiritual estudo bíblia', 'produza uma reflexão profunda, clara e espiritualmente relevante, identificando a principal mensagem, sua aplicação prática e a lição central para a vida contemporânea, sem alterar o significado original da passagem'],
      ['/meaning', 'Meaning', 'Explica o significado central da passagem.', 'Explique de forma clara e objetiva o significado principal desta passagem bíblica, considerando contexto, intenção do autor e mensagem central.', 'significado sentido mensagem central explicação autor', 'explique de forma clara e objetiva o significado principal da passagem, considerando contexto, intenção do autor e mensagem central'],
      ['/context', 'Context', 'Explica o contexto histórico, cultural, político, religioso e social.', 'Apresente o contexto histórico, cultural, religioso, político e social relacionado à passagem bíblica fornecida. Explique costumes, instituições, povos, tradições e acontecimentos necessários para compreender corretamente o texto.', 'contexto história cultura política religião sociedade costumes histórico', 'explique brevemente o contexto histórico, cultural, religioso, político e social necessário para compreender corretamente o texto'],
      ['/explain', 'Explain', 'Explicação simples e acessível.', 'Explique esta passagem bíblica em linguagem simples e acessível, preservando seu significado original.', 'simples explicação fácil iniciante linguagem acessível', 'explique a passagem em linguagem simples e acessível, preservando seu significado original'],
      ['/deepstudy', 'Deep Study', 'Estudo bíblico aprofundado.', 'Realize um estudo bíblico aprofundado da passagem, analisando contexto histórico, estrutura literária, palavras-chave, personagens, temas, referências relacionadas, aplicações práticas e principais interpretações cristãs.', 'estudo profundo aprofundado completo análise exegese teologia'],
      ['/chapter', 'Chapter', 'Resumo e análise de um capítulo inteiro.', 'Analise todo o capítulo informado e apresente seus acontecimentos principais, ensinamentos, personagens, temas centrais e conclusão.', 'capítulo resumo livro acontecimentos análise'],
      ['/summary', 'Summary', 'Resumo rápido e objetivo.', 'Resuma a passagem bíblica de forma objetiva, preservando os acontecimentos e ensinamentos essenciais.', 'resumo rápido síntese curto objetivo', 'resuma a passagem de forma objetiva, preservando os acontecimentos e ensinamentos essenciais'],
      ['/lesson', 'Lesson', 'Destaca o principal ensinamento.', 'Identifique as principais lições espirituais e práticas presentes nesta passagem.', 'lição ensinamento aprendizado moral princípio', 'identifique as principais lições espirituais e práticas da passagem'],
      ['/application', 'Application', 'Aplicação moderna e responsável.', 'Mostre como os princípios apresentados nesta passagem podem ser aplicados de maneira responsável à vida contemporânea.', 'aplicação prática hoje vida moderna cotidiano', 'mostre como seus princípios podem ser aplicados de maneira responsável à vida contemporânea'],
      ['/question', 'Questions', 'Perguntas de estudo e reflexão.', 'Crie perguntas de reflexão e estudo bíblico relacionadas ao texto, indo de questões simples de compreensão até perguntas profundas de aplicação.', 'perguntas questionário grupo célula estudo reflexão discussão'],
      ['/keywords', 'Keywords', 'Palavras-chave e conceitos importantes.', 'Identifique e explique as palavras, conceitos e expressões mais importantes presentes na passagem.', 'palavras chave termos conceitos original hebraico grego vocabulário'],
      ['/themes', 'Themes', 'Temas teológicos, históricos e morais.', 'Identifique os principais temas teológicos, históricos, espirituais e morais presentes no texto.', 'temas teologia moral espiritual assunto', 'identifique os principais temas teológicos, históricos, espirituais e morais'],
      ['/crossreference', 'Cross Reference', 'Referências cruzadas com outras passagens.', 'Apresente outras passagens bíblicas relacionadas ao tema desta passagem e explique brevemente a conexão entre elas.', 'referências cruzadas passagens relacionadas conexão versículos paralelos', 'apresente outras passagens bíblicas relacionadas ao tema e explique brevemente a conexão entre elas'],
      ['/theology', 'Theology', 'Análise teológica da passagem.', 'Analise os temas teológicos presentes na passagem, apresentando interpretações reconhecidas dentro da tradição cristã quando houver divergências relevantes.', 'teologia teológica interpretação tradição cristã doutrina análise'],
      ['/doctrine', 'Doctrine', 'Doutrinas cristãs relacionadas.', 'Identifique quais doutrinas cristãs estão relacionadas à passagem e explique a relação de forma clara e contextualizada.', 'doutrina doutrinas dogma fé cristã ensino']
    ]},
    { cat: 'História e Contexto', views: ['historia'], kind: 'study', phase: 2, sample: 'Êxodo 14', rows: [
      ['/history', 'History', 'Acontecimentos históricos e cronologia.', 'Explique os acontecimentos históricos relacionados à passagem e situe-os cronologicamente.', 'história histórico cronologia acontecimentos época período', 'explique os acontecimentos históricos relacionados e situe-os cronologicamente'],
      ['/culture', 'Culture', 'Costumes, vestimentas, alimentação e cotidiano.', 'Descreva costumes, práticas sociais, vestimentas, alimentação, religião, economia e cotidiano relevantes para compreender a passagem.', 'cultura costumes vestimenta comida cotidiano sociedade economia', 'descreva os costumes, as práticas sociais e o cotidiano relevantes para compreender a passagem'],
      ['/people', 'People', 'Personagens mencionados e seus papéis.', 'Identifique os principais personagens mencionados e apresente quem eram, seu papel e sua relação com os acontecimentos.', 'personagens pessoas quem era figuras envolvidos'],
      ['/character', 'Character', 'Perfil completo de um personagem bíblico.', 'Crie um perfil completo do personagem bíblico solicitado, incluindo origem, contexto, principais acontecimentos, virtudes, falhas, relacionamentos e legado.', 'personagem perfil caráter biografia pessoa virtudes falhas'],
      ['/place', 'Place', 'Descrição detalhada de um local bíblico.', 'Descreva detalhadamente o local bíblico mencionado, incluindo geografia, arquitetura, paisagem, clima e importância histórica.', 'local lugar cenário geografia mapa paisagem região'],
      ['/map', 'Map', 'Mapa conceitual de lugares e trajetos.', 'Crie uma representação cartográfica conceitual dos lugares e deslocamentos mencionados na passagem, destacando cidades, regiões, rios, montanhas e trajetos.', 'mapa mapas cartografia geografia lugares rotas viagens cidades'],
      ['/journey', 'Journey', 'Jornada cronológica dos personagens.', 'Reconstrua cronologicamente a jornada ou deslocamento dos personagens mencionados.', 'jornada viagem rota trajeto percurso mapa deslocamento caminho'],
      ['/timeline', 'Timeline', 'Linha do tempo dos acontecimentos.', 'Organize os acontecimentos em ordem cronológica e produza uma linha do tempo clara.', 'linha do tempo cronologia ordem datas sequência história'],
      ['/kingdom', 'Kingdom', 'Reino, império ou autoridade política.', 'Explique o reino, império ou autoridade política relacionada à passagem.', 'reino império política governo rei autoridade'],
      ['/archaeology', 'Archaeology', 'Evidências arqueológicas e tradições.', 'Apresente informações arqueológicas relevantes relacionadas aos lugares, povos ou acontecimentos citados, distinguindo evidências arqueológicas de tradições religiosas.', 'arqueologia escavações evidências descobertas ruínas história'],
      ['/geography', 'Geography', 'Geografia, relevo, clima e recursos.', 'Explique a geografia da região, incluindo relevo, distância, clima, recursos naturais e importância estratégica.', 'geografia relevo clima região mapa território distância'],
      ['/city', 'City', 'História de uma cidade bíblica.', 'Apresente a história da cidade bíblica citada, sua localização, importância econômica, política e religiosa.', 'cidade jerusalém belém babilônia nínive história lugar mapa'],
      ['/temple', 'Temple', 'Templo, tabernáculo e simbolismo.', 'Explique o templo, tabernáculo ou estrutura religiosa mencionada, incluindo arquitetura, funções e simbolismo.', 'templo tabernáculo santuário arquitetura culto simbolismo'],
      ['/tribes', 'Tribes', 'Tribos de Israel e sua participação.', 'Identifique as tribos de Israel relacionadas ao texto e explique sua participação histórica.', 'tribos israel doze tribos povo herança'],
      ['/genealogy', 'Genealogy', 'Genealogia e relações familiares.', 'Organize a genealogia dos personagens citados e apresente suas relações familiares de forma clara.', 'genealogia família árvore descendentes linhagem pais filhos', null, ['personagens', 'linhas']]
    ]},
    { cat: 'Imagem', views: ['imagens', 'cinema'], kind: 'scene', phase: 5, sample: 'Davi contra Golias', rows: [
      ['/scene', 'Scene', 'Transforma a passagem em cena visual coerente.', 'Transforme a passagem em uma cena visual detalhada e historicamente coerente.', 'cena imagem visual ilustração arte momento'],
      ['/cinematic', 'Cinematic', 'Transforma uma passagem bíblica em cena cinematográfica épica.', 'Crie uma representação cinematográfica épica, realista e emocionalmente impactante da passagem.', 'cinema imagem bíblia épico filme realismo cena visual cinematográfico', null, ['cinema'], 'style'],
      ['/biblicalcinema', 'Biblical Cinema', 'Superprodução bíblica de alto orçamento.', 'Represente a passagem como uma produção cinematográfica bíblica de alto orçamento, com cenografia histórica, iluminação dramática e composição cinematográfica.', 'cinema bíblico superprodução filme hollywood cenografia', null, ['cinema'], 'style'],
      ['/epic', 'Epic', 'Amplifica a escala e a grandiosidade.', 'Amplifique a escala visual da cena, enfatizando grandiosidade, ambiente, multidões, arquitetura e atmosfera.', 'épico grandioso escala multidões monumental', null, ['cinema'], 'style'],
      ['/realistic', 'Realistic', 'Estética fotorrealista e natural.', 'Use estética fotorrealista, iluminação natural, materiais realistas, proporções humanas naturais e textura cinematográfica.', 'realista fotorrealismo natural textura realismo', null, ['cinema'], 'style'],
      ['/ancient', 'Ancient', 'Estética histórica da Antiguidade.', 'Adote estética histórica da Antiguidade, respeitando arquitetura, tecidos, objetos, ferramentas e ambiente da época.', 'antigo antiguidade histórico época tecidos arquitetura', null, [], 'style'],
      ['/dramatic', 'Dramatic', 'Iluminação dramática e atmosfera intensa.', 'Utilize iluminação dramática, contraste, composição emocional e atmosfera intensa.', 'dramático contraste emoção intenso luz', null, ['cinema'], 'style'],
      ['/miracle', 'Miracle', 'Representa um milagre de forma respeitosa.', 'Represente visualmente o milagre narrado na passagem de maneira respeitosa, cinematográfica e coerente com o texto.', 'milagre milagres sobrenatural cura Jesus cena', null, ['cinema']],
      ['/battle', 'Battle', 'Batalha bíblica historicamente inspirada.', 'Crie uma cena de batalha bíblica historicamente inspirada, com armas, vestimentas, terreno e exércitos adequados ao período.', 'batalha guerra exército armas combate Davi Golias', null, ['cinema']],
      ['/desert', 'Desert', 'Paisagem desértica bíblica.', 'Crie uma paisagem bíblica desértica com relevo, iluminação, vegetação e atmosfera historicamente plausíveis.', 'deserto paisagem areia êxodo cenário', null, []],
      ['/templescene', 'Temple Scene', 'Cena no templo ou tabernáculo.', 'Crie uma cena ambientada no templo ou tabernáculo mencionado no texto.', 'templo tabernáculo cena santuário culto sacerdote', null, ['cinema']],
      ['/heaven', 'Heaven', 'Representação simbólica do céu.', 'Crie uma representação artística e simbólica do céu baseada na descrição bíblica fornecida, evitando afirmar que se trata de uma reprodução literal.', 'céu paraíso glória celestial apocalipse trono', null, ['profecias']],
      ['/angel', 'Angel', 'Anjos conforme a descrição do texto.', 'Crie uma representação visual de anjos baseada especificamente na descrição da passagem fornecida.', 'anjo anjos querubins serafins celestial mensageiro', null, []],
      ['/prophecy', 'Prophecy', 'Profecia como imagem simbólica e cinematográfica.', 'Transforme a profecia descrita na passagem em uma representação visual simbólica e cinematográfica.', 'profecia profético símbolo visão imagem apocalipse', null, ['profecias', 'cinema']],
      ['/vision', 'Vision', 'Visão bíblica com seus símbolos.', 'Represente artisticamente a visão bíblica narrada no texto, destacando seus símbolos e elementos descritos.', 'visão visões símbolos Daniel Ezequiel Apocalipse arte', null, ['profecias']]
    ]},
    { cat: 'Redes Sociais', views: ['social'], kind: 'layout', phase: 5, sample: 'Salmo 23', rows: [
      ['/verse', 'Verse', 'Composição visual do versículo.', 'Selecione ou utilize o versículo indicado e crie uma composição visual impactante, legível e apropriada para redes sociais.', 'versículo texto cartaz social post imagem frase', null, ['devocionais']],
      ['/versecard', 'Verse Card', 'Card elegante para o versículo.', 'Crie um card visual elegante para apresentar o versículo.', 'card versículo cartão post arte tipografia'],
      ['/instagram', 'Instagram', 'Otimiza para Instagram.', 'Otimize o conteúdo para publicação no Instagram, priorizando leitura rápida, estética premium e alto impacto visual.', 'instagram feed post rede social', null, [], 'platform'],
      ['/reels', 'Reels', 'Adapta para Instagram Reels.', 'Adapte o conteúdo para Instagram Reels, com estrutura rápida, gancho inicial, desenvolvimento e encerramento.', 'reels instagram vídeo curto vertical social', null, ['videos'], 'platform'],
      ['/shorts', 'Shorts', 'Adapta para YouTube Shorts.', 'Adapte o conteúdo para YouTube Shorts com foco em retenção e clareza.', 'shorts youtube vídeo curto vertical retenção', null, ['videos'], 'platform'],
      ['/tiktok', 'TikTok', 'Adapta para TikTok.', 'Adapte o conteúdo para TikTok utilizando narrativa rápida, linguagem clara e alta retenção.', 'tiktok vídeo curto vertical retenção viral', null, ['videos'], 'platform'],
      ['/story', 'Story', 'Adapta para Stories verticais.', 'Adapte o conteúdo para Stories em formato vertical.', 'story stories vertical instagram rede social', null, [], 'platform'],
      ['/carousel', 'Carousel', 'Carrossel organizado em páginas.', 'Transforme o conteúdo em um carrossel organizado por páginas, começando com uma capa forte e terminando com uma conclusão.', 'carrossel slides páginas instagram educativo sequência'],
      ['/poster', 'Poster', 'Composição em formato de pôster.', 'Crie uma composição em formato de pôster.', 'pôster poster cartaz arte capa'],
      ['/quote', 'Quote', 'Frase curta e visualmente forte.', 'Transforme a principal mensagem em uma frase curta e visualmente forte.', 'frase citação mensagem curta impacto texto', null, [], 'text'],
      ['/wallpaper', 'Wallpaper', 'Papel de parede para smartphone.', 'Crie uma composição adequada para papel de parede de smartphone.', 'wallpaper papel de parede celular fundo vertical'],
      ['/minimalist', 'Minimalist', 'Poucos elementos e amplo espaço negativo.', 'Utilize composição minimalista, poucos elementos, forte hierarquia visual e amplo espaço negativo.', 'minimalista minimal limpo simples espaço', null, [], 'style'],
      ['/dark', 'Dark', 'Estética escura, cinematográfica e sofisticada.', 'Utilize estética escura, cinematográfica e sofisticada.', 'escuro dark sombrio sofisticado noite', null, [], 'style'],
      ['/gold', 'Gold', 'Preto, dourado e iluminação premium.', 'Utilize estética elegante com preto, dourado e iluminação premium.', 'dourado ouro preto luxo premium elegante', null, [], 'style'],
      ['/ancientpaper', 'Ancient Paper', 'Papiro ou pergaminho antigo.', 'Utilize estética inspirada em papiro ou pergaminho antigo.', 'papiro pergaminho antigo papel textura manuscrito', null, [], 'style']
    ]},
    { cat: 'Vídeo', views: ['videos'], kind: 'text', phase: 3, sample: 'Daniel na cova dos leões', rows: [
      ['/script', 'Script', 'Roteiro completo sobre o tema.', 'Crie um roteiro completo sobre o tema bíblico informado.', 'roteiro vídeo script texto completo youtube'],
      ['/shortscript', 'Short Script', 'Roteiro curto e envolvente.', 'Crie um roteiro curto, direto e envolvente.', 'roteiro curto vídeo rápido short'],
      ['/reelsscript', 'Reels Script', 'Roteiro para Instagram Reels.', 'Crie roteiro otimizado para Instagram Reels.', 'roteiro reels instagram vídeo'],
      ['/shortsscript', 'Shorts Script', 'Roteiro para YouTube Shorts.', 'Crie roteiro otimizado para YouTube Shorts.', 'roteiro shorts youtube vídeo'],
      ['/tiktokscript', 'TikTok Script', 'Roteiro para TikTok.', 'Crie roteiro otimizado para TikTok.', 'roteiro tiktok vídeo'],
      ['/narration', 'Narration', 'Texto natural para narração em voz.', 'Produza texto natural para narração em voz.', 'narração voz locução áudio vídeo', null, ['narracao'], 'voice', 4],
      ['/voiceover', 'Voiceover', 'Narração fluida para sintetizadores.', 'Crie uma narração fluida, natural e otimizada para sintetizadores de voz.', 'narração voz sintetizador elevenlabs áudio locução', null, ['narracao'], 'voice', 4],
      ['/hook', 'Hook', 'Abertura curta que desperta curiosidade.', 'Crie uma abertura curta capaz de despertar curiosidade imediatamente.', 'gancho abertura início curiosidade vídeo retenção', null, ['narracao'], 'text', 1],
      ['/viralhook', 'Viral Hook', 'Gancho forte, sem clickbait enganoso.', 'Crie um gancho extremamente forte nos primeiros segundos, sem utilizar clickbait enganoso.', 'gancho viral abertura retenção vídeo impacto', null, ['narracao'], 'text', 1],
      ['/storytelling', 'Storytelling', 'Conta a passagem como uma história.', 'Conte a passagem como uma história envolvente, preservando os acontecimentos bíblicos.', 'história narrativa contar storytelling vídeo envolvente'],
      ['/documentary', 'Documentary', 'Roteiro documental com contexto.', 'Transforme o conteúdo em roteiro documental, combinando narração, contexto histórico, acontecimentos e explicações.', 'documentário vídeo roteiro história narração longo youtube'],
      ['/mystery', 'Mystery', 'Formato investigativo sem especulação como fato.', 'Apresente o tema em formato investigativo, destacando dúvidas, interpretações debatidas e elementos pouco conhecidos, sem apresentar especulação como fato.', 'mistério enigma investigação dúvida debate segredo', null, ['misterios', 'curiosidades']],
      ['/dramaticvoice', 'Dramatic Voice', 'Narração intensa, pausada e emocional.', 'Produza narração intensa, pausada e emocional.', 'voz dramática narração emoção pausa intensa', null, ['narracao'], 'voice', 4],
      ['/cinematicvoice', 'Cinematic Voice', 'Narração cinematográfica e épica.', 'Produza narração cinematográfica, épica e envolvente.', 'voz cinematográfica narração épica trailer', null, ['narracao'], 'voice', 4],
      ['/ending', 'Ending', 'Encerramento forte e memorável.', 'Crie um encerramento forte, reflexivo e memorável.', 'final encerramento conclusão fechamento cta', null, ['narracao'], 'text', 7]
    ]},
    { cat: 'Curiosidades', views: ['curiosidades'], kind: 'study', phase: 2, sample: 'Jericó', rows: [
      ['/curiosity', 'Curiosity', 'Uma curiosidade relevante sobre o tema.', 'Apresente uma curiosidade relevante relacionada ao texto ou tema.', 'curiosidade curiosidades interessante fato'],
      ['/unknown', 'Unknown', 'Fatos pouco conhecidos, com fontes diferenciadas.', 'Apresente fatos pouco conhecidos relacionados ao assunto, diferenciando fatos históricos, tradições e hipóteses.', 'pouco conhecido desconhecido segredo fatos curiosidade mistério', null, ['misterios']],
      ['/secrets', 'Secrets', 'Detalhes menos conhecidos, sem tratar especulação como fato.', 'Explore detalhes, conexões e elementos menos conhecidos da passagem sem tratar especulações como fatos.', 'segredos detalhes ocultos conexões mistério', null, ['misterios']],
      ['/didyouknow', 'Did You Know', 'Formato “Você sabia?”.', "Transforme o conteúdo no formato 'Você sabia?', começando com uma informação capaz de despertar curiosidade.", 'você sabia curiosidade fato curto gancho'],
      ['/controversy', 'Controversy', 'Interpretações diferentes, de forma equilibrada.', 'Apresente diferentes interpretações existentes sobre o tema de maneira equilibrada.', 'controvérsia debate interpretações divergência polêmica', null, ['misterios']],
      ['/hiddenmeaning', 'Hidden Meaning', 'Significados simbólicos menos evidentes.', 'Explore significados simbólicos e contextuais menos evidentes, deixando claro quando uma interpretação não é consenso.', 'significado oculto simbólico escondido mistério interpretação', null, ['misterios']],
      ['/symbolism', 'Symbolism', 'Símbolos e suas funções literárias e teológicas.', 'Identifique os principais símbolos presentes na passagem e explique suas possíveis funções literárias e teológicas.', 'símbolos simbolismo significado imagem figuras', 'identifique os principais símbolos e explique suas possíveis funções literárias e teológicas', ['misterios', 'profecias']],
      ['/numbers', 'Numbers', 'Números e seu significado contextual.', 'Analise números presentes no texto e explique seu significado contextual ou simbólico quando houver evidências.', 'números sete quarenta doze simbolismo numerologia'],
      ['/names', 'Names', 'Significado linguístico e histórico de nomes.', 'Explique o significado linguístico e histórico dos nomes mencionados.', 'nomes significado etimologia hebraico grego origem'],
      ['/prophecies', 'Prophecies', 'Profecias e suas conexões.', 'Identifique profecias relacionadas ao tema e apresente sua relação com outras passagens.', 'profecias profecia profético cumprimento conexão', null, ['profecias']],
      ['/connections', 'Connections', 'Conexões temáticas, históricas e literárias.', 'Mostre conexões temáticas, históricas e literárias com outras partes da Bíblia.', 'conexões ligações relações referências temas', null, []],
      ['/oldnew', 'Old & New', 'Relações entre Antigo e Novo Testamento.', 'Mostre relações entre o Antigo e o Novo Testamento.', 'antigo novo testamento ligação tipologia continuidade', null, ['profecias']],
      ['/fulfilled', 'Fulfilled', 'Cumprimentos de profecias segundo tradições cristãs.', 'Apresente passagens que tradições cristãs interpretam como cumprimento de profecias, diferenciando interpretação teológica de evidência histórica.', 'cumprimento cumprida profecia messias tradição', null, ['profecias']],
      ['/facts', 'Facts', 'Lista organizada de fatos importantes.', 'Apresente uma lista organizada de fatos importantes relacionados ao tema.', 'fatos lista informações resumo dados']
    ]},
    { cat: 'Personagens', views: ['personagens'], kind: 'study', phase: 2, sample: 'Pedro', rows: [
      ['/biography', 'Biography', 'Biografia detalhada do personagem.', 'Crie uma biografia detalhada do personagem com base no texto bíblico.', 'biografia vida personagem história pessoa'],
      ['/rise', 'Rise', 'Ascensão, liderança e crescimento.', 'Explique os acontecimentos relacionados à ascensão, liderança ou crescimento do personagem.', 'ascensão liderança crescimento sucesso chamado'],
      ['/fall', 'Fall', 'Queda, derrota ou declínio.', 'Explique acontecimentos relacionados à queda, derrota ou declínio.', 'queda derrota declínio pecado fracasso'],
      ['/faith', 'Faith', 'Episódios de fé do personagem.', 'Identifique episódios de fé relacionados ao personagem.', 'fé confiança obediência episódios crença'],
      ['/mistakes', 'Mistakes', 'Erros e conflitos segundo a narrativa.', 'Apresente erros, conflitos e decisões problemáticas do personagem segundo a narrativa bíblica.', 'erros falhas pecados decisões conflitos fraquezas'],
      ['/lessons', 'Lessons', 'Lições da trajetória do personagem.', 'Extraia lições da trajetória do personagem.', 'lições aprendizado trajetória exemplo'],
      ['/family', 'Family', 'Relacionamentos familiares.', 'Apresente seus principais relacionamentos familiares.', 'família pais filhos esposa irmãos parentes'],
      ['/relationships', 'Relationships', 'Relação com outras figuras bíblicas.', 'Explique a relação do personagem com outras figuras bíblicas.', 'relacionamentos amigos inimigos conexão pessoas'],
      ['/legacy', 'Legacy', 'Influência e legado.', 'Explique a influência e o legado do personagem.', 'legado influência impacto herança história'],
      ['/death', 'Death', 'Circunstâncias da morte, distinguindo tradição e texto.', 'Explique as circunstâncias da morte quando informadas por fontes bíblicas ou históricas, distinguindo tradição de texto bíblico.', 'morte martírio fim da vida tradição'],
      ['/comparison', 'Comparison', 'Comparação factual entre personagens.', 'Compare os personagens solicitados de forma factual, considerando trajetória, contexto, decisões e papel na narrativa.', 'comparação comparar diferenças semelhanças personagens']
    ]},
    { cat: 'Sermões e Devocionais', views: ['sermoes', 'devocionais'], kind: 'text', phase: 3, sample: 'Salmo 91', rows: [
      ['/sermon', 'Sermon', 'Sermão completo com introdução a conclusão.', 'Crie um sermão completo baseado na passagem, contendo introdução, contexto, desenvolvimento, aplicações práticas e conclusão.', 'sermão pregação mensagem igreja culto pastor', null, ['sermoes']],
      ['/sermonoutline', 'Sermon Outline', 'Esboço de sermão em tópicos.', 'Crie um esboço de sermão organizado em tópicos.', 'esboço sermão tópicos estrutura pregação', null, ['sermoes']],
      ['/preaching', 'Preaching', 'Mensagem adequada para pregação.', 'Prepare uma mensagem adequada para pregação.', 'pregação mensagem pregar púlpito igreja', null, ['sermoes']],
      ['/devotional', 'Devotional', 'Devocional curto e edificante.', 'Crie um devocional curto e edificante baseado na passagem.', 'devocional edificante diário leitura fé', null, ['devocionais']],
      ['/morning', 'Morning', 'Devocional breve para começar o dia.', 'Crie um devocional breve para começar o dia.', 'manhã bom dia início do dia devocional', null, ['devocionais']],
      ['/night', 'Night', 'Reflexão noturna.', 'Crie uma reflexão noturna baseada na passagem.', 'noite boa noite descanso reflexão devocional', null, ['devocionais']],
      ['/prayer', 'Prayer', 'Oração inspirada no texto.', 'Crie uma oração inspirada nos temas apresentados no texto.', 'oração orar prece súplica devocional', null, ['devocionais']],
      ['/meditation', 'Meditation', 'Meditação calma e contemplativa.', 'Crie uma meditação bíblica calma e contemplativa.', 'meditação contemplação paz calma silêncio', null, ['devocionais']],
      ['/encouragement', 'Encouragement', 'Mensagem de encorajamento.', 'Produza uma mensagem de encorajamento baseada nos princípios do texto.', 'encorajamento ânimo consolo força motivação', null, ['devocionais']],
      ['/faithmessage', 'Faith Message', 'Mensagem sobre fé.', 'Crie uma mensagem sobre fé baseada na passagem.', 'fé confiança mensagem crer', null, ['devocionais']],
      ['/hope', 'Hope', 'Mensagem de esperança.', 'Crie uma mensagem sobre esperança.', 'esperança consolo futuro confiança', null, ['devocionais']],
      ['/wisdom', 'Wisdom', 'Princípios de sabedoria.', 'Extraia princípios de sabedoria presentes no texto.', 'sabedoria provérbios princípios conselho', null, ['sermoes']],
      ['/familymessage', 'Family Message', 'Reflexão para a vida familiar.', 'Crie uma reflexão aplicável à vida familiar.', 'família lar casamento filhos reflexão', null, ['devocionais']],
      ['/leadership', 'Leadership', 'Princípios de liderança.', 'Extraia princípios de liderança presentes no texto.', 'liderança líder gestão serviço exemplo', null, ['sermoes']],
      ['/lifelesson', 'Life Lesson', 'Lição principal aplicada à vida.', 'Transforme o ensinamento principal em uma lição aplicável à vida.', 'lição de vida ensinamento prática cotidiano', null, ['devocionais']]
    ]},
    { cat: 'Thumbnails', views: ['thumbs'], kind: 'layout', phase: 5, sample: 'Ressurreição de Lázaro', rows: [
      ['/thumbnail', 'Thumbnail', 'Composição otimizada para thumbnail de YouTube.', 'Crie uma composição visual otimizada para thumbnail de YouTube, com ponto focal forte, contraste e leitura rápida.', 'thumbnail miniatura capa youtube clique'],
      ['/clickworthy', 'Click Worthy', 'Thumbnail chamativa, sem enganar.', 'Crie thumbnail visualmente chamativa e curiosa sem utilizar afirmações falsas ou enganosas.', 'chamativa clique curiosidade thumbnail atenção'],
      ['/scrollstopper', 'Scroll Stopper', 'Visual que interrompe a rolagem.', 'Crie um visual pensado para interromper o movimento de rolagem e gerar atenção imediata.', 'rolagem atenção impacto viral feed parar'],
      ['/mysterythumbnail', 'Mystery Thumbnail', 'Thumbnail com atmosfera de mistério.', 'Crie thumbnail com atmosfera de mistério bíblico.', 'mistério thumbnail suspense enigma capa'],
      ['/biblicalposter', 'Biblical Poster', 'Pôster cinematográfico bíblico.', 'Crie pôster cinematográfico inspirado na narrativa bíblica.', 'pôster bíblico filme cartaz capa cinema', null, ['cinema']],
      ['/cinematicposter', 'Cinematic Poster', 'Pôster com composição profissional.', 'Crie pôster com composição cinematográfica profissional.', 'pôster cinematográfico cartaz filme capa', null, ['cinema']],
      ['/headline', 'Headline', 'Título curto e impactante.', 'Crie um título curto e impactante.', 'título manchete headline chamada texto', null, [], 'text'],
      ['/viralheadline', 'Viral Headline', 'Títulos de alta curiosidade, sem falsas promessas.', 'Crie títulos de alta curiosidade e retenção, sem promessas falsas.', 'título viral curiosidade retenção youtube', null, [], 'text'],
      ['/curiositygap', 'Curiosity Gap', 'Título que desperta curiosidade sem entregar a resposta.', 'Crie um título que desperte curiosidade sem revelar imediatamente a resposta.', 'título curiosidade lacuna suspense pergunta', null, [], 'text'],
      ['/dramatictext', 'Dramatic Text', 'Frase curta e dramática sobre a imagem.', 'Crie uma frase curta e dramática para utilização sobre a imagem.', 'frase dramática texto sobre imagem impacto', null, [], 'text']
    ]},
    { cat: 'Formato', views: ['imagens'], kind: 'fmt', phase: 6, sample: '', rows: [
      ['/9:16', '9:16', 'Vertical para Reels, TikTok e Shorts.', 'Use composição vertical na proporção 9:16.', 'vertical reels tiktok shorts story formato proporção', null, ['videos']],
      ['/4:5', '4:5', 'Feed do Instagram.', 'Use composição vertical na proporção 4:5.', 'feed instagram vertical formato proporção'],
      ['/1:1', '1:1', 'Quadrado.', 'Use composição quadrada na proporção 1:1.', 'quadrado formato proporção post'],
      ['/16:9', '16:9', 'YouTube e apresentações horizontais.', 'Use composição horizontal na proporção 16:9.', 'horizontal youtube apresentação widescreen formato'],
      ['/storyformat', 'Story Format', '1080 × 1920.', 'Use composição vertical em 1080 × 1920 pixels.', 'story 1080 1920 vertical formato'],
      ['/feedformat', 'Feed Format', '1080 × 1350.', 'Use composição vertical em 1080 × 1350 pixels.', 'feed 1080 1350 instagram formato'],
      ['/youtube', 'YouTube', '1920 × 1080.', 'Use composição horizontal em 1920 × 1080 pixels, otimizada para YouTube.', 'youtube 1920 1080 horizontal formato'],
      ['/portrait', 'Portrait', 'Composição vertical.', 'Use composição vertical.', 'retrato vertical orientação formato'],
      ['/landscape', 'Landscape', 'Composição horizontal.', 'Use composição horizontal.', 'paisagem horizontal orientação formato']
    ]},
    { cat: 'Estilo', views: ['imagens'], kind: 'style', phase: 5, sample: 'Êxodo 14', rows: [
      ['/photorealistic', 'Photorealistic', 'Fotorrealismo.', 'Utilize fotorrealismo.', 'fotorrealismo foto realista estilo'],
      ['/ultrarealistic', 'Ultra Realistic', 'Realismo avançado.', 'Utilize realismo avançado, com detalhes precisos de pele, tecidos e superfícies.', 'ultra realismo hiper realista detalhe estilo'],
      ['/cinematiclight', 'Cinematic Light', 'Iluminação cinematográfica.', 'Utilize iluminação cinematográfica.', 'luz cinematográfica iluminação cinema', null, ['cinema']],
      ['/softlight', 'Soft Light', 'Iluminação suave.', 'Utilize iluminação suave e difusa.', 'luz suave difusa iluminação calma'],
      ['/dramaticlight', 'Dramatic Light', 'Iluminação dramática.', 'Utilize iluminação dramática e contrastada.', 'luz dramática contraste iluminação'],
      ['/volumetric', 'Volumetric', 'Luz volumétrica.', 'Utilize luz volumétrica atravessando o ambiente.', 'luz volumétrica raios névoa iluminação'],
      ['/goldenhour', 'Golden Hour', 'Hora dourada.', 'Utilize a luz quente da hora dourada.', 'hora dourada pôr do sol luz quente iluminação'],
      ['/moonlight', 'Moonlight', 'Cena iluminada pela lua.', 'Ilumine a cena pela luz da lua.', 'lua luar noite iluminação'],
      ['/firelight', 'Firelight', 'Iluminação de fogo e tochas.', 'Ilumine a cena com fogo e tochas.', 'fogo tochas fogueira luz iluminação'],
      ['/ancientcity', 'Ancient City', 'Cidade da Antiguidade.', 'Ambiente a cena em uma cidade da Antiguidade, com arquitetura plausível para a época.', 'cidade antiga antiguidade cenário arquitetura'],
      ['/biblicaldesert', 'Biblical Desert', 'Paisagem bíblica desértica.', 'Ambiente a cena em uma paisagem bíblica desértica.', 'deserto bíblico paisagem cenário areia'],
      ['/historical', 'Historical', 'Reconstrução historicamente inspirada.', 'Faça uma reconstrução historicamente inspirada.', 'histórico reconstrução época fiel'],
      ['/documentaryphoto', 'Documentary Photo', 'Fotografia documental.', 'Utilize estética de fotografia documental.', 'documental fotografia documentário foto'],
      ['/epicmovie', 'Epic Movie', 'Estética de superprodução.', 'Utilize estética de superprodução cinematográfica.', 'superprodução épico filme cinema', null, ['cinema']],
      ['/premium', 'Premium', 'Acabamento visual premium.', 'Utilize acabamento visual premium.', 'premium luxo sofisticado acabamento'],
      ['/minimal', 'Minimal', 'Design limpo.', 'Utilize design limpo e minimalista.', 'minimal limpo simples design']
    ]},
    { cat: 'Produção', views: ['videos', 'imagens', 'narracao'], kind: 'full', phase: 3, sample: 'Êxodo 14', rows: [
      ['/fullvideo', 'Full Video', 'Produção completa de vídeo.', 'Produza um pacote completo de vídeo sobre o tema, contendo: 1) título; 2) gancho; 3) roteiro; 4) narração; 5) divisão por cenas; 6) prompt de imagem para cada cena; 7) indicação de duração; 8) texto na tela; 9) descrição; 10) hashtags; 11) thumbnail; 12) CTA.', 'vídeo completo produção youtube roteiro cenas pacote', null, ['videos'], 'full', 3],
      ['/fullshort', 'Full Short', 'Short completo de 20–60 segundos.', 'Produza um short completo de 20 a 60 segundos, contendo: assunto; título; hook de 2 a 3 segundos; roteiro; narração; cenas; prompts visuais para cada cena; legendas; final; CTA; descrição; hashtags.', 'short completo vídeo curto produção shorts', null, ['videos'], 'full', 3],
      ['/fullreels', 'Full Reels', 'Reels completo em 9:16.', 'Produza um Reels completo em formato 9:16, contendo: hook; roteiro; narração; divisão de cenas; prompts das imagens; texto na tela; CTA; descrição; hashtags.', 'reels completo vídeo curto produção instagram', null, ['videos'], 'full', 3],
      ['/fulldocumentary', 'Full Documentary', 'Documentário completo.', 'Produza um documentário completo, contendo: título; introdução; contexto histórico; narrativa; personagens; cronologia; mapas sugeridos; fontes históricas a pesquisar; roteiro de narração; divisão por capítulos; prompts visuais; encerramento.', 'documentário completo vídeo longo produção capítulos', null, ['videos'], 'full', 3],
      ['/imageprompt', 'Image Prompt', 'Prompt visual completo a partir de qualquer passagem.', 'A partir da passagem, gere um prompt visual completo contendo: personagem; ação; local; época; vestimentas; arquitetura; iluminação; câmera; composição; atmosfera; estilo; proporção.', 'prompt de imagem visual gerar imagem arte cena', null, ['imagens'], 'meta', 5],
      ['/videoprompt', 'Video Prompt', 'Prompt para IA de vídeo.', 'Gere um prompt para IA de vídeo contendo: cena; personagem; ação; movimento; câmera; movimento de câmera; iluminação; ambiente; duração; estilo cinematográfico.', 'prompt de vídeo veo animação cena movimento câmera', null, ['videos', 'cinema'], 'meta', 5],
      ['/voiceprompt', 'Voice Prompt', 'Texto otimizado para ElevenLabs e similares.', 'Gere texto de narração otimizado para ElevenLabs ou outros sintetizadores de voz, incluindo: pausas naturais; frases curtas; ritmo; emoção; pontuação adequada; palavras de impacto.', 'narração voz elevenlabs sintetizador áudio locução prompt', null, ['narracao'], 'voice', 4]
    ]},
    { cat: 'Formatos de Estudo', views: ['formatos'], kind: 'study', phase: 3, sample: 'Romanos 8', rows: [
      ['/table', 'Table', 'Organiza o conteúdo em tabela comparativa.', 'Organize as informações em uma tabela comparativa clara, com colunas e linhas bem definidas.', 'tabela comparativa colunas organizar quadro', null, [], 'mod', 8],
      ['/mindmap', 'Mind Map', 'Estrutura o tema como mapa mental.', 'Estruture o tema como um mapa mental textual, com o conceito central e ramificações hierárquicas.', 'mapa mental esquema ramos organizar conceitos', null, [], 'mod', 8],
      ['/flashcards', 'Flashcards', 'Cartões de pergunta e resposta para memorizar.', 'Crie flashcards de estudo com pergunta na frente e resposta objetiva no verso, baseados na passagem.', 'flashcards cartões memorizar revisão estudo perguntas'],
      ['/quiz', 'Quiz', 'Perguntas e respostas com gabarito.', 'Crie um quiz de múltipla escolha sobre a passagem, com níveis de dificuldade crescentes e gabarito comentado ao final.', 'quiz teste perguntas respostas gabarito prova jogo'],
      ['/glossary', 'Glossary', 'Glossário de termos importantes.', 'Crie um glossário com os termos, nomes e conceitos importantes da passagem, com definições curtas e fiéis ao contexto bíblico.', 'glossário termos definições vocabulário dicionário'],
      ['/outline', 'Outline', 'Esboço de estudo para grupo ou célula.', 'Crie um esboço de estudo para grupo pequeno ou célula, com abertura, leitura guiada, perguntas, aplicação e oração final.', 'esboço estudo grupo célula roteiro reunião']
    ]},
    { cat: 'Gêneros e Livros', views: ['generos'], kind: 'study', phase: 2, sample: 'Mateus 5', rows: [
      ['/gospel', 'Gospel', 'Leitura de um Evangelho em seu gênero.', 'Leia o texto como narrativa de Evangelho, considerando o propósito do autor, o público original e a apresentação da pessoa e da obra de Jesus.', 'evangelho jesus mateus marcos lucas joão narrativa gênero'],
      ['/epistle', 'Epistle', 'Leitura de uma carta apostólica.', 'Leia o texto como carta apostólica, identificando remetente, destinatários, situação da igreja, argumento e instruções práticas.', 'epístola carta paulo apóstolo igreja gênero'],
      ['/psalm', 'Psalm', 'Leitura de um Salmo e seu tipo.', 'Analise o salmo identificando seu tipo (lamento, louvor, ação de graças, sabedoria ou real), seu paralelismo poético e sua emoção central.', 'salmo salmos louvor lamento poesia oração gênero'],
      ['/proverb', 'Proverb', 'Leitura de provérbios e sabedoria.', 'Analise o provérbio ou texto de sabedoria, explicando que ele expressa um princípio geral e não uma promessa absoluta, com contexto e aplicação.', 'provérbio provérbios sabedoria princípio conselho gênero'],
      ['/parable', 'Parable', 'Análise de parábola.', 'Analise a parábola identificando o contexto em que foi contada, o público, os elementos da história, o ponto central e a aplicação, sem alegorizar excessivamente.', 'parábola história Jesus ensino ilustração gênero'],
      ['/apocalyptic', 'Apocalyptic', 'Leitura de literatura apocalíptica.', 'Leia o texto como literatura apocalíptica, considerando seus símbolos, seu contexto histórico original e as principais linhas de interpretação cristã.', 'apocalíptico apocalipse daniel símbolos visão gênero', null, ['profecias']],
      ['/law', 'Law', 'Leitura de textos legais do Antigo Testamento.', 'Analise o texto legal considerando seu contexto na aliança, a finalidade da lei, seu contexto cultural e a forma como cristãos o interpretam hoje.', 'lei torá mandamentos leis levítico deuteronômio gênero'],
      ['/poetry', 'Poetry', 'Leitura de poesia bíblica.', 'Analise o texto poético identificando paralelismo, imagens, figuras de linguagem e o efeito literário na mensagem.', 'poesia poético paralelismo figuras linguagem literário gênero']
    ]},
    { cat: 'Eventos e Temas', views: ['eventos'], kind: 'study', phase: 2, sample: 'O Dilúvio', rows: [
      ['/event', 'Event', 'Análise de um acontecimento bíblico.', 'Analise o acontecimento bíblico informado: o que o texto relata, quando e onde ocorreu, quem participou, causas, consequências e significado.', 'evento acontecimento fato dilúvio êxodo história'],
      ['/covenant', 'Covenant', 'Alianças bíblicas.', 'Explique a aliança relacionada à passagem, seus participantes, promessas, condições, sinal e lugar na história da redenção.', 'aliança pacto promessa abraão davi noé'],
      ['/feasts', 'Feasts', 'Festas e calendário judaico.', 'Explique a festa ou o tempo sagrado mencionado, sua origem bíblica, seus costumes, seu calendário e seu significado.', 'festas páscoa pentecostes tabernáculos calendário judaico celebração'],
      ['/miraclelist', 'Miracle List', 'Lista de milagres relacionados.', 'Liste os milagres relacionados ao tema ou personagem, com referência, contexto e significado de cada um.', 'milagres lista sinais maravilhas Jesus profetas'],
      ['/parablelist', 'Parable List', 'Lista de parábolas relacionadas.', 'Liste as parábolas relacionadas ao tema, com referência, mensagem central e público original de cada uma.', 'parábolas lista histórias Jesus ensinos']
    ]},
    { cat: 'Tradições e Versões', views: ['tradicoes'], kind: 'study', phase: 2, sample: 'João 1:1', rows: [
      ['/translations', 'Translations', 'Compara traduções da passagem.', 'Compare como diferentes traduções reconhecidas vertem a passagem e explique as diferenças relevantes de sentido.', 'traduções comparar versões diferenças texto'],
      ['/versions', 'Versions', 'Compara versões populares em português.', 'Apresente a passagem em versões conhecidas em português (como ARA, NVI e ARC) e destaque as variações que alteram o entendimento.', 'versões ara nvi arc almeida comparar português'],
      ['/original', 'Original', 'Hebraico e grego da passagem.', 'Analise termos-chave da passagem em hebraico, aramaico ou grego, com transliteração, significado e uso em outros textos.', 'original hebraico grego aramaico palavras transliteração língua'],
      ['/churchhistory', 'Church History', 'Como a passagem foi lida na história.', 'Explique como esta passagem foi interpretada ao longo da história da Igreja, apontando períodos e autores relevantes e distinguindo texto de tradição.', 'história da igreja pais da igreja interpretação reforma tradição'],
      ['/denominations', 'Denominations', 'Visões católica, protestante e ortodoxa.', 'Apresente de forma equilibrada como as principais tradições cristãs (católica, ortodoxa e protestante) interpretam a passagem, sem favorecer nenhuma.', 'denominações católico protestante ortodoxo visões tradições']
    ]},
    { cat: 'Plataformas', views: ['plataformas'], kind: 'text', phase: 3, sample: 'Salmo 23', rows: [
      ['/youtubelong', 'YouTube Long', 'Vídeo longo com capítulos.', 'Estruture um vídeo longo para YouTube com título, introdução, capítulos com marcação de tempo, desenvolvimento e encerramento.', 'youtube vídeo longo capítulos roteiro duração'],
      ['/podcast', 'Podcast', 'Episódio de podcast.', 'Crie o roteiro de um episódio de podcast, com abertura, blocos de conversa, perguntas para o convidado e encerramento.', 'podcast episódio áudio roteiro conversa'],
      ['/blogpost', 'Blog Post', 'Artigo para blog.', 'Escreva um artigo de blog com título, introdução, subtítulos, desenvolvimento e conclusão em linguagem acessível.', 'blog artigo texto post escrever'],
      ['/newsletter', 'Newsletter', 'Newsletter semanal.', 'Escreva uma newsletter curta com assunto, mensagem principal, aplicação prática e chamada final.', 'newsletter e-mail boletim semanal mensagem'],
      ['/whatsapp', 'WhatsApp', 'Mensagem curta para grupos.', 'Escreva uma mensagem curta, acolhedora e fácil de compartilhar em grupos de WhatsApp.', 'whatsapp mensagem grupo curta compartilhar'],
      ['/caption', 'Caption', 'Legenda para publicação.', 'Escreva uma legenda envolvente para a publicação, com abertura forte, mensagem principal e fechamento.', 'legenda caption post instagram texto'],
      ['/hashtags', 'Hashtags', 'Hashtags relevantes.', 'Sugira hashtags relevantes, misturando amplas e específicas, sem exagero.', 'hashtags tags alcance redes'],
      ['/cta', 'CTA', 'Chamada para ação.', 'Crie uma chamada para ação clara e respeitosa ao final do conteúdo.', 'cta chamada ação convite final seguir', null, [], 'text', 7],
      ['/seo', 'SEO', 'Otimização para buscadores.', 'Sugira título, descrição e palavras-chave otimizados para busca, sem promessas enganosas.', 'seo busca google palavras-chave título descrição']
    ]},
    { cat: 'Imagem e Vídeo Avançado', views: ['avancado'], kind: 'text', phase: 5, sample: 'Daniel na cova dos leões', rows: [
      ['/scenelist', 'Scene List', 'Storyboard cena a cena.', 'Divida a história em cenas numeradas (storyboard), com descrição, duração aproximada e prompt visual de cada cena.', 'storyboard cenas lista divisão roteiro visual'],
      ['/shotlist', 'Shot List', 'Planos de câmera.', 'Crie uma lista de planos de câmera para cada cena, indicando enquadramento, lente, movimento e intenção dramática.', 'planos câmera enquadramento lente movimento filmagem'],
      ['/consistency', 'Consistency', 'Mantém personagens consistentes entre imagens.', 'Defina uma descrição fixa de cada personagem, cenário e paleta e repita-a em todos os prompts para manter consistência visual entre as cenas.', 'consistência personagem continuidade mesmo rosto série cenas'],
      ['/characterref', 'Character Ref', 'Ficha visual do personagem.', 'Crie uma ficha visual do personagem com idade aparente, vestimentas, cores, acessórios e traços plausíveis para a época, sem declarar como fato o que o texto não descreve.', 'ficha personagem referência visual aparência vestimenta'],
      ['/negative', 'Negative', 'Lista do que evitar na imagem.', 'Liste elementos a evitar na imagem: objetos e roupas modernas, anacronismos, texto distorcido, mãos deformadas e elementos fantasiosos não solicitados.', 'negativo evitar proibir erros anacronismo prompt negativo'],
      ['/broll', 'B-Roll', 'Imagens de apoio para o vídeo.', 'Sugira imagens de apoio (b-roll) para ilustrar a narração, como paisagens, objetos, mapas e detalhes de época.', 'broll apoio imagens complementares cobertura vídeo'],
      ['/subtitles', 'Subtitles', 'Legendas na tela.', 'Divida a narração em legendas curtas, de no máximo duas linhas, sincronizadas com as cenas.', 'legendas subtítulos texto na tela vídeo']
    ]},
    { cat: 'Voz Avançada', views: ['narracao'], kind: 'voice', phase: 4, sample: 'Êxodo 14', rows: [
      ['/whisper', 'Whisper', 'Narração suave e íntima.', 'Produza narração suave, íntima e calma, como se fosse sussurrada ao ouvinte.', 'sussurro suave íntima calma voz narração'],
      ['/ssml', 'SSML', 'Marcação de pausas para sintetizador.', 'Entregue a narração com marcações de pausa e ênfase compatíveis com SSML para sintetizadores de voz.', 'ssml pausas ênfase marcação sintetizador voz'],
      ['/pronunciation', 'Pronunciation', 'Guia de pronúncia de nomes bíblicos.', 'Inclua um guia de pronúncia, com grafia fonética, para nomes e lugares bíblicos difíceis presentes na narração.', 'pronúncia nomes bíblicos fonética voz leitura']
    ]},
    { cat: 'Público', views: ['publico'], kind: 'mod', phase: 8, sample: 'Davi e Golias', rows: [
      ['/kids', 'Kids', 'Para crianças.', 'Adapte o conteúdo para crianças, com linguagem simples, frases curtas, tom acolhedor e exemplos do cotidiano infantil.', 'crianças infantil kids ensino simples escola dominical'],
      ['/teen', 'Teen', 'Para adolescentes.', 'Adapte o conteúdo para adolescentes, com linguagem atual e respeitosa, abordando dúvidas e desafios da idade.', 'adolescentes teen jovens linguagem atual'],
      ['/youth', 'Youth', 'Para jovens.', 'Adapte o conteúdo para jovens adultos, conectando a mensagem a estudos, trabalho, relacionamentos e propósito.', 'jovens juventude universitários propósito'],
      ['/seniors', 'Seniors', 'Para idosos.', 'Adapte o conteúdo para pessoas idosas, com ritmo calmo, linguagem clara e temas de experiência, legado e esperança.', 'idosos terceira idade calma legado'],
      ['/newbeliever', 'New Believer', 'Para quem está começando.', 'Adapte o conteúdo para quem está começando na fé, explicando termos e conceitos sem presumir conhecimento prévio.', 'iniciante novo convertido começando fé básico'],
      ['/skeptic', 'Skeptic', 'Para quem tem dúvidas.', 'Adapte o conteúdo para quem tem dúvidas ou ceticismo, com respeito, honestidade intelectual e sem pressão.', 'cético dúvidas ceticismo apologética respeito']
    ]},
    { cat: 'Tom', views: ['tom'], kind: 'mod', phase: 8, sample: 'Salmo 23', rows: [
      ['/gentle', 'Gentle', 'Tom gentil e acolhedor.', 'Use um tom gentil, acolhedor e encorajador.', 'gentil suave acolhedor tom'],
      ['/scholarly', 'Scholarly', 'Tom acadêmico.', 'Use um tom acadêmico e rigoroso, com termos técnicos explicados e distinção clara entre fatos e interpretações.', 'acadêmico erudito técnico rigoroso tom'],
      ['/pastoral', 'Pastoral', 'Tom pastoral.', 'Use um tom pastoral, cuidadoso e próximo, voltado ao acompanhamento espiritual.', 'pastoral cuidado pastor aconselhamento tom'],
      ['/humorsafe', 'Light Humor', 'Leveza e humor respeitoso.', 'Use leveza e humor respeitoso, sem ironizar o texto bíblico nem pessoas.', 'humor leve descontraído respeitoso tom']
    ]},
    { cat: 'Ocasiões', views: ['ocasioes'], kind: 'text', phase: 3, sample: 'Lucas 2', rows: [
      ['/christmas', 'Christmas', 'Mensagem de Natal.', 'Crie uma mensagem de Natal baseada nos relatos bíblicos do nascimento de Jesus, sem acrescentar detalhes que o texto não traz.', 'natal nascimento jesus presépio dezembro'],
      ['/easter', 'Easter', 'Mensagem de Páscoa.', 'Crie uma mensagem de Páscoa baseada nos relatos bíblicos da morte e ressurreição de Jesus.', 'páscoa ressurreição sexta-feira santa cruz'],
      ['/pentecost', 'Pentecost', 'Mensagem de Pentecostes.', 'Crie uma mensagem sobre Pentecostes baseada em Atos 2 e no papel do Espírito Santo.', 'pentecostes espírito santo atos igreja'],
      ['/newyear', 'New Year', 'Mensagem de Ano Novo.', 'Crie uma mensagem de Ano Novo com esperança, gratidão e propósito, baseada na passagem.', 'ano novo recomeço propósito esperança'],
      ['/mothersday', 'Mothers Day', 'Dia das Mães.', 'Crie uma mensagem para o Dia das Mães inspirada em mulheres e mães da Bíblia, com respeito e gratidão.', 'dia das mães mãe maternidade mulheres bíblia'],
      ['/funeral', 'Funeral', 'Mensagem de conforto em funeral.', 'Crie uma mensagem breve e consoladora para um funeral, com esperança cristã e respeito à dor da família.', 'funeral velório despedida consolo luto'],
      ['/wedding', 'Wedding', 'Mensagem de casamento.', 'Crie uma mensagem para casamento baseada em princípios bíblicos de amor, compromisso e serviço.', 'casamento noivos matrimônio amor aliança'],
      ['/baptism', 'Baptism', 'Mensagem de batismo.', 'Crie uma mensagem para batismo, explicando seu significado bíblico de forma clara e acolhedora.', 'batismo batizar água novo nascimento'],
      ['/grief', 'Grief', 'Consolo no luto.', 'Crie uma mensagem de consolo para quem vive o luto, com empatia e sem frases que minimizem a dor.', 'luto perda dor consolo saudade'],
      ['/anxiety', 'Anxiety', 'Mensagem para a ansiedade.', 'Crie uma mensagem para quem enfrenta ansiedade, com acolhimento e passagens bíblicas, sem substituir a busca por ajuda profissional.', 'ansiedade medo preocupação paz angústia'],
      ['/gratitude', 'Gratitude', 'Mensagem de gratidão.', 'Crie uma mensagem sobre gratidão baseada na passagem, com aplicação prática ao dia a dia.', 'gratidão agradecimento ação de graças']
    ]},
    { cat: 'Fidelidade', views: ['fidelidade'], kind: 'mod', phase: 8, sample: 'Gênesis 1', rows: [
      ['/sources', 'Sources', 'Citar fontes.', 'Indique, sempre que possível, as fontes usadas (passagens bíblicas, obras e autores) e sinalize o que não puder ser confirmado.', 'fontes referências citações bibliografia'],
      ['/verifyverse', 'Verify Verse', 'Conferir se o versículo existe.', 'Confira se cada versículo citado existe e corresponde ao texto bíblico, indicando a referência exata e avisando quando houver dúvida.', 'verificar versículo conferir referência existe correto'],
      ['/neutral', 'Neutral', 'Sem viés denominacional.', 'Mantenha neutralidade denominacional, apresentando as principais posições sem favorecer nenhuma.', 'neutro neutralidade imparcial denominacional equilibrado'],
      ['/noinvent', 'No Invent', 'Reforço da regra de fidelidade.', 'Não invente versículos, acontecimentos, citações ou personagens. Se não souber, diga claramente que não há informação confiável.', 'não inventar fidelidade honestidade alucinação verdade']
    ]},
    { cat: 'Idioma e Saída', views: ['saida'], kind: 'mod', phase: 8, sample: 'João 3:16', rows: [
      ['/english', 'English', 'Resposta em inglês.', 'Responda em inglês.', 'inglês english idioma língua'],
      ['/spanish', 'Spanish', 'Resposta em espanhol.', 'Responda em espanhol.', 'espanhol español idioma língua'],
      ['/bilingual', 'Bilingual', 'Português e inglês.', 'Entregue o resultado em português e em inglês, lado a lado.', 'bilíngue português inglês idioma duas línguas'],
      ['/short', 'Short', 'Resposta curta.', 'Mantenha a resposta curta e direta.', 'curto breve resumido direto tamanho'],
      ['/long', 'Long', 'Resposta longa e detalhada.', 'Desenvolva a resposta de forma longa e detalhada.', 'longo detalhado extenso completo tamanho'],
      ['/json', 'JSON', 'Saída estruturada em JSON.', 'Entregue o resultado em JSON válido, com campos claros e sem texto fora do JSON.', 'json estruturado dados código saída'],
      ['/tableformat', 'Table Format', 'Saída em tabela.', 'Entregue o resultado em formato de tabela.', 'tabela formato saída colunas']
    ]}
  ];

  /* ---------- Modificadores visuais usados na composição do prompt ---------- */
  const STYLE_MODS = {
    '/cinematic': 'composição cinematográfica épica, realista e emocionalmente impactante',
    '/biblicalcinema': 'aparência de produção bíblica de alto orçamento, com cenografia histórica',
    '/epic': 'escala visual grandiosa, com multidões, arquitetura e atmosfera monumental',
    '/realistic': 'estética fotorrealista, iluminação natural, materiais realistas e proporções humanas naturais',
    '/ancient': 'estética histórica da Antiguidade, com tecidos, objetos e ferramentas da época',
    '/dramatic': 'iluminação dramática, contraste e atmosfera intensa',
    '/minimalist': 'composição minimalista, com poucos elementos e amplo espaço negativo',
    '/dark': 'estética escura, cinematográfica e sofisticada',
    '/gold': 'paleta elegante em preto e dourado, com iluminação premium',
    '/ancientpaper': 'textura inspirada em papiro ou pergaminho antigo',
    '/photorealistic': 'fotorrealismo',
    '/ultrarealistic': 'realismo avançado, com detalhes precisos de pele, tecidos e superfícies',
    '/cinematiclight': 'iluminação cinematográfica',
    '/softlight': 'iluminação suave e difusa',
    '/dramaticlight': 'iluminação dramática e contrastada',
    '/volumetric': 'luz volumétrica atravessando o ambiente',
    '/goldenhour': 'a luz quente da hora dourada',
    '/moonlight': 'cena iluminada pela luz da lua',
    '/firelight': 'iluminação de fogo e tochas',
    '/ancientcity': 'cenário de cidade da Antiguidade, com arquitetura plausível',
    '/biblicaldesert': 'paisagem bíblica desértica',
    '/historical': 'reconstrução historicamente inspirada',
    '/documentaryphoto': 'estética de fotografia documental',
    '/epicmovie': 'estética de superprodução cinematográfica',
    '/premium': 'acabamento visual premium',
    '/minimal': 'design limpo e minimalista'
  };

  /* ---------- Formatos e plataformas ---------- */
  const FORMATS = {
    '/9:16': { orient: 'vertical', ratio: '9:16' },
    '/4:5': { orient: 'vertical', ratio: '4:5' },
    '/1:1': { orient: 'quadrada', ratio: '1:1' },
    '/16:9': { orient: 'horizontal', ratio: '16:9' },
    '/storyformat': { orient: 'vertical', ratio: '1080 × 1920' },
    '/feedformat': { orient: 'vertical', ratio: '1080 × 1350' },
    '/youtube': { orient: 'horizontal', ratio: '1920 × 1080', platform: 'YouTube' },
    '/portrait': { orient: 'vertical', ratio: '' },
    '/landscape': { orient: 'horizontal', ratio: '' }
  };
  const PLATFORMS = {
    '/instagram': 'Instagram',
    '/reels': 'Instagram Reels',
    '/shorts': 'YouTube Shorts',
    '/tiktok': 'TikTok',
    '/story': 'Stories'
  };

  /* ---------- Compatibilidade (explícita) e padrão por tipo ---------- */
  const COMPAT = {
    '/cinematic': ['/realistic', '/epic', '/scene', '/dramatic', '/9:16'],
    '/verse': ['/reflection', '/instagram', '/minimalist', '/4:5'],
    '/context': ['/history', '/culture', '/meaning', '/application'],
    '/reflection': ['/context', '/application', '/prayer', '/verse'],
    '/map': ['/journey', '/geography', '/history', '/place'],
    '/timeline': ['/history', '/people', '/context', '/map'],
    '/biography': ['/timeline', '/faith', '/mistakes', '/legacy'],
    '/scene': ['/cinematic', '/realistic', '/dramatic', '/epic', '/9:16'],
    '/storytelling': ['/viralhook', '/scene', '/cinematicvoice', '/ending', '/9:16'],
    '/viralhook': ['/storytelling', '/curiosity', '/cinematic', '/reels', '/9:16'],
    '/thumbnail': ['/cinematic', '/dramatic', '/headline', '/dramatictext', '/16:9'],
    '/documentary': ['/history', '/timeline', '/people', '/map', '/cinematic', '/16:9'],
    '/sermon': ['/context', '/application', '/lesson', '/prayer'],
    '/fullvideo': ['/cinematic', '/16:9', '/documentary'],
    '/fullshort': ['/cinematic', '/9:16', '/shorts'],
    '/fullreels': ['/cinematic', '/9:16', '/reels'],
    '/fulldocumentary': ['/cinematic', '/16:9', '/map'],
    '/imageprompt': ['/cinematic', '/realistic', '/dramatic', '/9:16'],
    '/videoprompt': ['/cinematic', '/realistic', '/dramatic', '/9:16']
  };
  const COMPAT_BY_KIND = {
    study: ['/context', '/application', '/crossreference', '/reflection'],
    text: ['/viralhook', '/storytelling', '/cinematicvoice', '/ending'],
    scene: ['/cinematic', '/realistic', '/dramatic', '/epic', '/9:16'],
    layout: ['/dark', '/gold', '/minimalist', '/4:5', '/9:16'],
    style: ['/scene', '/realistic', '/dramatic', '/cinematic', '/9:16'],
    platform: ['/viralhook', '/scene', '/cinematic', '/9:16'],
    fmt: ['/scene', '/cinematic', '/realistic', '/dramatic'],
    voice: ['/viralhook', '/storytelling', '/ending', '/shorts'],
    full: ['/cinematic', '/9:16', '/dramatic'],
    meta: ['/cinematic', '/realistic', '/dramatic', '/9:16'],
    mod: ['/short', '/neutral', '/gentle', '/english']
  };

  /* ---------- Exemplos de entrada/saída ---------- */
  const EXAMPLES = {
    '/cinematic': [{ input: 'Davi contra Golias /cinematic /epic /realistic /9:16', output: 'Prompt cinematográfico completo para geração da cena.' }],
    '/map': [{ input: 'Viagens missionárias de Paulo /map /journey /geography', output: 'Prompt para gerar mapa das viagens.' }],
    '/timeline': [{ input: 'Vida de Moisés /timeline', output: 'Linha do tempo dos principais acontecimentos.' }],
    '/biography': [{ input: 'Pedro /biography /faith /mistakes /legacy', output: 'Biografia estruturada de Pedro.' }],
    '/verse': [{ input: 'Salmo 23:1 /verse /minimalist /premium /4:5', output: 'Arte de versículo minimalista para o feed.' }],
    '/fullshort': [{ input: 'Daniel na cova dos leões /fullshort /9:16', output: 'Short completo com roteiro, cenas, legendas e hashtags.' }],
    '/context': [{ input: 'Lucas 15:11-32 /context /reflection', output: 'Contexto histórico da parábola seguido de uma reflexão.' }]
  };

  /* ---------- Menu lateral (seção 21) ---------- */
  const VIEWS = [
    { id: 'estudo', icon: '📖', label: 'Estudo Bíblico', group: 'Estudo' },
    { id: 'historia', icon: '🏺', label: 'História e Contexto', group: 'Estudo' },
    { id: 'personagens', icon: '👤', label: 'Personagens', group: 'Estudo' },
    { id: 'generos', icon: '📜', label: 'Gêneros e Livros', group: 'Estudo' },
    { id: 'eventos', icon: '📅', label: 'Eventos e Temas', group: 'Estudo' },
    { id: 'tradicoes', icon: '🏛', label: 'Tradições e Versões', group: 'Estudo' },
    { id: 'formatos', icon: '🗂', label: 'Formatos de Estudo', group: 'Estudo' },
    { id: 'misterios', icon: '🕵', label: 'Mistérios', group: 'Explorar' },
    { id: 'curiosidades', icon: '💡', label: 'Curiosidades', group: 'Explorar' },
    { id: 'profecias', icon: '🔮', label: 'Profecias', group: 'Explorar' },
    { id: 'mapas', icon: '🗺', label: 'Mapas', group: 'Explorar', codes: ['/map', '/journey', '/geography', '/place', '/city', '/archaeology'] },
    { id: 'linhas', icon: '⏳', label: 'Linhas do Tempo', group: 'Explorar', codes: ['/timeline', '/history', '/genealogy', '/journey', '/people'] },
    { id: 'imagens', icon: '🎨', label: 'Imagens', group: 'Criação visual' },
    { id: 'cinema', icon: '🎬', label: 'Cinema Bíblico', group: 'Criação visual' },
    { id: 'thumbs', icon: '🖼', label: 'Thumbnails', group: 'Criação visual' },
    { id: 'avancado', icon: '🎞', label: 'Imagem e Vídeo Avançado', group: 'Criação visual' },
    { id: 'videos', icon: '🎥', label: 'Vídeos', group: 'Vídeo e voz' },
    { id: 'narracao', icon: '🎙', label: 'Narração', group: 'Vídeo e voz' },
    { id: 'social', icon: '📱', label: 'Redes Sociais', group: 'Vídeo e voz' },
    { id: 'plataformas', icon: '📡', label: 'Plataformas', group: 'Vídeo e voz' },
    { id: 'sermoes', icon: '🔥', label: 'Sermões', group: 'Mensagens' },
    { id: 'devocionais', icon: '🙏', label: 'Devocionais', group: 'Mensagens' },
    { id: 'ocasioes', icon: '🎉', label: 'Ocasiões', group: 'Mensagens' },
    { id: 'publico', icon: '👥', label: 'Público', group: 'Ajustes' },
    { id: 'tom', icon: '🎚', label: 'Tom', group: 'Ajustes' },
    { id: 'fidelidade', icon: '🛡', label: 'Fidelidade', group: 'Ajustes' },
    { id: 'saida', icon: '🌐', label: 'Idioma e Saída', group: 'Ajustes' },
    { id: 'combos', icon: '⚡', label: 'Combinações', group: 'Ferramentas', special: true },
    { id: 'dark', icon: '🌑', label: 'Canal Dark', group: 'Ferramentas', special: true },
    { id: 'favoritos', icon: '⭐', label: 'Favoritos', group: 'Ferramentas', special: true },
    { id: 'criador', icon: '🧩', label: 'Criador de Prompt', group: 'Ferramentas', special: true }
  ];

  /* ---------- Combinações pré-configuradas (seções 12, 28 e 29) ---------- */
  const COMBOS = [
    ['História Bíblica Cinematográfica', 'Vídeo', 'Criar cenas para vídeos bíblicos cinematográficos.', '/storytelling /scene /cinematic /realistic /dramatic /9:16'],
    ['Estudo Bíblico Completo', 'Estudo', 'Estudo equilibrado com contexto, significado e aplicação.', '/context /history /meaning /crossreference /application'],
    ['Estudo Profundo', 'Estudo', 'Exegese, teologia e doutrina em uma única análise.', '/deepstudy /context /theology /doctrine /crossreference /application'],
    ['Short Bíblico Viral', 'Vídeo', 'Short de alta retenção com narração cinematográfica.', '/viralhook /curiosity /storytelling /cinematicvoice /ending /shorts'],
    ['Reels Bíblico', 'Vídeo', 'Reels com gancho, roteiro curto, narração e cena.', '/viralhook /shortscript /narration /scene /reels /9:16'],
    ['TikTok Bíblico', 'Vídeo', 'TikTok narrativo e vertical.', '/viralhook /tiktokscript /storytelling /cinematicvoice /9:16'],
    ['Mistério Bíblico', 'Vídeo', 'Conteúdo investigativo sem tratar especulação como fato.', '/mystery /unknown /history /symbolism /cinematic'],
    ['Curiosidade', 'Vídeo', 'Formato “Você sabia?” curto e direto.', '/didyouknow /curiosity /unknown /facts /shortscript'],
    ['Devocional', 'Devocional', 'Versículo, reflexão, aplicação e oração.', '/verse /reflection /application /prayer'],
    ['Devocional da Manhã', 'Devocional', 'Para começar o dia.', '/morning /verse /reflection /encouragement /prayer'],
    ['Reflexão Noturna', 'Devocional', 'Para encerrar o dia com calma.', '/night /verse /reflection /meditation /prayer'],
    ['Documentário Bíblico', 'Vídeo', 'Roteiro documental com mapa e cronologia.', '/documentary /history /timeline /people /map /cinematic'],
    ['Personagem Bíblico', 'Personagens', 'Perfil do personagem com fé, erros e legado.', '/biography /timeline /faith /mistakes /legacy'],
    ['Biografia Documental', 'Personagens', 'Biografia em formato de documentário.', '/biography /history /timeline /relationships /legacy /documentary'],
    ['Profecia', 'Profecia', 'Profecia com contexto, símbolos e referências.', '/prophecy /context /symbolism /crossreference /cinematic'],
    ['Batalha Bíblica', 'Imagem', 'Cena de batalha épica e realista.', '/battle /history /people /cinematic /epic /realistic'],
    ['Thumbnail Bíblica', 'Thumbnail', 'Thumbnail cinematográfica com título.', '/thumbnail /cinematic /dramatic /headline'],
    ['Thumbnail de Mistério', 'Thumbnail', 'Thumbnail escura com atmosfera de mistério.', '/thumbnail /mystery /dark /dramatictext /cinematic'],
    ['Arte de Versículo', 'Imagem', 'Versículo minimalista para o feed.', '/verse /minimalist /premium /4:5'],
    ['Versículo Cinematográfico', 'Imagem', 'Versículo vertical, escuro e dourado.', '/verse /cinematic /dark /gold /9:16'],
    ['Mapa Bíblico', 'Mapas', 'Mapa conceitual com geografia e trajeto.', '/map /geography /journey /history'],
    ['Linha do Tempo', 'Mapas', 'Cronologia com pessoas e contexto.', '/timeline /history /people /context'],
    ['Contexto Histórico', 'Estudo', 'Contexto completo, com geografia e arqueologia.', '/context /history /culture /geography /archaeology'],
    ['Produção: Vídeo Completo', 'Produção', 'Pacote completo de vídeo.', '/fullvideo /16:9'],
    ['Produção: Short Completo', 'Produção', 'Pacote completo de short.', '/fullshort /shorts /9:16'],
    ['Produção: Reels Completo', 'Produção', 'Pacote completo de Reels.', '/fullreels /reels /9:16'],
    ['Produção: Documentário Completo', 'Produção', 'Pacote completo de documentário.', '/fulldocumentary /16:9']
  ].map(c => ({ name: c[0], category: c[1], description: c[2], codes: c[3].split(' ') }));

  const DARK_COMBOS = [
    ['História bíblica', 'Narrativa vertical, cinematográfica e dramática.', '/storytelling /cinematic /narration /dramatic /9:16'],
    ['Mistério', 'Mistério bíblico com gancho forte.', '/mystery /unknown /viralhook /cinematic /dark /9:16'],
    ['Curiosidade', 'Curiosidade curta com voz cinematográfica.', '/didyouknow /unknown /shortscript /cinematicvoice'],
    ['Documentário', 'Documentário com história e linha do tempo.', '/documentary /history /timeline /cinematic'],
    ['Personagem', 'Biografia narrada.', '/biography /storytelling /cinematic /narration'],
    ['Profecia', 'Profecia simbólica com voz dramática.', '/prophecy /symbolism /cinematic /dramaticvoice']
  ].map(c => ({ name: c[0], category: 'Canal Dark', description: c[1], codes: c[2].split(' '), dark: true }));

  /* ---------- Construção do catálogo ---------- */
  const CODES = [];
  const seen = {};
  SECTIONS.forEach(sec => {
    sec.rows.forEach(r => {
      const [code, name, description, prompt, tags, clause, extraViews, kindOv, phaseOv] = r;
      const views = new Set([].concat(sec.views, extraViews || []));
      if (seen[code]) { views.forEach(v => seen[code].views.add(v)); return; }
      const kind = kindOv || sec.kind;
      const item = {
        code, name, category: sec.cat, description, prompt,
        tags: tags.split(' '),
        compatibleWith: COMPAT[code] || COMPAT_BY_KIND[kind] || [],
        examples: EXAMPLES[code] || (sec.sample ? [{ input: sec.sample + ' ' + code, output: description }] : [{ input: 'Tema ' + code, output: description }]),
        featured: false,
        kind, phase: phaseOv || sec.phase, clause: clause || null, views
      };
      CODES.push(item); seen[code] = item;
    });
  });
  // Visão de Mistérios / Cinema / Profecias adicionais por código
  ['/mystery', '/unknown', '/secrets', '/hiddenmeaning', '/controversy', '/symbolism', '/mysterythumbnail'].forEach(c => seen[c] && seen[c].views.add('misterios'));
  ['/prophecy', '/prophecies', '/fulfilled', '/vision', '/oldnew', '/symbolism', '/heaven'].forEach(c => seen[c] && seen[c].views.add('profecias'));
  ['/cinematic', '/epic', '/realistic', '/dramatic', '/biblicalcinema', '/miracle', '/battle', '/epicmovie', '/cinematiclight', '/cinematicposter', '/cinematicvoice'].forEach(c => seen[c] && seen[c].views.add('cinema'));
  ['/cinematic', '/context', '/verse', '/viralhook', '/fullshort', '/imageprompt', '/biography', '/map', '/thumbnail'].forEach(c => seen[c] && (seen[c].featured = true));
  VIEWS.forEach(v => { if (v.codes) v.codes.forEach(c => seen[c] && seen[c].views.add(v.id)); });
  CODES.forEach(c => { c.views = Array.from(c.views); });

  g.GS_DATA = { RULES, STYLE_MODS, FORMATS, PLATFORMS, VIEWS, CODES, COMBOS, DARK_COMBOS, byCode: seen };
  if (typeof module !== 'undefined') module.exports = g.GS_DATA;
})(typeof window !== 'undefined' ? window : globalThis);
