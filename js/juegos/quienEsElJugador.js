function iniciarQuienEsElJugador() {

    const zonaJuego = document.getElementById("zona-juego");

    zonaJuego.innerHTML = `

        <h2>
            🕵️ ¿Quién es el jugador?
        </h2>

        <p style="margin: 20px 0; color: #9eabc1;">
            Aquí irá el juego para adivinar futbolistas.
        </p>

        <button
            class="boton"
            id="empezar-quien-es"
        >
            Empezar juego
        </button>

    `;


    document
        .getElementById("empezar-quien-es")
        .addEventListener("click", () => {

            alert("Aquí comenzará el juego.");

        });

}