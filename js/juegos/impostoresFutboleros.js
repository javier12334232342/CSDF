(() => {
    const CLAVE_RACHA = "racha-impostores-futboleros";
    const CLAVE_MEJOR_RACHA = "mejor-racha-impostores-futboleros";

    let categorias = [];
    let jugadoresRonda = [];
    let impostoresRonda = new Set();
    let seleccionados = new Set();
    let puntuacion = 0;
    let respuestaBloqueada = false;

    async function iniciarImpostoresFutboleros() {
        const zonaJuego = document.getElementById("zona-juego");

        if (!zonaJuego) {
            console.error("No se encontró #zona-juego");
            return;
        }

        puntuacion = Number(localStorage.getItem(CLAVE_RACHA)) || 0;
        zonaJuego.innerHTML = `
            <div class="juego-impostores">
                <div class="impostores-cabecera">
                    <span>Racha: <span id="puntuacionImpostores">0</span> 🔥</span>
                </div>
                <div class="impostores-consigna">
                    <h2 id="consignaImpostores"></h2>
                </div>
                <div id="jugadoresImpostores" class="impostores-jugadores"></div>
                <div class="impostores-acciones">
                    <button id="accionImpostores" class="impostores-confirmar" type="button">
                        Confirmar selección
                    </button>
                    <p id="resultadoImpostores" class="impostores-resultado" aria-live="polite"></p>
                </div>
            </div>
        `;

        document
            .getElementById("accionImpostores")
            .addEventListener("click", manejarAccion);

        try {
            const [
                respuestaGolesCarrera,
                respuestaGolesChampions,
                respuestaEstadisticasMundiales,
                respuestaJugadores
            ] = await Promise.all([
                fetch("datos/golesCarrera.json"),
                fetch("datos/golesChampionsHistoricos.json"),
                fetch("datos/estadisticasMundiales.json"),
                fetch("datos/jugadores.json")
            ]);

            if (!respuestaGolesCarrera.ok) {
                throw new Error("No se pudo cargar golesCarrera.json");
            }
            if (!respuestaGolesChampions.ok) {
                throw new Error("No se pudo cargar golesChampionsHistoricos.json");
            }
            if (!respuestaEstadisticasMundiales.ok) {
                throw new Error("No se pudo cargar estadisticasMundiales.json");
            }
            if (!respuestaJugadores.ok) {
                throw new Error("No se pudo cargar jugadores.json");
            }

            const [
                datosGolesCarrera,
                datosGolesChampions,
                datosEstadisticasMundiales,
                datosJugadores
            ] = await Promise.all([
                respuestaGolesCarrera.json(),
                respuestaGolesChampions.json(),
                respuestaEstadisticasMundiales.json(),
                respuestaJugadores.json()
            ]);

            if (
                !Array.isArray(datosGolesCarrera) ||
                !Array.isArray(datosGolesChampions) ||
                !Array.isArray(datosEstadisticasMundiales) ||
                !Array.isArray(datosJugadores)
            ) {
                throw new Error("Los archivos de datos no contienen arrays");
            }

            const jugadoresPorId = new Map(
                datosJugadores.map(jugador => [jugador.id, jugador])
            );

            categorias = [
                crearCategoria(
                    "golesCarrera",
                    "goles oficiales en su carrera",
                    datosGolesCarrera,
                    "goles",
                    jugadoresPorId,
                    [50, 100, 150, 200, 250, 300, 350, 400, 500, 600, 700]
                ),
                crearCategoria(
                    "golesChampions",
                    "goles en Champions League",
                    datosGolesChampions,
                    "goles",
                    jugadoresPorId,
                    [5, 10, 20, 25, 30, 40, 50, 60, 75, 100]
                ),
                crearCategoria(
                    "golesMundiales",
                    "goles en Copas del Mundo",
                    datosEstadisticasMundiales,
                    "goles",
                    jugadoresPorId,
                    [1, 2, 3, 4, 5, 6, 8, 10]
                ),
                crearCategoria(
                    "partidosMundiales",
                    "partidos en Copas del Mundo",
                    datosEstadisticasMundiales,
                    "partidos",
                    jugadoresPorId,
                    [4, 5, 6, 8, 10, 12, 15, 18, 20]
                )
            ].filter(categoria => categoria.jugadores.length >= 5);

            if (categorias.length === 0) {
                throw new Error("No hay suficientes datos para generar rondas");
            }

            actualizarPuntuacion();
            generarRonda();
        } catch (error) {
            console.error("Error cargando los datos del juego:", error);
            zonaJuego.innerHTML = `
                <div class="error-juego">
                    <h2>Error al cargar el juego</h2>
                    <p>No se han podido cargar los datos de los jugadores.</p>
                </div>
            `;
        }
    }

    function crearCategoria(id, etiqueta, datos, campo, jugadoresPorId, umbrales) {
        const jugadoresCategoria = datos
            .filter(registro =>
                typeof registro.idJugador === "string" &&
                Number.isInteger(registro[campo]) &&
                registro[campo] >= 0
            )
            .map(registro => {
                const jugador = jugadoresPorId.get(registro.idJugador);

                if (!jugador) {
                    throw new Error(
                        `No existe "${registro.idJugador}" en jugadores.json`
                    );
                }

                return {
                    id: jugador.id,
                    nombre: jugador.nombre,
                    imagen: jugador.imagen,
                    valor: registro[campo]
                };
            });

        return { id, etiqueta, jugadores: jugadoresCategoria, umbrales };
    }

    function mezclar(lista) {
        const resultado = [...lista];

        for (let indice = resultado.length - 1; indice > 0; indice--) {
            const aleatorio = Math.floor(Math.random() * (indice + 1));
            [resultado[indice], resultado[aleatorio]] =
                [resultado[aleatorio], resultado[indice]];
        }

        return resultado;
    }

    function elegirElementos(lista, cantidad) {
        return mezclar(lista).slice(0, cantidad);
    }

    function generarRonda() {
        const rondasPosibles = [];

        categorias.forEach(categoria => {
            categoria.umbrales.forEach(umbral => {
                const cumplen = categoria.jugadores.filter(
                    jugador => jugador.valor > umbral
                );
                const noCumplen = categoria.jugadores.filter(
                    jugador => jugador.valor <= umbral
                );

                for (
                    let cantidadImpostores = 1;
                    cantidadImpostores <= 4;
                    cantidadImpostores++
                ) {
                    const cantidadNormales = 5 - cantidadImpostores;

                    if (
                        noCumplen.length >= cantidadImpostores &&
                        cumplen.length >= cantidadNormales
                    ) {
                        rondasPosibles.push({
                            categoria,
                            umbral,
                            cumplen,
                            noCumplen,
                            cantidadImpostores
                        });
                    }
                }
            });
        });

        if (rondasPosibles.length === 0) {
            throw new Error("No hay datos suficientes para generar una ronda válida");
        }

        const ronda = rondasPosibles[
            Math.floor(Math.random() * rondasPosibles.length)
        ];
        const jugadoresNormales = elegirElementos(ronda.cumplen, 5 - ronda.cantidadImpostores);
        const jugadoresImpostores = elegirElementos(
            ronda.noCumplen,
            ronda.cantidadImpostores
        );

        jugadoresRonda = mezclar([...jugadoresNormales, ...jugadoresImpostores]);
        impostoresRonda = new Set(jugadoresImpostores.map(jugador => jugador.id));
        seleccionados = new Set();
        respuestaBloqueada = false;

        document.getElementById("consignaImpostores").textContent =
            `Jugadores con más de ${ronda.umbral} ${ronda.categoria.etiqueta}`;
        document.getElementById("resultadoImpostores").textContent = "";
        document.getElementById("accionImpostores").textContent = "Confirmar selección";
        document.getElementById("accionImpostores").className =
            "impostores-confirmar";
        document.getElementById("accionImpostores").disabled = false;

        const contenedor = document.getElementById("jugadoresImpostores");
        contenedor.replaceChildren();

        jugadoresRonda.forEach(jugador => {
            const boton = document.createElement("button");
            boton.type = "button";
            boton.className = "impostor-jugador";
            boton.setAttribute("aria-pressed", "false");
            boton.setAttribute("aria-label", `${jugador.nombre}, no seleccionado`);

            const imagen = document.createElement("img");
            imagen.src = jugador.imagen;
            imagen.alt = "";
            imagen.loading = "lazy";

            const nombre = document.createElement("strong");
            nombre.textContent = jugador.nombre;

            boton.append(imagen, nombre);
            boton.addEventListener("click", () => alternarSeleccion(jugador, boton));
            contenedor.append(boton);
        });
    }

    function alternarSeleccion(jugador, boton) {
        if (respuestaBloqueada) {
            return;
        }

        if (seleccionados.has(jugador.id)) {
            seleccionados.delete(jugador.id);
        } else {
            seleccionados.add(jugador.id);
        }

        const seleccionado = seleccionados.has(jugador.id);
        boton.setAttribute("aria-pressed", String(seleccionado));
        boton.setAttribute(
            "aria-label",
            `${jugador.nombre}, ${seleccionado ? "seleccionado" : "no seleccionado"}`
        );
    }

    function manejarAccion() {
        if (respuestaBloqueada) {
            generarRonda();
            return;
        }

        respuestaBloqueada = true;
        const acierto =
            seleccionados.size === impostoresRonda.size &&
            [...impostoresRonda].every(id => seleccionados.has(id));

        document.querySelectorAll(".impostor-jugador").forEach((boton, indice) => {
            const jugador = jugadoresRonda[indice];
            boton.disabled = true;
            boton.classList.add(
                impostoresRonda.has(jugador.id)
                    ? "es-impostor"
                    : "cumple-consigna"
            );
        });

        const accion = document.getElementById("accionImpostores");
        const resultado = document.getElementById("resultadoImpostores");

        if (acierto) {
            puntuacion++;
            resultado.textContent = "¡Correcto! Has encontrado a todos los impostores.";
            accion.textContent = "Siguiente ronda";
        } else {
            puntuacion = 0;
            resultado.textContent = "No es correcto. ¡Inténtalo de nuevo!";
            accion.textContent = "Volver a jugar";
        }

        guardarRacha();
        actualizarPuntuacion();
        accion.className = "impostores-siguiente";
    }

    function guardarRacha() {
        localStorage.setItem(CLAVE_RACHA, String(puntuacion));

        const mejorRacha = Number(localStorage.getItem(CLAVE_MEJOR_RACHA)) || 0;
        if (puntuacion > mejorRacha) {
            localStorage.setItem(CLAVE_MEJOR_RACHA, String(puntuacion));
        }
    }

    function actualizarPuntuacion() {
        const marcador = document.getElementById("puntuacionImpostores");
        if (marcador) {
            marcador.textContent = String(puntuacion);
        }
    }

    window.iniciarImpostoresFutboleros = iniciarImpostoresFutboleros;
})();
