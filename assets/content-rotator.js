/* Dizzah Media — NASA-powered gallery rotation for GitHub Pages. */
(() => {
  "use strict";

  const GIBS = "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best";
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
  const rotate = () => {
    cards.forEach((card, index) => {
      const image = card.querySelector("img");
      const title = card.querySelector(".caption strong");
      const subtitle = card.querySelector(".caption span");
      if (!image) return;
      const [row, col] = positions[index % positions.length];
      card.classList.add("is-changing");
      image.style.opacity = "0.12";
      window.setTimeout(() => {
        image.src = tile(frame, row, col);
        image.alt = `Dizzah Media ${labels[index % labels.length]} — NASA Earth Watch ${dateFor(frame)}`;
        if (title) title.textContent = labels[index % labels.length];
        if (subtitle) subtitle.textContent = `NASA GIBS • ${dateFor(frame)}`;
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
      card.classList.remove("is-changing");
    }, { once: true });
  });

  rotate();
  window.setInterval(rotate, 10000);
})();
