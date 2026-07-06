class MenuLateral extends HTMLElement {

    connectedCallback() {

        this.innerHTML = `

        <aside class="menuu">
            <div class="logou">
                <h2>ACME</h2>
                <p>Sistema Producción</p>
            </div>

            <nav>
                <ul>
                    <li>
                        <a href="inicio.html">Inicio</a>
                    </li>
                    <li>
                        <a href="usuarios.html"> Usuarios</a>
                    </li>
                    <li>
                        <a href="inventario.html">Inventario</a>
                    </li>
                    <li>
                        <a href="produccion.html"> Producción</a>
                    </li>

                </ul>
            </nav>
        </aside>
        `;
    }
}

customElements.define("menu-lateral", MenuLateral);