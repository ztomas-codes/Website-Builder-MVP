//create new element and append it to the body
const cart = document.createElement('div');
document.body.appendChild(cart);

const style = document.createElement('style');
style.innerHTML = `
    .cart {
        position: fixed;
        top: 0;
        right: 0;
        background: rgb(15,15,15);
        width: 300px;
        color: white;
        height: 100vh;
        z-index: 1000;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .cart__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .cart__header button {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
    }

    .cart__body {
        padding: 10px;
        overflow-y: auto;
        min-height: 75vh;
        max-height: 75vh;
    }
    .cart__footer {
        padding: 10px;
    }
    .cart__footer button
    {
        background: white;
        color: black;
        border: none;
        padding: 10px;
        cursor: pointer;
        width: 100%;
        height: 70px;
        transition: background 0.3s, color 0.3s;
    }

    .cart__footer button:hover
    {
        background: black;
        color: white;
        border: 1px solid white;
    }

    .cart__footer div {
        display: flex;
        justify-content: space-between;
    }

    .cart__item {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        background: rgb(30,30,30);
        padding: 20px;
        margin-top: 30px;
        border: 1px solid rgb(255,255,255,0.2);
    }

    .cart__item img {
        width: 50%;
    }
    .cart__item input{
        width: 100%;
        background: rgb(10,10,10);
        color: white;
        padding: 10px;
        border: 1px solid rgb(255,255,255,0.2);
        outline: none;
        margin-left: 10px;
    }
    .cart__item__description div {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .cart__item__image {
        display: flex;
        justify-content: center;
    }
    .cart__item__image
    {
        border-radius: 20px;
    }
`;
document.head.appendChild(style);

const getProductById = (id) =>
{
    return ShopStorage.products.find(product => product.id === id);
}

const addToCart = (id) =>
{

    if (!ShopStorage.cart.find(item => item.id === id))
    {
        ShopStorage.cart.push({id: id, quantity: 1});
    }
    else
    {
        ShopStorage.cart.find(item => item.id === id).quantity++;
    }
    openCart();

    localStorage.setItem('cart', JSON.stringify(ShopStorage.cart));
}

const closeCart = () =>
{
    cart.innerHTML = '';
}

const checkout = async () =>
{
    //make fetch to /api/shop/createorder
    const response = await fetch('/api/shop/createorder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            items: ShopStorage.cart,
            pageId: pageId
        })
    }).then(res => res.json());

    location.href = response.session.url;

}

const openCart = () =>
{
    cart.innerHTML = `
    <div class="cart">
        <div class="cart__header">
            <h2>Cart</h2>
            <button onclick="closeCart()">X</button>
        </div>
        <div class="cart__body
        ">
            ${ShopStorage.cart.map(item => `
                <div class="cart__item">
                    <div class="cart__item__image">
                        <img src="${getProductById(item.id).image}">
                    </div>
                    <div class="cart__item__description">
                        <h3>${getProductById(item.id).name}</h3>
                        <p>${getProductById(item.id).cost},- Kč for each</p>
                        <div>
                            <p>Quantity:</p>
                            <input type="number" value="${item.quantity}" onchange="changeQuantity(${item.id}, this.value - ${item.quantity})">
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="cart__footer">
            <div>
                <h3>Total: ${ShopStorage.cart.reduce((acc, item) => acc + getProductById(item.id).cost * item.quantity, 0)}</h3>
                <p>Items: ${ShopStorage.cart.reduce((acc, item) => acc + item.quantity, 0)}</p>
            </div>
            <div>
                <button onclick="checkout()">Checkout</button>
            </div>
        </div>
    </div>
    `;
}

const changeQuantity = (id, quantity) =>
{

    if (quantity < 0) {
        if (ShopStorage.cart.find(item => item.id === id).quantity + quantity <= 0) {
            ShopStorage.cart = ShopStorage.cart.filter(item => item.id !== id);
            openCart();
            localStorage.setItem('cart', JSON.stringify(ShopStorage.cart));
            return;
        }
    }

    ShopStorage.cart.find(item => item.id === id).quantity += quantity;
    openCart();

    localStorage.setItem('cart', JSON.stringify(ShopStorage.cart));
}

if (localStorage.getItem('cart')) {
    ShopStorage.cart = JSON.parse(localStorage.getItem('cart'));
}