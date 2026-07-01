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

  const codigo = document.getElementById("codigo").value;
  const nombre = document.getElementById("name").value;
  const proveedor = document.getElementById("proveedor").value;

  const productos = {
    "codigo": codigo,
    "nombre": nombre,
    "proveedor": proveedor,
  }

  const httpClient = fetch(`${URL_BASE}/productos.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify(productos)

  });

  const res = httpClient.then(data => data.json());
  res.then(data => console.log("producto guardado ", data)).catch(err => console.error("error: ", err))

})



