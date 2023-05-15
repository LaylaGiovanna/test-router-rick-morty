const locationSelect = document.getElementById("location-select");
const charactersContainer = document.querySelector(".characters-container");
const title = document.querySelector("h1");

let locations = [];

// function to fetch all locations
async function fetchLocations() {

    let nextPage = 1;
    while (nextPage !== null) {
        const response = await fetch(`https://rickandmortyapi.com/api/location?page=${nextPage}`);
        const data = await response.json();
        locations = locations.concat(data.results);
        nextPage = data.info.next ? new URL(data.info.next).searchParams.get("page") : null;
    }
    return locations;
}

// function to fetch characters by location id
async function fetchCharactersByLocationId(locationId) {
    const response = await fetch(`https://rickandmortyapi.com/api/location/${locationId}`);
    const data = await response.json();
    const characterIds = data.residents.map((url) => url.split("/").pop());
    const characters = await Promise.all(
        characterIds.map(async (id) => {
            const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
            const data = await response.json();
            return data;
        })
    );
    return characters;
}

// function to create character card
function createCharacterCard(character) {
    const card = document.createElement("div");
    card.classList.add("character-card");

    const image = document.createElement("img");
    image.src = character.image;
    image.alt = `${character.name} image`;
    card.appendChild(image);

    const name = document.createElement("h2");
    name.textContent = character.name;
    card.appendChild(name);

    const status = document.createElement("p");
    status.classList.add("status");
    status.textContent = `Status: ${character.status}`;
    if (character.status === "Alive") {
        status.style.color = "#36a845"; // set color to green for "Alive"
    } else if (character.status === "Dead") {
        status.style.color = "red"; // set color to red for "Dead"
    }
    card.appendChild(status);

    const location = document.createElement("p");
    location.textContent = `Location: ${character.location.name}`;
    card.appendChild(location);

    return card;
}

// function to render characters
function renderCharacters(characters) {
    charactersContainer.innerHTML = "";
    characters.forEach((character) => {
        const card = createCharacterCard(character);
        charactersContainer.appendChild(card);
    });
}

// initialize filter and render first location characters
fetchLocations().then((locations) => {
    const locationOptions = locations.map((location) => {
        const option = document.createElement("option");
        option.value = location.id;
        option.textContent = location.name;
        return option;
    });

    locationSelect.append(...locationOptions);

    const firstLocationId = locations[0].id;
    fetchCharactersByLocationId(firstLocationId).then((characters) => {
        renderCharacters(characters);
        title.textContent = `Location - ${locations.find(loc => loc.id == firstLocationId).name}`;
    });
});

// event listener for location select change
locationSelect.addEventListener("change", (event) => {
    const locationId = event.target.value;
    fetchCharactersByLocationId(locationId).then((characters) => {
        renderCharacters(characters);
        title.textContent = `Location - ${locations.find(loc => loc.id == locationId).name}`;
    });
});


// export const loadLocation = () =>{
//     fetchLocations(),
//     fetchCharactersByLocationId(),
//     createCharacterCard(),
//     renderCharacters()
// }