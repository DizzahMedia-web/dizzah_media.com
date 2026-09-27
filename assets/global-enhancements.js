/* Dizzah Media — International UX layer: multilingual navigation + breaking ticker. */
(() => {
  "use strict";
  const storageKey = "dizzah-language";
  const supported = [
    ["auto", "Auto"], ["sw", "Kiswahili"], ["en", "English"], ["fr", "Français"],
    ["ar", "العربية"], ["es", "Español"], ["pt", "Português"], ["de", "Deutsch"],
    ["zh", "中文"], ["hi", "हिन्दी"], ["tr", "Türkçe"]
  ];
  const messages = {
    sw: ["Karibu Dizzah Media — Sauti za Tanzania kwa Dunia.", "Habari, simulizi na maudhui yenye ubora kutoka Tanzania kwenda Afrika na dunia.", "Dizzah Originals: Local Stories. Global Standards.", "Tuma taarifa yako kwa newsroom ya Dizzah Media kupitia ukurasa wa Contact."],
    en: ["Welcome to Dizzah Media — Tanzania's voice to the world.", "News, stories and premium content from Tanzania to Africa and the world.", "Dizzah Originals: Local Stories. Global Standards.", "Send your news tip to the Dizzah Media newsroom through our Contact page."],
    fr: ["Bienvenue sur Dizzah Media — la voix de la Tanzanie pour le monde.", "Actualités, récits et contenus premium de la Tanzanie vers l'Afrique et le monde.", "Dizzah Originals : des histoires locales, des standards mondiaux.", "Envoyez votre information à la rédaction Dizzah Media."],
    ar: ["مرحباً بكم في دزّة ميديا — صوت تنزانيا إلى العالم.", "أخبار وقصص ومحتوى مميز من تنزانيا إلى أفريقيا والعالم.", "إنتاجات دزّة: قصص محلية بمعايير عالمية.", "أرسل خبراً إلى غرفة أخبار دزّة ميديا."],
    es: ["Bienvenido a Dizzah Media — la voz de Tanzania para el mundo.", "Noticias, historias y contenido premium desde Tanzania hacia África y el mundo.", "Dizzah Originals: historias locales, estándares globales.", "Envía una noticia a la redacción de Dizzah Media."],
    pt: ["Bem-vindo à Dizzah Media — a voz da Tanzânia para o mundo.", "Notícias, histórias e conteúdo premium da Tanzânia para África e o mundo.", "Dizzah Originals: histórias locais, padrões globais.", "Envie uma notícia para a redação da Dizzah Media."],
    de: ["Willkommen bei Dizzah Media — Tansanias Stimme für die Welt.", "Nachrichten, Geschichten und hochwertige Inhalte aus Tansania für Afrika und die Welt.", "Dizzah Originals: Lokale Geschichten, globale Standards.", "Senden Sie einen Hinweis an die Redaktion von Dizzah Media."],
    zh: ["欢迎来到 Dizzah Media——坦桑尼亚通往世界的声音。", "来自坦桑尼亚、面向非洲和世界的新闻、故事与优质内容。", "Dizzah Originals：本土故事，全球标准。", "向 Dizzah Media 新闻编辑部提供线索。"],
    hi: ["Dizzah Media में आपका स्वागत है — दुनिया तक तंजानिया की आवाज़।", "तंजानिया से अफ्रीका और दुनिया तक समाचार, कहानियाँ और प्रीमियम सामग्री।", "Dizzah Originals: स्थानीय कहानियाँ, वैश्विक मानक।", "Dizzah Media न्यूज़रूम को समाचार भेजें।"],
    tr: ["Dizzah Media'ya hoş geldiniz — Tanzanya'nın dünyaya açılan sesi.", "Tanzanya'dan Afrika'ya ve dünyaya haberler, hikâyeler ve kaliteli içerik.", "Dizzah Originals: Yerel hikâyeler, küresel standartlar.", "Dizzah Media haber merkezine haber gönderin."]
  };
  const nav = {
    "index.html": {sw:"Home",en:"Home",fr:"Accueil",ar:"الرئيسية",es:"Inicio",pt:"Início",de:"Startseite",zh:"首页",hi:"होम",tr:"Ana Sayfa"},
    "news.html": {sw:"News",en:"News",fr:"Actualités",ar:"أخبار",es:"Noticias",pt:"Notícias",de:"Nachrichten",zh:"新闻",hi:"समाचार",tr:"Haberler"},
    "simulizi.html": {sw:"Simulizi",en:"Stories",fr:"Récits",ar:"قصص",es:"Historias",pt:"Histórias",de:"Geschichten",zh:"故事",hi:"कहानियाँ",tr:"Hikâyeler"},
    "movies.html": {sw:"Movies",en:"Movies",fr:"Films",ar:"أفلام",es:"Películas",pt:"Filmes",de:"Filme",zh:"电影",hi:"फ़िल्में",tr:"Filmler"},
    "originals.html": {sw:"Originals",en:"Originals",fr:"Productions",ar:"إنتاجات",es:"Originales",pt:"Originais",de:"Originals",zh:"原创",hi:"ओरिजिनल्स",tr:"Özgün Yapımlar"},
    "videos.html": {sw:"Videos",en:"Videos",fr:"Vidéos",ar:"فيديو",es:"Vídeos",pt:"Vídeos",de:"Videos",zh:"视频",hi:"वीडियो",tr:"Videolar"},
    "gallery.html": {sw:"Gallery",en:"Gallery",fr:"Galerie",ar:"معرض",es:"Galería",pt:"Galeria",de:"Galerie",zh:"图库",hi:"गैलरी",tr:"Galeri"},
    "podcasts.html": {sw:"Podcasts",en:"Podcasts",fr:"Podcasts",ar:"بودكاست",es:"Podcasts",pt:"Podcasts",de:"Podcasts",zh:"播客",hi:"पॉडकास्ट",tr:"Podcastler"},
    "motivation.html": {sw:"Motivation",en:"Motivation",fr:"Motivation",ar:"تحفيز",es:"Motivación",pt:"Motivação",de:"Motivation",zh:"励志",hi:"प्रेरणा",tr:"Motivasyon"},
    "live.html": {sw:"Live",en:"Live",fr:"En direct",ar:"مباشر",es:"En vivo",pt:"Ao vivo",de:"Live",zh:"直播",hi:"लाइव",tr:"Canlı"},
    "search.html": {sw:"Search",en:"Search",fr:"Rechercher",ar:"بحث",es:"Buscar",pt:"Pesquisar",de:"Suche",zh:"搜索",hi:"खोजें",tr:"Ara"},
    "profile.html": {sw:"Profile",en:"Profile",fr:"Profil",ar:"الملف الشخصي",es:"Perfil",pt:"Perfil",de:"Profil",zh:"个人资料",hi:"प्रोफ़ाइल",tr:"Profil"},
    "about.html": {sw:"Kuhusu Sisi",en:"About",fr:"À propos",ar:"من نحن",es:"Sobre nosotros",pt:"Sobre nós",de:"Über uns",zh:"关于我们",hi:"हमारे बारे में",tr:"Hakkımızda"},
    "contact.html": {sw:"Mawasiliano",en:"Contact",fr:"Contact",ar:"اتصل بنا",es:"Contacto",pt:"Contacto",de:"Kontakt",zh:"联系我们",hi:"संपर्क",tr:"İletişim"},
    "faq.htm": {sw:"FAQ",en:"FAQ",fr:"FAQ",ar:"الأسئلة الشائعة",es:"Preguntas",pt:"Perguntas",de:"FAQ",zh:"常见问题",hi:"सामान्य प्रश्न",tr:"SSS"}
  };
  const labelText = {sw:"Lugha",en:"Language",fr:"Langue",ar:"اللغة",es:"Idioma",pt:"Idioma",de:"Sprache",zh:"语言",hi:"भाषा",tr:"Dil"};
  let preference = localStorage.getItem(storageKey) || "auto";
  let language = resolveLanguage(preference);
  let tickerIndex = 0, tickerTimer, paused = false;
  function resolveLanguage(value) { if (value !== "auto" && messages[value]) return value; const browser = (navigator.language || "en").slice(0,2).toLowerCase(); return messages[browser] ? browser : "en"; }
  const basename = (href) => String(href || "").split("?")[0].split("#")[0].split("/").pop().toLowerCase();
  function buildLanguageSwitcher() {
    if (document.querySelector(".dm-language-wrap")) return;
    const target = document.querySelector("header nav, .nav-links, .nav"); if (!target) return;
    const wrap = document.createElement("span"); wrap.className = "dm-language-wrap";
    wrap.innerHTML = '<label for="dmLanguage"></label><select class="dm-language-select" id="dmLanguage" aria-label="Choose language"></select>';
    const select = wrap.querySelector("select");
    supported.forEach(([code, name]) => { const option = document.createElement("option"); option.value = code; option.textContent = name; select.appendChild(option); });
    select.value = supported.some(([code]) => code === preference) ? preference : "auto";
    select.addEventListener("change", () => { preference = select.value; localStorage.setItem(storageKey, preference); language = resolveLanguage(preference); applyLanguage(); renderTicker(); });
    target.appendChild(wrap);
  }
  function buildTicker() {
    let ticker = document.querySelector(".dm-ticker"); const legacy = document.querySelector(".breaking");
    if (legacy && !ticker) { legacy.classList.add("dm-ticker"); const l=legacy.querySelector(".breaking-label"), x=legacy.querySelector(".breaking-text"); if(l)l.className="dm-ticker-label"; if(x)x.className="dm-ticker-message"; ticker=legacy; }
    if (!ticker) { ticker=document.createElement("div"); ticker.className="dm-ticker"; const header=document.querySelector("header"); if(header)header.insertAdjacentElement("afterend",ticker); }
    if (!ticker.querySelector(".dm-ticker-message")) ticker.innerHTML='<span class="dm-ticker-label"></span><span class="dm-ticker-track"><span class="dm-ticker-message" aria-live="polite"></span><span class="dm-ticker-time"></span><button class="dm-ticker-control" type="button">Ⅱ</button></span>';
    const control=ticker.querySelector(".dm-ticker-control"); control.onclick=()=>{paused=!paused;ticker.classList.toggle("is-paused",paused);control.textContent=paused?"▶":"Ⅱ";control.setAttribute("aria-label",paused?"Resume ticker":"Pause ticker");if(paused)clearInterval(tickerTimer);else startTicker();};
    renderTicker(); startTicker();
  }
  function renderTicker() { const ticker=document.querySelector(".dm-ticker"); if(!ticker)return; const list=messages[language]; const m=ticker.querySelector(".dm-ticker-message"), l=ticker.querySelector(".dm-ticker-label"), n=ticker.querySelector(".dm-ticker-time"); if(m)m.textContent=list[tickerIndex%list.length]; if(l)l.textContent=language==="sw"?"HABARI":"BREAKING"; if(n)n.textContent=`${tickerIndex+1}/${list.length}`; }
  function startTicker() { clearInterval(tickerTimer); if(paused)return; tickerTimer=setInterval(()=>{tickerIndex=(tickerIndex+1)%messages[language].length;renderTicker();},6000); }
  function applyLanguage() { document.documentElement.lang=language; document.documentElement.dir=language==="ar"?"rtl":"ltr"; document.body.dataset.language=language; document.querySelectorAll("header nav a,.nav-links a,.nav a").forEach(link=>{const item=nav[basename(link.getAttribute("href"))];if(item)link.textContent=item[language]||item.en;}); const label=document.querySelector(".dm-language-wrap label"); if(label)label.textContent=labelText[language]||labelText.en; const select=document.querySelector("#dmLanguage");if(select)select.setAttribute("aria-label",labelText[language]||labelText.en); }
  function init(){buildLanguageSwitcher();buildTicker();applyLanguage();}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
