//Se utlizan concepto de la api.
//sprite es la imagen del pokemon
//se cargan las imagenes de los pokemon iniciales.
let POKEMON_INICIALES = [];

// En  un prinicipio tenía un const con un arreglo con los pokemones iniciales. Lo reemplazo para cumplir la consigna
async function cargarPokemonIniciales() {
  try {
    const respuestaJson = await fetch("data/pokemonIniciales.json");
    if (!respuestaJson.ok) throw new Error(`HTTP ${respuestaJson.status}`);
    POKEMON_INICIALES = await respuestaJson.json();
  } catch (err) {
    swal({
      title: "Error",
      text: "No pudimos cargar los iniciales. Intenta de nuevo.",
      icon: "error",
    });
    POKEMON_INICIALES = [];
  }
}

//Se utiliza el storage como indicó la tutora.
const STORAGE_KEY = "entrenadorPokemon_v1";
let entrenadores = [];
let entrenadorSeleccionadoId = null;

function cargarEntrenadores() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw).map((obj) => Entrenador.fromPlain(obj));
  } catch {
    swal({
      title: "Error",
      text: "No es posible cargar a los entrenadores",
      icon: "error",
    });
    return [];
  }
}

function guardarEntrenadores() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(entrenadores.map((e) => e.toPlain()))
  );
}

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        m
      ])
  );
}

function renderListaEntrenadores() {
  const cont = document.getElementById("listaEntrenadores");
  cont.innerHTML = "";
  if (entrenadores.length === 0) {
    cont.innerHTML =
      '<div class="alert alert-secondary">No hay entrenadores todavía.</div>';
    return;
  }
  const list = document.createElement("div");
  list.className = "list-group";
  entrenadores.forEach((entrenadorcreado) => {
    const item = document.createElement("div");
    item.className =
      "list-group-item d-flex justify-content-between align-items-center";
    const left = document.createElement("div");
    left.innerHTML = `<strong>${escapeHtml(
      entrenadorcreado.nombre
    )}</strong> <div class="muted">Edad: ${escapeHtml(
      String(entrenadorcreado.edad)
    )}</div>`;
    const actions = document.createElement("div");
    const btnEditar = document.createElement("button");
    btnEditar.className = "btn btn-sm btn-outline-primary me-2";
    btnEditar.textContent = "Editar equipo";
    btnEditar.addEventListener("click", () =>
      seleccionarEntrenador(entrenadorcreado.id)
    );
    const btnEliminar = document.createElement("button");
    btnEliminar.className = "btn btn-sm btn-outline-danger";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", () =>
      eliminarEntrenador(entrenadorcreado.id)
    );
    actions.appendChild(btnEditar);
    actions.appendChild(btnEliminar);
    item.appendChild(left);
    item.appendChild(actions);
    list.appendChild(item);
  });
  cont.appendChild(list);
}

async function poblarTipos() {
  const select = document.getElementById("comboTipoAdd");
  select.innerHTML = '<option value="">-- Selecciona tipo --</option>';
  try {
    const resp = await fetch("https://pokeapi.co/api/v2/type");
    const data = await resp.json();
    data.results.forEach((t) => {
      if (t.name === "unknown" || t.name === "shadow") return;
      const opt = document.createElement("option");
      opt.value = t.name;
      opt.textContent = t.name;
      select.appendChild(opt);
    });
  } catch {
    swal({
      title: "Advertencia",
      text: "No es posible agregar los tipos de pokemon",
      icon: "warning",
    });
  }
}

async function obtenerPokemonPorTipoLista(tipo) {
  try {
    const resp = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
    const data = await resp.json();
    return data.pokemon.map((item) => item.pokemon.name);
  } catch {
    return [];
  }
}

function crearEntrenadorDesdeUI() {
  const nombre = document.getElementById("inputNombre").value.trim();
  const edad = parseInt(document.getElementById("inputEdad").value, 10) || 0;
  const msg = document.getElementById("msgCrear");
  msg.textContent = "";
  if (!nombre) {
    msg.textContent = "Nombre requerido.";
    return;
  }
  if (entrenadores.length >= 3) {
    swal({
      title: "Advertencia",
      text: "No es posible agregar más de 3 entrenadores",
      icon: "warning",
    });

    return;
  }
  entrenadores.push(new Entrenador(nombre, edad));
  guardarEntrenadores();
  renderListaEntrenadores();
  document.getElementById("inputNombre").value = "";
  swal({
    title: "Creación",
    text: "Has creado un nuevo entrenado",
    icon: "success",
  });
}

function eliminarEntrenador(id) {
  entrenadores = entrenadores.filter((e) => e.id !== id);
  if (entrenadorSeleccionadoId === id) entrenadorSeleccionadoId = null;
  guardarEntrenadores();
  renderListaEntrenadores();
  renderEditor();
  swal({
    title: "Eliminación",
    text: "Has eliminado al entrenador",
    icon: "success",
  });
}

function seleccionarEntrenador(id) {
  entrenadorSeleccionadoId = id;
  renderEditor();
}

function esInicial(pokemon) {
  return Array.isArray(pokemon.tipos)
    ? pokemon.tipos.includes("inicial")
    : pokemon.tipos === "inicial";
}

function tieneInicial(entrenador) {
  return entrenador.equipo.pokemones.some(esInicial);
}

async function manejarAgregarPorTipo() {
  const tipo = document.getElementById("comboTipoAdd").value;
  const msg = document.getElementById("msgEditor");
  msg.textContent = "";

  if (!tipo) {
    msg.textContent = "Selecciona un tipo.";
    return;
  }

  const ent = entrenadores.find((x) => x.id === entrenadorSeleccionadoId);
  if (!ent.equipo.puedeAgregar()) {
    msg.textContent = "Equipo completo.";
    return;
  }

  const lista = await obtenerPokemonPorTipoLista(tipo);
  const nombreElegido = lista.find((n) => !ent.equipo.tienePokemon(n));
  if (!nombreElegido) {
    msg.textContent = "No hay disponibles.";
    return;
  }

  const imagen = await obtenerImagenPokemon(nombreElegido);
  const nuevoPokemon = new Pokemon(nombreElegido, tipo, imagen);

  nuevoPokemon.sprite = imagen;
  ent.equipo.agregar(nuevoPokemon);

  guardarEntrenadores();
  renderEditor();
  renderListaEntrenadores();
}

async function manejarGuardarEntrenador() {
  const entTemporal = entrenadores.find(
    (entrenador) => entrenador.id === entrenadorSeleccionadoId
  );
  const seleccion = Array.from(
    document.getElementsByName("pokemonInicial")
  ).find((radioSeleccionado) => radioSeleccionado.checked);
  if (seleccion) {
    if (tieneInicial(entTemporal) && seleccion.checked) {
      swal({
        title: "Inicial ya asignado",
        text: "Este entrenador ya tiene un Pokémon inicial. Debes quitarlo antes de elegir otro.",
        icon: "warning",
      });
      seleccion.checked = false;
      return;
    }

    const nombreIni = seleccion.value;
    const imagen = await obtenerImagenPokemon(nombreIni);
    if (
      !entTemporal.equipo.tienePokemon(nombreIni) &&
      entTemporal.equipo.puedeAgregar()
    ) {
      const nuevoPokemonInicial = new Pokemon(nombreIni, "inicial", imagen);
      nuevoPokemonInicial.sprite = imagen;
      entTemporal.equipo.pokemones.unshift(nuevoPokemonInicial);
      entTemporal.equipo.pokemones = entTemporal.equipo.pokemones.slice(
        0,
        entTemporal.equipo.max
      );
    }
  }
  guardarEntrenadores();
  renderEditor();
  renderListaEntrenadores();

  swal({
    title: "Guardado",
    text: "Has editado correctamente los cambios en el equipo Pokemon",
    icon: "success",
  });
}

function renderEditor() {
  const editor = document.getElementById("editorEquipo");
  if (!entrenadorSeleccionadoId) {
    editor.classList.add("d-none");
    return;
  }
  const ent = entrenadores.find((x) => x.id === entrenadorSeleccionadoId);
  editor.classList.remove("d-none");
  document.getElementById("tituloEditor").textContent = `Editor: ${ent.nombre}`;
  const radios = document.getElementById("radiosIniciales");
  radios.innerHTML = "";
  POKEMON_INICIALES.forEach((pokemonNuevo) => {
    const id = `ini_${pokemonNuevo.nombre}`;
    const div = document.createElement("div");
    div.className = "form-check";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "pokemonInicial";
    input.id = id;
    input.value = pokemonNuevo.nombre;
    input.className = "form-check-input";
    if (
      ent.equipo.pokemones.some((poke) => poke.nombre === pokemonNuevo.nombre)
    )
      input.checked = true;
    const lbl = document.createElement("label");
    lbl.className = "form-check-label";
    lbl.htmlFor = id;
    lbl.innerHTML = `<img src="${pokemonNuevo.sprite}" class="sprite"> ${pokemonNuevo.nombre}`;
    div.appendChild(input);
    div.appendChild(lbl);
    radios.appendChild(div);
  });
  const listaDiv = document.getElementById("listaPokemonEquipo");
  listaDiv.innerHTML = "";
  ent.equipo.pokemones.forEach((poke) => {
    const row = document.createElement("div");
    row.className = "card-pokemon d-flex align-items-center gap-3";
    //const imagenPokemonEquipo = obtenerImagenPokemon(poke.nombre);
    row.innerHTML = `
      <img src="${poke.sprite || "assets/img/placeholder.png"}" alt="${
      poke.nombre
    }" widthtalize">${poke.nombre}</strong>
        <small class="text-muted">${
          Array.isArray(poke.tipos) ? poke.tipos.join(", ") : poke.tipos
        }</small>
      </div>
    `;

    const btn = document.createElement("button");
    btn.className = "btn btn-sm btn-outline-danger ms-auto";
    btn.textContent = "Quitar";
    btn.onclick = () => {
      ent.equipo.quitar(poke.nombre);
      guardarEntrenadores();
      renderEditor();
      renderListaEntrenadores();
      swal({
        title: "Guardado",
        text: "Has editado correctamente los cambios en el equipo Pokemon",
        icon: "success",
      });
    };
    row.appendChild(btn);
    listaDiv.appendChild(row);
  });
}

function inicializarApp() {
  entrenadores = cargarEntrenadores();
  renderListaEntrenadores();
  poblarTipos();
  document
    .getElementById("btnCrearEntrenador")
    .addEventListener("click", crearEntrenadorDesdeUI);
  document
    .getElementById("btnAgregarPorTipo")
    .addEventListener("click", manejarAgregarPorTipo);
  document
    .getElementById("btnGuardarEntrenador")
    .addEventListener("click", manejarGuardarEntrenador);
  cargarPokemonIniciales();
  swal("Inicio de la aplicación", "Aplicación Iniciada");
}

async function obtenerImagenPokemon(nombre) {
  const msg = document.getElementById("msgEditor");
  if (msg) msg.textContent = "Buscando imagen…";

  try {
    const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
    if (!resp.ok) {
      if (msg) msg.textContent = "No encontramos la imagen.";
      return "";
    }
    const data = await resp.json();
    return data.sprites.front_default || "";
  } catch {
    swal({
      title: "Advertencia",
      text: "No es posible obtener la imagen del pokemon seleccionado",
      icon: "warning",
    });
    return "";
  } finally {
    if (msg) msg.textContent = "";
  }
}

inicializarApp();
