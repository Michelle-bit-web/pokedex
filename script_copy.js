let limit = 40;
let offset = 0;
let pokemonData = [];
let pokemonTypesData = [];
let imgUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/";
let openDialog = false;
let saveIndex;

function init() {
  fetchPokemonUrls();
}

//hier vllt eine Hilfsvariable bauen, die immer Urls fetched & mit Parametern oder sonst default parametern
//Beispiel let pokemonForm = "pokemon-form"  
//Dann Funktionsaufruf mit übergabe von pokemonForm
//Dann irgendwie iteration um übergabe von i zu kriegen
async function fetchPokemonUrls() {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  let responseToJson = await response.json();
  getEachPokemonUrl(responseToJson);
}

//Hinweis: Detailansicht ja nur beim Klicken. Nur dann abrufen die Daten?! Farben als Gradient bauen
//hier URL für name, types,png https://pokeapi.co/api/v2/pokemon-form/1/
//Eine allgemeine URL bauen: "https://pokeapi.co/api/v2/${feature}/${i}/" wo feature und id austauschbar sind

async function getEachPokemonUrl(array) {
  for (let i = offset; i < array.results.length; i++) {
    const entry = array.results[i];
    let response = await fetch(entry.url);//hier vielleicht eine generelle Übergabe von Urls, die gefetched werden und an bestimmte Fkt übergeben werden
    let pokemonToJson = await response.json();
    pokemonData[i] = pokemonToJson;
    console.log(entry.url);
    renderPokemons(i);
    
    for (let j = 0; j < pokemonData[i].types.length; j++) {
      const pokemonTypes = pokemonData[i].types[j].type.name;
      pokemonTypesData[j] = pokemonTypes;
      let types = pokemonTypesData[j];
       document.getElementById(`types${i}`).innerHTML+=`<p>${types}</p>`
  };
  getTypeColor(i, `bg_for_img${i}`, `pokemon_card${i}`);
}

function renderPokemons(i) {
  let pokemon = pokemonData[i];
  
  let contentContainer = document.getElementById("content");
  contentContainer.innerHTML += `
        <div id="pokemon_card${i}" class="pokemon_card" onclick="openDialogOverlay(${i})">
            <div class="pokemon_title">
                <p> ${pokemon.species.name}</p>
                <p> #${i + 1}</p>
            </div>
            <div id="bg_for_img${i}" class="bg_for_img">
             <img class="pokemon_img" src="${imgUrl + (i + 1)}.gif">
            </div>
            <div id="types${i}" class="div_types">
            </div>
        </div>
       `;
      }
}

function getTypeColor(i, imageBgId, cardId) {
  let types = pokemonData[i].types;
  let typeColors = [];

  for (let j = 0; j < types.length; j++) {
    let typeName = types[j].type.name;
    let color = colors[typeName];
    typeColors.push(color);
  }

  const imageBg = document.getElementById(imageBgId);
  const card = document.getElementById(cardId);

  if (!typeColors[0]) return; // Fallback

  if (typeColors.length === 1) {
    imageBg.style.background = typeColors[0];
    card.style.border = `3px solid ${typeColors[0]}`;
  } else {
    const gradient = `linear-gradient(135deg, ${typeColors[0]}, ${typeColors[1]})`;
    imageBg.style.background = gradient;
    card.style.border = `3px solid ${typeColors[0]}`;
    card.style.backgroundClip = "padding-box";
  }
}

function loadMoreData() {
  if (limit >= 350) {
    document.getElementById("load_data_btn").disabled = true;
  } else {
    document.getElementById("load_data_btn").disabled = true;
    console.log("is loading");
    limit += 40;
    offset += 40;
    fetchPokemonUrls();
    document.getElementById("load_data_btn").disabled = false;
  }
}

function openDialogOverlay(index) {
  let dialog = document.getElementById("dialog_overlay");
  let pokemon = pokemonData[index];

  dialog.classList.remove("d_none");
  dialog.innerHTML = `
      <div id="pokemon_dialog${index}" class="pokemon_card_dialog">
          <div class="dialog_top_content">
                <div>
                    <p>#${index + 1}</p>
                    <p>${pokemon.species.name}</p>
              
                </div>
                <button onclick="closeDialog()" class="close_btn">Close</button>
          </div>
          <div id="bg_for_img_dialog${index}" class="bg_for_img_dialog">
              <img class="pokemon_img_dialog" src="${imgUrl + (index + 1)}.gif">
          </div>
          <div class="categories_dialog">
              <div class="category_titles_dialog">
              <h3 class="onclick" onclick="switchCategory(event)">About</h3>
              <h3 onclick="switchCategory(event)">Base Stats</h3>
              <h3 onclick="switchCategory(event)">category 3</h3>
              <h3 onclick="switchCategory(event)"> category 4</h3>
              </div>
              <p>weight: ${pokemon.weight} kg</p>
              <p>weight: ${pokemon.weight} kg</p>
              <p>weight: ${pokemon.weight} kg</p>
          </div>
          
          <div>
              <button onclick="navigateDialog(${index}, -1)">left</button>
              <button onclick="navigateDialog(${index}, 1)">right</button>
          </div>
      </div>
    `;
  unableScrolling();
  getTypeColor(index, `bg_for_img_dialog${index}`, `pokemon_dialog${index}`);
  saveIndex = index;
}

function unableScrolling() {
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden"; 
}

function enableScrolling() {
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
}

function closeDialog() {
  let dialog = document.getElementById("dialog_overlay");
  dialog.classList.add("d_none");
  enableScrolling();
}

function navigateDialog(currentIndex, direction) {
    let newIndex = currentIndex + direction;
    if (newIndex >= pokemonData.length) {
      newIndex = 0;
    }
    if (newIndex < 0) {
      newIndex = pokemonData.length - 1;
    }
    saveIndex = newIndex;
    openDialogOverlay(newIndex);
  }

  function switchCategory(event){
    let categoryTitles = document.querySelectorAll(".category_titles_dialog h3");
    categoryTitles.forEach(h3 => {
      h3.classList.remove('onclick');})
    event.target.classList.add('onclick');
  }
