/* Dizzah Media — NASA + Wikimedia Commons gallery rotation for GitHub Pages. */
(() => {
  "use strict";

  const GIBS = "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best";
  const COMMONS = "https://commons.wikimedia.org/w/api.php";
  const layer = "VIIRS_SNPP_CorrectedReflectance_TrueColor";
  const matrix = "GoogleMapsCompatible_Level9";
  const positions = [[3, 3], [4, 3], [2, 4], [3, 4], [2, 3], [4, 4]];
  const labels = ["Africa & Europe", "Indian Ocean & Asia", "Atlantic & the Americas", "Earth Watch", "World Moments", "Dizzah Media Live"];
  const gallery = document.querySelector(".gallery");
  if (!gallery) return;

  const cards = [...gallery.querySelectorAll(".photo")];
  if (!cards.length) return;

  const dateFor = (daysAgo) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - daysAgo);
    return date.toISOString().slice(0, 10);
  };
  const tile = (daysAgo, row, col) => `${GIBS}/${layer}/default/${dateFor(daysAgo)}/${matrix}/3/${row}/${col}.jpg`;
  let frame = 1;
  let commonsImages = [];
  let commonsCursor = 0;

  const rotate = () => {
    cards.forEach((card, index) => {
      const image = card.querySelector("img");
      const title = card.querySelector(".caption strong");
      const subtitle = card.querySelector(".caption span");
      if (!image) return;
      const [row, col] = positions[index % positions.length];
      const commons = commonsImages.length ? commonsImages[commonsCursor++ % commonsImages.length] : null;
      card.classList.add("is-changing");
      image.style.opacity = "0.12";
      window.setTimeout(() => {
        image.src = commons ? commons.url : tile(frame, row, col);
        image.alt = commons ? `${commons.title} — Wikimedia Commons` : `Dizzah Media ${labels[index % labels.length]} — NASA Earth Watch ${dateFor(frame)}`;
        if (title) title.textContent = commons ? (commons.title.length > 42 ? `${commons.title.slice(0, 42)}…` : commons.title) : labels[index % labels.length];
        if (subtitle) subtitle.textContent = commons ? "Wikimedia Commons • World scene" : `NASA GIBS • ${dateFor(frame)}`;
        card.title = commons ? `Source: Wikimedia Commons — ${commons.title}` : `Source: NASA GIBS — ${dateFor(frame)}`;
        image.style.opacity = "1";
        card.classList.remove("is-changing");
      }, 120 + index * 70);
    });
    frame = frame >= 3 ? 1 : frame + 1;
  };

  cards.forEach((card) => {
    const image = card.querySelector("img");
    if (!image) return;
    image.style.transition = "opacity .35s ease, transform .5s ease";
    image.addEventListener("error", () => {
      image.src = "assets/gallery.jpg";
      image.style.opacity = "1";
      card.classList.remove("is-changing");
    }, { once: true });
  });

  const loadCommons = async () => {
    const params = new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: "beautiful flowers gardens city skylines",
      gsrnamespace: "6",
      gsrlimit: "18",
      prop: "imageinfo",
      iiprop: "url|extmetadata",
      iiurlwidth: "1000",
      format: "json",
      origin: "*"
    });
    try {
      const response = await fetch(`${COMMONS}?${params.toString()}`);
      if (!response.ok) throw new Error("Commons unavailable");
      const payload = await response.json();
      commonsImages = Object.values(payload.query?.pages || {})
        .map((item) => {
          const info = item.imageinfo?.[0] || {};
          return { url: info.thumburl || info.url, title: String(item.title || "World scene").replace(/^File:/i, "") };
        })
        .filter((item) => /^https?:\/\//i.test(item.url));
      if (commonsImages.length) rotate();
    } catch {
      // NASA rotation remains the fallback when Commons is unavailable.
    }
  };

  rotate();
  loadCommons();
  window.setInterval(rotate, 10000);
})();
