items = [];

document.addEventListener("product.submit", (event) => {
    const item = event.detail;
    items.push(item);
    localStorage.setItem("items", JSON.stringify(items));
    console.log("Producto guardado en LocalStorage:", item);

});

const URL_BASE = "https://stock-flow-3accf-default-rtdb.firebaseio.com"

const boton = document.getElementById("login");

boton.addEventListener("click", (e) => {

    e.preventDefault();

    const identificacion = document.getElementById("identificacion").value;
    const contraseña = document.getElementById("password").value;
    const nombre = document.getElementById("username").value;
    const cargo = document.getElementById("cargo").value;
    const confirmacion = document.getElementById("confirmarPassword").value;
    const mensaje = document.getElementById("mensajeError");

    if (contraseña !== confirmacion) {
        mensaje.textContent = "Las contraseñas no coinciden.";
        return;
    }
    
    mensaje.textContent = "";

    const usuario = {
        "identificacion": identificacion,
        "password": contraseña,
        "name": nombre,
        "cargo": cargo,
    }

    const httpClient = fetch(`${URL_BASE}/usuarios.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(usuario)

    });

    const res = httpClient.then(data => data.json());
    res.then(data => console.log("producto guardado ", data)).catch(err => console.error("error: ", err))

})