/* Dizzah Media — NASA GIBS + EONET live visual layer for GitHub Pages. */
(() => {
  "use strict";

  const GIBS = "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best";
  const EONET = "https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=8";
  const tileMatrix = "GoogleMapsCompatible_Level9";
  const tiles = [
    [3, 3, "Africa & Europe"],
    [4, 3, "Indian Ocean & Asia"],
    [2, 4, "Atlantic & the Americas"]
  ];

  const dateFor = (daysAgo) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - daysAgo);
    return date.toISOString().slice(0, 10);
  };

  const tileUrl = (daysAgo, row, col) =>
    `${GIBS}/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/${dateFor(daysAgo)}/${tileMatrix}/3/${row}/${col}.jpg`;

  const escapeHTML = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const mount = () => {
    if (document.querySelector(".dm-live-strip")) return;
    const target = document.querySelector("main") || document.body;
    const strip = document.createElement("section");
    strip.className = "dm-live-strip";
    strip.setAttribute("aria-label", "Dizzah Media live satellite visuals");
    strip.innerHTML = `
      <div class="dm-live-inner">
        <div class="dm-live-head">
          <div class="dm-live-title"><i class="dm-live-dot" aria-hidden="true"></i><span>LIVE EARTH WATCH</span></div>
          <span class="dm-live-time">NASA VIIRS • near-real-time imagery</span>
        </div>
        <div class="dm-live-grid">
          ${tiles.map((tile, index) => `
            <article class="dm-live-card" data-live-card="${index}">
              <img src="${tileUrl(1, tile[0], tile[1])}" alt="NASA satellite view: ${tile[2]}" loading="lazy">
              <div class="dm-live-caption"><strong>${tile[2]}</strong><span data-live-date>NASA GIBS</span></div>
            </article>
          `).join("")}
        </div>
        <div class="dm-live-events" data-live-events aria-live="polite">Inapakia matukio ya dunia kutoka NASA EONET...</div>
      </div>
    `;
    target.parentNode.insertBefore(strip, target);
    return strip;
  };

  const rotateSatellite = (strip) => {
    const cards = [...strip.querySelectorAll("[data-live-card]")];
    let frame = 1;
    const update = () => {
      cards.forEach((card, index) => {
        const [row, col] = tiles[index];
        const image = card.querySelector("img");
        const date = card.querySelector("[data-live-date]");
        card.classList.add("is-changing");
        window.setTimeout(() => {
          image.src = tileUrl(frame, row, col);
          image.alt = `NASA satellite view: ${tiles[index][2]} — ${dateFor(frame)}`;
          if (date) date.textContent = dateFor(frame);
          card.classList.remove("is-changing");
        }, 240);
      });
      frame = frame >= 3 ? 1 : frame + 1;
    };
    cards.forEach((card) => {
      const image = card.querySelector("img");
      image.addEventListener("error", () => {
        image.src = "assets/gallery.jpg";
        card.classList.remove("is-changing");
      }, { once: true });
    });
    window.setInterval(update, 14000);
  };

  const loadEvents = async (strip) => {
    const target = strip.querySelector("[data-live-events]");
    try {
      const response = await fetch(EONET, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("EONET request failed");
      const payload = await response.json();
      const events = Array.isArray(payload.events) ? payload.events : [];
      if (!events.length) {
        target.textContent = "NASA EONET: Hakuna tukio jipya lililoripotiwa kwa sasa.";
        return;
      }
      let cursor = 0;
      const render = () => {
        const event = events[cursor % events.length];
        const category = event.categories?.[0]?.title || "Earth event";
        target.innerHTML = `NASA EONET • <a href="${escapeHTML(event.link || "https://eonet.gsfc.nasa.gov/")}" target="_blank" rel="noopener noreferrer">${escapeHTML(event.title || "Tukio la dunia")}</a> • ${escapeHTML(category)}`;
        cursor += 1;
      };
      render();
      window.setInterval(render, 8000);
    } catch (error) {
      target.textContent = "NASA EONET haijapatikana kwa sasa; satellite visuals zinaendelea.";
    }
  };

  const init = () => {
    const strip = mount();
    if (!strip) return;
    rotateSatellite(strip);
    loadEvents(strip);
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
