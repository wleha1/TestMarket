const productList = document.querySelector(".product-list");
const pagination = document.querySelector(".pagination");
const cartTotal = document.getElementById("cart-total");
const cartItemsContainer = document.createElement("div");
cartItemsContainer.classList.add("cart-items");
document.querySelector(".cart").insertBefore(cartItemsContainer, document.querySelector(".cart-footer"));
const clearCartButton = document.querySelector(".clear-cart");
const categoryFilter = document.getElementById("category");
const sortFilter = document.getElementById("sort");
const searchInput = document.getElementById("search");

let totalPrice = 0;
let allGoods = [];
let itemsPerPage = [];
let filteredGoods = [];

async function loadGoods() {
  try {
    const response = await fetch("./goods.json");
    if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
    const data = await response.json();
    allGoods = data.goods;
    filteredGoods = [...allGoods];
    return filteredGoods;
  } catch (error) {
    console.error("Ошибка:", error);
    return [];
  }
}

function updateCurrentPageButton(currentPage) {
  const buttons = pagination.querySelectorAll("button");
  buttons.forEach((button) =>
    button.classList.toggle("current", button.textContent == currentPage)
  );
}

function updateCartDisplay(title, price) {
  const cartItem = document.createElement("div");
  cartItem.classList.add("cart-item");
  cartItem.textContent = `${title} - ${price} руб.`;
  cartItemsContainer.appendChild(cartItem);
}

function handleAddToCart(title, price) {
  totalPrice += price;
  cartTotal.textContent = totalPrice;
  updateCartDisplay(title, price);
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
  button.addEventListener("click", () =>
    handleAddToCart(element.title, parseInt(element.price, 10))
  );

  item.append(img, h1, description, price, button);
  return item;
}

function showPage(pageNumber) {
  productList.innerHTML = "";
  const page = itemsPerPage.find((p) => p.pageCount === pageNumber);
  if (page) {
    page.items.forEach((element) => {
      const item = createProductItem(element);
      productList.appendChild(item);
    });
  }
}

function createPageButton(number) {
  const button = document.createElement("button");
  button.textContent = number;
  button.classList.add("page-button");
  if (number === 1) button.classList.add("current");

  button.addEventListener("click", () => {
    showPage(number);
    updateCurrentPageButton(number);
  });

  pagination.appendChild(button);
}

function clearPagination() {
  pagination.innerHTML = ""; 
}

function filterAndSortGoods() {
  const category = categoryFilter.value;
  const sort = sortFilter.value;
  const searchQuery = searchInput.value.toLowerCase();

  let result = allGoods.filter(item => {
    if (category !== "all" && item.category !== category) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery)) return false;
    return true;
  });


  if (sort === "price-asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === "name-asc") {
    result.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "name-desc") {
    result.sort((a, b) => b.title.localeCompare(a.title));
  }

  filteredGoods = result;
  paginateGoods();
}

function paginateGoods() {
  itemsPerPage = [];
  let tempItems = [];
  let pageCount = 1;

  filteredGoods.forEach((element, index) => {
    tempItems.push(element);

    if (tempItems.length === 4 || index === filteredGoods.length - 1) {
      itemsPerPage.push({ pageCount, items: [...tempItems] });
      createPageButton(pageCount);
      tempItems = [];
      pageCount += 1;
    }
  });

  showPage(1);
}

async function initGoods() {
  await loadGoods();
  filterAndSortGoods();
}

categoryFilter.addEventListener('change', () => {
  clearPagination();
  filterAndSortGoods();
});
sortFilter.addEventListener('change', () => {
  clearPagination();
  filterAndSortGoods();
});
searchInput.addEventListener('input', () => {
  clearPagination();
  filterAndSortGoods();
});

clearCartButton.addEventListener("click", () => {
  totalPrice = 0;
  cartTotal.textContent = totalPrice;
  cartItemsContainer.innerHTML = ""; 
});

initGoods();
