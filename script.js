let limit = 40;
let offset = 0;
let pokemonData = [];
let imgUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/";
let openDialog = false;

function init() {
  fetchPokemonUrls();
}

async function fetchPokemonUrls() {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  let responseToJson = await response.json();
  getEachPokemonUrl(responseToJson);
}

//Eine allgemeine URL bauen: "https://pokeapi.co/api/v2/${feature}/${i}/" wo feature und id austauschbar sind

async function getEachPokemonUrl(array) {
  for (let i = offset; i < array.results.length; i++) {
    const entry = array.results[i];
    let response = await fetch(entry.url);
    let pokemonToJson = await response.json();
    renderPokemons(pokemonToJson, i);
    console.log(entry.url);
  }
}

function renderPokemons(pokemon, i) {
  pokemonData[i] = pokemon;
  let contentContainer = document.getElementById("content");
  contentContainer.innerHTML += `
        <div id="pokemon_card${i}" class="pokemon_card" onclick="openDialogOverlay(${i})">
            <div class="pokemon_title">
                <p> #${i + 1}</p>
                <p> ${pokemon.species.name}</p>
            </div>
            <div class="bg_for_img">
             <img class="pokemon_img" src="${imgUrl + (i + 1)}.gif">
            </div>
           <p>weight: ${pokemon.weight} kg</p>
        </div>
       `;
}

function loadMoreData() {
  if (limit >= 350) {
    document.getElementById("load_data_btn").disabled = true;
  } else {
    console.log("is loading");
    limit += 40;
    offset += 40;
    fetchPokemonUrls();
  }
}

function openDialogOverlay(index) {
  let dialog = document.getElementById("dialog_overlay");
  let pokemon = pokemonData[index];

  dialog.classList.remove("d_none");
  dialog.innerHTML = `
      <div id="pokemon_dialog${index}" class="pokemon_card">
          <div class="dialog_top_content">
                <div>
                    <p>#${index + 1}</p>
                    <p>${pokemon.species.name}</p>
              
                </div>
                <button onclick="closeDialog()" class="close_btn">Close</button>
          </div>
          <div class="bg_for_img">
              <img class="pokemon_img" src="${imgUrl + (index + 1)}.gif">
          </div>
          <p>weight: ${pokemon.weight} kg</p>
          <div>
              <button onclick="navigateDialog(${index - 1})">left</button>
              <button onclick="navigateDialog(${index + 1})">right</button>
          </div>
      </div>
    `;
  unableScrolling();
}

function unableScrolling() {
  document.body.style.overflow = "hidden";
}

function enableScrolling() {
  document.body.style.overflow = "";
}

function closeDialog() {
  let dialog = document.getElementById("dialog_overlay");
  dialog.classList.add("d_none");
  enableScrolling();
}
