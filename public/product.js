// const loaddcp = async() => {
//     try {
//         const res = await fetch('/productData?id=1'); // Change URL to fetch data from productData endpoint
//         const data = await res.json();
//         console.log(data);
//     } catch(err) {
//         console.error(err);
//     }
// }

// loaddcp();

const div = document.querySelector('.here')

const loaddcp = async() => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        
        const res = await fetch(`/productData?id=${id}`);
        const data = await res.json();
        console.log(data);
        loadpropage(data);
    } catch(err) {
        console.error(err);
    }
}

function loadpropage(data){
const add = data
    .map((item)=>{
        return `
        <aside class = "prodimg"><image src = "${item.imageurl}"></image></aside>
  <!--right side-->
  <div class = product-content>
    <h2 class = prodname>${item.product_name}, ${item.condition} </h2>

    <div class="product-price">
      <p class="price">Price: <span>£${item.price}</span></p>
      <p class = "vat">VAT included</p>
    </div>
    <div class="product-detail">
      <h2>Product description</h2>
      <p>nfnfnjsrnjsnvfjinfrjisnfjrnjf mfmormfowjfoiwjfw jfomowf</p>
      <h2>Aditional Information</h2>
      <p>${item.listing_des}</p>
    </div>
  </div>
  <div class="purch">
    <button class = "btn" id = "addcart" data-product-id = "${item.product_id}"> Add to cart</button>
    <button class = "btn" id = "addwish" data-product-id = "${item.product_id}"> Add to wishlist</button>
  </div>
        `
    })
    div.innerHTML = add;

const cartbutton = document.getElementById("addcart");
const wishbutton = document.getElementById("addwish");
wishbutton.addEventListener("click", addtowish)

function addtowish(event){
  const productId = event.target.getAttribute("data-product-id");
  console.log(productId);
  addedtowishlist(productId);
}

function addedtowishlist(productId){
  fetch('/addwish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId }),
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else if (response.status === 401) {
      return response.json().then(data => {
        alert(data.alert);
        window.location.href = data.redirect;
      });
    } else if (response.status ===400){
    return response.json().then(data => {
      alert(data.alert);
    })
   }else {
      throw new Error('Failed to add product to cart');
    }
  })
  .then(data => {
    console.log('Product added:', data.message);
    alert(data.alert);
  })
  .catch(error => {
    console.error('Error:', error);
  });

}

cartbutton.addEventListener("click", addtocart)

function addtocart(event){
   const productId = event.target.getAttribute("data-product-id");
   console.log(productId)
   addedtocarted(productId);
}

function addedtocarted(productId) {
  fetch(`/addpro/${productId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId }),
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else if (response.status === 401) {
      return response.json().then(data => {
        alert(data.alert);
        window.location.href = data.redirect;
      });
    } else if (response.status ===400){
    return response.json().then(data => {
      alert(data.alert);
    })
   }else {
      throw new Error('Failed to add product to cart');
    }
  })
  .then(data => {
    console.log('Product added:', data.message);
    alert(data.alert);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

}

loaddcp();