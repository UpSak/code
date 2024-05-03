const container = document.getElementById('dataContainer');
const filter = document.getElementById('filterForm');

const loadMarvelData = async () => {
    try {
        const res = await fetch('/marvel-data');
        const data = await res.json();
        displayProduct(data);
    } catch (error) {
        console.error(error);
    }
}

function displayProduct(data) {
    const display = data
        .map((item) => {
            return `
            <div class='box'>
                <a href="/product.html?id=${item.product_id}">
                    <div class="product">
                        <img class='img' src="${item.imageurl}">
                    </div>
                    <div class="productinfo">
                        <p class='prodname'>${item.product_name}</p>
                        <p class='condition'>${item.condition}</p>
                        <p class='price'>£${item.price}</p>
                    </div>
                </a>
            </div>
            `;
        })
        .join("");
    container.innerHTML = display;
}

filter.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(filter);
    const price = formData.get('price');
    try {
        const res = await fetch(`/marvel-data?price=${price}`);
        const data = await res.json();
        displayProduct(data);
    } catch (error) {
        console.error(error);
    }
});

loadMarvelData();