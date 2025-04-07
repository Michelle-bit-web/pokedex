function init(){
    fetchPokemonData();
}

async function fetchPokemonData(){
let response = await fetch("https://pokeapi.co/api/v2/");
let responseToJson = await response.json();
console.log(responseToJson);
}