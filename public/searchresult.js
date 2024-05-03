const container = document.getElementById('dataContainer');
const loadSearch = async () => {
    try {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const search = urlSearchParams.get('q');
        console.log(search)
        
        const res = await fetch(`/productsearch/${search}`);
        const data = await res.json();
        console.log(data);
        load(data.products);
    } catch(err) {
        console.error(err);
    }
}


function load(data) {
    console.log(data);
    const disp = data
        .map((item) => {
            return `
            <div class = 'box'>
            <a href="/product.html?id=${item.product_id}">
                <div class="product">
                    <img class ='img' src="${item.imageurl}">
                </div>
                <div class="productinfo">
                    <p class = 'prodname'>${item.product_name}</p>
                    <p class = 'condition'>${item.condition}</p>
                    <p class = 'price'>£${item.price}</p>
                </div>
            </a>
            </div>
            `;
        })
        .join("");
    container.innerHTML = disp;
}

loadSearch();