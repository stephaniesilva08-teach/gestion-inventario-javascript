items = [];

document.addEventListener("product.submit", (event) => {
  const item = event.detail;
  items.push(item);
  localStorage.setItem("items", JSON.stringify(items));
  console.log("Producto guardado en LocalStorage:", item);

});

const URL_BASE = "https://stock-flow-3accf-default-rtdb.firebaseio.com"

const boton = document.getElementById("login");

boton.addEventListener("click", () => {

  const producto = document.getElementById("#producto").value;
  const precio = document.getElementById("#precio").value;
  const stock = document.getElementById("#stock").value;

  const user = {
  "name": producto, 
  "quantity": stock,
  "price": precio
  }

  const httpClient = fetch(`${URL_BASE}/product.json`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  
  body: JSON.stringify(user)
  
  }); 

    const res = httpClient.then(data => data.json());
  res.then(data => console.log("producto guardado ",data)).catch(err => console.error("error: ", err))

})


  
