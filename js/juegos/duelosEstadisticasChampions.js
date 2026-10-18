(() => {
    const ARCHIVO_ESTADISTICAS = "datos/estadisticasChampionsHistoricos.json";

    function iniciarDueloEstadisticas(configuracion) {
        const zonaJuego = document.getElementById("zona-juego");

        if (!zonaJuego) {
            console.error("No se encontró #zona-juego");
            return;
        }

        const prefijo = configuracion.id;
        const claveRacha = `racha-${prefijo}`;
        const claveMejorRacha = `mejor-racha-${prefijo}`;
        let jugadores = [];
        let jugadorA;
        let jugadorB;
        let puntuacion = 0;
        let respuestaBloqueada = false;

        zonaJuego.innerHTML = `
            <div class="juego-goleadores-champions">
                <div class="cabecera-partida">
                    <div class="racha-actual">
                        <span id="${prefijo}-puntuacion">0</span>
                        <img src="/img/iconos/rayo.png" alt="" aria-hidden="true">
                    </div>
                </div>
                <div class="pregunta">
                    <h2>${configuracion.pregunta}</h2>
                </div>
                <div class="jugadores">
                    <div id="${prefijo}-opcion-a" class="tarjeta-jugador" role="button" tabindex="0">
                        <h3 id="${prefijo}-nombre-a"></h3>
                        <img id="${prefijo}-imagen-a" class="imagen-jugador" src="" alt="">
                        <div id="${prefijo}-valor-a" class="goles-jugador">?</div>
                    </div>
                    <div class="vs">VS</div>
                    <div id="${prefijo}-opcion-b" class="tarjeta-jugador" role="button" tabindex="0">
                        <h3 id="${prefijo}-nombre-b"></h3>
                        <img id="${prefijo}-imagen-b" class="imagen-jugador" src="" alt="">
                        <div id="${prefijo}-valor-b" class="goles-jugador">?</div>
                    </div>
                </div>
                <div id="${prefijo}-resultado" class="resultado" style="display: none;" aria-live="polite">
                    <button id="${prefijo}-siguiente" class="boton-siguiente" type="button">
                        Siguiente ronda
                    </button>
                </div>
            </div>
        `;

        const botonA = document.getElementById(`${prefijo}-opcion-a`);
        const botonB = document.getElementById(`${prefijo}-opcion-b`);
        const botonSiguiente = document.getElementById(`${prefijo}-siguiente`);

        botonA.addEventListener("click", () => comprobarRespuesta("a"));
        botonB.addEventListener("click", () => comprobarRespuesta("b"));
        [botonA, botonB].forEach((boton, indice) => {
            boton.addEventListener("keydown", evento => {
                if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    comprobarRespuesta(indice === 0 ? "a" : "b");
                }
            });
        });
        botonSiguiente.addEventListener("click", () => {
            if (puntuacion === 0) {
                iniciarDueloEstadisticas(configuracion);
            } else {
                generarPregunta();
            }
        });

        cargarDatos();

        async function cargarDatos() {
            try {
                const [respuestaEstadisticas, respuestaJugadores] = await Promise.all([
                    fetch(configuracion.archivoEstadisticas || ARCHIVO_ESTADISTICAS),
                    fetch("datos/jugadores.json")
                ]);

                if (!respuestaEstadisticas.ok) {
                    throw new Error(
                        `No se pudo cargar ${configuracion.archivoEstadisticas || ARCHIVO_ESTADISTICAS}`
                    );
                }
                if (!respuestaJugadores.ok) {
                    throw new Error("No se pudo cargar datos/jugadores.json");
                }

                const [estadisticas, datosJugadores] = await Promise.all([
                    respuestaEstadisticas.json(),
                    respuestaJugadores.json()
                ]);

                if (!Array.isArray(estadisticas) || !Array.isArray(datosJugadores)) {
                    throw new Error("Los archivos de datos no contienen arrays");
                }

                const jugadoresPorId = new Map(
                    datosJugadores.map(jugador => [jugador.id, jugador])
                );
                const registrosValidos = estadisticas.filter(registro =>
                    registro[configuracion.estadistica] !== undefined
                );

                if (registrosValidos.some(registro =>
                    typeof registro.idJugador !== "string" ||
                    !Number.isInteger(registro[configuracion.estadistica]) ||
                    registro[configuracion.estadistica] < 0
                )) {
                    throw new Error(
                        `${configuracion.archivoEstadisticas || ARCHIVO_ESTADISTICAS} contiene valores de ${configuracion.nombreEstadistica} inválidos`
                    );
                }

                jugadores = registrosValidos.map(registro => {
                    const jugador = jugadoresPorId.get(registro.idJugador);

                    if (!jugador) {
                        throw new Error(
                            `No existe "${registro.idJugador}" en datos/jugadores.json`
                        );
                    }

                    return {
                        id: jugador.id,
                        nombre: jugador.nombre,
                        imagen: jugador.imagen,
                        valor: registro[configuracion.estadistica]
                    };
                });

                if (jugadores.length < 2) {
                    throw new Error(
                        `No hay suficientes jugadores con datos de ${configuracion.nombreEstadistica}`
                    );
                }

                puntuacion = Number(localStorage.getItem(claveRacha)) || 0;
                actualizarPuntuacion();
                generarPregunta();
            } catch (error) {
                console.error("Error cargando los datos del juego:", error);
                zonaJuego.innerHTML = `
                    <div class="error-juego">
                        <h2>Error al cargar el juego</h2>
                        <p>No se han podido cargar las estadísticas de los jugadores.</p>
                    </div>
                `;
            }
        }

        function generarPregunta() {
            respuestaBloqueada = false;
            const parejasValidas = [];

            for (let indiceA = 0; indiceA < jugadores.length; indiceA++) {
                for (let indiceB = indiceA + 1; indiceB < jugadores.length; indiceB++) {
                    if (jugadores[indiceA].valor !== jugadores[indiceB].valor) {
                        parejasValidas.push([jugadores[indiceA], jugadores[indiceB]]);
                    }
                }
            }

            if (parejasValidas.length === 0) {
                console.error("No se encontró una pareja de jugadores con valores distintos.");
                zonaJuego.innerHTML = `
                    <div class="error-juego">
                        <h2>No hay suficientes datos distintos</h2>
                        <p>No se puede generar una ronda con estas estadísticas.</p>
                    </div>
                `;
                return;
            }

            [jugadorA, jugadorB] =
                parejasValidas[Math.floor(Math.random() * parejasValidas.length)];

            mostrarJugador("a", jugadorA);
            mostrarJugador("b", jugadorB);
            [botonA, botonB].forEach(boton => {
                boton.classList.remove("correcta", "incorrecta", "desactivada");
                boton.setAttribute("tabindex", "0");
            });
            botonSiguiente.textContent = "Siguiente ronda";
            document.getElementById(`${prefijo}-resultado`).style.display = "none";
        }

        function mostrarJugador(lado, jugador) {
            document.getElementById(`${prefijo}-nombre-${lado}`).textContent = jugador.nombre;
            document.getElementById(`${prefijo}-valor-${lado}`).textContent = "?";

            const imagen = document.getElementById(`${prefijo}-imagen-${lado}`);
            imagen.src = `/${jugador.imagen.replace(/^\/+/, "")}`;
            imagen.alt = jugador.nombre;
        }

        function comprobarRespuesta(respuesta) {
            if (respuestaBloqueada) {
                return;
            }

            respuestaBloqueada = true;
            const ganador = jugadorA.valor > jugadorB.valor ? "a" : "b";

            document.getElementById(`${prefijo}-valor-a`).textContent =
                `${jugadorA.valor} ${configuracion.unidad}`;
            document.getElementById(`${prefijo}-valor-b`).textContent =
                `${jugadorB.valor} ${configuracion.unidad}`;

            if (respuesta === ganador) {
                puntuacion++;
                document.getElementById(`${prefijo}-opcion-${respuesta}`)
                    .classList.add("correcta");
                window.mostrarNotificacionJuego("¡Correcto!", true);
            } else {
                puntuacion = 0;
                document.getElementById(`${prefijo}-opcion-${respuesta}`)
                    .classList.add("incorrecta");
                document.getElementById(`${prefijo}-opcion-${ganador}`)
                    .classList.add("correcta");
                window.mostrarNotificacionJuego("¡Fallaste!", false);
                botonSiguiente.textContent = "Volver a jugar";
            }

            guardarRacha();
            actualizarPuntuacion();
            [botonA, botonB].forEach(boton => {
                boton.classList.add("desactivada");
                boton.setAttribute("tabindex", "-1");
            });
            document.getElementById(`${prefijo}-resultado`).style.display = "block";
        }

        function guardarRacha() {
            localStorage.setItem(claveRacha, puntuacion);

            const mejorRacha = Number(localStorage.getItem(claveMejorRacha)) || 0;
            if (puntuacion > mejorRacha) {
                localStorage.setItem(claveMejorRacha, puntuacion);
            }
        }

        function actualizarPuntuacion() {
            document.getElementById(`${prefijo}-puntuacion`).textContent = puntuacion;
        }
    }

    window.iniciarQuienJugoMasChampions = () => iniciarDueloEstadisticas({
        id: "quien-jugo-mas-champions",
        estadistica: "partidos",
        nombreEstadistica: "partidos",
        unidad: "partidos",
        pregunta: "¿Quién disputó más partidos?"
    });

    window.iniciarQuienDioMasAsistenciasChampions = () => iniciarDueloEstadisticas({
        id: "quien-dio-mas-asistencias-champions",
        estadistica: "asistencias",
        nombreEstadistica: "asistencias",
        unidad: "asistencias",
        pregunta: "¿Quién dio más asistencias?"
    });

    const ARCHIVO_ESTADISTICAS_SELECCIONES = "datos/estadisticasSelecciones.json";

    window.iniciarQuienJugoMasSelecciones = () => iniciarDueloEstadisticas({
        id: "quien-jugo-mas-selecciones",
        archivoEstadisticas: ARCHIVO_ESTADISTICAS_SELECCIONES,
        estadistica: "partidos",
        nombreEstadistica: "partidos oficiales",
        unidad: "partidos",
        pregunta: "¿Quién disputó más partidos oficiales con su selección?"
    });

    window.iniciarQuienMarcoMasSelecciones = () => iniciarDueloEstadisticas({
        id: "quien-marco-mas-selecciones",
        archivoEstadisticas: ARCHIVO_ESTADISTICAS_SELECCIONES,
        estadistica: "goles",
        nombreEstadistica: "goles",
        unidad: "goles",
        pregunta: "¿Quién marcó más goles oficiales con su selección?"
    });
})();
