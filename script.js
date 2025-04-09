let limit = 3;
let offset = 1;
let openDialog = false;
let saveIndex;
let pokemonData = [];
let pokemonTypesData = [];
let pokemonNames = [];
let imgUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/";

//hier URL für name, types,png https://pokeapi.co/api/v2/pokemon-form/1/
//Eine allgemeine URL bauen: "https://pokeapi.co/api/v2/${feature}/${i}/" wo feature und id austauschbar sind

function init() {
  getFetchResponse();
}

async function getFetchResponse(){
  showLoadingSpinner();
  for (let i = offset; i <= limit; i++) {
    let generalUrl = `https://pokeapi.co/api/v2/pokemon/${i}/`;
    const response = await fetchData(generalUrl);
    renderPokemonData(response);
  }
  removeLoadingSpinner();
}

function showLoadingSpinner(){
  document.getElementById('loading_spinner').classList.remove('d_none');
}

function removeLoadingSpinner(){
  document.getElementById('loading_spinner').classList.add('d_none');
}

async function fetchData(url) {
  const response = await fetch(`${url}`);
  let responseToJson = await response.json();
  pokemonNames.push(responseToJson.name);
  return responseToJson;
}

// function renderPokemonData(responseData){
//   pokemonData[responseData.id] = responseData;
//   let contentContainer = document.getElementById("content");
//   contentContainer.innerHTML += pokemonCardTemplate(responseData);
//   renderPokemonTypes(responseData);
// }

// function renderPokemonTypes(pokemon){
//   let typeColors = [];
//   for (let t = 0; t < pokemon.types.length; t++) {
//     pokemonTypesData = pokemon.types;
//     let type = pokemon.types[t].type.name;
//        document.getElementById(`types${pokemon.id}`).innerHTML+=`<p>${type}</p>`;
//       //  document.getElementById(`types_overlay${pokemon.id}`).innerHTML+=`<p>${type}</p>`;
//        if(colors[type]){
//         typeColors.push(colors[type]);
//       }
//   }
//   fitColorToType(typeColors, `bg_for_img${pokemon.id}`, `pokemon_card${pokemon.id}`);
// }

// function fitColorToType(typeColors, imageBgId, cardId){
//   let imageBg = document.getElementById(imageBgId);
//   let card = document.getElementById(cardId);
//   if (!imageBg || !card || !typeColors.length) return;
//   if (typeColors.length === 1) {
//     imageBg.style.background = typeColors[0];
//     card.style.border = `3px solid ${typeColors[0]}`;
//   } else {
//     const gradient = `linear-gradient(135deg, ${typeColors[0]}, ${typeColors[1]})`;
//     imageBg.style.background = gradient;
//     card.style.border = `3px solid ${typeColors[0]}`;
//     card.style.backgroundClip = "padding-box";
//   }
// }

// function loadMoreData() {
//   document.getElementById("load_data_btn").disabled = true;
//   if (limit <= 350) {
//     console.log("is loading");
//     limit += 40;
//     offset += 40;
//     getFetchResponse();
//   } 
//     document.getElementById("load_data_btn").disabled = false;
// }

// function openDialogOverlay(id) {
//   let dialog = document.getElementById("dialog_overlay");
//   dialog.classList.remove("d_none");
//   openDialog = true;
//   renderDialogOverlay(id)
// }

// function renderDialogOverlay(id){
//   let dialog = document.getElementById("dialog_overlay");
//   let pokemon = pokemonData[id];
//   dialog.innerHTML = getDialogTemplate(id, pokemon);
//   // unableScrolling();
//   let typeColors = [];
//   for (let t = 0; t < pokemon.types.length; t++) {
//     let type = pokemon.types[t].type.name;
//     if (colors[type]) {
//       typeColors.push(colors[type]);
//     }
//   }
//   fitColorToType(typeColors, `bg_for_img_dialog${id}`, `pokemon_dialog${id}`);
//   saveIndex = id;
// }
// // function unableScrolling() {
// //   document.body.style.overflow = "hidden";
// //   document.documentElement.style.overflow = "hidden"; 
// // }

// // function enableScrolling() {
// //   document.body.style.overflow = "";
// //   document.documentElement.style.overflow = "";
// // }

// function closeDialog() {
//   let dialog = document.getElementById("dialog_overlay");
//   dialog.classList.add("d_none");
//   openDialog = false;
//   enableScrolling();
// }

// function navigateDialog(currentIndex, direction) {
//     let newIndex = currentIndex + direction;
//     if (newIndex >= pokemonData.length) {
//       newIndex = 0;
//     }
//     if (newIndex < 0) {
//       newIndex = pokemonData.length - 1;
//     }
//     saveIndex = newIndex;
//     openDialogOverlay(newIndex);
//   }

//   function switchCategory(event, id, category){
//     let categoryTitles = document.querySelectorAll(".category_titles_dialog h3");
//     categoryTitles.forEach(h3 => {
//       h3.classList.remove('onclick');})
//     event.target.classList.add('onclick');
//     getCategoryContent(id, category);
//   }

// async function getCategoryContent(id, category){
//   response = await fetchData(`https://pokeapi.co/api/v2/pokemon/${id}/`);
 

//   if(category == "cat1"){
//     document.getElementById(`category_content${id}`).innerHTML = "";
//     document.getElementById(`category_content${id}`).innerHTML += categoryTemplateAbout(id, category, response);
//     for (let i = 0; i < response.abilities.length; i++) {
//       let ability = response.abilities[i].ability.name;
//       document.getElementById(`abilities${id}`).innerHTML += `<p>${ability}</p>`;
//     }
//   } else if (category == "cat2"){
//     document.getElementById(`category_content${id}`).innerHTML = "";
//     for (let i = 0; i < response.stats.length; i++) {
      
//       let statName = response.stats[i].stat.name;
//       let statValue = response.stats[i].base_stat;

//       console.log(statName);

//       document.getElementById(`category_content${id}`).innerHTML += `<p>${statName}: ${statValue}</p>`;
//     }
    
//   }else if (category == "cat3"){
//     document.getElementById(`category_content${id}`).innerHTML = "";
//     document.getElementById(`category_content${id}`).innerHTML += categoryTemplateEvolution(id, category, response);
//   } else if(category == "cat4"){
//     document.getElementById(`category_content${id}`).innerHTML = "";

//     const response = await fetch(`${url}`);
//     let responseToJson = await response.json();
//     //am Ende rausschmeißen
//     console.log(responseToJson);
//     pokemonNames.push(responseToJson.name);
//     return responseToJson;
//     document.getElementById(`category_content${id}`).innerHTML += categoryTemplateEffectiveness(id, category, response);
//   }

// }

//   async function searchPokemon(){
//     let inputLowerCase = document.getElementById('search').value.toLocaleLowerCase();
//     if(inputLowerCase.length < 3){
//         document.getElementById('search_suggestion').innerHTML = "";
//         return;
//     }
//     else{
//       const allDataUrl = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";
//       let baseData = await fetchData(allDataUrl);
//       console.log(baseData) //Ein Array, das Arrays enthält in 100er Schritten

//       for (let i = 0; i < baseData.length; i++) {
//       const element = baseData[i];
//       for (let j = 0; j < element.length; j++) {
//        console.log(element[0])
//         // console.log((element[j].filter(value => value.name == `${inputLowerCase}`)))
//       }
//      }
//     }
//     // let arrayComparison = baseData.name.map(value => value.includes(`${inputLowerCase}`));
    // console.log(arrayComparison)
    // if(inputLowerCase.length < 3){
    //   document.getElementById('search_suggestion').innerHTML = "";
    //   return;
    // } else if(arrayComparison.includes(`${inputLowerCase}`)){
    //   document.getElementById('search_suggestion').innerHTML += `${inputLowerCase}`;
    // }
  }
