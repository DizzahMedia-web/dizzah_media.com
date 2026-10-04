/* Dizzah Media — category-aware live visuals for each public content page. */
(() => {
  "use strict";

  const GIBS = "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best";
  const EVENTS = "https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=10";
  const layer = "VIIRS_SNPP_CorrectedReflectance_TrueColor";
  const matrix = "GoogleMapsCompatible_Level9";
  const positions = [[3, 3], [4, 3], [2, 4]];
  const page = location.pathname.split("/").pop().toLowerCase();
  const configs = {
    "index.html": ["DIZZAH MEDIA LIVE", "Tanzania → Africa → World", "Satellite moments and world events in motion."],
    "news.html": ["HABARI LIVE", "Matukio yanayoendelea duniani", "Picha za Earth Watch na matukio ya asili yanayoendelea."],
    "simulizi.html": ["SIMULIZI ZA DUNIA", "Stories behind the moment", "Mandhari za dunia zinazobadilika kwa kila sura ya simulizi."],
    "movies.html": ["CINEMATIC EARTH", "Scenes from a living planet", "Mionekano ya cinematic kutoka Earth Watch; si movie stills za watu wengine."],
    "originals.html": ["DIZZAH ORIGINALS LIVE", "Local stories • global planet", "Visuals za dunia kwa ubunifu wa Dizzah Originals."],
    "videos.html": ["DIZZAH MEDIA TV LIVE", "Watch the world change", "Frames za satellite na matukio yanayoweza kugeuzwa kuwa video stories."],
    "gallery.html": ["WORLD MOMENTS", "Gallery inayobadilika", "Satellite frames na moments za dunia zikibadilika kila baada ya muda."],
    "podcasts.html": ["DIZZAH TALKS • LIVE EARTH", "Listen to the planet", "Visual companion ya mazungumzo, interviews na matukio ya dunia."],
    "motivation.html": ["INSPIRATION FROM EARTH", "Dunia iko hai", "Mabadiliko ya dunia kama background ya ujumbe wa kujenga."],
    "live.html": ["NASA LIVE MAP", "Earth Watch", "Matukio ya asili yanayotolewa na NASA EONET."],
    "search.html": ["LIVE DISCOVERY", "Search the moment", "Visuals za sasa kwa safari ya kutafuta maudhui."],
    "profile.html": ["DIZZAH MEDIA LIVE", "Our world, our stories", "Brand visuals zinazobadilika bila kuondoa taarifa za profile."],
    "about.html": ["ABOUT DIZZAH • EARTH WATCH", "Tanzania → Africa → World", "Dunia inayotuzunguka, ikionekana kwa macho ya satellite."],
    "contact.html": ["CONTACT THE NEWSROOM", "Send a story from anywhere", "Live event context kwa newsroom ya Dizzah Media."],
    "faq.htm": ["DIZZAH MEDIA LIVE", "Maswali kuhusu live content", "Satellite imagery na event feed yenye fallback salama."]
  };

  const config = configs[page];
  if (!config || document.querySelector(".dm-page-live")) return;

  const dateFor = (daysAgo) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - daysAgo);
    return date.toISOString().slice(0, 10);
  };
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
            <article class="dm-page-live-card" data-page-live-card="${index}">
              <span class="dm-page-live-badge"><i></i> LIVE NASA</span>
              <img src="${tile(1, position[0], position[1])}" alt="NASA satellite frame ${index + 1}" loading="lazy">
              <div class="dm-page-live-card-content"><strong data-page-live-title>${index === 0 ? config[1] : "Earth Watch"}</strong><span data-page-live-meta>${dateFor(1)} • NASA GIBS</span></div>
            </article>
          `).join("")}
        </div>
        <p class="dm-page-live-event" data-page-live-event>Inapakia tukio la sasa kutoka NASA EONET...</p>
      </div>
    `;
    main.insertBefore(section, main.firstChild);
    return section;
  };

  const rotate = (section) => {
    let frame = 1;
    const cards = [...section.querySelectorAll("[data-page-live-card]")];
    const update = () => {
      cards.forEach((card, index) => {
        const image = card.querySelector("img");
        const meta = card.querySelector("[data-page-live-meta]");
        const [row, col] = positions[index];
        card.classList.add("is-changing");
        window.setTimeout(() => {
          image.src = tile(frame, row, col);
          image.alt = `${config[1]} — NASA satellite frame ${dateFor(frame)}`;
          meta.textContent = `${dateFor(frame)} • NASA GIBS`;
          card.classList.remove("is-changing");
        }, 230 + index * 70);
      });
      frame = frame >= 3 ? 1 : frame + 1;
    };
    cards.forEach((card) => {
      card.querySelector("img").addEventListener("error", (event) => {
        event.currentTarget.src = "assets/gallery.jpg";
        card.classList.remove("is-changing");
      }, { once: true });
    });
    window.setInterval(update, 12000);
  };

  const loadEvents = async (section) => {
    const output = section.querySelector("[data-page-live-event]");
    try {
      const response = await fetch(EVENTS, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("EONET unavailable");
      const payload = await response.json();
      const events = Array.isArray(payload.events) ? payload.events : [];
      if (!events.length) {
        output.textContent = "NASA EONET: Hakuna tukio jipya lililoripotiwa kwa sasa.";
        return;
      }
      let index = 0;
      const render = () => {
        const event = events[index % events.length];
        const category = event.categories?.[0]?.title || "Earth event";
        output.innerHTML = `NASA EONET • <a href="${escapeHTML(event.link || "https://eonet.gsfc.nasa.gov/")}" target="_blank" rel="noopener noreferrer">${escapeHTML(event.title || "Tukio la dunia")}</a> • ${escapeHTML(category)}`;
        index += 1;
      };
      render();
      window.setInterval(render, 7000);
    } catch {
      output.textContent = "NASA EONET haijapatikana kwa sasa; picha za satellite zinaendelea kwa fallback.";
    }
  };

  const upgradeStaticContentImages = () => {
    const staticAssets = /assets\/(news1|news2|news3|gallery|motivation|movie|originals|podcast|simulizi|videos)\.jpg$/i;
    const images = [...document.querySelectorAll("main img")]
      .filter((image) => !image.closest(".dm-page-live, .dm-live-strip") && staticAssets.test(image.getAttribute("src") || ""));
    if (!images.length) return;

    let frame = 1;
    const update = () => {
      images.forEach((image, index) => {
        const [row, col] = positions[index % positions.length];
        image.dataset.originalSrc ||= image.src;
        image.style.opacity = "0.2";
        window.setTimeout(() => {
          image.src = tile(frame, row, col);
          image.alt = `${config[1]} — NASA Earth Watch ${dateFor(frame)}`;
          image.style.opacity = "1";
        }, index * 90);
      });
      frame = frame >= 3 ? 1 : frame + 1;
    };

    images.forEach((image) => {
      image.style.transition = "opacity .4s ease, transform .5s ease";
      image.addEventListener("error", () => {
        image.src = image.dataset.originalSrc || "assets/gallery.jpg";
        image.style.opacity = "1";
      }, { once: true });
    });
    update();
    window.setInterval(update, 12000);
  };

  const init = () => {
    const section = create();
    if (!section) return;
    rotate(section);
    loadEvents(section);
    upgradeStaticContentImages();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
