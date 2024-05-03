const container = document.getElementById('dataContainer');
const filter = document.getElementById('filterForm');

const loaddc = async() => {
    try{
        const res = await fetch('/dc-data');
        const data = await res.json();
        displayproduct(data);
    } catch(err){
        console.error(err);
    }
}

    function displayproduct(data) {
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

filter.addEventListener('submit', async (event) =>{
    event.preventDefault();
    const data = new FormData(filter);
    const price = data.get('price');
    try{
        const res = await fetch(`/dc-data?price=${price}`);
        const data = await res.json();
        displayproduct(data);
    } catch (err){
        console.error(err);
    }
})

loaddc();