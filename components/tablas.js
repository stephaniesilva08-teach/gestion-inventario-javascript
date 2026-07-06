class TablaUsuarios extends HTMLElement {
    constructor() {
        super();
        this._datos = [];
        this._columnas = [];
        this._config = { titulo: "Tabla", textoBoton: "+ Nuevo", urlBoton: "#" };
    }

    configurar(configuracion, columnas) {
        this._config = configuracion;
        this._columnas = columnas;
        this.renderBase();
    }

    set datos(nuevosDatos) {
        this._datos = nuevosDatos;
        if (this.querySelector("#cuerpoTablaDinamica")) {
            this.renderCuerpo();
        } else {
            this.renderBase();
        }
    }

    renderBase() {
        this.innerHTML = `
        <main class="contenidot">
            <h1 class="titulo">${this._config.titulo}</h1>
            <div class="accionest">
                <input type="text" id="buscar" placeholder="Buscar...">
                <a class="boton" id="btn-nuevo-dinamico" href="${this._config.urlBoton}">${this._config.textoBoton}</a>
            </div>
            <p id="mensaje-tabla"></p>
            <div class="contenedor-tablat">
                <table>
                    <thead>
                        <tr id="cabeceraTablaDinamica"></tr>
                    </thead>
                    <tbody id="cuerpoTablaDinamica"></tbody>
                </table>
            </div>
        </main>
        `;

        const trCabecera = this.querySelector("#cabeceraTablaDinamica");
        trCabecera.innerHTML = this._columnas.map(col => `<th>${col.label}</th>`).join("") + `<th>Acciones</th>`;

        this.renderCuerpo();
        this.configurarBuscador();
    }

    renderCuerpo() {
        const tbody = this.querySelector("#cuerpoTablaDinamica");
        if (!tbody) return;

        tbody.innerHTML = "";

        if (this._datos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="${this._columnas.length + 1}">No hay registros</td></tr>`;
            return;
        }

        this._datos.forEach((item) => {
            const fila = document.createElement("tr");

            const celdasHTML = this._columnas.map(col => {
                if (col.key === "tipo") {
                    return `<td>${item[col.key] === 'materia_prima' ? 'Materia Prima' : 'Producto Terminado'}</td>`;
                }
                return `<td>${item[col.key] || ''}</td>`;
            }).join("");
            const botonStockHTML = item.hasOwnProperty('stock') 
                ? `<button class="incrementar btn-incrementar">+ Stock</button>` 
                : '';

            fila.innerHTML = ` 
                ${celdasHTML}
                <td>
                    ${botonStockHTML}
                    <button class="editar btn-editar">Editar</button>
                    <button class="eliminar btn-eliminar">Eliminar</button>
                </td>
            `; 

            fila.querySelector(".eliminar").addEventListener("click", () => {
                this.dispatchEvent(new CustomEvent("eliminar-item", { bubbles: true, detail: item }));
            });

            fila.querySelector(".editar").addEventListener("click", () => {
                this.dispatchEvent(new CustomEvent("editar-item", { bubbles: true, detail: item }));
            });

            const btnStock = fila.querySelector(".incrementar");
            if (btnStock) {
                btnStock.addEventListener("click", () => {
                    this.dispatchEvent(new CustomEvent("aumentar-stock", { bubbles: true, detail: item }));
                });
            }

            tbody.appendChild(fila);
        });
    }

    configurarBuscador() {
        const Buscar = this.querySelector('#buscar');
        if (!Buscar) return;
        
        Buscar.addEventListener('input', () => {
            const textoBusqueda = Buscar.value.toLowerCase();
            const filas = this.querySelectorAll('#cuerpoTablaDinamica tr');

            filas.forEach(fila => {
                const primeraCelda = fila.querySelector('td'); 
                const celdaID = primeraCelda ? primeraCelda.textContent.toLowerCase() : '';
                fila.style.display = celdaID.includes(textoBusqueda) ? '' : 'none';
            });
        });
    }
    
}

customElements.define("tabla-usuarios", TablaUsuarios);



