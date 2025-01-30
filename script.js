const productList = document.querySelector('.product-list');

console.log(productList)

async function loadGoods() {
    try {
      const response = await fetch('./goods.json');
      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }
      const data = await response.json();
      console.log(data.goods);
      return data.goods
    } catch (error) {
      console.error('Ошибка:', error);
      return [];
    }
  }

async function initGoods() {
    const goods = await loadGoods();

    console.log(goods)

    for (let i = 0; i < goods.length; i += 1) {
        const element = goods[i]

        const item = document.createElement('div');
        item.setAttribute("type", element.type);
        item.classList.add('item');

        const img = document.createElement('img');
        img.src = element.imgUrl;

        const h1 = document.createElement('h1');
        h1.textContent = element.title;

        const description = document.createElement('div');
        description.classList.add('description');
        description.textContent = element.description;

        const price = document.createElement('price');
        price.classList.add('price');
        price.textContent = `${element.price} Руб.`;

        const button = document.createElement('button');
        button.classList.add('add-to-cart');
        button.textContent = "Добавить в корзину"

        item.appendChild(img);
        item.appendChild(h1);
        item.appendChild(description);
        item.appendChild(price);
        item.appendChild(button);

        productList.appendChild(item);
    }
}

initGoods()

document.addEventListener("DOMContentLoaded", async () => {
  const cartTotal = document.getElementById("cart-total");
  const productList = document.getElementById("product-list");
  const clearCartButton = document.querySelector(".clear-cart");

  let totalPrice = 0;
  let goods = [];

  async function loadGoods() {
    try {
      const response = await fetch("goods.json");
      const data = await response.json();
      goods = data.goods;
      renderGoods(goods);
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
    }
  }

  function renderGoods(goods) {
    productList.textContent = ""; 

    goods.forEach((item) => {
      const productElement = document.createElement("div");
      productElement.classList.add("item");

      const img = document.createElement("img");
      img.src = item.imgUrl;
      img.alt = item.title;
      productElement.appendChild(img);

      const title = document.createElement("h1");
      title.textContent = item.title;
      productElement.appendChild(title);

      const description = document.createElement("div");
      description.classList.add("description");
      description.textContent = item.description;
      productElement.appendChild(description);

      const price = document.createElement("div");
      price.classList.add("price");
      price.textContent = `${item.price} Руб.`;
      productElement.appendChild(price);

      const button = document.createElement("button");
      button.classList.add("add-to-cart");
      button.textContent = "Добавить в корзину";
      button.dataset.price = item.price; 
      button.addEventListener("click", addToCart);
      productElement.appendChild(button);

      productList.appendChild(productElement);
    });
  }

  function addToCart(event) {
    const price = parseInt(event.target.dataset.price, 10);
    totalPrice += price;
    cartTotal.textContent = totalPrice;
  }

  clearCartButton.addEventListener("click", () => {
    totalPrice = 0;
    cartTotal.textContent = totalPrice;
  });

  loadGoods();
});
