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
                        <a class="boton" href="../registro-usuario.html" >+ Nuevo Usuario</a>
                </div>
            <p id="mensaje-tabla"></p>
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

        this.cargarUsuarios();
        this.configurarBuscador();
    }

    async cargarUsuarios() {
        const tbody = this.querySelector(`#listaUsuariost`);

        try {

            const respuesta = await fetch(`https://stock-flow-3accf-default-rtdb.firebaseio.com/usuarios.json`);
            const datos = await respuesta.json();

            tbody.innerHTML = ``;

            if (!datos) {
                tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay usuarios registrados</td></tr>`;
                return;
            }

            Object.keys(datos).forEach(idFirebase => {
                const usuario = datos[idFirebase];
                const fila = document.createElement(`tr`);
                const estadoAutomatico = "ACTIVO";

                fila.innerHTML = ` 
                <td>${usuario.identificacion || ''}</td>
                <td>${usuario.name || ''}</td>
                <td>${usuario.cargo || ''}</td>
                <td>
                    <span class="estado ${estadoAutomatico.toLowerCase()}">
                    ${estadoAutomatico}
                    </span>
                </td>
                <td>
                    <button class="editar">Editar</button>
                    <button class="eliminar">Eliminar</button>
                </td>
                `; 
                
                tbody.appendChild(fila);
            }); 

        } catch (error) { 
            console.error("Error al cargar usuarios:", error);
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Error de conexión</td></tr>`;
        }
    } 

        configurarBuscador() {
        const Buscar = this.querySelector('#buscar');
        
        Buscar.addEventListener('input', () => {
            const textoBusqueda = Buscar.value.toLowerCase()
            const filas = this.querySelectorAll('#listaUsuariost tr');

            filas.forEach(fila => {
                const primeraCelda = fila.querySelector('td'); 
                const celdaID = primeraCelda ? primeraCelda.textContent.toLowerCase() : '';

                if (celdaID.includes(textoBusqueda)) {
                    fila.style.display = '';
                } else {
                    fila.style.display = 'none';
                }
            });
        });
        
    }
}
 
customElements.define("tabla-usuarios", TablaUsuarios);

