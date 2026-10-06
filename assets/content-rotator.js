/* Dizzah Media — category rotation for the Gallery. */
(() => {
  "use strict";
  const COMMONS = "https://commons.wikimedia.org/w/api.php";
  const gallery = document.querySelector(".gallery");
  if (!gallery) return;
  const cards = [...gallery.querySelectorAll(".photo")];
  if (!cards.length) return;
  const categories = [
    ["beautiful flowers botanical garden", "Maua na bustani"],
    ["beautiful rivers waterfalls lakes landscape", "Mito na maporomoko"],
    ["world attractions city skylines landmarks", "Vivutio na miji"],
    ["African landscapes nature rivers", "Mandhari ya Afrika"],
    ["tropical gardens flowers parks", "Bustani za dunia"],
    ["famous tourist attractions scenic landscape", "Maeneo ya kuvutia"]
  ];
  const query = (search) => {
    const params = new URLSearchParams({ action: "query", generator: "search", gsrsearch: search, gsrnamespace: "6", gsrlimit: "8", prop: "imageinfo", iiprop: "url|mime|extmetadata", iiurlwidth: "1100", format: "json", origin: "*" });
    return fetch(`${COMMONS}?${params.toString()}`, { headers: { Accept: "application/json" } }).then((r) => { if (!r.ok) throw new Error("Commons unavailable"); return r.json(); }).then((payload) => Object.values(payload.query?.pages || {}).map((item) => {
      const info = item.imageinfo?.[0] || {};
      return { url: info.thumburl || info.url, mime: String(info.mime || ""), title: String(item.title || "World scene").replace(/^File:/i, ""), page: `https://commons.wikimedia.org/wiki/${encodeURIComponent(item.title || "")}` };
    }).filter((item) => /^https?:\/\//i.test(item.url || "") && (!item.mime || item.mime.startsWith("image/"))));
  };
  const render = (card, item, label) => {
    const image = card.querySelector("img");
    const title = card.querySelector(".caption strong");
    const subtitle = card.querySelector(".caption span");
    if (!image) return;
    card.classList.add("is-changing");
    image.style.opacity = "0.12";
    window.setTimeout(() => {
      image.src = item.url;
      image.alt = `${item.title} — Wikimedia Commons`;
      image.title = `Chanzo: Wikimedia Commons — ${item.title}`;
      if (title) title.textContent = label;
      if (subtitle) subtitle.textContent = "Wikimedia Commons • World scene";
      card.dataset.source = item.page;
      image.style.opacity = "1";
      card.classList.remove("is-changing");
    }, 150);
  };
  const pools = [];
  const load = async () => {
    const results = await Promise.all(categories.map(([search]) => query(search).catch(() => [])));
    results.forEach((items, index) => { pools[index] = items; });
    let round = 0;
    const rotate = () => cards.forEach((card, index) => {
      const items = pools[index % pools.length] || [];
      if (items.length) render(card, items[round % items.length], categories[index % categories.length][1]);
    });
    if (pools.some((items) => items.length)) { rotate(); window.setInterval(() => { round += 1; rotate(); }, 15000); }
  };
  cards.forEach((card) => {
    const image = card.querySelector("img");
    if (image) { image.style.transition = "opacity .4s ease, transform .5s ease"; image.addEventListener("error", () => { image.src = "assets/gallery.jpg"; image.style.opacity = "1"; }, { once: true }); }
  });
  load();
})();
