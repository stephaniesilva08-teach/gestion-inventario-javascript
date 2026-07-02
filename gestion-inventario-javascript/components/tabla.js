class TablaUsuarios extends HTMLElement {

    connectedCallback() {
        this.innerHTML = `

        <main class="contenidot">
                <h1 class="titulo">Gestión de Usuarios</h1>
                <div class="accionest">
                    <input
                        type="text"
                        id="buscar"
                        placeholder="Buscar usuario">
                        <a class="boton" href="registro-usuario.html">+ Nuevo Usuario</a>
                </div>

            <div class="contenedor-tablat">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Cargo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="listaUsuariost">
            
                    </tbody>
                </table>
            </div>
        </main>
        `;
    }
}
 
customElements.define("tabla-usuarios", TablaUsuarios);