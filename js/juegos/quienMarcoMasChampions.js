(() => {

const CLAVE_RACHA = "racha-quien-marco-mas-champions";
const CLAVE_MEJOR_RACHA = "mejor-racha-quien-marco-mas-champions";

let datosGoleadoresChampions = [];
let datosJugadores = [];

let jugadorA = null;
let jugadorB = null;

let todosLosJugadoresChampions = [];

let puntuacion = 0;
let preguntaActual = 0;
let respuestaBloqueada = false;


// ======================================================
// INICIAR JUEGO
// ======================================================

async function iniciarPartidaQuienMarcoMasChampions() {

    const zonaJuego = document.getElementById("zona-juego");

    if (!zonaJuego) {
        console.error("No se encontró #zona-juego");
        return;
    }

    zonaJuego.innerHTML = `
        <div class="juego-goleadores-champions">

            <div class="cabecera-partida">

                <div class="puntuacion">
                    <span id="puntuacion">0</span> 🔥 
                </div>

            </div>


            <div class="pregunta">
                <h2>¿Quién marcó más goles?</h2>
            </div>


            <div class="jugadores">

                <div
                    id="botonA"
                    class="tarjeta-jugador"
                    role="button"
                    tabindex="0"
                >
                     <h3 id="nombreJugadorA"></h3>

                    <div
                        id="temporadaJugadorA"
                        class="temporada-jugador"
                    ></div>
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

                    <div
                        id="temporadaJugadorB"
                        class="temporada-jugador"
                    ></div>
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


    botonA.addEventListener("click", () => {
        comprobarRespuesta("A");
    });


    botonB.addEventListener("click", () => {
        comprobarRespuesta("B");
    });


    // ==================================================
    // SIGUIENTE RONDA
    // ==================================================

    botonSiguiente.addEventListener("click", () => {

        if (puntuacion === 0) {

            iniciarPartidaQuienMarcoMasChampions();

        } else {

            generarPregunta();

        }

    });


    botonA.addEventListener("keydown", (evento) => {

        if (
            evento.key === "Enter" ||
            evento.key === " "
        ) {

            evento.preventDefault();

            comprobarRespuesta("A");
        }

    });


    botonB.addEventListener("keydown", (evento) => {

        if (
            evento.key === "Enter" ||
            evento.key === " "
        ) {

            evento.preventDefault();

            comprobarRespuesta("B");
        }

    });


    try {

        const [
            respuestaGoleadores,
            respuestaJugadores
        ] = await Promise.all([

            fetch("datos/golesChampionsTemporadas.json"),

            fetch("datos/jugadores.json")

        ]);


        if (!respuestaGoleadores.ok) {

            throw new Error(
                "No se pudo cargar golesChampionsTemporadas.json"
            );

        }


        if (!respuestaJugadores.ok) {

            throw new Error(
                "No se pudo cargar jugadores.json"
            );

        }


        datosGoleadoresChampions =
            await respuestaGoleadores.json();


        datosJugadores =
            await respuestaJugadores.json();


        if (!Array.isArray(datosGoleadoresChampions)) {

            throw new Error(
                "golesChampionsTemporadas.json no contiene un array"
            );

        }


        if (!Array.isArray(datosJugadores)) {

            throw new Error(
                "jugadores.json no contiene un array"
            );

        }


        todosLosJugadoresChampions =
            construirListaJugadoresChampions();


        if (todosLosJugadoresChampions.length < 2) {

            throw new Error(
                "No hay suficientes jugadores para iniciar el juego"
            );

        }


        puntuacion =
            Number(
                localStorage.getItem(CLAVE_RACHA)
            ) || 0;


        preguntaActual = 0;


        actualizarPuntuacion();


        generarPregunta();


    } catch (error) {

        console.error(
            "Error cargando los datos del juego:",
            error
        );


        zonaJuego.innerHTML = `
            <div class="error-juego">

                <h2>Error al cargar el juego</h2>

                <p>
                    No se han podido cargar los datos
                    de los jugadores.
                </p>

            </div>
        `;

    }

}


// ======================================================
// CONSTRUIR LISTA COMPLETA DE JUGADORES
// ======================================================

function construirListaJugadoresChampions() {

    const lista = [];


    datosGoleadoresChampions.forEach(temporada => {

        if (
            !temporada.jugadores ||
            !Array.isArray(temporada.jugadores)
        ) {

            return;

        }


        temporada.jugadores.forEach(datosGoleador => {

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

                goles: datosGoleador.goles,

                temporada: temporada.temporada

            });

        });

    });


    return lista;

}


// ======================================================
// GENERAR PREGUNTA
// ======================================================

function generarPregunta() {

    respuestaBloqueada = false;

    preguntaActual++;


    if (todosLosJugadoresChampions.length < 2) {

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
                todosLosJugadoresChampions.length
            );


        indiceB =
            Math.floor(
                Math.random() *
                todosLosJugadoresChampions.length
            );


        intentos++;


    } while (

        (

            // No puede ser el mismo registro
            indiceA === indiceB ||


            // No enfrentamos al mismo jugador
            todosLosJugadoresChampions[indiceA].id ===
            todosLosJugadoresChampions[indiceB].id ||


            // No puede haber empate en goles
            todosLosJugadoresChampions[indiceA].goles ===
            todosLosJugadoresChampions[indiceB].goles

        ) &&

        intentos < maxIntentos

    );


    if (

        indiceA === indiceB ||

        todosLosJugadoresChampions[indiceA].id ===
        todosLosJugadoresChampions[indiceB].id ||

        todosLosJugadoresChampions[indiceA].goles ===
        todosLosJugadoresChampions[indiceB].goles

    ) {

        console.error(
            "No se pudo encontrar una combinación válida."
        );

        return;

    }


    jugadorA =
        todosLosJugadoresChampions[indiceA];


    jugadorB =
        todosLosJugadoresChampions[indiceB];


    mostrarPregunta();

}


// ======================================================
// OBTENER DATOS DEL JUGADOR
// ======================================================

function obtenerDatosJugador(datosGoleador) {

    const jugador =
        datosJugadores.find(
            jugador =>
                jugador.id === datosGoleador.idJugador
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

        imagen: jugador.imagen,

        goles: datosGoleador.goles

    };

}


// ======================================================
// MOSTRAR PREGUNTA
// ======================================================

function mostrarPregunta() {

    document.getElementById("temporadaJugadorA").textContent =
        jugadorA.temporada;


    document.getElementById("temporadaJugadorB").textContent =
        jugadorB.temporada;


    document.getElementById("nombreJugadorA").textContent =
        jugadorA.nombre;


    document.getElementById("nombreJugadorB").textContent =
        jugadorB.nombre;


    const imagenA =
        document.getElementById("imagenJugadorA");


    const imagenB =
        document.getElementById("imagenJugadorB");


    imagenA.src =
        jugadorA.imagen;


    imagenA.alt =
        jugadorA.nombre;


    imagenB.src =
        jugadorB.imagen;


    imagenB.alt =
        jugadorB.nombre;


    document.getElementById("golesJugadorA").textContent =
        "?";


    document.getElementById("golesJugadorB").textContent =
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


    botonA.classList.remove("desactivada");

    botonB.classList.remove("desactivada");


    botonA.setAttribute("tabindex", "0");

    botonB.setAttribute("tabindex", "0");


    document.getElementById("resultado").style.display =
        "none";

}


// ======================================================
// COMPROBAR RESPUESTA
// ======================================================

function comprobarRespuesta(respuesta) {

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


    document.getElementById("golesJugadorA").textContent =
        golesA;


    document.getElementById("golesJugadorB").textContent =
        golesB;


    // ==================================================
    // CORRECTO
    // ==================================================

    if (respuesta === ganador) {

        puntuacion++;


        guardarRacha();


        document
            .getElementById(`boton${respuesta}`)
            .classList.add("correcta");


        document.getElementById("tituloResultado").textContent =
            "¡Correcto!";


        document.getElementById("botonSiguiente").textContent =
            "Siguiente ronda";

    }


    // ==================================================
    // INCORRECTO
    // ==================================================

    else {

        puntuacion = 0;


        guardarRacha();


        document
            .getElementById(`boton${respuesta}`)
            .classList.add("incorrecta");


        document
            .getElementById(`boton${ganador}`)
            .classList.add("correcta");


        document.getElementById("tituloResultado").textContent =
            "¡Fallaste!";


        document.getElementById("botonSiguiente").textContent =
            "Volver a jugar";

    }


    actualizarPuntuacion();


    desactivarTarjetas();


    document.getElementById("resultado").style.display =
        "block";

}


// ======================================================
// GUARDAR RACHA
// ======================================================

function guardarRacha() {

    localStorage.setItem(
        CLAVE_RACHA,
        puntuacion
    );


    const mejorRachaActual =
        Number(
            localStorage.getItem(CLAVE_MEJOR_RACHA)
        ) || 0;


    if (puntuacion > mejorRachaActual) {

        localStorage.setItem(
            CLAVE_MEJOR_RACHA,
            puntuacion
        );

    }

}


// ======================================================
// DESACTIVAR TARJETAS
// ======================================================

function desactivarTarjetas() {

    const botonA =
        document.getElementById("botonA");


    const botonB =
        document.getElementById("botonB");


    botonA.classList.add("desactivada");

    botonB.classList.add("desactivada");


    botonA.setAttribute("tabindex", "-1");

    botonB.setAttribute("tabindex", "-1");

}


// ======================================================
// ACTUALIZAR PUNTUACIÓN
// ======================================================

function actualizarPuntuacion() {

    const elemento =
        document.getElementById("puntuacion");


    if (elemento) {

        elemento.textContent =
            puntuacion;

    }

}
window.iniciarQuienMarcoMasChampions =
    iniciarPartidaQuienMarcoMasChampions;

})();
