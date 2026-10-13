(() => {

    const CLAVE_RACHA =
        "racha-quien-marco-mas-champions-historico";

    const CLAVE_MEJOR_RACHA =
        "mejor-racha-quien-marco-mas-champions-historico";

    let jugadores = [];
    let jugadorA = null;
    let jugadorB = null;
    let puntuacion = 0;
    let respuestaBloqueada = false;


    // ======================================================
    // INICIAR O REINICIAR PARTIDA
    // ======================================================

    async function iniciarPartidaQuienMarcoMasChampionsHistorico() {

        const zonaJuego =
            document.getElementById("zona-juego");

        if (!zonaJuego) {
            console.error("No se encontró #zona-juego");
            return;
        }

        zonaJuego.innerHTML = `
            <div class="juego-goleadores-champions">

                <div class="cabecera-partida">
                    <div class="puntuacion">
                        <span id="puntuacionChampionsHistorico">0</span> 🔥
                    </div>
                </div>

                <div class="pregunta">
                    <h2>¿Quién marcó más goles?</h2>
                </div>

                <div class="jugadores">

                    <div
                        id="botonChampionsHistoricoA"
                        class="tarjeta-jugador"
                        role="button"
                        tabindex="0"
                    >
                    <h3 id="nombreChampionsHistoricoA"></h3>
                        <img
                            id="imagenChampionsHistoricoA"
                            class="imagen-jugador"
                            src=""
                            alt=""
                        >
                       
                        <div id="golesChampionsHistoricoA" class="goles-jugador">?</div>
                    </div>

                    <div class="vs">VS</div>

                    <div
                        id="botonChampionsHistoricoB"
                        class="tarjeta-jugador"
                        role="button"
                        tabindex="0"
                    >
                    <h3 id="nombreChampionsHistoricoB"></h3>
                        <img
                            id="imagenChampionsHistoricoB"
                            class="imagen-jugador"
                            src=""
                            alt=""
                        >
                        
                        <div id="golesChampionsHistoricoB" class="goles-jugador">?</div>
                    </div>

                </div>

                <div
                    id="resultadoChampionsHistorico"
                    class="resultado"
                    style="display: none;"
                >
                    <h3 id="tituloResultadoChampionsHistorico"></h3>
                    <button
                        id="siguienteChampionsHistorico"
                        class="boton-siguiente"
                    >
                        Siguiente ronda
                    </button>
                </div>

            </div>
        `;

        const botonA = document.getElementById(
            "botonChampionsHistoricoA"
        );

        const botonB = document.getElementById(
            "botonChampionsHistoricoB"
        );

        botonA.addEventListener("click", () => comprobarRespuesta("A"));
        botonB.addEventListener("click", () => comprobarRespuesta("B"));

        [botonA, botonB].forEach((boton, indice) => {

            boton.addEventListener("keydown", evento => {

                if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    comprobarRespuesta(indice === 0 ? "A" : "B");
                }

            });

        });

        document
            .getElementById("siguienteChampionsHistorico")
            .addEventListener("click", () => {

                if (puntuacion === 0) {
                    iniciarPartidaQuienMarcoMasChampionsHistorico();
                } else {
                    generarPregunta();
                }

            });

        try {

            const [respuestaGoles, respuestaJugadores] =
                await Promise.all([
                    fetch("datos/golesChampionsHistoricos.json"),
                    fetch("datos/jugadores.json")
                ]);

            if (!respuestaGoles.ok) {
                throw new Error(
                    "No se pudo cargar golesChampionsHistoricos.json"
                );
            }

            if (!respuestaJugadores.ok) {
                throw new Error(
                    "No se pudo cargar jugadores.json"
                );
            }

            const [datosGoles, datosJugadores] =
                await Promise.all([
                    respuestaGoles.json(),
                    respuestaJugadores.json()
                ]);

            if (
                !Array.isArray(datosGoles) ||
                !Array.isArray(datosJugadores)
            ) {
                throw new Error(
                    "Los archivos de datos no contienen arrays"
                );
            }

            if (datosGoles.some(datos =>
                typeof datos.idJugador !== "string" ||
                !Number.isInteger(datos.goles) ||
                datos.goles < 0
            )) {
                throw new Error(
                    "golesChampionsHistoricos.json contiene estadísticas inválidas"
                );
            }

            jugadores = datosGoles
                .filter(datos => datos.goles > 0)
                .map(datos => {

                    const jugador = datosJugadores.find(
                        item => item.id === datos.idJugador
                    );

                    if (!jugador) {
                        throw new Error(
                            `No existe "${datos.idJugador}" en jugadores.json`
                        );
                    }

                    return {
                        id: jugador.id,
                        nombre: jugador.nombre,
                        imagen: jugador.imagen,
                        goles: datos.goles
                    };

                });

            if (jugadores.length < 2) {
                throw new Error(
                    "No hay suficientes jugadores para iniciar el juego"
                );
            }

            puntuacion =
                Number(localStorage.getItem(CLAVE_RACHA)) || 0;

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
                        No se han podido cargar los datos de los jugadores.
                    </p>
                </div>
            `;

        }
    }


    // ======================================================
    // GENERAR PREGUNTA
    // ======================================================

    function generarPregunta() {

        respuestaBloqueada = false;

        let intentos = 0;

        do {

            jugadorA =
                jugadores[Math.floor(Math.random() * jugadores.length)];

            jugadorB =
                jugadores[Math.floor(Math.random() * jugadores.length)];

            intentos++;

        } while (
            (
                jugadorA.id === jugadorB.id ||
                jugadorA.goles === jugadorB.goles
            ) &&
            intentos < 100
        );

        if (
            jugadorA.id === jugadorB.id ||
            jugadorA.goles === jugadorB.goles
        ) {
            console.error(
                "No se pudo encontrar una combinación válida."
            );
            return;
        }

        mostrarJugador("A", jugadorA);
        mostrarJugador("B", jugadorB);

        ["A", "B"].forEach(lado => {

            const boton = document.getElementById(
                `botonChampionsHistorico${lado}`
            );

            boton.classList.remove(
                "correcta",
                "incorrecta",
                "desactivada"
            );

            boton.setAttribute("tabindex", "0");

        });

        document.getElementById(
            "siguienteChampionsHistorico"
        ).textContent = "Siguiente ronda";

        document.getElementById(
            "resultadoChampionsHistorico"
        ).style.display = "none";
    }


    // ======================================================
    // MOSTRAR JUGADOR
    // ======================================================

    function mostrarJugador(lado, jugador) {

        document.getElementById(
            `nombreChampionsHistorico${lado}`
        ).textContent = jugador.nombre;

        document.getElementById(
            `golesChampionsHistorico${lado}`
        ).textContent = "?";

        const imagen = document.getElementById(
            `imagenChampionsHistorico${lado}`
        );

        imagen.src = jugador.imagen;
        imagen.alt = jugador.nombre;
    }


    // ======================================================
    // COMPROBAR RESPUESTA
    // ======================================================

    function comprobarRespuesta(respuesta) {

        if (respuestaBloqueada) {
            return;
        }

        respuestaBloqueada = true;

        const ganador =
            jugadorA.goles > jugadorB.goles ? "A" : "B";

        document.getElementById(
            "golesChampionsHistoricoA"
        ).textContent = `${jugadorA.goles} goles`;

        document.getElementById(
            "golesChampionsHistoricoB"
        ).textContent = `${jugadorB.goles} goles`;

        if (respuesta === ganador) {

            puntuacion++;

            document.getElementById(
                `botonChampionsHistorico${respuesta}`
            ).classList.add("correcta");

            document.getElementById(
                "tituloResultadoChampionsHistorico"
            ).textContent = "¡Correcto!";

        } else {

            puntuacion = 0;

            document.getElementById(
                `botonChampionsHistorico${respuesta}`
            ).classList.add("incorrecta");

            document.getElementById(
                `botonChampionsHistorico${ganador}`
            ).classList.add("correcta");

            document.getElementById(
                "tituloResultadoChampionsHistorico"
            ).textContent = "¡Fallaste!";

            document.getElementById(
                "siguienteChampionsHistorico"
            ).textContent = "Volver a jugar";

        }

        guardarRacha();
        actualizarPuntuacion();

        ["A", "B"].forEach(lado => {

            const boton = document.getElementById(
                `botonChampionsHistorico${lado}`
            );

            boton.classList.add("desactivada");
            boton.setAttribute("tabindex", "-1");

        });

        document.getElementById(
            "resultadoChampionsHistorico"
        ).style.display = "block";
    }


    // ======================================================
    // GUARDAR RACHA
    // ======================================================

    function guardarRacha() {

        localStorage.setItem(CLAVE_RACHA, puntuacion);

        const mejorRacha =
            Number(localStorage.getItem(CLAVE_MEJOR_RACHA)) || 0;

        if (puntuacion > mejorRacha) {
            localStorage.setItem(CLAVE_MEJOR_RACHA, puntuacion);
        }
    }


    // ======================================================
    // ACTUALIZAR PUNTUACIÓN
    // ======================================================

    function actualizarPuntuacion() {

        const elemento = document.getElementById(
            "puntuacionChampionsHistorico"
        );

        if (elemento) {
            elemento.textContent = puntuacion;
        }
    }


    window.iniciarQuienMarcoMasChampionsHistorico =
        iniciarPartidaQuienMarcoMasChampionsHistorico;

})();