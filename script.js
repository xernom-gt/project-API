const searchInput = document.getElementById("search-pokemon")
const searchResult = document.getElementById("search-result")
const pokemonDetail = document.getElementById("pokemon-details")
const nameEl = document.getElementById("pokemon-name")
const imgEl = document.getElementById("pokemon-img")
const typeEl = document.getElementById("pokemon-type")
const hightEl = document.getElementById("pokemon-tinggi")
const weightEl = document.getElementById("pokemon-berat")
const abilityEl = document.getElementById("pokemon-ability")
const evoEl = document.getElementById("pokemon-evolution")

let allpokemon = [];

fetch('https://pokeapi.co/api/v2/pokemon?limit=1300')
    .then(res => res.json())
    .then (data => {
        allpokemon = data.results;
    });

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim()
    if (!query) {
        searchResult.innerHTML = '',
        pokemonDetail.style.display = 'none';
        return;
    }
    const matches = allpokemon.filter(p => p.name.includes(query)).slice(0,10);
    displayResults(matches);
})

function displayResults(matches) {
    searchResult.innerHTML = '';
    matches.forEach(p => {
        const div = document.createElement('div');
        div.className = 'pokemon-item'
        div.textContent = p.name;
        div.onclick = () => loadPokemonDetails(p.name);
        searchResult.appendChild(div)
    })
}

async function loadPokemonDetails(name){
    pokemonDetail.style.display = 'none';
    searchResult.innerHTML = '';
    searchInput.value = name;

    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        const data = await res.json();
        
        nameEl.textContent = data.name.toUpperCase();
        imgEl.src = data.sprites.front_default || '';
        typeEl.textContent = data.types.map(t => t.type.name).join(', ');
        hightEl.textContent = data.height / 10 + ' m';
        weightEl.textContent = data.weight / 10 + ' kg';
        abilityEl.textContent = data.abilities.map(a => a.ability.name).join(', ');

        const speciesRes = await fetch(data.species.url);
        const speciesData = await speciesRes.json();
        const evoRes = await fetch (speciesData.evolution_chain.url);
        const evoData = await evoRes.json();

        evoEl.innerHTML = '';
        await showEvolutionChain(evoData.chain);

        pokemonDetail.style.display = 'block';
        } catch (error) {
            alert('gagal mengambil data pokemon');
    }
}

async function showEvolutionChain(chain) {
    let current = chain;
    while (current){
        const name = current.species.name;
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await res.json();

        const  wrapper = document.createElement('div');
        wrapper.style.display = 'inline-block';
        wrapper.style.textAlign = 'center'
        wrapper.style.marginRight = '10px'

        const img = document.createElement('img');
        img.src = data.sprites.front_default;
        img.title = name;

        const label = document.createElement('div');
        label.textContent = name.charAt(0).toUpperCase() + name.slice(1);
        label.style.fontSize = '14px';
        label.style.marginTop = '5px';

        wrapper.appendChild(img);
        wrapper.appendChild(label);
        evoEl.appendChild(wrapper);
        current = current.evolves_to.length > 0 ? current.evolves_to[0] : null;
    }
}