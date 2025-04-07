function init(){
    fetchPokemonData();
}

async function fetchPokemonData(){
const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=40&offset=0");
let responseToJson = await response.json();
console.log(response);
console.log(responseToJson); //über limit Anzahl änderbar und mit offset Startpunkt der Anzahl
renderRequest(responseToJson);
}

function renderRequest(array){
    let contentContainer = document.getElementById('content');
    let allPokemon = array.results;
    console.log(allPokemon)
    contentContainer.innerHTML = "";

    allPokemon.forEach(singlePokemon =>{
        contentContainer.innerHTML += `
        <div id="pokemon_card" class="pokemon_card">
          <p> ${singlePokemon.name}</p>
        </div>
       `} )
}