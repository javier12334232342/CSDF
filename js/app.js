const contenido = document.getElementById("contenido");
const logo = document.getElementById("logo");
const anio = document.getElementById("anio");
let indiceCarruselOtrosJuegos = 0;

anio.textContent = new Date().getFullYear();

window.addEventListener("resize", actualizarCarruselOtrosJuegos);


/* =========================================================
   JUEGOS DISPONIBLES
========================================================= */

const juegos = [
    {
        id: "maximos-goleadores",
        titulo: "Máximos goleadores",
        descripcion: "¿Cuánto sabes sobre los grandes goleadores del fútbol?",
        iniciar: iniciarMaximosGoleadores
    },

    {
        id: "quien-es-el-jugador",
        titulo: "¿Quién es el jugador?",
        descripcion: "Adivina qué futbolista se esconde detrás de las pistas.",
        iniciar: iniciarQuienEsElJugador
    },

    {
        id: "campeones-del-mundo",
        titulo: "Campeones del mundo",
        descripcion: "Pon a prueba tus conocimientos sobre los Mundiales.",
        iniciar: iniciarCampeonesDelMundo
    },

    {
        id: "quien-marco-mas-champions",
        titulo: "Goleadores de Champions",
        descripcion: "¿Cuánto sabes de goleadores en Champions?",
        iniciar: iniciarQuienMarcoMasChampions
    },
    {
        id: "quien-marco-mas-champions-historico",
        titulo: "Goleadores históricos de Champions",
        descripcion: "¿Quién marcó más goles en la historia de la Copa de Europa y la Champions?",
        iniciar: iniciarQuienMarcoMasChampionsHistorico
    },
    {
        id: "quien-marco-mas-mundial",
        titulo: "Goleadores de Mundiales",
        descripcion: "¿Quién marcó más goles en la historia de los Mundiales?",
        iniciar: iniciarQuienMarcoMasMundial
    },
    {
        id: "quien-marco-mas-carrera",
        titulo: "Goleadores históricos",
        descripcion: "¿Quién marcó más goles oficiales en su carrera?",
        iniciar: iniciarQuienMarcoMasCarrera
    },
    {
        id: "quien-jugo-mas-mundial",
        titulo: "Más partidos en Mundiales",
        descripcion: "¿Quién disputó más partidos en Copas del Mundo?",
        iniciar: iniciarQuienJugoMasMundial
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
        <div style="text-align: right" class="racha-juego">
           ${racha} 🔥 
        </div>
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

                    <button
                        class="juego-opcion"
                        data-juego="${juego.id}"
                    >

                        ${crearRachaHTML(juego.id)}

                        <div class="juego-titulo">
                            ${juego.titulo}
                        </div>

                        <div class="juego-descripcion">
                            ${juego.descripcion}
                        </div>

                    </button>

                `).join("")}

            </div>

        </div>
    `;


    document.querySelectorAll(".juego-opcion").forEach(boton => {

        boton.addEventListener("click", () => {

            abrirJuego(boton.dataset.juego);

        });

    });
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

    juego.iniciar();

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

            <button
                class="carrusel-item"
                data-juego="${juego.id}"
            >

                ${crearRachaHTML(juego.id)}

                <strong>
                    ${juego.titulo}
                </strong>

                <span>
                    ${juego.descripcion}
                </span>

            </button>

        `)

        .join("");
}


/* =========================================================
   BOTÓN CSDF
========================================================= */

logo.addEventListener("click", mostrarInicio);


/* =========================================================
   INICIAR
========================================================= */

mostrarInicio();


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