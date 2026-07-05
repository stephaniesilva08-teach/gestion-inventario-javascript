let items = JSON.parse(localStorage.getItem("items")) || [];

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
    const mensaje = document.getElementById("mensaje");

    if (!identificacion || !contraseña) {
        mensaje.textContent = "Por favor, llena todos los campos.";
        return;
    }

    fetch(`${URL_BASE}/usuarios.json`)
        .then(res => res.json())
        .then(data => {
            const usuarios = Object.values(data || {});
            const usuariovalido = usuarios.some(user => 
                String(user.identificacion) === identificacion &&
                String(user.password) === contraseña
            );

            if (usuariovalido) {
                mensaje.textContent = "Iniciaste Sesion";
                mensaje.style.color = "green";
                setTimeout(() => {
                    window.location.href = "../inicio.html";
                }, 1000);

            } else {
                mensaje.textContent = "Datos no validos"
                mensaje.style.color = "red"; 

                document.getElementById("identificacion").value = "";
                document.getElementById("password").value = ""; 
            }
        })
        .catch(err => {
            console.error("Error: ", err)
            mensaje.textContent = "Error no ingresado a la base de datos.";
        });
});
