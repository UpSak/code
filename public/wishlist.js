const loadbproone = async() => {
    try {
        const res = await fetch('/getwish');
        const data = await res.json();
        console.log(data);
        displaywish(data);
    } catch(err) {
        console.error(err);
    }
}

function displaywish(data){
    const productList = document.getElementById('product-list');

    const display = data.map((add) => {
        return `
        <tr>
            <td>
                <div class="cart-info">
                    <img src="${add.imageurl}">
                    <div>
                        <p>${add.product_name}</p>
                        <small>price: £${add.price}</small>
                        <br>
                        <button class="remove" data-id="${add.product_id}">remove</button>
                    </div>
                </div>
            </td>
            <td><button class="btn" data-product-id="${add.product_id}">add to cart</button></td>
        </tr>
        `;
    }).join("");

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove')) {
            const productId = event.target.getAttribute("data-id");
            remove(productId);
        } else if (event.target.classList.contains('btn')) {
            const productId = event.target.getAttribute("data-product-id");
            console.log(productId);
            addcart(productId);
        }
    });

    function addcart(productId){
        fetch(`/addpro/${productId}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId}),
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

    function remove(productId){
        fetch(`/removeprod/${productId}`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({productId}),
        })
        .then(response => {
            if (response.ok){
                loadbproone();
                return response.json().then(data => {
                    alert(data.alert)
                });
            } else if(response.status === 404){
                return response.json().then(data => {
                    alert(data.alert);
                })
            }else {
                throw new Error('failed to remove')
            }
        })
        
    }
    productList.innerHTML = display;

}

loadbproone();
