"use strict";

const BASE_URL = "https://api.rawg.io/api";
const API_KEY = "4ada683953054cdb9358e724cb3c5358";
const GAMES_ENDPOINT = "/games";
const MOVIES_ENDPOINT = "/movies";
const GENRES_ENDPOINT = "/genres";

const gamesWrapper = document.querySelector(".games-wrapper");
const inputSearch = document.querySelector(".input-search");
const btnSearch = document.querySelector(".btn-search");
const genreSelect = document.querySelector(".genre-select");

const gameLoader = `
		<div class="card" aria-hidden="true">
			<div class="card-img-top game-image-container loader">
			</div>
			<div class="card-body">
			<h5 class="card-title placeholder-glow">
				<span class="placeholder col-6"></span>
			</h5>
			<p class="card-text placeholder-glow">
				<span class="placeholder col-8"></span>
			</p>
			</div>
		</div>
`;

btnSearch.addEventListener("click", () => {
  let getParams = `?key=${API_KEY}&search=${inputSearch.value}`;

  const selectedGenres = [];

  [...genreSelect.children].forEach(
    (option) => option.selected && selectedGenres.push(option.value)
  );

  if (selectedGenres.length) {
    getParams += `&genres=${selectedGenres.join(",")}`;
  }

  fetch(`${BASE_URL}${GAMES_ENDPOINT}${getParams}`)
    .then((response) => response.json())
    .then(({ results }) => {
      renderGames(results);
    });
});

(function () {
  getLoader();

  fetch(`${BASE_URL}${GAMES_ENDPOINT}?key=${API_KEY}`)
    .then((response) => response.json())
    .then((data) => {
      renderGames(data.results);
    });
  fetch(`${BASE_URL}${GENRES_ENDPOINT}?key=${API_KEY}`)
    .then((response) => response.json())
    .then(({ results }) => {
      results.forEach((genre) => {
        const option = document.createElement("option");
        option.value = genre.slug;
        option.textContent = genre.name;

        genreSelect.append(option);
      });
    });
})();

function getLoader() {
  gamesWrapper.innerHTML = "";

  for (let i = 0; i < 10; i++) {
    const skeleton = document.createElement("div");

    skeleton.classList.add("col-lg-3", "col-md-4", "game");

    skeleton.innerHTML = gameLoader;
    gamesWrapper.append(skeleton);
  }
}

function renderGames(games) {
  gamesWrapper.innerHTML = ``;

  games.forEach((gameData) => {
    const column = document.createElement("div");
    column.classList.add("col-lg-3", "col-md-4", "mb-4");

    const game = document.createElement("div");
    game.classList.add("card", "h-100", "game");
    game.id = gameData.id;

    const gameContent = `
      		<div class="card-img-top game-image-container">
					<video muted class="game-video" src="" poster=${gameData.background_image}>
      		</div>

      		<div class="card-body">
					<h5 class="card-title">${gameData.name}</h5>

					<p class="card-text genres">
						${getGenresInnerHtml(gameData.genres)}
					</p>

					<p class="card-text">
						<small class="text-muted">${gameData.released}</small>
					</p>
      		</div>`;

    game.innerHTML = gameContent;

    game.onclick = () => {
      window.location.href = `game.html#${gameData.id}`;
    };

    game.onmouseenter = () => {
      getGameVideo(gameData.id);
    };

    game.onmouseleave = (e) => {
      e.currentTarget.querySelector(".game-video").src = "";
    };

    column.append(game);

    gamesWrapper.append(column);
  });
}

function getGameVideo(id) {
  fetch(`${BASE_URL}${GAMES_ENDPOINT}/${id}${MOVIES_ENDPOINT}?key=${API_KEY}`)
    .then((response) => response.json())
    .then((data) => {
      const currentGame = document.getElementById(id);

      const gameVideo = currentGame.querySelector(".game-video");

      if (data.results.length) {
        gameVideo.src = data.results[0].data[360] || data.results[0].data[480];
        gameVideo.play();
      }
    });
}

function getGenresInnerHtml(genres) {
  return genres.reduce((result, genre) => {
    result += `<span class="badge bg-dark">${genre.name}</span>`;

    return result;
  }, "");
}
