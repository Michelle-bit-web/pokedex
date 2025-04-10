let limit = 8;
let offset = 1;
let openDialog = false;
let category = "about";
let saveId;
let currentPokemonIds = [];
let pokemonData = [];
let pokemonTypesData = [];
let pokemonTypesUrl = [];
let pokemonNames = [];
const baseUrl = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
// let urlById = `https://pokeapi.co/api/v2/pokemon/${i}/`
const imgUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/";

//hier URL für name, types,png https://pokeapi.co/api/v2/pokemon-form/1/
//Eine allgemeine URL bauen: "https://pokeapi.co/api/v2/${feature}/${i}/" wo feature und id austauschbar sind

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
  console.log(`Pokemon-Ids auf dieser Seite: ${currentPokemonIds}`);
}

async function fetchData(url) {
  const response = await fetch(`${url}`);
  let responseToJson = await response.json();
  pokemonNames.push(responseToJson.name);
  console.log(pokemonNames) //hier speicher ich die Namen in pokemonNames
  return responseToJson;
}

function showLoadingSpinner(){
  document.getElementById('loading_spinner').classList.remove('d_none');
  getFetchResponse();
}

function removeLoadingSpinner(){
  document.getElementById('loading_spinner').classList.add('d_none');
}

function renderPokemonData(responseData){
  pokemonData[responseData.id] = responseData; //hier speicher ich alle Daten eines Pokemon
  console.log(pokemonData[responseData.id])
  let contentContainer = document.getElementById("content");
  contentContainer.innerHTML += pokemonCardTemplate(responseData);
  renderPokemonTypes(responseData);
}

function renderPokemonTypes(pokemon){
  let typeColors = [];

  for (let t = 0; t < pokemon.types.length; t++) {
    let type = pokemon.types[t].type.name;
    let typeId = `${pokemon.id}_${type}`;

    document.getElementById(`types${pokemon.id}`).innerHTML += `<p id="${typeId}">${type}</p>`;
    pokemonTypesUrl.push(pokemon.name, pokemon.types[t].type.url);

    if (colors[type]) {
      typeColors.push(colors[type]);
      setTypeBorder(typeId, type); // ⬅ hier wird jedem <p> eine Farbe gegeben
    }
  }

  fitColorToType(typeColors, `bg_for_img${pokemon.id}`, `pokemon_card${pokemon.id}`);
}

function fitColorToType(typeColors, imageBgId, cardId){
  let imageBg = document.getElementById(imageBgId);
  let card = document.getElementById(cardId);
  if (!imageBg || !card || !typeColors.length) return;
  
  if (typeColors.length === 1) {
    imageBg.style.background = typeColors[0];
    card.style.border = `3px solid ${typeColors[0]}`;
    card.style.setProperty('--hoverColor', typeColors[0]);
  } else {
    const gradient = `linear-gradient(135deg, ${typeColors[0]}, ${typeColors[1]})`;
    imageBg.style.background = gradient;
    card.style.border = `3px solid ${typeColors[0]}`;
    card.style.backgroundClip = "padding-box";
    card.style.setProperty('--hoverColor', typeColors[0]);
  }
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

function loadMoreData() {
  document.getElementById("load_data_btn").disabled = true;
  if (limit <= 350) {
    console.log("is loading");
    limit += 40;
    offset += 40;
   showLoadingSpinner();
  } 
    document.getElementById("load_data_btn").disabled = false;
}

function openDialogOverlay(id) {
  let dialog = document.getElementById("dialog_overlay");
  dialog.classList.remove("d_none");
  openDialog = true;
  renderDialogOverlay(id)
}

async function renderDialogOverlay(id){
  let generalUrl = `https://pokeapi.co/api/v2/pokemon/${id}/`;
  const responseData = await fetchData(generalUrl);
  let dialog = document.getElementById("dialog_overlay");

  dialog.innerHTML = getDialogTemplate(id, responseData);
  unableScrolling();
  let typeColors = [];
  for (let t = 0; t < responseData.types.length; t++) {
    let type = responseData.types[t].type.name;
    if (colors[type]) {
      typeColors.push(colors[type]);
    }
  }
  fitColorToType(typeColors, `bg_for_img_dialog${id}`, `pokemon_dialog${id}`);
  saveId = id;
  getCategoryContent(id, null);
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
    renderDialogOverlay(newId);
  }

  function switchCategory(event, id, category){
    let categoryTitles = document.querySelectorAll(".category_titles_dialog h3");
    categoryTitles.forEach(h3 => {
      h3.classList.remove('onclick');});
    event.target.classList.add('onclick');
    getCategoryContent(id, category);
  }

async function getCategoryContent(id, categoryTitle){
  if(categoryTitle == null){
    category = "about";
  } else {
    category = categoryTitle;
  }
  let categoryData = await fetchData(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  setCategoryTemplate(categoryData, id);
}

async function setCategoryTemplate(categoryData, id){

  if(category == "about"){
    loadAboutData(categoryData, id);
  } else if (category == "stats"){
    loadStatsData(categoryData, id);

  }
  // else if (category == "cat3"){
  //   document.getElementById(`category_content${id}`).innerHTML = "";
  //   document.getElementById(`category_content${id}`).innerHTML += categoryTemplateEvolution(id, category, response);
  // } else if(category == "cat4"){
  //   loadEffectivenessData(id)
  // }

}

function loadAboutData(categoryData, id){
  document.getElementById(`category_content${id}`).innerHTML = "";
    document.getElementById(`category_content${id}`).innerHTML += aboutCategoryTemplate(id, categoryData);
    for (let i = 0; i < categoryData.abilities.length; i++) {
      let ability = categoryData.abilities[i].ability.name;
      document.getElementById(`abilities${id}`).innerHTML += `<li>${ability}</li>`;
    }
}

function loadStatsData(categoryData, id){
  document.getElementById(`category_content${id}`).innerHTML = "";
  for (let i = 0; i < categoryData.stats.length; i++) {
    let statName = categoryData.stats[i].stat.name;
    let statValue = categoryData.stats[i].base_stat;

    console.log(statName);
    document.getElementById(`category_content${id}`).innerHTML += `<div class="single_category"><p>${statName}: ${statValue} <div id="${id}_${statName}" class="stat_values"></div></p></div>`;
    generateBarChart(id, `${statName}`, statValue);
  }
}

console.log(pokemonTypesData) //leer
console.log(pokemonNames) //geladene Pokemonnamen

function generateBarChart(id, statName, statValue){
  let feature = document.getElementById(`${id}_${statName}`);
  if(statValue < 60){
    feature.style.backgroundColor = `#e62829`;
  }
  else if(100 > statValue > 60){
    feature.style.backgroundColor = `#63c24e`;
  }
  if(statValue > 100){
    feature.style.backgroundColor = `#1c7208
  }`;
  }
}

//Abgleich des Pokemon-Namens für die Suchleiste
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

// function loadEvolutionData(categoryData, id){
  
// }

// async function loadEffectivenessData(categoryData, id){
//   document.getElementById(`category_content${id}`).innerHTML = "";

//   for (let i = 1; i < pokemonTypesUrl.length; i+2) {
//     const url = pokemonTypesUrl[i];
//     const response =  await fetchData(`${url}`);
//     let damage = response.damage_relation
//   }
   
//     pokemonNames.push(responseToJson.name);
//     return responseToJson;
//     document.getElementById(`category_content${id}`).innerHTML += categoryTemplateEffectiveness(id, category, response);
// }
