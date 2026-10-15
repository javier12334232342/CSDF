(() => {

const CLAVE_RACHA_MUNDIAL =
    "racha-quien-marco-mas-mundial";

const CLAVE_MEJOR_RACHA_MUNDIAL =
    "mejor-racha-quien-marco-mas-mundial";


let datosGoleadoresMundial = [];
let datosJugadores = [];

jugadorA = null;
jugadorB = null;

let todosLosJugadoresMundial = [];

puntuacion = 0;
preguntaActual = 0;
respuestaBloqueada = false;


// ======================================================
// INICIAR JUEGO
// ======================================================

async function iniciarQuienMarcoMasMundial() {

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
                    <img src="img/iconos/rayo.png" alt="" aria-hidden="true">
                </div>

            </div>


            <div class="pregunta">

                <h2>
                    ¿Quién marcó más goles?
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
                        id="golesJugadorA"
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
                        id="golesJugadorB"
                        class="goles-jugador"
                    ></div>

                </div>

            </div>


            <div
                id="resultado"
                class="resultado"
                style="display: none;"
            >

                <h3 id="tituloResultado"></h3>

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

        comprobarRespuesta("A");

    });


    // ==================================================
    // RESPUESTA B
    // ==================================================

    botonB.addEventListener("click", () => {

        comprobarRespuesta("B");

    });


    // ==================================================
    // SIGUIENTE RONDA
    // ==================================================

    botonSiguiente.addEventListener("click", () => {

        if (puntuacion === 0) {

            iniciarQuienMarcoMasMundial();

        } else {

            generarPregunta();

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

            comprobarRespuesta("A");

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

            comprobarRespuesta("B");

        }

    });


    // ==================================================
    // CARGAR DATOS
    // ==================================================

    try {

        const [
            respuestaGoleadores,
            respuestaJugadores
        ] = await Promise.all([

            fetch(
                "datos/estadisticasMundiales.json"
            ),

            fetch(
                "datos/jugadores.json"
            )

        ]);


        if (!respuestaGoleadores.ok) {

            throw new Error(
                "No se pudo cargar estadisticasMundiales.json"
            );

        }


        if (!respuestaJugadores.ok) {

            throw new Error(
                "No se pudo cargar jugadores.json"
            );

        }


        datosGoleadoresMundial =
            await respuestaGoleadores.json();


        datosJugadores =
            await respuestaJugadores.json();


        if (!Array.isArray(datosGoleadoresMundial)) {

            throw new Error(
                "estadisticasMundiales.json no contiene un array"
            );

        }


        if (!Array.isArray(datosJugadores)) {

            throw new Error(
                "jugadores.json no contiene un array"
            );

        }


        todosLosJugadoresMundial =
            construirListaJugadoresMundial();


        if (
            todosLosJugadoresMundial.length < 2
        ) {

            throw new Error(
                "No hay suficientes jugadores para iniciar el juego"
            );

        }


        // ==================================================
        // CARGAR RACHA
        // ==================================================

        puntuacion =
            Number(
                localStorage.getItem(
                    CLAVE_RACHA_MUNDIAL
                )
            ) || 0;


        preguntaActual = 0;


        actualizarPuntuacion();


        generarPregunta();

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

function construirListaJugadoresMundial() {

    const lista = [];


    datosGoleadoresMundial
        .filter(datosGoleador => datosGoleador.goles > 0)
        .forEach(
        datosGoleador => {

            const jugador =
                obtenerDatosJugador(
                    datosGoleador
                );


            if (!jugador) {

                return;

            }


            lista.push({

                id: jugador.id,

                nombre: jugador.nombre,

                imagen: jugador.imagen,

                goles: datosGoleador.goles

            });

        }
    );


    return lista;

}


// ======================================================
// GENERAR PREGUNTA
// ======================================================

function generarPregunta() {

    respuestaBloqueada = false;

    preguntaActual++;


    if (
        todosLosJugadoresMundial.length < 2
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
                todosLosJugadoresMundial.length
            );


        indiceB =
            Math.floor(
                Math.random() *
                todosLosJugadoresMundial.length
            );


        intentos++;

    }

    while (

        (

            // No puede ser el mismo registro
            indiceA === indiceB ||


            // No enfrentamos al mismo jugador
            todosLosJugadoresMundial[indiceA].id ===
            todosLosJugadoresMundial[indiceB].id ||


            // No puede haber empate
            todosLosJugadoresMundial[indiceA].goles ===
            todosLosJugadoresMundial[indiceB].goles

        )

        &&

        intentos < maxIntentos

    );


    if (

        indiceA === indiceB ||

        todosLosJugadoresMundial[indiceA].id ===
        todosLosJugadoresMundial[indiceB].id ||

        todosLosJugadoresMundial[indiceA].goles ===
        todosLosJugadoresMundial[indiceB].goles

    ) {

        console.error(
            "No se pudo encontrar una combinación válida."
        );

        return;

    }


    jugadorA =
        todosLosJugadoresMundial[indiceA];


    jugadorB =
        todosLosJugadoresMundial[indiceB];


    mostrarPregunta();

}


// ======================================================
// OBTENER DATOS DEL JUGADOR
// ======================================================

function obtenerDatosJugador(
    datosGoleador
) {

    const jugador =
        datosJugadores.find(
            jugador =>
                jugador.id ===
                datosGoleador.idJugador
        );


    if (!jugador) {

        console.error(
            `No existe "${datosGoleador.idJugador}" en jugadores.json`
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

function mostrarPregunta() {

    document.getElementById(
        "nombreJugadorA"
    ).textContent =
        jugadorA.nombre;


    document.getElementById(
        "nombreJugadorB"
    ).textContent =
        jugadorB.nombre;


    const imagenA =
        document.getElementById(
            "imagenJugadorA"
        );


    const imagenB =
        document.getElementById(
            "imagenJugadorB"
        );


    imagenA.src =
        jugadorA.imagen;


    imagenA.alt =
        jugadorA.nombre;


    imagenB.src =
        jugadorB.imagen;


    imagenB.alt =
        jugadorB.nombre;


    document.getElementById(
        "golesJugadorA"
    ).textContent =
        "?";


    document.getElementById(
        "golesJugadorB"
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

function comprobarRespuesta(
    respuesta
) {

    if (respuestaBloqueada) {

        return;

    }


    respuestaBloqueada = true;


    const golesA =
        jugadorA.goles;


    const golesB =
        jugadorB.goles;


    const ganador =
        golesA > golesB
            ? "A"
            : "B";


    // ==================================================
    // MOSTRAR GOLES
    // ==================================================

    document.getElementById(
        "golesJugadorA"
    ).textContent =
        `${golesA} goles`;


    document.getElementById(
        "golesJugadorB"
    ).textContent =
        `${golesB} goles`;


    // ==================================================
    // CORRECTO
    // ==================================================

    if (respuesta === ganador) {

        puntuacion++;


        guardarRacha();


        document
            .getElementById(
                `boton${respuesta}`
            )
            .classList.add(
                "correcta"
            );


        document.getElementById(
            "tituloResultado"
        ).textContent =
            "¡Correcto!";


        document.getElementById(
            "botonSiguiente"
        ).textContent =
            "Siguiente ronda";

    }


    // ==================================================
    // INCORRECTO
    // ==================================================

    else {

        puntuacion = 0;


        guardarRacha();


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


        document.getElementById(
            "tituloResultado"
        ).textContent =
            "¡Fallaste!";


        document.getElementById(
            "botonSiguiente"
        ).textContent =
            "Volver a jugar";

    }


    actualizarPuntuacion();


    desactivarTarjetas();


    document.getElementById(
        "resultado"
    ).style.display =
        "block";

}


// ======================================================
// GUARDAR RACHA
// ======================================================

function guardarRacha() {

    localStorage.setItem(
        CLAVE_RACHA_MUNDIAL,
        puntuacion
    );


    const mejorRachaActual =
        Number(
            localStorage.getItem(
                CLAVE_MEJOR_RACHA_MUNDIAL
            )
        ) || 0;


    if (
        puntuacion >
        mejorRachaActual
    ) {

        localStorage.setItem(
            CLAVE_MEJOR_RACHA_MUNDIAL,
            puntuacion
        );

    }

}


// ======================================================
// DESACTIVAR TARJETAS
// ======================================================

function desactivarTarjetas() {

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

function actualizarPuntuacion() {

    const elemento =
        document.getElementById(
            "puntuacion"
        );


    if (elemento) {

        elemento.textContent =
            puntuacion;

    }

}

window.iniciarQuienMarcoMasMundial =
    iniciarQuienMarcoMasMundial;

})();