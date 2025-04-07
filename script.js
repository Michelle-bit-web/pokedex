let limit = 40;
let offet = 0;

function init() {
  fetchPokemonUrls();
}

async function fetchPokemonUrls() {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offet}`);
  let responseToJson = await response.json();
  getEachPokemonUrl(responseToJson);
}

//Eine allgemeine URL bauen: "https://pokeapi.co/api/v2/${feature}/${i}/" wo feature und id austauschbar sind

async function getEachPokemonUrl(array) {
  for (let i = 0; i < array.results.length; i++) {
    const entry = array.results[i];
    let response = await fetch(entry.url);
    let pokemonToJson = await response.json();
    renderPokemons(pokemonToJson, i);
  }
}

function renderPokemons(pokemon, i) {
  let contentContainer = document.getElementById("content");
  contentContainer.innerHTML += `
        <div id="pokemon_card" class="pokemon_card" onclick="openDialogOverlay(${i + 1})">
            <div>
                <p> #${i + 1}</p>
                <p> ${pokemon.species.name}</p>
            </div>
           <img src="#">
           <p> ${pokemon.weight}</p>
        </div>
       `;
}

function loadMoreData() {
  if (limit >= 120) {
    document.getElementById("load_data_btn").disabled = true;
  } else {
    console.log("is loading");
    limit += 40;
    offet += 40;
    fetchPokemonUrls();
  }
}
