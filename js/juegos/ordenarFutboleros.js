(() => {
    const CLAVE_RACHA = "racha-ordenar-futboleros";
    const CLAVE_MEJOR_RACHA = "mejor-racha-ordenar-futboleros";

    let categorias = [];
    let categoriaRonda;
    let jugadoresRonda = [];
    let ordenSeleccionado = [];
    let puntuacion = 0;
    let respuestaBloqueada = false;

    async function iniciarOrdenarFutboleros() {
        const zonaJuego = document.getElementById("zona-juego");

        if (!zonaJuego) {
            console.error("No se encontró #zona-juego");
            return;
        }

        puntuacion = Number(localStorage.getItem(CLAVE_RACHA)) || 0;
        zonaJuego.innerHTML = `
            <div class="juego-orden">
                <div class="impostores-cabecera">
                    <span class="racha-actual">
                        <span id="puntuacionOrdenar">0</span>
                        <img src="/img/iconos/rayo.png" alt="" aria-hidden="true">
                    </span>
                </div>
                <div class="impostores-consigna">
                    <h2 id="consignaOrdenar"></h2>
                    <p>Pulsa los jugadores en orden, del valor más alto al más bajo.</p>
                </div>
                <div id="jugadoresOrdenar" class="orden-jugadores"></div>
                <div class="impostores-acciones">
                    <section id="resultadoOrdenar" class="orden-resultado" aria-live="polite" hidden>
                        <header class="orden-resultado-cabecera">
                            <span id="etiquetaResultadoOrdenar" class="orden-resultado-etiqueta"></span>
                            <h2 id="tituloResultadoOrdenar"></h2>
                            <p id="resumenResultadoOrdenar"></p>
                        </header>
                        <ol id="clasificacionOrdenar" class="orden-clasificacion" aria-label="Clasificación correcta"></ol>
                    </section>
                    <button id="accionOrdenar" class="impostores-confirmar" type="button" disabled>
                        Confirmar orden
                    </button>
                </div>
            </div>
        `;

        document
            .getElementById("accionOrdenar")
            .addEventListener("click", manejarAccion);

        try {
            const [
                respuestaGolesCarrera,
                respuestaGolesChampions,
                respuestaEstadisticasMundiales,
                respuestaJugadores
            ] = await Promise.all([
                fetch("datos/golesCarrera.json"),
                fetch("datos/estadisticasChampionsHistoricos.json"),
                fetch("datos/estadisticasMundiales.json"),
                fetch("datos/jugadores.json")
            ]);

            if (!respuestaGolesCarrera.ok) {
                throw new Error("No se pudo cargar golesCarrera.json");
            }
            if (!respuestaGolesChampions.ok) {
                throw new Error("No se pudo cargar estadisticasChampionsHistoricos.json");
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
                    "goles"
                ),
                crearCategoria(
                    "golesChampions",
                    "goles en Champions League",
                    datosGolesChampions,
                    "goles",
                    jugadoresPorId,
                    "goles"
                ),
                crearCategoria(
                    "golesMundiales",
                    "goles en Copas del Mundo",
                    datosEstadisticasMundiales,
                    "goles",
                    jugadoresPorId,
                    "goles"
                ),
                crearCategoria(
                    "partidosMundiales",
                    "partidos en Copas del Mundo",
                    datosEstadisticasMundiales,
                    "partidos",
                    jugadoresPorId,
                    "partidos"
                )
            ].filter(categoria =>
                new Set(categoria.jugadores.map(jugador => jugador.valor)).size >= 5
            );

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

    function crearCategoria(id, etiqueta, datos, campo, jugadoresPorId, unidad) {
        const jugadoresPorIdCategoria = new Map();

        datos
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

                if (!jugadoresPorIdCategoria.has(jugador.id)) {
                    jugadoresPorIdCategoria.set(jugador.id, {
                        id: jugador.id,
                        nombre: jugador.nombre,
                        imagen: jugador.imagen,
                        valor: registro[campo]
                    });
                }
            });

        return {
            id,
            etiqueta,
            jugadores: [...jugadoresPorIdCategoria.values()],
            unidad
        };
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

    function generarRonda() {
        categoriaRonda = categorias[
            Math.floor(Math.random() * categorias.length)
        ];
        const jugadoresPorValor = new Map();

        categoriaRonda.jugadores.forEach(jugador => {
            if (!jugadoresPorValor.has(jugador.valor)) {
                jugadoresPorValor.set(jugador.valor, jugador);
            }
        });

        const jugadoresUnicos = [...jugadoresPorValor.values()];
        jugadoresRonda = mezclar(mezclar(jugadoresUnicos).slice(0, 5));
        ordenSeleccionado = [];
        respuestaBloqueada = false;

        document.querySelector(".impostores-consigna").hidden = false;
        document.getElementById("jugadoresOrdenar").hidden = false;
        document.getElementById("consignaOrdenar").textContent =
            `Ordena según ${categoriaRonda.etiqueta}`;
        document.getElementById("resultadoOrdenar").hidden = true;
        document.getElementById("clasificacionOrdenar").replaceChildren();

        const accion = document.getElementById("accionOrdenar");
        accion.textContent = "Confirmar orden";
        accion.className = "impostores-confirmar";
        accion.disabled = true;

        const contenedor = document.getElementById("jugadoresOrdenar");
        contenedor.replaceChildren();

        jugadoresRonda.forEach(jugador => {
            const boton = document.createElement("button");
            boton.type = "button";
            boton.className = "impostor-jugador orden-jugador";
            boton.dataset.jugador = jugador.id;
            boton.setAttribute("aria-pressed", "false");
            boton.setAttribute("aria-label", `${jugador.nombre}, sin posición asignada`);

            const posicion = document.createElement("span");
            posicion.className = "orden-posicion";
            posicion.setAttribute("aria-hidden", "true");

            const imagen = document.createElement("img");
            imagen.src = jugador.imagen;
            imagen.alt = "";
            imagen.loading = "lazy";

            const nombre = document.createElement("strong");
            nombre.textContent = jugador.nombre;

            boton.append(posicion, imagen, nombre);
            boton.addEventListener("click", () => alternarPosicion(jugador));
            contenedor.append(boton);
        });
    }

    function alternarPosicion(jugador) {
        if (respuestaBloqueada) {
            return;
        }

        const indiceActual = ordenSeleccionado.findIndex(
            seleccionado => seleccionado.id === jugador.id
        );

        if (indiceActual >= 0) {
            ordenSeleccionado.splice(indiceActual, 1);
        } else {
            if (ordenSeleccionado.length >= jugadoresRonda.length) {
                return;
            }
            ordenSeleccionado.push(jugador);
        }

        actualizarPosiciones();
    }

    function actualizarPosiciones() {
        jugadoresRonda.forEach(jugador => {
            const boton = [...document.querySelectorAll(".orden-jugador")]
                .find(opcion => opcion.dataset.jugador === jugador.id);
            const posicion = ordenSeleccionado.findIndex(
                seleccionado => seleccionado.id === jugador.id
            );

            if (!boton) {
                return;
            }

            boton.dataset.jugador = jugador.id;
            boton.setAttribute("aria-pressed", String(posicion >= 0));
            boton.setAttribute(
                "aria-label",
                posicion >= 0
                    ? `${jugador.nombre}, posición ${posicion + 1}`
                    : `${jugador.nombre}, sin posición asignada`
            );
            boton.querySelector(".orden-posicion").textContent =
                posicion >= 0 ? String(posicion + 1) : "";
        });

        document.getElementById("accionOrdenar").disabled =
            ordenSeleccionado.length !== jugadoresRonda.length;
    }

    function manejarAccion() {
        if (respuestaBloqueada) {
            generarRonda();
            return;
        }

        if (ordenSeleccionado.length !== jugadoresRonda.length) {
            return;
        }

        respuestaBloqueada = true;
        const ordenCorrecto = [...jugadoresRonda].sort(
            (jugadorA, jugadorB) => jugadorB.valor - jugadorA.valor
        );
        const acierto = ordenSeleccionado.every(
            (jugador, indice) => jugador.id === ordenCorrecto[indice].id
        );
        const puestosCorrectos = ordenSeleccionado.reduce(
            (total, jugador, indice) =>
                total + Number(jugador.id === ordenCorrecto[indice].id),
            0
        );

        document.querySelectorAll(".orden-jugador").forEach(boton => {
            const jugador = jugadoresRonda.find(
                item => item.id === boton.dataset.jugador
            );
            boton.disabled = true;
            boton.classList.add(
                ordenSeleccionado.findIndex(item => item.id === jugador.id) ===
                    ordenCorrecto.findIndex(item => item.id === jugador.id)
                    ? "orden-correcto"
                    : "orden-incorrecto"
            );
        });

        const accion = document.getElementById("accionOrdenar");
        const panelResultado = document.getElementById("resultadoOrdenar");
        const clasificacion = document.getElementById("clasificacionOrdenar");

        if (acierto) {
            puntuacion++;
            document.getElementById("etiquetaResultadoOrdenar").textContent =
                "Orden perfecto";
            document.getElementById("tituloResultadoOrdenar").textContent =
                "¡Clasificación acertada!";
            accion.textContent = "Siguiente ronda";
        } else {
            puntuacion = 0;
            document.getElementById("etiquetaResultadoOrdenar").textContent =
                "Clasificación correcta";
            document.getElementById("tituloResultadoOrdenar").textContent =
                "Esta vez no salió";
            accion.textContent = "Volver a jugar";
        }

        document.getElementById("resumenResultadoOrdenar").textContent =
            `Has acertado ${puestosCorrectos} de ${jugadoresRonda.length} puestos.`;

        ordenCorrecto.forEach(jugador => {
            const elemento = document.createElement("li");
            elemento.className = "orden-clasificacion-fila";

            const posicion = document.createElement("span");
            posicion.className = "orden-clasificacion-posicion";
            posicion.textContent = String(ordenCorrecto.indexOf(jugador) + 1);

            const imagen = document.createElement("img");
            imagen.src = jugador.imagen;
            imagen.alt = "";
            imagen.loading = "lazy";

            const nombre = document.createElement("strong");
            nombre.textContent = jugador.nombre;

            const dato = document.createElement("span");
            dato.className = "orden-clasificacion-dato";
            dato.textContent = `${jugador.valor} ${categoriaRonda.unidad}`;

            const puestoElegido = ordenSeleccionado.findIndex(
                seleccionado => seleccionado.id === jugador.id
            );
            const estado = document.createElement("span");
            estado.className = "orden-clasificacion-estado";
            estado.textContent = puestoElegido === ordenCorrecto.indexOf(jugador)
                ? "Bien colocado"
                : `Lo pusiste ${puestoElegido + 1}.º`;

            if (puestoElegido === ordenCorrecto.indexOf(jugador)) {
                elemento.classList.add("puesto-acertado");
            }

            elemento.append(posicion, imagen, nombre, dato, estado);
            clasificacion.append(elemento);
        });
        document.querySelector(".impostores-consigna").hidden = true;
        document.getElementById("jugadoresOrdenar").hidden = true;
        panelResultado.hidden = false;

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
        const marcador = document.getElementById("puntuacionOrdenar");
        if (marcador) {
            marcador.textContent = String(puntuacion);
        }
    }

    window.iniciarOrdenarFutboleros = iniciarOrdenarFutboleros;
})();
