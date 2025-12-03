document.getElementById("buscar").addEventListener("click", () => {
  const nombrePokemon = document.getElementById("pokemonInput").value.trim();
  buscarPokemon(nombrePokemon);
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
