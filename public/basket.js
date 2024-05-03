const loadbproone = async() => {
    try {
        const res = await fetch('/getprobasket');
        const data = await res.json();
        console.log(data);
        displaybpro(data);
    } catch(err) {
        console.error(err);
    }
}

function displaybpro(data) {
    const productList = document.getElementById('product-list');
    let totalprice = 0;

    const display = data.map((add) => {
        totalprice = totalprice + parseFloat(add.price);
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
            <td>${add.price}</td>
        </tr>
        `;
    }).join("");
    
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove')) {
            const productId = event.target.getAttribute("data-id");
            remove(productId)
        }
    });

    function remove(productId) {
        fetch(`/removeproduct/${productId}`, {
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

    const pricedisplay = document.getElementById('total-display');

    if (data.length > 0) {
        const vat = totalprice * 0.2;
        const fullprice = totalprice + vat;
        const totalpricedisplay = `
        <table>
        <tr>
            <td>Subtotal:</td>
            <td>£${totalprice}</td>
        </tr>
        <tr>
            <td>VAT:</td>
            <td>£${vat}</td>
        </tr>
        <tr>
            <td>Total:</td>
            <td>£${fullprice}</td>
        </tr>
        </table>
        `;
        pricedisplay.innerHTML = totalpricedisplay;
    }
}

loadbproone();
