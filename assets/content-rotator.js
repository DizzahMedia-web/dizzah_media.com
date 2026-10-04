/* Dizzah Media — lightweight local content rotation for GitHub Pages. */
(() => {
  "use strict";

  const galleryImages = [
    ["assets/news1.jpg", "News"],
    ["assets/news2.jpg", "Newsroom"],
    ["assets/news3.jpg", "Matukio"],
    ["assets/gallery.jpg", "Moments"],
    ["assets/simulizi.jpg", "Simulizi"],
    ["assets/movie.jpg", "Movies"],
    ["assets/originals.jpg", "Originals"],
    ["assets/videos.jpg", "Dizzah Media TV"],
    ["assets/podcast.jpg", "Podcasts"],
    ["assets/motivation.jpg", "Motivation"]
  ];

  const gallery = document.querySelector(".gallery");
  if (!gallery) return;

  const cards = [...gallery.querySelectorAll(".photo")];
  if (!cards.length) return;

  const rotateCard = (card, index) => {
    const image = card.querySelector("img");
    const title = card.querySelector(".caption strong");
    const subtitle = card.querySelector(".caption span");
    if (!image) return;

    const asset = galleryImages[(index + Math.floor(Date.now() / 7000)) % galleryImages.length];
    image.style.opacity = "0";
    window.setTimeout(() => {
      image.src = asset[0];
      image.alt = `Dizzah Media ${asset[1]}`;
      if (title) title.textContent = asset[1];
      if (subtitle) subtitle.textContent = "Dizzah Media";
      image.style.opacity = "1";
    }, 180);
  };

  cards.forEach((card, index) => {
    const image = card.querySelector("img");
    if (image) {
      image.style.transition = "opacity .18s ease, transform .5s ease";
      image.addEventListener("error", () => {
        image.src = "assets/gallery.jpg";
      }, { once: true });
    }
    window.setInterval(() => rotateCard(card, index), 7000 + index * 350);
  });
})();
