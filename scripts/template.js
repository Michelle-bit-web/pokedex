//gif-url https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/
//png-shiny-url https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/
//png https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/ruby-sapphire/
//https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/shiny/

function pokemonCardTemplate(data){
    return `
        <div id="pokemon_card${data.id}" class="pokemon_card" onclick="openDialogOverlay(${data.id})">
            <div class="pokemon_title">
                <p> ${data.name}</p>
                <p> #${data.id}</p>
            </div>
            <div id="bg_for_img$dData.id}" class="bg_for_img">
             <img class="pokemon_img" src="${imgUrl + (data.id)}.gif">
            </div>
            <div id="types${data.id}" class="div_types">
            </div>
        </div>
       `
}

function getDialogTemplate(id, pokemon){
    return `
    <div id="pokemon_dialog${id}" class="pokemon_card_dialog">
        <div class="dialog_top_content">
              <div>
                  <p>#${id}</p>
                  <p>${pokemon.species.name}</p>
            
              </div>
              <button onclick="closeDialog()" class="close_btn">Close</button>
        </div>
        <div id="bg_for_img_dialog${id}" class="bg_for_img_dialog">
            <img class="pokemon_img_dialog" src="${imgUrl + (id)}.gif">
        </div>
        <div id="types_overlay${id}"></div>
        <div class="categories_dialog">
            <div class="category_titles_dialog">
            <h3 class="onclick" onclick="switchCategory(event,${id},'cat1')">About</h3>
            <h3 onclick="switchCategory(event,${id},'cat2')">Stats</h3>
            <h3 onclick="switchCategory(event,${id},'cat3')">Evolution</h3>
            <h3 onclick="switchCategory(event,${id},'cat4')">Effectiveness</h3>
            </div>
            <div id="category_content${id}"></div>
        </div>
        
        <div>
            <button onclick="navigateDialog(${id}, -1)">left</button>
            <button onclick="navigateDialog(${id}, 1)">right</button>
        </div>
    </div>
  `
}

function categoryTemplateAbout(id, category, response){
    return `
    <p>species:</p><p>${response.species.name}</p>
    <p>height:</p><p>${response.height} cm</p>
    <p>weight:</p><p>${response.weight} kg</p>
    <p>abilities:</p><p id="abilities${id}"></p>
    `
}

function categoryTemplateSats(id, category, response){
    return `
    <p>HP:</p><p>${response.species.name}</p>
    <p>Attack:</p><p>${response.height} cm</p>
    <p>Defense:</p><p>${response.weight} kg</p>
    <p>Sp. Att.:</p><p id="abilities${id}"></p>
    <p>Sp. Def.:</p><p id="abilities${id}"></p>
    <p>Speed:</p><p id="abilities${id}"></p>
    <p>Total:</p><p id="abilities${id}"></p>
    `
}

function categoryTemplateEvolution(id, category, response){
    return `
    <p>species:</p><p>${response.species.name}</p>
    <p>height:</p><p>${response.height} cm</p>
    <p>weight:</p><p>${response.weight} kg</p>
    <p>abilities:</p><p id="abilities${id}"></p>
    `
}

function categoryTemplateEffectiveness(id, category, response){
    return `
    <p>species:</p><p>${response.species.name}</p>
    <p>height:</p><p>${response.height} cm</p>
    <p>weight:</p><p>${response.weight} kg</p>
    <p>abilities:</p><p id="abilities${id}"></p>
    `
}