class Pokemon {
    constructor(nombre, tipo) {
      this.nombre = nombre;
      this.tipo = tipo;            // puede ser string o array
    }
    informacion() {
      return `${this.nombre} (Tipo: ${this.tipo})`;
    }
  }

class Equipo {
    constructor() {
      this.pokemones = [];
      this.maxPokemones = 6;
    }
  
    agregarPokemon(pokemon) {
      if (this.pokemones.length >= this.maxPokemones) {        
        // agregar alerta
        return;
      }
  
      this.pokemones.push(pokemon);
    }
  
    quitarPokemon(nombre) {
      this.pokemones = this.pokemones.filter(p => p.nombre !== nombre);
    }
  
    listarEquipo() {
      return this.pokemones.map(p => p.informacion()).join("\n");
    }
}
  
class Entrenador {
    constructor(nombre, edad) {
      this.nombre = nombre;
      this.edad = edad;
      this.equipo = new Equipo();
    }
  
    capturar(pokemon) {
      this.equipo.agregarPokemon(pokemon);
    }
  
    mostrarEquipo() {
      console.log(`Equipo de ${this.nombre}:\n${this.equipo.listarEquipo()}`);
    }
}

//Funciones para generar equipo y entrenadores

function elegirSeisPokemon(lista) {
    const equipo = lista
  
    return equipo.slice(0, 6);
  }

function crearPokemon(nombres, tipo) {
     return nombres.map(function(nombre) {
        return new Pokemon(nombre, tipo, 1);
      });
  }

  async function entrenadorEscogePorTipo(entrenador, tipo) {
    // Obtener lista de pokémon de ese tipo
    const lista = [
        "charmander",
        "charmeleon",
        "charizard",
        "vulpix",
        "ninetales",
        "growlithe",
    ]
  
    
    // Convertirlos a objetos Pokémon
    const objetosPokemon = crearPokemon(lista, tipo);
  
    // Agregarlos al equipo
    objetosPokemon.forEach(p => entrenador.capturar(p));
  
    console.log(`El entrenador ${entrenador.nombre} ha elegido estos Pokémon:`);
    entrenador.mostrarEquipo();
  }