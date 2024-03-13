let pageStart = 1;
let pageEnd = 50;
let pageOrder = 1;
const pageNumber = document.querySelector(".pageorder");
const row = document.querySelector(".row");
const search = document.querySelector("input");
const scroll = document.querySelector(".scroll");
const resultBox = document.querySelector(".result");
const loading = document.querySelector(".loading");
const boxPopup = document.querySelector(".popup");
const btn = document.querySelectorAll("#button");
window.addEventListener("scroll", () => {
  if (window.scrollY > 1000) {
    scroll.classList.add("active");
  } else {
    scroll.classList.remove("active");
  }
});

scroll.addEventListener("click", () => scrollTo(0, 0));

function getAllPokemon() {
  let promise = [];
  loading.style.display = "block";
  for (let i = pageStart; i < pageEnd; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    promise.push(fetch(url).then((res) => res.json()));
  }
  Promise.all(promise).then((res) => {
    const pokemon = res.map((data) => ({
      id: data.id,
      name: data.name,
      image: data.sprites.other.dream_world["front_default"],
      types: data.types[0].type["name"],
      moreTypes: data.types,
      weight: data.weight,
      height: data.height,
      hp: data.stats[0].base_stat,
      attack: data.stats[1].base_stat,
      defense: data.stats[2].base_stat,
    }));
    loading.style.display = "none";
    return showAllPokemon(pokemon);
  });
}

function pagination(flow) {
  if (flow == "next") {
    pageStart += 49;
    pageEnd += 50;
    getAllPokemon();
    pageOrder += 1;
    pageNumber.textContent = pageOrder;
  } else if (flow == "prev") {
    if (pageStart != 1) {
      pageStart -= 49;
      pageEnd -= 50;
      getAllPokemon();
      pageOrder -= 1;
      pageNumber.textContent = pageOrder;
    } else {
      alert("Sorry");
    }
  }
}

function showAllPokemon(pokemon) {
  const list = pokemon.map((poke) => cardPokemon(poke, "all")).join("");
  row.innerHTML = list;
  const card = row.children;
}
getAllPokemon();

function searchPokemon() {
  const pagination = document.querySelector(".pagination");
  row.innerHTML = ``;
  if (search.value == "") {
    resultBox.classList.add("active");
    resultBox.classList.add("danger");
    resultBox.textContent = "Please Fill The Blank";
    pagination.style.display = "none";
  } else {
    if (resultBox.classList.contains("danger")) {
      resultBox.classList.remove("danger");
      resultBox.textContent = `Search result from ${search.value}`;
      loading.style.display = "block";
    }
    loading.style.display = "block";
    fetch(`https://pokeapi.co/api/v2/pokemon/${search.value.toLowerCase()}`)
      .catch()
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something Error");
        }
        return response.json();
      })
      .then((response) => {
        row.innerHTML = cardPokemon(response, "individual");
        if (resultBox.classList.contains("danger")) {
          resultBox.classList.remove("danger");
          resultBox.innerHTML = `<h3 class="h3">Search Result from <span class="search-result">${search.value}</span></h3>`;
        } else {
          resultBox.classList.add("active");
          resultBox.classList.add("success");
          // result.textContent = "";
          resultBox.innerHTML = `<h3 class="h3">Search Result from <span class="search-result">${search.value}</span></h3>`;
          pagination.style.display = "none";
          loading.style.display = "none";
        }
      })
      .catch((error) => {
        if (resultBox.classList.contains("success")) {
          resultBox.classList.add("active");
          resultBox.classList.remove("success");
          resultBox.classList.add("danger");
          resultBox.innerHTML = `<h3 class="h3">${error}</h3>`;

          loading.style.display = "none";
        } else {
          resultBox.classList.add("active");
          resultBox.classList.add("danger");
          resultBox.innerHTML = `<h3 class="h3">${error}</h3>`;
          loading.style.display = "none";
        }
      });
  }
}

search.addEventListener("keypress", (event) => {
  if (event.key == "Enter") {
    event.preventDefault();
    searchPokemon();
  }
});

function pokemonType(type) {
  let classType;
  switch (type) {
    case "fire":
      classType = "fire";
      break;
    case "grass":
      classType = "grass";
      break;
    case "poison":
      classType = "poison";
      break;
    case "ground":
      classType = "ground";
      break;
    case "electric":
      classType = "electric";
      break;
    case "water":
      classType = "water";
      break;
    case "bug":
      classType = "bug";
      break;
    case "fairy":
      classType = "fairy";
      break;
    case "rock":
      classType = "rock";
      break;
    case "ghost":
      classType = "ghost";
      break;
    case "psychic":
      classType = "psychic";
      break;

    default:
      classType = "normal";
      break;
  }

  return classType;
}

function cardPokemon(pokemon, get) {
  let image;
  let type;
  let tagPokemon;
  let defaultImage = "assets/pokeball.png";
  if (get == "all") {
    image = pokemon.image;
    type = pokemon.types;
    tagPokemon = pokemon.moreTypes;
    height = pokemon.height;
    weight = pokemon.weight;
    hp = pokemon.hp;
    attack = pokemon.attack;
    defense = pokemon.defense;
  } else {
    image = pokemon.sprites.other.dream_world["front_default"];
    type = pokemon.types[0].type["name"];
    tagPokemon = pokemon.types;
    weight = pokemon.weight;
    height = pokemon.height;
    hp = pokemon.stats[0].base_stat;
    attack = pokemon.stats[1].base_stat;
    defense = pokemon.stats[2].base_stat;
  }
  let classType = pokemonType(type);
  return `
  <div class="card ${classType}">
          <div class="id">#${pokemon.id}</div>
          <div class="image">
            <img src="${
              image ? image : defaultImage
            }" alt="" class="pokeimg" id="tes"/>
          </div>
          <div class="aksi">
            <h4>${pokemon.name}</h4>
            <button onclick="getDetail(${
              pokemon.id
            })" id="button">Detail</button>
          </div>
        </div>
  `;
}

const getDetail = (id) => {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .catch()
    .then((response) => {
      if (!response.ok) {
        throw new Error("Something Error");
      }
      return response.json();
    })
    .then((response) => {
      showPopUp(response);
      console.log(response);
    });
  boxPopup.classList.add("show");
};

const showPopUp = (detail) => {
  const mainAbility = detail.types[0].type.name;
  const type = pokemonType(mainAbility);
  boxPopup.innerHTML = `
  <div class= "card-popup ${type}">
  <img src=${detail.sprites.other.dream_world["front_default"]}> 
  <div class="data">
    <table>
        <tr>
          <th><span>Name</span></th>
          <td>${detail.name}</td>
        </tr>
        <tr>
          <th><span>Main Ability</span></th>
          <td>${mainAbility}</td>
        </tr>
        <tr>
          <th><span>Height/Weight</span></th>
          <td>${detail.height}/${detail.weight}</td>
        </tr>
        <tr>
          <th><span>HP</span></th>
          <td>${detail.stats[0].base_stat}</td>
        </tr>
        <tr>
          <th><span>Attack Power</span></th>
          <td>${detail.stats[1].base_stat}</td>
        </tr>
        <tr>
          <th><span>Defense</span></th>
          <td>${detail.stats[2].base_stat}</td>
        </tr>
    </table>
  </div>
  </div> 
  `;
};

boxPopup.addEventListener("click", (ev) => {
  boxPopup.classList.remove("show");
});

const footer = document.querySelector("footer");
footer.innerHTML = `<h4>&copy; ${new Date().getFullYear()} mrakasondara </h4>`;
