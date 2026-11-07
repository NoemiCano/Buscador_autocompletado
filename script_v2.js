let provinciasMap = null;

async function get(nombre_municipio)
{
	if (!provinciasMap) {
        const resProv = await fetch("https://raw.githubusercontent.com/frontid/ComunidadesProvinciasPoblaciones/master/provincias.json");
        const provinciasData = await resProv.json();
        provinciasMap = {};
        provinciasData.forEach(p => {
            provinciasMap[p.code] = p.label;
        });
    }

	let URL_MUNICIPIOS = "https://raw.githubusercontent.com/frontid/ComunidadesProvinciasPoblaciones/master/poblaciones.json";
	const answer = await fetch(URL_MUNICIPIOS);
	const data = await answer.json();

	const query = nombre_municipio.toLowerCase();

	const filtrados = data.filter(lugar => {
        const nombre = lugar.label;
        return nombre.toLowerCase().includes(query);
    });

	filtrados.forEach(lugar => {
        lugar.provinciaNombre = provinciasMap[lugar.parent_code];
    });

	console.log(filtrados);
    return filtrados.slice(0, 7);
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
	mostrarSugerencias(municipios, nombre_municipio);
});

const sugerencias = document.querySelector("#sugerencias");
const seleccion = document.querySelector("#seleccion");

function mostrarSugerencias(lista, queryOriginal) {
    limpiarSugerencias();

    if (lista.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No se encontraron resultados";
        sugerencias.appendChild(li);
        return;
    }

    lista.forEach(lugar => {
        const li = document.createElement("li");
        
		const nombreLugar = lugar.label;
        const provincia = lugar.provinciaNombre;

		const nombreResaltado = resaltarCoincidencia(nombreLugar, queryOriginal);

        li.innerHTML = "<strong>" + nombreResaltado + " (" + provincia + ")" + "</strong>";

        li.addEventListener("click", () => {
            entrada.value = nombreLugar;
            seleccion.textContent = `Has elegido: ${nombreLugar}, ${provincia}`;
            limpiarSugerencias();
        });

        sugerencias.appendChild(li);
    });
}

function resaltarCoincidencia(cadena, subcadena) {
    if (!subcadena) return cadena;

    const cadenaNorm = cadena.toLowerCase()
    const subcadenaNorm = subcadena.toLowerCase()

    const inicio = cadenaNorm.indexOf(subcadenaNorm);

    if (inicio === -1) {
        return cadena;
    }

    const longitud = subcadena.length;

    const parteAntes = cadena.slice(0, inicio);
    const parteCoincidencia = cadena.slice(inicio, inicio + longitud);
    const parteDespues = cadena.slice(inicio + longitud);

    return parteAntes + "<mark>" + parteCoincidencia + "</mark>" + parteDespues;
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