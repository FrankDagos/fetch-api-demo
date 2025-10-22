// DOM
const imageURL = `https://cdn.thesimpsonsapi.com/500`;
const galeria = document.getElementById("galeria");
const loader = document.getElementById("loader");
const botonCargar = document.getElementById("cargarNuevosPersonajes");

/**
 * Función para obtener datos de un personaje por ID
 * @param {*} id
 * @returns {Promise<Object>}
 */
const fetchCharacter = async (id) => {
  const response = await fetch(
    `https://thesimpsonsapi.com/api/characters/${id}`
  );

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const data = await response.json();

  return data;
};

function getRandomArbitrary(min, max) {
  const randomId = Math.floor(Math.random() * (max - min) + min);
  return randomId;
}

function crearTarjetaPersonaje(personaje) {
  const { name, portrait_path, occupation } = personaje;
  const divTarjeta = document.createElement("div");
  divTarjeta.className = "personaje";
  const img = document.createElement("img");

  img.src = `${imageURL}${portrait_path}`;
  img.alt = `Imagen de ${name}`;

  const h2Nombre = document.createElement("h2");
  h2Nombre.textContent = name;

  const pOcupacion = document.createElement("p");
  pOcupacion.textContent = occupation || "Sin ocupación conocida";

  divTarjeta.appendChild(img);
  divTarjeta.appendChild(h2Nombre);
  divTarjeta.appendChild(pOcupacion);

  return divTarjeta;
}

async function cargarGaleria() {
  loader.classList.remove("oculto");
  botonCargar.style.display = "none";
  galeria.innerHTML = "";

  try {
    const promesas = [];

    for (let i = 0; i < 6; i++) {
      const characterId = getRandomArbitrary(1, 1182);
      promesas.push(fetchCharacter(characterId));
    }

    const personajes = await Promise.all(promesas);

    personajes.forEach((personaje) => {
      const tarjeta = crearTarjetaPersonaje(personaje);
      galeria.appendChild(tarjeta);
    });
  } catch (error) {
    console.error("Error al cargar la galería:", error);
    mostrarError(error.message);
  } finally {
    loader.classList.add("oculto");
    botonCargar.style.display = "block";
  }
}

/**
 * Función para mostrar errores en el HTML
 */
function mostrarError(mensaje) {
  galeria.innerHTML = ""; // Limpiamos la galería
  const pError = document.createElement("p");
  pError.textContent = `¡Oh, no! ${mensaje}`;
  pError.style.color = "red";
  galeria.appendChild(pError);
}

botonCargar.addEventListener("click", cargarGaleria);

cargarGaleria();
