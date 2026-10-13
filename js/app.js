const contenido = document.getElementById("contenido");
const anio = document.getElementById("anio");
let indiceCarruselOtrosJuegos = 0;

if (anio) {
    anio.textContent = new Date().getFullYear();
}


/* =========================================================
   JUEGOS DISPONIBLES
========================================================= */

const juegos = [
    {
        id: "quien-marco-mas-champions",
        titulo: "Pichichis de Champions",
        descripcion: "¿Cuánto sabes de los pichichis de la Champions League?",
        modo: "duelo",
        tema: "champions",
        normas: {
            titulo: "¿Quién marcó más goles?",
            descripcion: "Pon a prueba tus conocimientos sobre los máximos goleadores de la Champions League.",
            reglas: [
                {
                    titulo: "Compara dos jugadores:",
                    descripcion: "cada uno corresponde a una temporada diferente."
                },
                {
                    titulo: "Elige al goleador:",
                    descripcion: "pulsa sobre el jugador que marcó más goles en su temporada."
                },
                {
                    titulo: "Descubre las cifras:",
                    descripcion: "después de responder verás los goles de ambos jugadores."
                },
                {
                    titulo: "Consigue una racha:",
                    descripcion: "cada acierto consecutivo suma un punto; si fallas, la racha vuelve a cero."
                }
            ],
            nota: "¿Serás capaz de superar tu récord personal?"
        },
        iniciar: () => window.iniciarQuienMarcoMasChampions()
    },
    {
        id: "quien-marco-mas-champions-historico",
        titulo: "Goleadores de Champions",
        descripcion: "¿Quién marcó más goles en la historia de la Copa de Europa y la Champions?",
        modo: "duelo",
        tema: "champions",
        normas: {
            titulo: "¿Quién marcó más goles?",
            descripcion: "Compara a dos futbolistas y descubre quién ha marcado más goles en toda la historia de la Copa de Europa y la Champions League.",
            reglas: [
                {
                    titulo: "Compara dos leyendas:",
                    descripcion: "aparecerán dos futbolistas con sus goles acumulados."
                },
                {
                    titulo: "Elige al máximo goleador:",
                    descripcion: "pulsa sobre el jugador que tenga más goles históricos."
                },
                {
                    titulo: "Descubre las cifras:",
                    descripcion: "después de responder podrás ver los goles de ambos."
                },
                {
                    titulo: "Construye tu racha:",
                    descripcion: "cada acierto suma un punto; si fallas, la racha vuelve a cero."
                }
            ],
            nota: "Se excluyen las rondas clasificatorias."
        },
        iniciar: () => window.iniciarQuienMarcoMasChampionsHistorico()
    },
    {
        id: "quien-marco-mas-mundial",
        titulo: "Goleadores de Mundiales",
        descripcion: "¿Quién marcó más goles en la historia de los Mundiales?",
        modo: "duelo",
        tema: "mundial",
        normas: {
            titulo: "¿Quién marcó más goles?",
            descripcion: "Compara los goles anotados por dos futbolistas en la fase final de la Copa del Mundo.",
            reglas: [
                {
                    titulo: "Compara dos jugadores:",
                    descripcion: "cada ronda muestra a dos futbolistas."
                },
                {
                    titulo: "Elige al goleador:",
                    descripcion: "selecciona a quien haya marcado más goles en los Mundiales."
                },
                {
                    titulo: "Descubre las cifras:",
                    descripcion: "después de responder verás los goles de ambos."
                },
                {
                    titulo: "Consigue una racha:",
                    descripcion: "cada acierto consecutivo suma un punto; si fallas, la racha vuelve a cero."
                }
            ],
            nota: "Las estadísticas corresponden a las Copas del Mundo."
        },
        iniciar: () => window.iniciarQuienMarcoMasMundial()
    },
    {
        id: "quien-jugo-mas-mundial",
        titulo: "Más partidos en Mundiales",
        descripcion: "¿Quién disputó más partidos en Copas del Mundo?",
        modo: "duelo",
        tema: "mundial",
        normas: {
            titulo: "¿Quién jugó más partidos?",
            descripcion: "Compara los partidos disputados por dos futbolistas en la fase final de la Copa del Mundo.",
            reglas: [
                {
                    titulo: "Compara dos jugadores:",
                    descripcion: "cada ronda muestra a dos futbolistas."
                },
                {
                    titulo: "Elige a quien jugó más:",
                    descripcion: "selecciona a quien haya disputado más partidos en los Mundiales."
                },
                {
                    titulo: "Descubre las cifras:",
                    descripcion: "después de responder verás los partidos de ambos."
                },
                {
                    titulo: "Consigue una racha:",
                    descripcion: "cada acierto consecutivo suma un punto; si fallas, la racha vuelve a cero."
                }
            ],
            nota: "Las estadísticas corresponden a las Copas del Mundo."
        },
        iniciar: () => window.iniciarQuienJugoMasMundial()
    },
    {
        id: "quien-marco-mas-carrera",
        titulo: "Goleadores históricos",
        descripcion: "¿Quién marcó más goles oficiales en su carrera?",
        modo: "duelo",
        tema: "historico",
        normas: {
            titulo: "¿Quién marcó más goles?",
            descripcion: "Compara los goles oficiales acumulados por dos futbolistas durante sus carreras.",
            reglas: [
                {
                    titulo: "Compara dos jugadores:",
                    descripcion: "se muestran sus goles oficiales de clubes y selección absoluta."
                },
                {
                    titulo: "Elige al máximo goleador:",
                    descripcion: "selecciona a quien tenga más goles en total."
                },
                {
                    titulo: "Descubre las cifras:",
                    descripcion: "después de responder verás los goles de ambos."
                },
                {
                    titulo: "Consigue una racha:",
                    descripcion: "cada acierto consecutivo suma un punto; si fallas, la racha vuelve a cero."
                }
            ],
            nota: "Las cifras históricas pueden variar según la fuente."
        },
        iniciar: () => window.iniciarQuienMarcoMasCarrera()
    },
    {
        id: "impostores-futboleros",
        titulo: "Encuentra los impostores",
        descripcion: "¿Quién de estos jugadores no cumple la consigna?",
        modo: "grupo",
        tema: "impostores",
        normas: {
            titulo: "Encuentra a los impostores",
            descripcion: "En cada ronda verás una consigna estadística y cinco futbolistas.",
            reglas: [
                {
                    titulo: "Lee la consigna:",
                    descripcion: "indica una estadística y un mínimo que deben superar."
                },
                {
                    titulo: "Selecciona a los impostores:",
                    descripcion: "marca todos los jugadores que no superan ese mínimo."
                },
                {
                    titulo: "Confirma tu selección:",
                    descripcion: "para acertar debes marcar exactamente a todos los impostores, sin dejar ninguno ni añadir jugadores."
                },
                {
                    titulo: "Construye tu racha:",
                    descripcion: "un acierto suma un punto y un error la devuelve a cero."
                }
            ],
        },
        iniciar: () => window.iniciarImpostoresFutboleros()
    }

];


/* =========================================================
   OBTENER RACHA MÁXIMA DE UN JUEGO
========================================================= */

function obtenerRacha(idJuego) {

    return Number(
        localStorage.getItem(`mejor-racha-${idJuego}`)
    ) || 0;
}


/* =========================================================
   HTML DE LA RACHA
========================================================= */

function crearRachaHTML(idJuego) {

    const racha = obtenerRacha(idJuego);

    if (racha <= 0) {
        return "";
    }

    return `
        <div class="racha-juego">
           <span>${racha}</span>
           <span aria-hidden="true">🔥</span>
        </div>
    `;
}


function crearModoJuegoHTML(juego) {

    if (juego.modo === "grupo") {
        return `
            <span class="modo-juego" aria-label="Modo de juego: impostor">
                <svg
                    class="modo-juego-icono"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path d="M3 12c3-3 8-4 13-1 5-3 10-2 13 1-1 7-5 11-10 7l-3-3-3 3C8 23 4 19 3 12Z"></path>
                    <path d="m4 13-3-2m27 2 3-2M13 14h6"></path>
                </svg>
                <span>impostor</span>
            </span>
        `;
    }

    if (juego.modo !== "duelo") {
        return "";
    }

    return `
        <span class="modo-juego" aria-label="Modo de juego: 2 opciones">
            <svg
                class="modo-juego-icono"
                viewBox="0 0 32 32"
                aria-hidden="true"
                focusable="false"
            >
                <rect x="2.5" y="5" width="11" height="18" rx="3"></rect>
                <rect x="18.5" y="5" width="11" height="18" rx="3"></rect>
                <circle cx="8" cy="11" r="2"></circle>
                <path d="M5.5 18c.4-2 1.3-3 2.5-3s2.1 1 2.5 3"></path>
                <circle cx="24" cy="11" r="2"></circle>
                <path d="M21.5 18c.4-2 1.3-3 2.5-3s2.1 1 2.5 3"></path>
                <path d="M12.5 27h7m-2.5-2.5L19.5 27 17 29.5"></path>
            </svg>
            <span>2 opciones</span>
        </span>
    `;

}


function crearContenidoTarjetaJuegoHTML(juego) {

    return `
        <span class="juego-card-titulo">${juego.titulo}</span>
        <span class="juego-card-descripcion">${juego.descripcion}</span>
        <span class="juego-card-pie">
            ${crearRachaHTML(juego.id)}
            ${crearModoJuegoHTML(juego)}
        </span>
    `;

}


/* =========================================================
   MENÚ PRINCIPAL
========================================================= */

function mostrarInicio() {

    contenido.innerHTML = `
        <div class="menu-principal">

            <h1 class="titulo-principal">
                ¿Cuánto sabes de fútbol?
            </h1>

            <p class="subtitulo-principal">
                Pon a prueba tus conocimientos con nuestros juegos.
            </p>

            <div class="lista-juegos">

                ${juegos.map(juego => `

                    <a
                        class="juego-opcion tema-${juego.tema}"
                        href="/juegos/${juego.id}/"
                    >

                        ${crearContenidoTarjetaJuegoHTML(juego)}

                    </a>

                `).join("")}

            </div>

        </div>
    `;


}


/* =========================================================
   ABRIR JUEGO
========================================================= */

function abrirJuego(idJuego) {

    const juego = juegos.find(juego => juego.id === idJuego);

    if (!juego) {
        console.error("Juego no encontrado:", idJuego);
        return;
    }


    contenido.innerHTML = `

        <div class="vista-juego">

            <div class="cabecera-juego">

                <h1>
                    ${juego.titulo}
                </h1>

                <p>
                    ${juego.descripcion}
                </p>

            </div>


            <div
                id="zona-juego"
                class="contenedor-juego"
            ></div>


            <div class="otros-juegos">

                <h2>
                    Otros juegos
                </h2>

                <div class="carrusel-contenedor">

                    <button
                        type="button"
                        class="carrusel-control carrusel-anterior"
                        aria-label="Ver juegos anteriores"
                        aria-controls="carrusel-otros-juegos"
                    >
                        &#10094;
                    </button>

                    <div class="carrusel-ventana">
                        <div
                            id="carrusel-otros-juegos"
                            class="carrusel"
                        >

                            ${crearCarruselJuegos(idJuego)}

                        </div>
                    </div>

                    <button
                        type="button"
                        class="carrusel-control carrusel-siguiente"
                        aria-label="Ver siguientes juegos"
                        aria-controls="carrusel-otros-juegos"
                    >
                        &#10095;
                    </button>
                </div>

            </div>

        </div>
    `;


    /* Iniciar la lógica del juego */

    iniciarJuego(juego);

    indiceCarruselOtrosJuegos = 0;
    actualizarCarruselOtrosJuegos();


    document
        .querySelector(".carrusel-anterior")
        .addEventListener("click", () => moverCarruselOtrosJuegos(-1));


    document
        .querySelector(".carrusel-siguiente")
        .addEventListener("click", () => moverCarruselOtrosJuegos(1));


    /* Eventos de otros juegos */

    document
        .querySelectorAll(".carrusel-item")
        .forEach(opcion => {

            opcion.addEventListener("click", () => {

                abrirJuego(opcion.dataset.juego);

            });

        });
}

function iniciarJuego(juego) {
    if (!juego.normas) {
        juego.iniciar();
        return;
    }

    mostrarDialogoNormas(juego.normas, juego.iniciar);
}

function mostrarDialogoNormas(normas, iniciar) {
    document.getElementById("dialogoNormasJuego")?.remove();

    const dialogo = document.createElement("dialog");
    dialogo.id = "dialogoNormasJuego";
    dialogo.className = "dialogo-normas-juego";
    dialogo.setAttribute("aria-labelledby", "tituloDialogoNormasJuego");
    dialogo.setAttribute("aria-describedby", "descripcionDialogoNormasJuego");

    const icono = document.createElement("div");
    icono.className = "dialogo-normas-icono";
    icono.setAttribute("aria-hidden", "true");
    icono.textContent = "⚽";

    const titulo = document.createElement("h2");
    titulo.id = "tituloDialogoNormasJuego";
    titulo.textContent = normas.titulo;

    const descripcion = document.createElement("p");
    descripcion.id = "descripcionDialogoNormasJuego";
    descripcion.textContent = normas.descripcion;

    const lista = document.createElement("ul");
    normas.reglas.forEach(regla => {
        const elemento = document.createElement("li");
        const etiqueta = document.createElement("strong");
        etiqueta.textContent = regla.titulo;
        elemento.append(etiqueta, ` ${regla.descripcion}`);
        lista.append(elemento);
    });

    dialogo.append(icono, titulo, descripcion, lista);

    if (normas.nota) {
        const nota = document.createElement("p");
        nota.className = "dialogo-normas-nota";
        nota.textContent = normas.nota;
        dialogo.append(nota);
    }

    const botonEmpezar = document.createElement("button");
    botonEmpezar.type = "button";
    botonEmpezar.className = "dialogo-normas-empezar";
    botonEmpezar.textContent = "¡Jugar!";
    botonEmpezar.addEventListener("click", () => {
        dialogo.close();
        dialogo.remove();
        iniciar();
    });

    dialogo.append(botonEmpezar);
    document.body.append(dialogo);
    dialogo.showModal();
}

function moverCarruselOtrosJuegos(direccion) {

    const ventana =
        document.querySelector(".carrusel-ventana");

    const carrusel =
        document.querySelector(".carrusel");

    if (!ventana || !carrusel) {
        return;
    }


    const elementos =
        carrusel.querySelectorAll(".carrusel-item");

    const elementosVisibles =
        Number(
            getComputedStyle(ventana)
                .getPropertyValue("--elementos-visibles")
        ) || 1;

    const indiceMaximo =
        Math.max(0, elementos.length - elementosVisibles);

    if (indiceMaximo === 0) {
        return;
    }


    if (direccion > 0) {
        indiceCarruselOtrosJuegos = Math.min(
            indiceMaximo,
            indiceCarruselOtrosJuegos + elementosVisibles
        );
    } else if (indiceCarruselOtrosJuegos === indiceMaximo) {
        indiceCarruselOtrosJuegos =
            Math.floor((indiceMaximo - 1) / elementosVisibles) *
            elementosVisibles;
    } else {
        indiceCarruselOtrosJuegos = Math.max(
            0,
            indiceCarruselOtrosJuegos - elementosVisibles
        );
    }

    actualizarCarruselOtrosJuegos();

}


function actualizarCarruselOtrosJuegos() {

    const ventana =
        document.querySelector(".carrusel-ventana");

    const carrusel =
        document.querySelector(".carrusel");

    if (!ventana || !carrusel) {
        return;
    }


    const elementos =
        carrusel.querySelectorAll(".carrusel-item");

    const elementosVisibles =
        Number(
            getComputedStyle(ventana)
                .getPropertyValue("--elementos-visibles")
        ) || 1;

    const indiceMaximo =
        Math.max(0, elementos.length - elementosVisibles);


    indiceCarruselOtrosJuegos =
        Math.min(indiceCarruselOtrosJuegos, indiceMaximo);


    const elemento =
        elementos[indiceCarruselOtrosJuegos];

    const desplazamiento =
        elemento && elementos[0]
            ? elemento.getBoundingClientRect().left -
            elementos[0].getBoundingClientRect().left
            : 0;


    carrusel.style.transform =
        `translateX(-${desplazamiento}px)`;


    const botonAnterior =
        document.querySelector(".carrusel-anterior");

    const botonSiguiente =
        document.querySelector(".carrusel-siguiente");

    const hayMasDeUnaPagina =
        elementos.length > elementosVisibles;


    botonAnterior.disabled =
        !hayMasDeUnaPagina || indiceCarruselOtrosJuegos === 0;

    botonSiguiente.disabled =
        !hayMasDeUnaPagina || indiceCarruselOtrosJuegos === indiceMaximo;

}


/* =========================================================
   CARRUSEL
========================================================= */

/* =========================================================
   CARRUSEL
========================================================= */

function crearCarruselJuegos(juegoActual) {

    return juegos

        .filter(juego => juego.id !== juegoActual)

        .map(juego => `

            <a
                href="/juegos/${juego.id}/"
                class="carrusel-item tema-${juego.tema}"
                data-juego="${juego.id}"
                aria-label="Abrir juego ${juego.titulo}"
            >

                ${crearContenidoTarjetaJuegoHTML(juego)}

            </a>

        `)

        .join("");
}

function renderizarCarruselOtrosJuegos(juegoActualId) {
    let contenedor = document.getElementById("otros-juegos");

    if (!contenedor) {
        const navRelacionados = document.querySelector(".juegos-relacionados");

        if (navRelacionados) {
            navRelacionados.outerHTML = '<div id="otros-juegos" aria-label="Otros juegos de fútbol"></div>';
            contenedor = document.getElementById("otros-juegos");
        } else {
            const contenidoPrincipal = document.getElementById("contenido");

            if (!contenidoPrincipal) {
                return;
            }

            contenedor = document.createElement("div");
            contenedor.id = "otros-juegos";
            contenedor.setAttribute("aria-label", "Otros juegos de fútbol");
            contenidoPrincipal.appendChild(contenedor);
        }
    }

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = `
        <div class="otros-juegos">
            <h2>Otros juegos</h2>

            <div class="carrusel-contenedor">
                <button
                    type="button"
                    class="carrusel-control carrusel-anterior"
                    aria-label="Ver juegos anteriores"
                    aria-controls="carrusel-otros-juegos"
                >&#10094;</button>

                <div class="carrusel-ventana">
                    <div id="carrusel-otros-juegos" class="carrusel">
                        ${crearCarruselJuegos(juegoActualId)}
                    </div>
                </div>

                <button
                    type="button"
                    class="carrusel-control carrusel-siguiente"
                    aria-label="Ver siguientes juegos"
                    aria-controls="carrusel-otros-juegos"
                >&#10095;</button>
            </div>
        </div>
    `;

    indiceCarruselOtrosJuegos = 0;
    actualizarCarruselOtrosJuegos();

    document.querySelector(".carrusel-anterior")?.addEventListener("click", () => moverCarruselOtrosJuegos(-1));
    document.querySelector(".carrusel-siguiente")?.addEventListener("click", () => moverCarruselOtrosJuegos(1));

}

/* =========================================================
   INICIAR
========================================================= */

const idJuegoInicial = document.body?.dataset?.juego;

if (idJuegoInicial) {
    const juegoInicial = juegos.find(juego => juego.id === idJuegoInicial);

    if (juegoInicial) {
        iniciarJuego(juegoInicial);
        renderizarCarruselOtrosJuegos(idJuegoInicial);
    } else {
        console.error("Juego inicial no encontrado:", idJuegoInicial);
    }
} else {
    mostrarInicio();
}


/* async function probarJugadorSinTemporada() {
    try {
        const datos = await consultarAPI("/players", {
            id: 276
        });

        console.log("Jugador sin temporada:");
        console.log(datos);

    } catch (error) {
        console.error("Error:", error);
    }
}

probarJugadorSinTemporada(); */