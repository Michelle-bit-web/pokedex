let limit = 40;
let offset = 1;
let openDialog = false;
let category = "about";
let saveId;
let currentPokemonIds = [];

let idToName = {};
let nameToId = {};

let pokemonData = [];
let pokemonTypesData = [];
let pokemonTypesUrl = [];
let pokemonNames = [];
let evolutionChain = [];
let evolutionChainNames = [];
const baseUrl = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
const imgUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/";

function init() {
  showLoadingSpinner();
}

async function getFetchResponse(){
  for (let i = offset; i <= limit; i++) {
    let generalUrl = `https://pokeapi.co/api/v2/pokemon/${i}/`;
    const responseData = await fetchData(generalUrl);
    currentPokemonIds.push(responseData.id);
    renderPokemonData(responseData);
  }
  removeLoadingSpinner();
}

async function fetchData(url) {
  try{
    const response = await fetch(`${url}`);
    let responseToJson = await response.json();
    pokemonNames.push(responseToJson.name);
    return responseToJson;
  } catch (error) {
      document.getElementById(`category_content${id}`).innerHTML = "";
      console.error("Fehler beim Abrufen der Daten:", error);
      document.getElementById(`category_content${id}`).innerHTML += `No more data available. Please try a different related pokémon name.`;
   }
}

async function showLoadingSpinner(){
  document.getElementById('loading_spinner').classList.remove('d_none');
  await getFetchResponse();
}

function removeLoadingSpinner(){
  document.getElementById('loading_spinner').classList.add('d_none');
}

function renderPokemonData(responseData){
  pokemonData[responseData.id] = responseData;
  let contentContainer = document.getElementById("content");
  contentContainer.innerHTML += pokemonCardTemplate(responseData);
  renderPokemonTypes(responseData, `types${responseData.id}`);
  idToName[responseData.id] = responseData.name;
  nameToId[responseData.name] = responseData.id;
  console.log(idToName, nameToId);//Darin jetzt Objekte mit name & id
}

function renderPokemonTypes(pokemon, target = `types${pokemon.id}`){
  let typeColors = [];
  const typeElement = document.getElementById(target);
  for (let t = 0; t < pokemon.types.length; t++) {
    let type = pokemon.types[t].type.name;
    let typeId = `${pokemon.id}_${type}_${target}`;
    pokemonTypesUrl.push(pokemon.name, pokemon.types[t].type.url);
    typeElement.innerHTML += `<p id="${typeId}" class="single_type_dialog">${type}</p>`;
    if (colors[type]) {
      typeColors.push(colors[type]);
      setTypeBorder(typeId, type);
    }
  }
  if (target.startsWith("types_in_dialog")) {
    fitColorToType(typeColors, `bg_for_img_dialog${pokemon.id}`, `pokemon_dialog${pokemon.id}`);
  } else {
    fitColorToType(typeColors, `bg_for_img${pokemon.id}`, `pokemon_card${pokemon.id}`);
  }
}

function fitColorToType(typeColors, imageBgId, cardId){
  let imageBg = document.getElementById(imageBgId);
  let card = document.getElementById(cardId);
  if (!imageBg || !card || !typeColors.length) return;
  if (typeColors.length === 1) {
    imageBg.style.background = typeColors[0];
  } else {
    const gradient = `linear-gradient(135deg, ${typeColors[0]}, ${typeColors[1]})`;
    imageBg.style.background = gradient; 
  }
  card.style.border = `3px solid ${typeColors[0]}`;
  card.style.setProperty('--hoverColor', typeColors[0]);
}

function setTypeBorder(pTagId, typeName){
  const element = document.getElementById(pTagId);
  if (element && colors[typeName]) {
    element.style.border = `2px solid ${colors[typeName]}`;
    element.style.borderRadius = "5px";
    element.style.padding = "2px 6px";
    element.style.margin = "2px";
    element.style.display = "inline-block";
  }
}

async function loadMoreData() {
  document.getElementById("load_data_btn").disabled = true;
  if (limit <= 1000) {
    limit += 40;
    offset += 40;
   await showLoadingSpinner();
  } 
  document.getElementById("load_data_btn").disabled = false;
}

function openDialogOverlay(id) {
  let dialog = document.getElementById("dialog_overlay");
  dialog.classList.remove("d_none");
  openDialog = true;
  renderDialogOverlay(id)
}

async function renderDialogOverlay(id, passedCategory){
  saveId = id;
  let generalUrl = `https://pokeapi.co/api/v2/pokemon/${id}/`;
  const responseData = await fetchData(generalUrl);
  let dialog = document.getElementById("dialog_overlay");
  dialog.innerHTML = getDialogTemplate(id, responseData);
  renderPokemonTypes(responseData, `types_in_dialog${id}`);
  unableScrolling();
  getCategoryContent(id, passedCategory);
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
  openDialog = false;
  enableScrolling();
}

function navigateDialog(currentId, direction) {
  let currentIndex = currentPokemonIds.indexOf(currentId);
  let newIndex = currentIndex + direction;
    if (newIndex >= currentPokemonIds.length) {
      newIndex = 0;
    }
    if (newIndex < 0) {
      newIndex = currentPokemonIds.length - 1;
    }
    let newId = currentPokemonIds[newIndex];
    saveId = newId;
    renderDialogOverlay(newId, category);
    renderDialogOverlay(newId, category).then(() => {
      // Finde den H3-Tab zur aktuellen Kategorie
      let h3Elements = document.querySelectorAll(".category_titles_dialog h3");
      h3Elements.forEach(h3 => {
        if (h3.textContent.toLowerCase() === category) {
          switchCategory({ target: h3 }, newId, category);
        }
      });
    });
  }

  function switchCategory(event, id, selectedCategory){
    let categoryTitles = document.querySelectorAll(".category_titles_dialog h3");
    categoryTitles.forEach(h3 => {
    h3.classList.remove('onclick');});
    event.target.classList.add('onclick');
    category = selectedCategory;
    getCategoryContent(id, selectedCategory);
  }

  async function getCategoryContent(id, categoryTitle) {
    if (categoryTitle == null) {
      categoryTitle = category;
    } else {
      category = categoryTitle;
    }
  
    try {
      let categoryData = await fetchData(`https://pokeapi.co/api/v2/pokemon/${id}/`);
      let getName = categoryData.name;
  
      let evolutionName = await fetchData(`https://pokeapi.co/api/v2/pokemon-species/${getName}/`);
      console.log(`Das ist die Evol-Chain-Nr.: ${evolutionName.evolution_chain.url}`); // Die nötige URL je nach Name
  
      let evolutionData = await fetchData(`${evolutionName.evolution_chain.url}`);
      console.log(evolutionName.evolves_from_species);
      console.log(evolutionData);
  
      evolutionChain = evolutionData;
      setCategoryTemplate(categoryData, id, categoryTitle);
  
    } catch (error) {
      document.getElementById(`category_content${id}`).innerHTML = "";
      console.error("Fehler beim Abrufen der Daten:", error);
      document.getElementById(`category_content${id}`).innerHTML += `No more data available. Please try a different related pokémon name.`;
    }
  }

async function setCategoryTemplate(categoryData, id, currentCategory){
  document.getElementById(`category_content${id}`).innerHTML = "";
  if(currentCategory == "about"){
   loadAboutData(categoryData, id);
  } else if (currentCategory == "stats"){
    loadStatsData(categoryData, id);
  }else if (currentCategory == "evolution"){
    loadEvolutionData(id);
  }
}

function loadAboutData(categoryData, id){
    document.getElementById(`category_content${id}`).innerHTML += aboutCategoryTemplate(id, categoryData);
    for (let i = 0; i < categoryData.abilities.length; i++) {
      let ability = categoryData.abilities[i].ability.name;
      document.getElementById(`abilities${id}`).innerHTML += `°${ability}<br>`;
    }
}

function loadStatsData(categoryData, id){
  for (let i = 0; i < categoryData.stats.length; i++) {
    let statName = categoryData.stats[i].stat.name;
    let statValue = categoryData.stats[i].base_stat;
    document.getElementById(`category_content${id}`).innerHTML += `<div class="single_category">
      <p class="stat_name">${capitalizeFirstLetter(statName)}:</p>
      <p id="${id}_${statName}" class="stat_values">${statValue}</p>
    </div>`;
  }
}

async function loadEvolutionData(id){
  let evolutionChainId = evolutionChain.id;
  let currentChain = evolutionChain.chain.species.name;
  let nextEvolutionChain = evolutionChain.chain.evolves_to[0]?.species?.name;
  let furtherEvolutionChain = evolutionChain.chain.evolves_to[0]?.evolves_to[0]?.species?.name;

  // Array mit allen vorkommenden Namen der Chain
  let chainNames = [currentChain];
  if (nextEvolutionChain) chainNames.push(nextEvolutionChain);
  if (furtherEvolutionChain) chainNames.push(furtherEvolutionChain);

  // IDs aus Namen ziehen
  let chainIds = chainNames.map(name => nameToId[name]).filter(id => id !== undefined);

  // Bilder rendern
  let container = document.getElementById(`category_content${id}`);
  container.innerHTML = ""; // Leeren oder optional ergänzen
  chainIds.forEach(evoId => {
    container.innerHTML += `
      <img class="evolution_img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evoId}.png">
    `;
  });

  // Optional: Speichern, falls du das später brauchst
  evolutionChainNames = [{
    evolutionChainId,
    currentChain,
    nextEvolutionChain,
    furtherEvolutionChain
  }];
}


async function searchPokemon() {
  let input = document.getElementById('search').value.toLowerCase();
  let searchSuggestion = document.getElementById('search_suggestion');
  searchSuggestion.innerHTML = "";
  if (input.length < 3) {
    searchSuggestion.classList.add('d_none');
    return;
  }
  const allDataUrl = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";
  const response = await fetch(allDataUrl);
  const data = await response.json();
  const filteredResults = data.results.filter(pokemon => pokemon.name.startsWith(input));
  if (filteredResults.length > 0) {
    searchSuggestion.classList.remove('d_none');
    filteredResults.forEach(pokemon => {
      searchSuggestion.innerHTML += `<span class="suggested_pokename" onclick="getSuggestedPokemonByUrl('${pokemon.url}')">${pokemon.name}</span>`;
    });
  } else {
    searchSuggestion.classList.remove('d_none');
    searchSuggestion.innerHTML = `Pokémon nicht gefunden!`;
  }
}

async function getSuggestedPokemonByUrl(url) {
  const response = await fetch(url);
  const pokemon = await response.json();
  document.getElementById('search').value = "";
  document.getElementById('search_suggestion').classList.add('d_none');
  if (pokemon && pokemon.id) {
    openDialogOverlay(pokemon.id);
  } else {
    document.getElementById('search_suggestion').innerHTML = `Pokémon nicht gefunden!`;
  }
}

function capitalizeFirstLetter(word){
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}