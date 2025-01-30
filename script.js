const productList = document.querySelector(".product-list");
const pagination = document.querySelector(".pagination");
const cartTotal = document.getElementById("cart-total");
const clearCartButton = document.querySelector(".clear-cart");

let totalPrice = 0;
const itemsPerPage = [];

async function loadGoods() {
  try {
    const response = await fetch("./goods.json");
    if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
    const data = await response.json();
    return data.goods;
  } catch (error) {
    console.error("Ошибка:", error);
    return [];
  }
}

function updateCurrentPageButton(currentPage) {
  const buttons = pagination.querySelectorAll('button');
  buttons.forEach(button => button.classList.toggle('current', button.textContent == currentPage));
}

function handleAddToCart(price) {
  totalPrice += price;
  cartTotal.textContent = totalPrice;
}

function createProductItem(element) {
  const item = document.createElement("div");
  item.setAttribute("type", element.type);
  item.classList.add("item");

  const img = document.createElement("img");
  img.src = element.imgUrl;

  const h1 = document.createElement("h1");
  h1.textContent = element.title;

  const description = document.createElement("div");
  description.classList.add("description");
  description.textContent = element.description;

  const price = document.createElement("div");
  price.classList.add("price");
  price.textContent = `${element.price} Руб.`;

  const button = document.createElement("button");
  button.classList.add("add-to-cart");
  button.textContent = "Добавить в корзину";
  button.addEventListener('click', () => handleAddToCart(parseInt(element.price, 10)));

  item.append(img, h1, description, price, button);
  return item;
}

function showPage(pageNumber) {
  productList.innerHTML = "";
  const page = itemsPerPage.find(p => p.pageCount === pageNumber);
  if (page) {
    page.items.forEach(element => {
      const item = createProductItem(element);
      productList.appendChild(item);
    });
  }
}

function createPageButton(number) {
  const button = document.createElement('button');
  button.textContent = number;
  button.classList.add('page-button');
  if (number === 1) button.classList.add('current');
  
  button.addEventListener('click', () => {
    showPage(number);
    updateCurrentPageButton(number);
  });

  pagination.appendChild(button);
}

async function initGoods() {
  const goods = await loadGoods();
  let tempItems = [];
  let pageCount = 1;

  goods.forEach((element, index) => {
    tempItems.push(element);

    if (tempItems.length === 4 || index === goods.length - 1) {
      itemsPerPage.push({ pageCount, items: [...tempItems] });
      createPageButton(pageCount);
      tempItems = [];
      pageCount += 1;
    }
  });

  showPage(1);
}

clearCartButton.addEventListener("click", () => {
  totalPrice = 0;
  cartTotal.textContent = totalPrice;
});

initGoods();
