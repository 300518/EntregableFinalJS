document.getElementById("buscar").addEventListener("click", () => {
  const nombrePokemon = document.getElementById("pokemonInput").value.trim();
  buscarPokemon(nombrePokemon);
  const tipos = obtenerPokemonPorTipo('fire');
  console.log(tipos);
});

cargarTiposPokemon(); // función declara más abajo

document.getElementById("buscarTipoPokemon").addEventListener("click", async () => {
  const tipo = document.getElementById("comboTipo").value;
  const resultadoDivTipo = document.getElementById("resultadoTipoPokemon");

  if (!tipo) {
    resultadoDivTipo.innerHTML = "<p>Se debe seleccionar un tipo.</p>";
    return;
  }

  const lista = await obtenerPokemonPorTipo(tipo);

  resultadoDivTipo.innerHTML = `
    <h3>Pokemon de tipo ${tipo.toUpperCase()}</h3>
    <ul>
      ${lista.map(nombre => `<li>${nombre}</li>`).join("")}
    </ul>
  `;
});

async function buscarPokemon(nombrePokemon) {

  const resultadoDiv = document.getElementById("resultado");

  if (!nombrePokemon) {
    resultadoDiv.innerHTML = "<p>Ingresa un nombre válido.</p>";
    return;
  }

  try {
    const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon.toLowerCase()}`);

    if (!respuesta.ok) {
      resultadoDiv.innerHTML = "<p>Pokémon no encontrado 😢</p>";
      return;
    }

    const data = await respuesta.json();

    resultadoDiv.innerHTML = `
      <h2>${data.name.toUpperCase()}</h2>
      <img src="${data.sprites.front_default}" alt="${data.name}">
      <img src="${data.sprites.front_shiny}" alt="${data.name}">
      <p><strong>Peso:</strong> ${data.weight}</p>
      <p><strong>Altura:</strong> ${data.height}</p>
      <p><strong>Tipo(s):</strong> ${data.types.map(t => t.type.name).join(", ")}</p>
    `;
  } catch (error) {
    resultadoDiv.innerHTML = "<p>Error al conectar con PokeAPI.</p>";
    console.error(error);
  }
}

async function obtenerPokemonPorTipo(tipo) {
  try {
    const respuesta = await fetch(`https://pokeapi.co/api/v2/type/${tipo.toLowerCase()}`);

    if (!respuesta.ok) {
      throw new Error("Tipo no encontrado");
    }

    const data = await respuesta.json();

    return data.pokemon.map(p => p.pokemon.name);

  } catch (error) {
    console.error("Error al obtener Pokémon por tipo:", error);
    return [];
  }
}

async function obtenerTiposPokemon() {
  try {
    const respuesta = await fetch("https://pokeapi.co/api/v2/type");

    if (!respuesta.ok) {
      throw new Error("No se pudo obtener la lista de tipos.");
    }

    const data = await respuesta.json();
    return data.results.map(tipo => tipo.name);

  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

async function cargarTiposPokemon() {
  try {
    const respuesta = await fetch("https://pokeapi.co/api/v2/type");
    const data = await respuesta.json();

    const select = document.getElementById("comboTipo");

    data.results.forEach(t => {
        if (t.name === "unknown" || t.name === "shadow") return;

      const opcion = document.createElement("option");
      opcion.value = t.name;
      opcion.textContent = t.name.toUpperCase();
      select.appendChild(opcion);
    });

  } catch (error) {
    console.error("Error al cargar tipos:", error);
  }
}
