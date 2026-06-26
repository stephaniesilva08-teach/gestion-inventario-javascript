items = [];

document.addEventListener("product-submit", (event) => {
  const item = event.detail;
  items.push(item);
  localStorage.setItem("items", JSON.stringify(items));
});

const user = {
  "name": "nata", 
  "quantity": "123abc",
  "price": "123abc"
  }

  const URL_BASE = "https://stock-flow-3accf-default-rtdb.firebaseio.com"

  const httpClient = fetch(`${URL_BASE}/product.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
  
    body: JSON.stringify(user)
  });
  
  const res = httpclient.then(data => data.json());
  res.then(data => console.log).catch(err => console.error)