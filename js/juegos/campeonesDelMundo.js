function iniciarCampeonesDelMundo() {

    const zonaJuego = document.getElementById("zona-juego");

    zonaJuego.innerHTML = `

        <h2>
            🏆 Campeones del mundo
        </h2>

        <p style="margin: 20px 0; color: #9eabc1;">
            Aquí irá el juego sobre los Mundiales.
        </p>

        <button
            class="boton"
            id="empezar-campeones"
        >
            Empezar juego
        </button>

    `;


    document
        .getElementById("empezar-campeones")
        .addEventListener("click", () => {

            alert("Aquí comenzará el juego.");

        });

}