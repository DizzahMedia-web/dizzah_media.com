/* Dizzah Media — International UX layer: language switcher + breaking ticker. */
(() => {
  "use strict";
  const storageKey = "dizzah-language";
  const messages = {
    sw: [
      "Karibu Dizzah Media — Sauti za Tanzania kwa Dunia.",
      "Habari, simulizi na maudhui yenye ubora kutoka Tanzania kwenda Afrika na dunia.",
      "Dizzah Originals: Local Stories. Global Standards.",
      "Tuma taarifa yako kwa newsroom ya Dizzah Media kupitia ukurasa wa Contact."
    ],
    en: [
      "Welcome to Dizzah Media — Tanzania's voice to the world.",
      "News, stories and premium content from Tanzania to Africa and the world.",
      "Dizzah Originals: Local Stories. Global Standards.",
      "Send your news tip to the Dizzah Media newsroom through our Contact page."
    ]
  };
  const navLabels = {
    "index.html": ["Home", "Home"], "news.html": ["News", "News"], "simulizi.html": ["Simulizi", "Stories"],
    "movies.html": ["Movies", "Movies"], "originals.html": ["Originals", "Originals"], "videos.html": ["Videos", "Videos"],
    "gallery.html": ["Gallery", "Gallery"], "podcasts.html": ["Podcasts", "Podcasts"], "motivation.html": ["Motivation", "Motivation"],
    "live.html": ["Live", "Live"], "search.html": ["Search", "Search"], "profile.html": ["Profile", "Profile"],
    "about.html": ["Kuhusu Sisi", "About"], "contact.html": ["Mawasiliano", "Contact"], "faq.htm": ["FAQ", "FAQ"]
  };
  let language = localStorage.getItem(storageKey) === "en" ? "en" : "sw";
  let tickerIndex = 0;
  let tickerTimer;
  let paused = false;

  const basename = (href) => String(href || "").split("?")[0].split("#")[0].split("/").pop().toLowerCase();
  const t = (pair) => pair[language === "en" ? 1 : 0];

  function buildLanguageSwitcher() {
    if (document.querySelector(".dm-language-wrap")) return;
    const nav = document.querySelector("header nav, .nav-links, .nav");
    if (!nav) return;
    const wrap = document.createElement("span");
    wrap.className = "dm-language-wrap";
    wrap.innerHTML = '<label for="dmLanguage">Language</label><select class="dm-language-select" id="dmLanguage" aria-label="Choose language"><option value="sw">SW</option><option value="en">EN</option></select>';
    nav.appendChild(wrap);
    const select = wrap.querySelector("select");
    select.value = language;
    select.addEventListener("change", () => {
      language = select.value === "en" ? "en" : "sw";
      localStorage.setItem(storageKey, language);
      applyLanguage();
      renderTicker();
    });
  }

  function buildTicker() {
    let ticker = document.querySelector(".dm-ticker");
    const legacy = document.querySelector(".breaking");
    if (legacy && !ticker) {
      legacy.classList.add("dm-ticker");
      const label = legacy.querySelector(".breaking-label");
      const text = legacy.querySelector(".breaking-text");
      if (label) label.className = "dm-ticker-label";
      if (text) text.className = "dm-ticker-message";
      ticker = legacy;
    }
    if (!ticker) {
      ticker = document.createElement("div");
      ticker.className = "dm-ticker";
      const header = document.querySelector("header");
      if (header) header.insertAdjacentElement("afterend", ticker);
    }
    if (!ticker.querySelector(".dm-ticker-message")) {
      ticker.innerHTML = '<span class="dm-ticker-label">BREAKING</span><span class="dm-ticker-track"><span class="dm-ticker-message" aria-live="polite"></span><span class="dm-ticker-time"></span><button class="dm-ticker-control" type="button" aria-label="Pause ticker" title="Pause ticker">Ⅱ</button></span>';
    } else if (!ticker.querySelector(".dm-ticker-control")) {
      ticker.insertAdjacentHTML("beforeend", '<button class="dm-ticker-control" type="button" aria-label="Pause ticker" title="Pause ticker">Ⅱ</button>');
    }
    const control = ticker.querySelector(".dm-ticker-control");
    control.addEventListener("click", () => {
      paused = !paused;
      ticker.classList.toggle("is-paused", paused);
      control.textContent = paused ? "▶" : "Ⅱ";
      control.setAttribute("aria-label", paused ? "Resume ticker" : "Pause ticker");
      if (paused) clearInterval(tickerTimer); else startTicker();
    }, { once: true });
    renderTicker();
    startTicker();
  }

  function renderTicker() {
    const ticker = document.querySelector(".dm-ticker");
    if (!ticker) return;
    const list = messages[language];
    const message = ticker.querySelector(".dm-ticker-message");
    const label = ticker.querySelector(".dm-ticker-label");
    const time = ticker.querySelector(".dm-ticker-time");
    if (message) message.textContent = list[tickerIndex % list.length];
    if (label) label.textContent = language === "en" ? "BREAKING" : "HABARI";
    if (time) time.textContent = `${tickerIndex + 1}/${list.length}`;
  }

  function startTicker() {
    clearInterval(tickerTimer);
    if (paused) return;
    tickerTimer = setInterval(() => { tickerIndex = (tickerIndex + 1) % messages[language].length; renderTicker(); }, 6000);
  }

  function applyLanguage() {
    document.documentElement.lang = language === "en" ? "en" : "sw";
    document.querySelectorAll("header nav a, .nav-links a, .nav a").forEach((link) => {
      const key = basename(link.getAttribute("href"));
      if (navLabels[key]) link.textContent = t(navLabels[key]);
    });
    document.querySelectorAll(".utility a").forEach((link) => {
      const key = basename(link.getAttribute("href"));
      if (key === "about.html") link.textContent = language === "en" ? "About" : "Kuhusu Sisi";
      if (key === "contact.html") link.textContent = language === "en" ? "Contact" : "Mawasiliano";
    });
    const label = document.querySelector(".dm-language-wrap label");
    if (label) label.textContent = language === "en" ? "Language" : "Lugha";
  }

  function init() {
    buildLanguageSwitcher();
    buildTicker();
    applyLanguage();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
