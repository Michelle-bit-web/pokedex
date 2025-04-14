let limit = 40;
let offset = 1;
let openDialog = false;
let isLoadingDialog = false;
let category = "about";
let saveId;
let currentPokemonIds = [];
let idToName = {};
let nameToId = {};
let pokemonData = [];
let pokemonNames = [];
let evolutionChain = [];
let evolutionChainNames = [];
const baseUrl = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";
const imgUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/";

function init() {
  getFetchResponse();
}

async function showLoadingSpinner() {
  document.getElementById("loading_spinner").classList.remove("d_none");
}

function removeLoadingSpinner() {
  document.getElementById("loading_spinner").classList.add("d_none");
}

async function getFetchResponse() {
  showLoadingSpinner();
  const promises = [];
  for (let i = offset; i <= limit; i++) {
    let generalUrl = `https://pokeapi.co/api/v2/pokemon/${i}/`;
    promises.push(fetchData(generalUrl));
  }
  catchError(promises);
  removeLoadingSpinner();
}

async function catchError(promises) {
  try {
    const results = await Promise.all(promises);
    results.forEach((responseData) => {
      if (responseData) {
        currentPokemonIds.push(responseData.id);
        renderPokemonData(responseData);
      }
    });
  } catch (error) {
    console.error("Fehler beim parallelen Abrufen:", error);
  }
}

async function fetchData(url) {
  try {
    const response = await fetch(`${url}`);
    let responseToJson = await response.json();
    pokemonNames.push(responseToJson.name);
    return responseToJson;
  } catch (error) {
    document.getElementById(`category_content${id}`).innerHTML = "";
    console.error("Fehler beim Abrufen der Daten:", error);
    document.getElementById(
      `category_content${id}`
    ).innerHTML += `No more data available. Please try a different related pokémon name.`;
  }
}

function renderPokemonData(responseData) {
  pokemonData[responseData.id] = responseData;
  let contentContainer = document.getElementById("content");
  contentContainer.innerHTML += pokemonCardTemplate(responseData);
  renderPokemonTypes(responseData, `types${responseData.id}`);
  idToName[responseData.id] = responseData.name;
  nameToId[responseData.name] = responseData.id;
}

function renderPokemonTypes(pokemon, target = `types${pokemon.id}`) {
  let typeColors = [];
  const typeElement = document.getElementById(target);

  pokemon.types.forEach((typeInfo) => {
    const type = typeInfo.type.name;
    const typeId = getTypeElementId(pokemon.id, type, target);
    typeElement.innerHTML += getTypeElementHTML(typeId, type);
    applyTypeStyle(typeId, type, typeColors);
  });

  applyTypeColors(target, typeColors, pokemon.id);
}

function getTypeElementId(id, type, target) {
  return `${id}_${type}_${target}`;
}

function getTypeElementHTML(id, type) {
  return `<p id="${id}" class="single_type_dialog">${type}</p>`;
}

function applyTypeStyle(id, type, typeColors) {
  if (colors[type]) {
    typeColors.push(colors[type]);
    setTypeBorder(id, type);
  }
}

function applyTypeColors(target, typeColors, id) {
  if (target.startsWith("types_in_dialog")) {
    fitColorToType(typeColors, `bg_for_img_dialog${id}`, `pokemon_dialog${id}`);
  } else {
    fitColorToType(typeColors, `bg_for_img${id}`, `pokemon_card${id}`);
  }
}

function fitColorToType(typeColors, imageBgId, cardId) {
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
  card.style.setProperty("--hoverColor", typeColors[0]);
}

function setTypeBorder(pTagId, typeName) {
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
  category = "about";
  renderDialogOverlay(id);
}

async function renderDialogOverlay(id, passedCategory) {
  if (isLoadingDialog) return;
  isLoadingDialog = true;
  saveId = id;
  const responseData = await fetchData(getGeneralUrl(id));
  updateDialogOverlay(id, responseData);
  await getCategoryContent(id, passedCategory);
  isLoadingDialog = false;
}

function getGeneralUrl(id) {
  return `https://pokeapi.co/api/v2/pokemon/${id}/`;
}

function updateDialogOverlay(id, responseData) {
  let dialog = document.getElementById("dialog_overlay");
  dialog.innerHTML = getDialogTemplate(id, responseData);
  renderPokemonTypes(responseData, `types_in_dialog${id}`);
  unableScrolling();
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

async function navigateDialog(currentId, direction) {
  if (isLoadingDialog) return;
  const getWrappedIndex = (index, length) => (index >= length ? 0 : index < 0 ? length - 1 : index);
  const currentIndex = currentPokemonIds.indexOf(currentId);
  const newIndex = getWrappedIndex(currentIndex + direction, currentPokemonIds.length);
  const newId = currentPokemonIds[newIndex];
  saveId = newId;
  await renderDialogOverlay(newId, category);
  await checkCategory(newId, category);
}

async function checkCategory(newId, category) {
  renderDialogOverlay(newId, category).then(() => {
    let categoryTitle = document.querySelectorAll(".category_titles_dialog h3");
    categoryTitle.forEach((title) => {
      if (title.textContent.toLowerCase() === category) {
        switchCategory({ target: title }, newId, category);
      }
    });
  });
}

function switchCategory(event, id, selectedCategory) {
  let categoryTitles = document.querySelectorAll(".category_titles_dialog h3");
  categoryTitles.forEach((title) => {
    title.classList.remove("onclick");
  });
  event.target.classList.add("onclick");
  category = selectedCategory;
  getCategoryContent(id, selectedCategory);
}

async function getCategoryContent(id, categoryTitle) {
  if (categoryTitle == null) categoryTitle = category;
  else category = categoryTitle;

  try {
    const categoryData = await fetchCategoryData(id);
    await processEvolutionData(categoryData);
    setCategoryTemplate(categoryData, id, categoryTitle);
  } catch (error) {
    showCategoryError(id, error);
  }
}

async function fetchCategoryData(id) {
  return await fetchData(`https://pokeapi.co/api/v2/pokemon/${id}/`);
}

async function processEvolutionData(categoryData) {
  const getName = categoryData.name;
  const evolutionName = await fetchData(`https://pokeapi.co/api/v2/pokemon-species/${getName}/`);
  const evolutionData = await fetchData(evolutionName.evolution_chain.url);
  evolutionChain = evolutionData;
}

function showCategoryError(id, error) {
  console.error("Fehler beim Abrufen der Daten:", error);
  const container = document.getElementById(`category_content${id}`);
  container.innerHTML = `No more data available. Please try a different related pokémon name.`;
}

async function setCategoryTemplate(categoryData, id, currentCategory) {
  document.getElementById(`category_content${id}`).innerHTML = "";
  if (currentCategory == "about") {
    loadAboutData(categoryData, id);
  } else if (currentCategory == "stats") {
    loadStatsData(categoryData, id);
  } else if (currentCategory == "evolution") {
    loadEvolutionData(id);
  }
}

function loadAboutData(categoryData, id) {
  document.getElementById(`category_content${id}`).innerHTML += aboutCategoryTemplate(id, categoryData);
  for (let i = 0; i < categoryData.abilities.length; i++) {
    let ability = categoryData.abilities[i].ability.name;
    document.getElementById(`abilities${id}`).innerHTML += `°${ability}<br>`;
  }
}

function loadStatsData(categoryData, id) {
  for (let i = 0; i < categoryData.stats.length; i++) {
    let statName = categoryData.stats[i].stat.name;
    let statValue = categoryData.stats[i].base_stat;
    document.getElementById(`category_content${id}`).innerHTML += `<div class="single_category">
      <p class="stat_name">${capitalizeFirstLetter(statName)}:</p>
      <p id="${id}_${statName}" class="stat_values">${statValue}</p>
    </div>`;
  }
}

async function loadEvolutionData(id) {
  const chainIds = getEvolutionIds(evolutionChain);
  renderEvolutionImages(chainIds, id);
}

function getEvolutionIds(chain) {
  const names = [chain.chain.species.name];
  const next = chain.chain.evolves_to[0]?.species?.name;
  const further = chain.chain.evolves_to[0]?.evolves_to[0]?.species?.name;
  if (next) names.push(next);
  if (further) names.push(further);
  return names.map((name) => nameToId[name]).filter((id) => id !== undefined);
}

function renderEvolutionImages(chainIds, id) {
  const container = document.getElementById(`category_content${id}`);
  container.innerHTML = "";
  chainIds.forEach((evoId) => {
    container.innerHTML += `<img class="evolution_img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evoId}.png">`;
  });
}

async function searchPokemon() {
  let input = document.getElementById("search").value.toLowerCase();
  let searchSuggestion = document.getElementById("search_suggestion");
  searchSuggestion.innerHTML = "";
  if (input.length < 3) {
    searchSuggestion.classList.add("d_none");
    return;
  }
  const filteredResults = await getFilteredPokemon(input);
  showSuggestions(filteredResults, searchSuggestion);
}

async function getFilteredPokemon(input) {
  const response = await fetch(baseUrl);
  const data = await response.json();
  return data.results.filter((pokemon) => pokemon.name.startsWith(input));
}

function showSuggestions(filteredResults, searchSuggestion) {
  if (filteredResults.length > 0) {
    searchSuggestion.classList.remove("d_none");
    filteredResults.forEach((pokemon) => {
      searchSuggestion.innerHTML += `<span class="suggested_pokename" onclick="getSuggestedPokemonByUrl('${pokemon.url}')">${pokemon.name}</span>`;
    });
  } else {
    searchSuggestion.classList.remove("d_none");
    searchSuggestion.innerHTML = `Pokémon nicht gefunden!`;
  }
}

async function getSuggestedPokemonByUrl(url) {
  const response = await fetch(url);
  const pokemon = await response.json();
  document.getElementById("search").value = "";
  document.getElementById("search_suggestion").classList.add("d_none");
  if (pokemon && pokemon.id) {
    openDialogOverlay(pokemon.id);
  } else {
    document.getElementById("search_suggestion").innerHTML = `Pokémon nicht gefunden!`;
  }
}

function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
