const BASE_URL = "https://api.rawg.io/api";
const API_KEY = "4ada683953054cdb9358e724cb3c5358";
const GAMES_ENDPOINT = "/games";
const MOVIES_ENDPOINT = "/movies";
const GENRES_ENDPOINT = "/genres";

const gamesWrapper = document.querySelector(".games-wrapper");
const artWrapper = document.querySelector(".art-wrapper");

const gameId = location.hash.replace(/[^0-9]/g, "");

(function () {
  fetch(`${BASE_URL}${GAMES_ENDPOINT}/${gameId}?key=${API_KEY}`)
    .then((response) => response.json())
    .then((data) => {
      renderGame(data);
    });
})();

function renderGame(games) {
  gamesWrapper.innerHTML = ``;

  const contentLeft = document.createElement("div");
  const contentRight = document.createElement("div");

  contentLeft.classList.add("content-left");
  contentRight.classList.add("content-right");

  const title = document.createElement("h1");
  title.classList.add("title");
  title.textContent = games.name;

  contentLeft.append(title);

  const platformWrap = document.createElement("div");
  platformWrap.classList.add("platform-wrap");

  games.parent_platforms.map((elem) => {
    const platform = document.createElement("div");
    platform.textContent = elem.platform.name;
    platform.classList.add("platform");
    console.log(elem.platform.name);
    platformWrap.append(platform);
  });

  contentLeft.append(platformWrap);

  const aboutWrap = document.createElement("div");
  aboutWrap.classList.add("about-wrap");

  const aboutTitle = document.createElement("h2");
  aboutTitle.classList.add("about-title");
  aboutTitle.textContent = "About";
  const aboutText = document.createElement("p");
  aboutText.classList.add("about-text");
  aboutText.textContent = games.description_raw;

  aboutWrap.append(aboutTitle);
  aboutWrap.append(aboutText);
  contentLeft.append(aboutWrap);

  const infoWrap = document.createElement("div");
  infoWrap.classList.add("info-wrap");

  const infoBox = document.createElement("div");
  infoBox.classList.add("info-box");
  const infoTitle = document.createElement("h3");
  infoTitle.classList.add("info-title");
  infoTitle.textContent = "Platforms";
  infoBox.append(infoTitle);
  const infoTextWrap = document.createElement("div");
  infoTextWrap.classList.add("info-text-wrap");
  infoBox.append(infoTextWrap);
  games.platforms.map((elem) => {
    const infoText = document.createElement("p");
    infoText.classList.add("info-text");
    infoText.textContent = elem.platform.name;
    infoTextWrap.append(infoText);
  });

  infoWrap.append(infoBox);

  contentLeft.append(infoWrap);

  const wrapImg = document.createElement("div");
  wrapImg.classList.add("poster-wrap");

  games.tags.map((elem) => {
    const img = document.createElement("img");
    img.classList.add("poster-img");
    img.src = elem.image_background;

    wrapImg.append(img);
  });

  contentRight.append(wrapImg);

  gamesWrapper.append(contentLeft);
  gamesWrapper.append(contentRight);

  const bgArt = document.createElement("div");
  bgArt.classList.add("art_colored", "art");
  bgArt.style.backgroundImage = `linear-gradient(to bottom, rgba(15, 15, 15, 0), rgb(21, 21, 21)),linear-gradient(to bottom,rgba(21, 21, 21, 0.8),rgba(21, 21, 21, 0.5)),url(${games.background_image})`;

  artWrapper.append(bgArt);
}
