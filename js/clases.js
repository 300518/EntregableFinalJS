class Pokemon {
  constructor(nombre, tipos, sprite = "") {
    this.nombre = nombre;
    this.tipos = Array.isArray(tipos) ? tipos : [tipos];
    this.sprite = sprite;
  }
}

class Equipo {
  constructor(pokemones = []) {
    this.pokemones = pokemones;
    this.max = 6;
  }
  puedeAgregar() {
    return this.pokemones.length < this.max;
  }
  tienePokemon(nombre) {
    return this.pokemones.some((p) => p.nombre === nombre);
  }
  agregar(pokemon) {
    if (this.puedeAgregar() && !this.tienePokemon(pokemon.nombre)) {
      this.pokemones.push(pokemon);
      return true;
    }
    return false;
  }
  quitar(nombre) {
    this.pokemones = this.pokemones.filter((p) => p.nombre !== nombre);
  }
}

class Entrenador {
  constructor(nombre, edad, equipo = null) {
    this.id = Entrenador.generarId();
    this.nombre = nombre;
    this.edad = edad;
    this.equipo = equipo
      ? new Equipo(
          equipo.pokemones.map(
            (poke) => new Pokemon(poke.nombre, poke.tipos, poke.sprite)
          )
        )
      : new Equipo();
  }
  static generarId() {
    return `t_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }
  toPlain() {
    return {
      id: this.id,
      nombre: this.nombre,
      edad: this.edad,
      equipo: {
        pokemones: this.equipo.pokemones.map((p) => ({
          nombre: p.nombre,
          tipos: p.tipos,
          sprite: p.sprite,
        })),
      },
    };
  }

  static fromPlain(obj) {
    const en = new Entrenador(obj.nombre, obj.edad, obj.equipo);
    en.id = obj.id;
    return en;
  }
}
