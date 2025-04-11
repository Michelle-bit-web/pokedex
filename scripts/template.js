function pokemonCardTemplate(data){
    return `
        <div id="pokemon_card${data.id}" class="pokemon_card" onclick="openDialogOverlay(${data.id})">
            <div class="pokemon_title">
                <p> ${data.name}</p>
                <p> #${data.id}</p>
            </div>
            <div id="bg_for_img${data.id}" class="bg_for_img">
             <img class="pokemon_img" src="${imgUrl + (data.id)}.gif">
            </div>
            <div id="types${data.id}" class="div_types">
            </div>
        </div>
       `
}

function getDialogTemplate(id, pokemon){
    return `
    <div id="pokemon_dialog${id}" class="pokemon_card_dialog" onclick="event.stopPropagation()">
        <div class="dialog_top_content">
                  <p class="dialog_id">#${id}</p>
                  <p class="dialog_name">${pokemon.species.name}</p>
              <button onclick="closeDialog()" class="close_btn">Close</button>
        </div>
        <div id="bg_for_img_dialog${id}" class="bg_for_img_dialog">
            <div id="types_in_dialog${id}" class="types_in_dialog"></div>
            <img class="pokemon_img_dialog" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png">
        </div>
        <div id="types_overlay${id}" class="div_types"></div>
        <div class="categories_dialog">
            <div class="category_titles_dialog">
            <h3 class="onclick" onclick="switchCategory(event,${id},'about')">About</h3>
            <h3 onclick="switchCategory(event,${id},'stats')">Stats</h3>
            <h3 onclick="switchCategory(event,${id},'evolution')">Evolution</h3>
            </div>
            <div id="category_content${id}" class="content_categories"></div>
        </div>
        <div class="div_navigation_btn">
            <button onclick="navigateDialog(${id}, -1)" class="navigation_btn">back</button>
            <button onclick="navigateDialog(${id}, 1)" class="navigation_btn">next</button>
        </div>
    </div>
  `
}

function aboutCategoryTemplate(id, response){
    return `
    <p>Species: ${response.species.name}</p>
    <p>Height: ${response.height} cm</p>
    <p>Weight:${response.weight} kg</p>
    <p>Abilities:<p id="abilities${id}"></p></p>
    `
}