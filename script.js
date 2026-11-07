// OK - Municipios de España
// OK - Usar Geocoding API de Open Meteo
// OK - Solo consultar la api cuando el usuario haya tecleado un minimo de 3 caracteres
// OK - No mostrar más de 7 sugerencias
// OK - La seleccion de una sugerencia será realizada mediante el ratón
// OK - Si la api no devuelve nada, decide tu mismo que mostrar
// OK - La lista debe cerrarse si el usuario presiona la tecla ESCAPE o hace click fuera de la misma

async function get(nombre_municipio)
{
	let URL_MUNICIPIOS = "https://geocoding-api.open-meteo.com/v1/search?name=" + nombre_municipio + "&count=7&language=es&format=json&countryCode=ES";
	const answer = await fetch(URL_MUNICIPIOS);
	const data = await answer.json();
	return data.results;
};

const entrada = document.querySelector("#entrada");
entrada.addEventListener("input", async () => {
	let nombre_municipio = entrada.value;
	if (nombre_municipio.length < 3)
	{
		limpiarSugerencias();
		return;
	}
	const municipios = await get(nombre_municipio);
	mostrarSugerencias(municipios);
});

const sugerencias = document.querySelector("#sugerencias");
const seleccion = document.querySelector("#seleccion");

function mostrarSugerencias(lista) {
    limpiarSugerencias();

    if (lista.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No se encontraron resultados";
        sugerencias.appendChild(li);
        return;
    }

    lista.forEach(lugar => {
        const li = document.createElement("li");
        
        const provincia = lugar.admin2;
        li.innerHTML = "<strong>" + lugar.name + " (" + provincia + ")" + "</strong>";

        li.addEventListener("click", () => {
            entrada.value = lugar.name;
            seleccion.textContent = `Has elegido: ${lugar.name}, ${provincia}`;
            limpiarSugerencias();
        });

        sugerencias.appendChild(li);
    });
}

function limpiarSugerencias() {
    sugerencias.innerHTML = "";
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        limpiarSugerencias();
    }
});

document.addEventListener("click", (e) => {
    if (!entrada.contains(e.target) && !sugerencias.contains(e.target)) {
        limpiarSugerencias();
    }
});