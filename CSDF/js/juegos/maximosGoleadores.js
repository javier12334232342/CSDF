function iniciarMaximosGoleadores() {

    const jugadoresPrueba = [
        {
            id: 1,
            nombre: "Lionel Messi",
            foto: "https://media.api-sports.io/football/players/154.png",
            carrera: 850,
            champions: 129
        },
        {
            id: 2,
            nombre: "Cristiano Ronaldo",
            foto: "https://media.api-sports.io/football/players/874.png",
            carrera: 950,
            champions: 140
        },
        {
            id: 3,
            nombre: "Robert Lewandowski",
            foto: "https://media.api-sports.io/football/players/521.png",
            carrera: 700,
            champions: 110
        },
        {
            id: 4,
            nombre: "Luis Suárez",
            foto: "https://media.api-sports.io/football/players/228.png",
            carrera: 550,
            champions: 27
        },
        {
            id: 5,
            nombre: "Karim Benzema",
            foto: "https://media.api-sports.io/football/players/130.png",
            carrera: 500,
            champions: 90
        },
        {
            id: 6,
            nombre: "Neymar",
            foto: "https://media.api-sports.io/football/players/276.png",
            carrera: 450,
            champions: 43
        },
        {
            id: 7,
            nombre: "Kylian Mbappé",
            foto: "https://media.api-sports.io/football/players/278.png",
            carrera: 400,
            champions: 50
        },
        {
            id: 8,
            nombre: "Erling Haaland",
            foto: "https://media.api-sports.io/football/players/1100.png",
            carrera: 300,
            champions: 50
        },
        {
            id: 9,
            nombre: "Mohamed Salah",
            foto: "https://media.api-sports.io/football/players/306.png",
            carrera: 350,
            champions: 50
        },
        {
            id: 10,
            nombre: "Harry Kane",
            foto: "https://media.api-sports.io/football/players/157.png",
            carrera: 400,
            champions: 40
        }
    ];

    let modo = "carrera";
    let jugadoresDisponibles = [];
    let jugadorActual = null;
    let jugadoresColocados = [];
    let ronda = 0;

    const contenedor = document.getElementById("contenido");

    function crearInterfaz() {

        contenedor.innerHTML = `
            <section class="juego">

                <div class="cabecera-juego">
                    <button id="volverInicio" class="boton-secundario">
                        ← Volver
                    </button>

                    <h2>Máximos goleadores</h2>

                    <button id="botonInfo" class="boton-info">
                        ℹ
                    </button>
                </div>

                <div class="modos-juego">

                    <button id="modoCarrera" class="boton-modo activo">
                        Carrera
                    </button>

                    <button id="modoChampions" class="boton-modo">
                        Champions
                    </button>

                </div>

                <div id="informacionJuego"></div>

                <div id="jugadorActual"></div>

                <div id="ranking">
                </div>

            </section>
        `;

        document
            .getElementById("volverInicio")
            .addEventListener("click", mostrarInicio);

        document
            .getElementById("modoCarrera")
            .addEventListener("click", () => cambiarModo("carrera"));

        document
            .getElementById("modoChampions")
            .addEventListener("click", () => cambiarModo("champions"));

        document
            .getElementById("botonInfo")
            .addEventListener("click", mostrarInformacion);
    }

    function cambiarModo(nuevoModo) {

        modo = nuevoModo;

        document
            .getElementById("modoCarrera")
            .classList.toggle("activo", modo === "carrera");

        document
            .getElementById("modoChampions")
            .classList.toggle("activo", modo === "champions");

        iniciarPartida();
    }

    function iniciarPartida() {

        jugadoresColocados = [];
        ronda = 0;

        jugadoresDisponibles = [...jugadoresPrueba];

        mezclarArray(jugadoresDisponibles);

        mostrarRanking();
        siguienteJugador();
    }

    function siguienteJugador() {

        if (ronda >= 10) {
            finalizarPartida();
            return;
        }

        jugadorActual = jugadoresDisponibles[ronda];

        ronda++;

        mostrarJugadorActual();
    }

    function mostrarJugadorActual() {

        const contenedorJugador =
            document.getElementById("jugadorActual");

        const estadistica =
            modo === "carrera"
                ? "goles en carrera"
                : "goles en Champions";

        contenedorJugador.innerHTML = `
            <div class="tarjeta-jugador">

                <img
                    src="${jugadorActual.foto}"
                    alt="${jugadorActual.nombre}"
                >

                <h3>${jugadorActual.nombre}</h3>

                <p>
                    ¿Dónde colocarías a este jugador?
                </p>

                <strong>
                    ${estadistica}
                </strong>

            </div>
        `;

        mostrarBotonesPosicion();
    }

    function mostrarBotonesPosicion() {

        const contenedorRanking =
            document.getElementById("ranking");

        let botones = "";

        for (let i = 1; i <= 10; i++) {

            const ocupado =
                jugadoresColocados.some(
                    jugador => jugador.posicion === i
                );

            botones += `
                <button
                    class="boton-posicion"
                    data-posicion="${i}"
                    ${ocupado ? "disabled" : ""}
                >
                    ${i}
                </button>
            `;
        }

        contenedorRanking.innerHTML = `
            <div class="posiciones">
                ${botones}
            </div>

            <div id="rankingActual">
            </div>
        `;

        document
            .querySelectorAll(".boton-posicion")
            .forEach(boton => {

                boton.addEventListener("click", () => {

                    const posicion =
                        Number(boton.dataset.posicion);

                    colocarJugador(posicion);
                });
            });

        mostrarRankingActual();
    }

    function colocarJugador(posicion) {

        jugadoresColocados.push({
            jugador: jugadorActual,
            posicion: posicion
        });

        jugadoresColocados.sort(
            (a, b) => a.posicion - b.posicion
        );

        mostrarRanking();

        setTimeout(() => {
            siguienteJugador();
        }, 500);
    }

    function mostrarRanking() {

        const contenedorRanking =
            document.getElementById("ranking");

        if (!contenedorRanking) {
            return;
        }

        const rankingActual =
            document.getElementById("rankingActual");

        if (!rankingActual) {
            return;
        }

        mostrarRankingActual();
    }

    function mostrarRankingActual() {

        const contenedor =
            document.getElementById("rankingActual");

        if (!contenedor) {
            return;
        }

        let html = "";

        for (let i = 1; i <= 10; i++) {

            const jugador =
                jugadoresColocados.find(
                    elemento => elemento.posicion === i
                );

            if (jugador) {

                html += `
                    <div class="fila-ranking ocupada">

                        <span class="numero-ranking">
                            ${i}
                        </span>

                        <img
                            src="${jugador.jugador.foto}"
                            alt="${jugador.jugador.nombre}"
                        >

                        <span>
                            ${jugador.jugador.nombre}
                        </span>

                    </div>
                `;

            } else {

                html += `
                    <div class="fila-ranking vacia">

                        <span class="numero-ranking">
                            ${i}
                        </span>

                        <span>
                            —
                        </span>

                    </div>
                `;
            }
        }

        contenedor.innerHTML = html;
    }

    function finalizarPartida() {

        const estadistica =
            modo === "carrera"
                ? "carrera"
                : "Champions";

        const rankingOrdenado =
            [...jugadoresColocados]
                .sort((a, b) => {

                    const valorA =
                        modo === "carrera"
                            ? a.jugador.carrera
                            : a.jugador.champions;

                    const valorB =
                        modo === "carrera"
                            ? b.jugador.carrera
                            : b.jugador.champions;

                    return valorB - valorA;
                });

        let aciertos = 0;

        jugadoresColocados.forEach(elemento => {

            const posicionCorrecta =
                rankingOrdenado.findIndex(
                    jugador =>
                        jugador.jugador.id === elemento.jugador.id
                ) + 1;

            if (posicionCorrecta === elemento.posicion) {
                aciertos++;
            }
        });

        contenedor.innerHTML = `
            <section class="juego">

                <h2>Partida terminada</h2>

                <p>
                    Has conseguido
                    <strong>${aciertos}/10</strong>
                    posiciones exactas.
                </p>

                <div class="ranking-final">
                    ${rankingOrdenado.map((elemento, indice) => {

                        const jugador = elemento.jugador;

                        const valor =
                            modo === "carrera"
                                ? jugador.carrera
                                : jugador.champions;

                        return `
                            <div class="fila-ranking">

                                <span>
                                    ${indice + 1}
                                </span>

                                <img
                                    src="${jugador.foto}"
                                    alt="${jugador.nombre}"
                                >

                                <span>
                                    ${jugador.nombre}
                                </span>

                                <strong>
                                    ${valor}
                                </strong>

                            </div>
                        `;

                    }).join("")}
                </div>

                <button
                    id="volverAJugar"
                    class="boton-principal"
                >
                    Volver a jugar
                </button>

            </section>
        `;

        document
            .getElementById("volverAJugar")
            .addEventListener("click", () => {
                crearInterfaz();
                iniciarPartida();
            });
    }

    function mostrarInformacion() {

        alert(
            "Debes colocar cada jugador en el TOP 10 según " +
            "sus goles. Una vez colocado, no podrás cambiarlo. " +
            "Gana quien consiga formar el ranking más preciso."
        );
    }

    function mezclarArray(array) {

        for (let i = array.length - 1; i > 0; i--) {

            const j =
                Math.floor(Math.random() * (i + 1));

            [array[i], array[j]] =
                [array[j], array[i]];
        }

        return array;
    }

    crearInterfaz();
    iniciarPartida();
}