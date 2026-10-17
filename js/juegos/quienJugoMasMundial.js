const CLAVE_RACHA_PARTIDOS_MUNDIAL =
    "racha-quien-jugo-mas-mundial";

const CLAVE_MEJOR_RACHA_PARTIDOS_MUNDIAL =
    "mejor-racha-quien-jugo-mas-mundial";


let datosPartidosMundial = [];
let datosJugadoresPartidosMundial = [];

let jugadorAPartidosMundial = null;
let jugadorBPartidosMundial = null;

let todosLosJugadoresPartidosMundial = [];

let puntuacionPartidosMundial = 0;
let preguntaActualPartidosMundial = 0;
let respuestaBloqueadaPartidosMundial = false;


// ======================================================
// INICIAR JUEGO
// ======================================================

async function iniciarQuienJugoMasMundial() {

    const zonaJuego =
        document.getElementById("zona-juego");


    if (!zonaJuego) {

        console.error(
            "No se encontró #zona-juego"
        );

        return;

    }


    zonaJuego.innerHTML = `
        <div class="juego-goleadores-mundial">

            <div class="cabecera-partida">

                <div class="racha-actual">
                    <span id="puntuacion">0</span>
                    <img src="/img/iconos/rayo.png" alt="" aria-hidden="true">
                </div>

            </div>


            <div class="pregunta">

                <h2>
                    ¿Quién disputó más partidos?
                </h2>

            </div>


            <div class="jugadores">

                <div
                    id="botonA"
                    class="tarjeta-jugador"
                    role="button"
                    tabindex="0"
                >
                    <h3 id="nombreJugadorA"></h3>
                    <img
                        id="imagenJugadorA"
                        class="imagen-jugador"
                        src=""
                        alt=""
                    >

                    

                    <div
                        id="partidosJugadorA"
                        class="goles-jugador"
                    ></div>

                </div>


                <div class="vs">
                    VS
                </div>


                <div
                    id="botonB"
                    class="tarjeta-jugador"
                    role="button"
                    tabindex="0"
                >
                    <h3 id="nombreJugadorB"></h3>
                    <img
                        id="imagenJugadorB"
                        class="imagen-jugador"
                        src=""
                        alt=""
                    >

                    

                    <div
                        id="partidosJugadorB"
                        class="goles-jugador"
                    ></div>

                </div>

            </div>


            <div
                id="resultado"
                class="resultado"
                style="display: none;"
            >

                <button
                    id="botonSiguiente"
                    class="boton-siguiente"
                >
                    Siguiente ronda
                </button>

            </div>

        </div>
    `;


    const botonA =
        document.getElementById("botonA");


    const botonB =
        document.getElementById("botonB");


    const botonSiguiente =
        document.getElementById("botonSiguiente");


    // ==================================================
    // RESPUESTA A
    // ==================================================

    botonA.addEventListener("click", () => {

        comprobarRespuestaPartidos("A");

    });


    // ==================================================
    // RESPUESTA B
    // ==================================================

    botonB.addEventListener("click", () => {

        comprobarRespuestaPartidos("B");

    });


    // ==================================================
    // SIGUIENTE RONDA
    // ==================================================

    botonSiguiente.addEventListener("click", () => {

        if (puntuacionPartidosMundial === 0) {

            iniciarQuienJugoMasMundial();

        } else {

            generarPreguntaPartidos();

        }

    });


    // ==================================================
    // TECLADO A
    // ==================================================

    botonA.addEventListener("keydown", (evento) => {

        if (
            evento.key === "Enter" ||
            evento.key === " "
        ) {

            evento.preventDefault();

            comprobarRespuestaPartidos("A");

        }

    });


    // ==================================================
    // TECLADO B
    // ==================================================

    botonB.addEventListener("keydown", (evento) => {

        if (
            evento.key === "Enter" ||
            evento.key === " "
        ) {

            evento.preventDefault();

            comprobarRespuestaPartidos("B");

        }

    });


    // ==================================================
    // CARGAR DATOS
    // ==================================================

    try {

        const [
            respuestaEstadisticas,
            respuestaJugadores
        ] = await Promise.all([

            fetch(
                "datos/estadisticasMundiales.json"
            ),

            fetch(
                "datos/jugadores.json"
            )

        ]);


        if (!respuestaEstadisticas.ok) {

            throw new Error(
                "No se pudo cargar estadisticasMundiales.json"
            );

        }


        if (!respuestaJugadores.ok) {

            throw new Error(
                "No se pudo cargar jugadores.json"
            );

        }


        datosPartidosMundial =
            await respuestaEstadisticas.json();


        datosJugadoresPartidosMundial =
            await respuestaJugadores.json();


        if (!Array.isArray(datosPartidosMundial)) {

            throw new Error(
                "estadisticasMundiales.json no contiene un array"
            );

        }


        if (!Array.isArray(datosJugadoresPartidosMundial)) {

            throw new Error(
                "jugadores.json no contiene un array"
            );

        }


        todosLosJugadoresPartidosMundial =
            construirListaJugadoresPartidos();


        if (
            todosLosJugadoresPartidosMundial.length < 2
        ) {

            throw new Error(
                "No hay suficientes jugadores para iniciar el juego"
            );

        }


        // ==================================================
        // CARGAR RACHA
        // ==================================================

        puntuacionPartidosMundial =
            Number(
                localStorage.getItem(
                    CLAVE_RACHA_PARTIDOS_MUNDIAL
                )
            ) || 0;


        preguntaActualPartidosMundial = 0;


        actualizarPuntuacionPartidos();


        generarPreguntaPartidos();

    }


    catch (error) {

        console.error(
            "Error cargando los datos del juego:",
            error
        );


        zonaJuego.innerHTML = `
            <div class="error-juego">

                <h2>
                    Error al cargar el juego
                </h2>

                <p>
                    No se han podido cargar los datos
                    de los jugadores.
                </p>

            </div>
        `;

    }

}


// ======================================================
// CONSTRUIR LISTA DE JUGADORES
// ======================================================

function construirListaJugadoresPartidos() {

    const lista = [];


    datosPartidosMundial.forEach(
        datosJugadorMundial => {

            const jugador =
                obtenerDatosJugadorPartidos(
                    datosJugadorMundial
                );


            if (!jugador) {

                return;

            }


            lista.push({

                id: jugador.id,

                nombre: jugador.nombre,

                imagen: jugador.imagen,

                partidos: datosJugadorMundial.partidos

            });

        }
    );


    return lista;

}


// ======================================================
// GENERAR PREGUNTA
// ======================================================

function generarPreguntaPartidos() {

    respuestaBloqueadaPartidosMundial = false;

    preguntaActualPartidosMundial++;


    if (
        todosLosJugadoresPartidosMundial.length < 2
    ) {

        console.error(
            "No hay suficientes jugadores para generar una pregunta."
        );

        return;

    }


    let indiceA;

    let indiceB;

    let intentos = 0;

    const maxIntentos = 100;


    do {

        indiceA =
            Math.floor(
                Math.random() *
                todosLosJugadoresPartidosMundial.length
            );


        indiceB =
            Math.floor(
                Math.random() *
                todosLosJugadoresPartidosMundial.length
            );


        intentos++;

    }

    while (

        (

            // No puede ser el mismo registro
            indiceA === indiceB ||


            // No enfrentamos al mismo jugador
            todosLosJugadoresPartidosMundial[indiceA].id ===
            todosLosJugadoresPartidosMundial[indiceB].id ||


            // No puede haber empate
            todosLosJugadoresPartidosMundial[indiceA].partidos ===
            todosLosJugadoresPartidosMundial[indiceB].partidos

        )

        &&

        intentos < maxIntentos

    );


    if (

        indiceA === indiceB ||

        todosLosJugadoresPartidosMundial[indiceA].id ===
        todosLosJugadoresPartidosMundial[indiceB].id ||

        todosLosJugadoresPartidosMundial[indiceA].partidos ===
        todosLosJugadoresPartidosMundial[indiceB].partidos

    ) {

        console.error(
            "No se pudo encontrar una combinación válida."
        );

        return;

    }


    jugadorAPartidosMundial =
        todosLosJugadoresPartidosMundial[indiceA];


    jugadorBPartidosMundial =
        todosLosJugadoresPartidosMundial[indiceB];


    mostrarPreguntaPartidos();

}


// ======================================================
// OBTENER DATOS DEL JUGADOR
// ======================================================

function obtenerDatosJugadorPartidos(
    datosJugadorMundial
) {

    const jugador =
        datosJugadoresPartidosMundial.find(
            jugador =>
                jugador.id ===
                datosJugadorMundial.idJugador
        );


    if (!jugador) {

        console.error(
            `No existe "${datosJugadorMundial.idJugador}" en jugadores.json`
        );

        return null;

    }


    return {

        id: jugador.id,

        nombre: jugador.nombre,

        imagen: jugador.imagen

    };

}


// ======================================================
// MOSTRAR PREGUNTA
// ======================================================

function mostrarPreguntaPartidos() {

    document.getElementById(
        "nombreJugadorA"
    ).textContent =
        jugadorAPartidosMundial.nombre;


    document.getElementById(
        "nombreJugadorB"
    ).textContent =
        jugadorBPartidosMundial.nombre;


    const imagenA =
        document.getElementById(
            "imagenJugadorA"
        );


    const imagenB =
        document.getElementById(
            "imagenJugadorB"
        );


    imagenA.src =
        jugadorAPartidosMundial.imagen;


    imagenA.alt =
        jugadorAPartidosMundial.nombre;


    imagenB.src =
        jugadorBPartidosMundial.imagen;


    imagenB.alt =
        jugadorBPartidosMundial.nombre;


    document.getElementById(
        "partidosJugadorA"
    ).textContent =
        "?";


    document.getElementById(
        "partidosJugadorB"
    ).textContent =
        "?";


    const botonA =
        document.getElementById("botonA");


    const botonB =
        document.getElementById("botonB");


    botonA.classList.remove(
        "correcta",
        "incorrecta"
    );


    botonB.classList.remove(
        "correcta",
        "incorrecta"
    );


    botonA.classList.remove(
        "desactivada"
    );


    botonB.classList.remove(
        "desactivada"
    );


    botonA.setAttribute(
        "tabindex",
        "0"
    );


    botonB.setAttribute(
        "tabindex",
        "0"
    );


    document.getElementById(
        "resultado"
    ).style.display =
        "none";

}


// ======================================================
// COMPROBAR RESPUESTA
// ======================================================

function comprobarRespuestaPartidos(
    respuesta
) {

    if (respuestaBloqueadaPartidosMundial) {

        return;

    }


    respuestaBloqueadaPartidosMundial = true;


    const partidosA =
        jugadorAPartidosMundial.partidos;


    const partidosB =
        jugadorBPartidosMundial.partidos;


    const ganador =
        partidosA > partidosB
            ? "A"
            : "B";


    // ==================================================
    // MOSTRAR PARTIDOS
    // ==================================================

    document.getElementById(
        "partidosJugadorA"
    ).textContent =
        `${partidosA} partidos`;


    document.getElementById(
        "partidosJugadorB"
    ).textContent =
        `${partidosB} partidos`;


    // ==================================================
    // CORRECTO
    // ==================================================

    if (respuesta === ganador) {

        puntuacionPartidosMundial++;


        guardarRachaPartidos();


        document
            .getElementById(
                `boton${respuesta}`
            )
            .classList.add(
                "correcta"
            );


        window.mostrarNotificacionJuego("¡Correcto!", true);


        document.getElementById(
            "botonSiguiente"
        ).textContent =
            "Siguiente ronda";

    }


    // ==================================================
    // INCORRECTO
    // ==================================================

    else {

        puntuacionPartidosMundial = 0;


        guardarRachaPartidos();


        document
            .getElementById(
                `boton${respuesta}`
            )
            .classList.add(
                "incorrecta"
            );


        document
            .getElementById(
                `boton${ganador}`
            )
            .classList.add(
                "correcta"
            );


        window.mostrarNotificacionJuego("¡Fallaste!", false);


        document.getElementById(
            "botonSiguiente"
        ).textContent =
            "Volver a jugar";

    }


    actualizarPuntuacionPartidos();


    desactivarTarjetasPartidos();


    document.getElementById(
        "resultado"
    ).style.display =
        "block";

}


// ======================================================
// GUARDAR RACHA
// ======================================================

function guardarRachaPartidos() {

    localStorage.setItem(
        CLAVE_RACHA_PARTIDOS_MUNDIAL,
        puntuacionPartidosMundial
    );


    const mejorRachaActual =
        Number(
            localStorage.getItem(
                CLAVE_MEJOR_RACHA_PARTIDOS_MUNDIAL
            )
        ) || 0;


    if (
        puntuacionPartidosMundial >
        mejorRachaActual
    ) {

        localStorage.setItem(
            CLAVE_MEJOR_RACHA_PARTIDOS_MUNDIAL,
            puntuacionPartidosMundial
        );

    }

}


// ======================================================
// DESACTIVAR TARJETAS
// ======================================================

function desactivarTarjetasPartidos() {

    const botonA =
        document.getElementById(
            "botonA"
        );


    const botonB =
        document.getElementById(
            "botonB"
        );


    botonA.classList.add(
        "desactivada"
    );


    botonB.classList.add(
        "desactivada"
    );


    botonA.setAttribute(
        "tabindex",
        "-1"
    );


    botonB.setAttribute(
        "tabindex",
        "-1"
    );

}


// ======================================================
// ACTUALIZAR PUNTUACIÓN
// ======================================================

function actualizarPuntuacionPartidos() {

    const elemento =
        document.getElementById(
            "puntuacion"
        );


    if (elemento) {

        elemento.textContent =
            puntuacionPartidosMundial;

    }

}