# EntregableFinalJS
Simulador de Entrenadores Pokémon
¿De qué se trata?
Es una aplicación web donde puedes crear entrenadores Pokémon (máximo 3) y armarles su equipo (máximo 6 Pokémon). Se puede elegir un inicial y sumar otros por tipo usando datos de la PokeAPI. Todo queda guardado en tu navegador, así no se pierde nada.

¿Qué puedes hacer?

Crear entrenadores (hasta 3).
Elegir un Pokémon inicial.
Agregar Pokémon por tipo.
Quitar Pokémon del equipo cuando querai.
Guardar cambios y que todo quede en LocalStorage.
Ver todo dinámico, sin HTML fijo (todo lo arma el JavaScript).
Mensajes más bacanes con SweetAlert en vez de los alert fomes.

Tecnologías:

HTML5, CSS3 (con Bootstrap para estilos).
JavaScript (DOM, Fetch, LocalStorage).
SweetAlert para los mensajes.
PokeAPI para traer tipos y sprites.

Estructura
/ (raíz)
├─ index.html
├─ estilo.css
├─ clases.js        # Clases: Pokemon, Equipo, Entrenador
├─ app.js           # Lógica principal y eventos
├─ pokemonIniciales.json
└─ README.md

Autor: Alvaro Cabezas
Proyecto final del curso JavaScript en Coderhouse.
