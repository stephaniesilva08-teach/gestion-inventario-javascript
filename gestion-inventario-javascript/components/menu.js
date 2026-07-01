class menuLateral extends HTMLElement {

    connectedCallback() {

        this.innerHTML = `

    <aside class="menu">

    <h2 class="titulo">ACME</h2>

        <ul>

            <li><a href="">Usuarios</a></li>

            <li><a href="">Productos</a></li>

            <li><a href="">Inventario</a></li>

            <li><a href="">Producción</a></li>

        </ul>

    </aside>

`;

    }

}

customElements.define("menu-lateral", menuLateral);