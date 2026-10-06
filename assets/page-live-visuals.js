/* Dizzah Media — category-aware world visuals for each public content page. */
(() => {
  "use strict";

  const GIBS = "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best";
  const EVENTS = "https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=10";
  const COMMONS_API = "https://commons.wikimedia.org/w/api.php";
  const layer = "VIIRS_SNPP_CorrectedReflectance_TrueColor";
  const matrix = "GoogleMapsCompatible_Level9";
  const positions = [[3, 3], [4, 3], [2, 4]];
  const page = location.pathname.split("/").pop().toLowerCase() || "index.html";
  const configs = {
    "index.html": ["DIZZAH MEDIA LIVE", "Tanzania → Africa → World", "Mito, bustani, miji na matukio ya dunia zikibadilika.", ["African rivers lakes landscape", "beautiful botanical gardens flowers", "world cities skyline landmarks"]],
    "news.html": ["HABARI LIVE", "Matukio yanayoendelea duniani", "Mandhari halisi za maeneo, miji na matukio ya dunia.", ["African city streets landmarks", "rivers floods waterfalls world", "world news locations landscapes"]],
    "simulizi.html": ["SIMULIZI ZA DUNIA", "Stories behind the moment", "Mito, maziwa na maeneo yenye hadithi kwa kila sura.", ["river landscape Africa", "waterfalls lakes nature world", "beautiful villages mountains landscapes"]],
    "movies.html": ["CINEMATIC EARTH", "Scenes from a living planet", "Mandhari za cinematic za miji, landmarks na mazingira duniani.", ["cinematic city skyline night", "famous world landmarks travel", "cinematic mountains lakes landscape"]],
    "originals.html": ["DIZZAH ORIGINALS LIVE", "Local stories • global planet", "Mandhari ya kuvutia kwa ubunifu wa Dizzah Originals.", ["African landscapes rivers", "beautiful world attractions", "cinematic gardens flowers"]],
    "videos.html": ["DIZZAH MEDIA TV LIVE", "Watch the world change", "Picha za miji, mito na vivutio kwa video stories.", ["world city skyline travel", "river waterfall aerial landscape", "beautiful tourist attractions"]],
    "gallery.html": ["WORLD MOMENTS", "Gallery inayobadilika", "Maua, bustani, mito, maporomoko, miji na vivutio vya dunia.", ["beautiful flowers gardens", "rivers waterfalls lakes landscapes", "world attractions city skylines"]],
    "podcasts.html": ["DIZZAH TALKS • LIVE EARTH", "Listen to the planet", "Visual companion ya mazungumzo kutoka maeneo ya dunia.", ["beautiful gardens flowers", "rivers lakes nature landscapes", "world cities landmarks"]],
    "motivation.html": ["INSPIRATION FROM EARTH", "Dunia iko hai", "Maua, bustani, milima na mandhari za kujenga moyo.", ["beautiful flowers botanical garden", "sunrise mountains lakes landscape", "river waterfall nature inspiration"]],
    "live.html": ["NASA LIVE MAP", "Earth Watch", "Matukio ya asili yanayotolewa na NASA EONET.", ["satellite earth landscape", "world landmarks", "rivers waterfalls"]],
    "search.html": ["LIVE DISCOVERY", "Search the moment", "Visuals za sasa kwa safari ya kutafuta maudhui.", ["world cities landmarks", "rivers lakes landscapes", "flowers gardens"]],
    "profile.html": ["DIZZAH MEDIA LIVE", "Our world, our stories", "Brand visuals kutoka Tanzania, Afrika na dunia.", ["African landscapes rivers", "beautiful gardens flowers", "world cities skyline"]],
    "about.html": ["ABOUT DIZZAH • EARTH WATCH", "Tanzania → Africa → World", "Mito, bustani, miji na maeneo yanayotuzunguka.", ["Tanzania landscapes rivers", "African flowers gardens", "world attractions cities"]],
    "contact.html": ["CONTACT THE NEWSROOM", "Send a story from anywhere", "Tuma story kutoka mji, mto au kivutio chochote.", ["African city skyline", "rivers waterfalls world", "beautiful gardens attractions"]],
    "faq.htm": ["DIZZAH MEDIA LIVE", "Maswali kuhusu live content", "Satellite imagery na world scenes yenye fallback salama.", ["world attractions", "flowers gardens", "rivers waterfalls"]]
  };

  const config = configs[page];
  if (!config || document.querySelector(".dm-page-live")) return;
  const queries = config[3];
  const dateFor = (daysAgo) => { const date = new Date(); date.setUTCDate(date.getUTCDate() - daysAgo); return date.toISOString().slice(0, 10); };
  const tile = (daysAgo, row, col) => `${GIBS}/${layer}/default/${dateFor(daysAgo)}/${matrix}/3/${row}/${col}.jpg`;
  const escapeHTML = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

  const create = () => {
    const main = document.querySelector("main");
    if (!main) return null;
    const section = document.createElement("section");
    section.className = "dm-page-live";
    section.setAttribute("aria-label", config[0]);
    section.innerHTML = `
      <div class="dm-page-live-inner">
        <div class="dm-page-live-heading">
          <div><span class="dm-page-live-kicker">${config[0]}</span><h2 class="dm-page-live-title">${config[1]}</h2></div>
          <p class="dm-page-live-note">${config[2]}</p>
        </div>
        <div class="dm-page-live-grid">
          ${positions.map((position, index) => `
            <article class="dm-page-live-card" data-page-live-card="${index}" data-source="loading">
              <span class="dm-page-live-badge"><i></i> LIVE VISUAL</span>
              <img src="${tile(1, position[0], position[1])}" alt="${escapeHTML(config[1])} world visual ${index + 1}" loading="lazy">
              <div class="dm-page-live-card-content"><strong data-page-live-title>${escapeHTML(["Mito na mazingira", "Maua na bustani", "Miji na vivutio"][index])}</strong><span data-page-live-meta>Inapakia picha ya dunia...</span><a data-page-live-credit hidden target="_blank" rel="noopener noreferrer">Chanzo</a></div>
            </article>
          `).join("")}
        </div>
        <p class="dm-page-live-event" data-page-live-event>Inapakia tukio la sasa kutoka NASA EONET...</p>
      </div>
    `;
    main.insertBefore(section, main.firstChild);
    return section;
  };

  const searchCommons = async (search) => {
    const params = new URLSearchParams({ action: "query", generator: "search", gsrsearch: search, gsrnamespace: "6", gsrlimit: "10", prop: "imageinfo", iiprop: "url|mime|extmetadata", iiurlwidth: "1100", format: "json", origin: "*" });
    const response = await fetch(`${COMMONS_API}?${params.toString()}`, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Commons unavailable");
    const payload = await response.json();
    return Object.values(payload.query?.pages || {}).map((item) => {
      const info = item.imageinfo?.[0] || {};
      const mime = String(info.mime || "");
      const title = String(item.title || "World scene").replace(/^File:/i, "");
      return { url: info.thumburl || info.url, title, mime, artist: String(info.extmetadata?.Artist?.value || info.extmetadata?.Credit?.value || "Wikimedia Commons"), page: `https://commons.wikimedia.org/wiki/${encodeURIComponent(item.title || "")}` };
    }).filter((item) => /^https?:\/\//i.test(item.url || "") && (!item.mime || item.mime.startsWith("image/")));
  };

  const renderCommons = (card, item, sourceLabel) => {
    const image = card.querySelector("img");
    const title = card.querySelector("[data-page-live-title]");
    const meta = card.querySelector("[data-page-live-meta]");
    const credit = card.querySelector("[data-page-live-credit]");
    card.dataset.source = "commons";
    card.classList.add("is-changing");
    window.setTimeout(() => {
      image.src = item.url;
      image.alt = `${item.title} — Wikimedia Commons`;
      if (title) title.textContent = item.title.length > 44 ? `${item.title.slice(0, 44)}…` : item.title;
      if (meta) meta.textContent = `${sourceLabel} • Wikimedia Commons`;
      if (credit) { credit.hidden = false; credit.href = item.page; credit.textContent = "Credits"; }
      card.classList.remove("is-changing");
    }, 180);
  };

  const loadWorldVisuals = async (section) => {
    const cards = [...section.querySelectorAll("[data-page-live-card]")];
    const pools = await Promise.all(queries.map((query) => searchCommons(query).catch(() => [])));
    let cursor = 0;
    const render = () => cards.forEach((card, index) => {
      const pool = pools[index % pools.length];
      if (!pool.length) return;
      renderCommons(card, pool[cursor % pool.length], ["Mito na mazingira", "Maua na bustani", "Miji na vivutio"][index]);
      cursor += 1;
    });
    if (pools.some((pool) => pool.length)) { render(); window.setInterval(render, 15000); }
  };

  const loadEvents = async (section) => {
    const output = section.querySelector("[data-page-live-event]");
    try {
      const response = await fetch(EVENTS, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("EONET unavailable");
      const payload = await response.json();
      const events = Array.isArray(payload.events) ? payload.events : [];
      if (!events.length) { output.textContent = "NASA EONET: Hakuna tukio jipya lililoripotiwa kwa sasa."; return; }
      let index = 0;
      const render = () => { const event = events[index % events.length]; const category = event.categories?.[0]?.title || "Earth event"; output.innerHTML = `NASA EONET • <a href="${escapeHTML(event.link || "https://eonet.gsfc.nasa.gov/")}" target="_blank" rel="noopener noreferrer">${escapeHTML(event.title || "Tukio la dunia")}</a> • ${escapeHTML(category)}`; index += 1; };
      render(); window.setInterval(render, 7000);
    } catch { output.textContent = "NASA EONET haijapatikana kwa sasa; world visuals zinaendelea kutoka Wikimedia Commons."; }
  };

  const upgradeStaticContentImages = async () => {
    const staticAssets = /assets\/(news1|news2|news3|gallery|motivation|movie|originals|podcast|simulizi|videos)\.jpg$/i;
    const images = [...document.querySelectorAll("main img")].filter((image) => !image.closest(".dm-page-live, .dm-live-strip, .gallery") && staticAssets.test(image.getAttribute("src") || ""));
    if (!images.length) return;
    const pools = await Promise.all(queries.map((query) => searchCommons(query).catch(() => [])));
    const all = pools.flat();
    if (!all.length) return;
    let cursor = 0;
    const update = () => images.forEach((image) => {
      const item = all[cursor++ % all.length];
      image.dataset.originalSrc ||= image.src;
      image.style.opacity = "0.18";
      window.setTimeout(() => { image.src = item.url; image.alt = `${item.title} — Dizzah Media world visual`; image.title = `Wikimedia Commons: ${item.title}`; image.style.opacity = "1"; }, (cursor % 8) * 70);
    });
    images.forEach((image) => { image.style.transition = "opacity .45s ease, transform .5s ease"; image.addEventListener("error", () => { image.src = image.dataset.originalSrc || "assets/gallery.jpg"; image.style.opacity = "1"; }, { once: true }); });
    update(); window.setInterval(update, 18000);
  };

  const init = () => { const section = create(); if (!section) return; loadWorldVisuals(section); loadEvents(section); upgradeStaticContentImages(); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
