let limit = 40;
let offet = 0;
let imgUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/"

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
    console.log(entry.url);
  }
}

function renderPokemons(pokemon, i) {
  let contentContainer = document.getElementById("content");
  contentContainer.innerHTML += `
        <div id="pokemon_card${i}" class="pokemon_card" onclick="openDialogOverlay(${i})">
            <div class="pokemon_title">
                <p> #${(i + 1)}</p>
                <p> ${pokemon.species.name}</p>
            </div>
            <div class="bg_for_img">
             <img class="pokemon_img" src="${imgUrl+(i + 1)}.gif">
            </div>
           <p>weight: ${pokemon.weight} kg</p>
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

function openDialogOverlay(index, pokemon){
console.log(index)
    // let dialog = document.getElementById("dialog_overlay");
    // dialog.innerHTML += `
    //       <div id="pokemon_dialog${index}" class="pokemon_card">
    //           <div>
    //               <p> #${index + 1}</p>
    //               <p> ${pokemon.species.name}</p>
    //           </div>
    //          <img src="#">
    //          <p> ${pokemon.weight}</p>
    //          <div>
    //              <button>left</button>
    //              <button>right</button>
    //          </div> 
    //       </div>
    //      `;
}
