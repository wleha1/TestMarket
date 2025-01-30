const productList = document.querySelector(".product-list");
const pagination = document.querySelector(".pagination");

const itemsPerPage = [];

async function loadGoods() {
  try {
    const response = await fetch("./goods.json");
    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.status}`);
    }
    const data = await response.json();
    return data.goods;
  } catch (error) {
    console.error("Ошибка:", error);
    return [];
  }
}

// Создание кнопки страницы
function createPageButton(number) {
  const button = document.createElement('button');
  button.textContent = number;

  // Устанавливаем текущую страницу
  button.classList.add('page-button');
  if (number === 1) {
    button.classList.add('current');
  }

  button.addEventListener('click', () => {
    showPage(number);
    updateCurrentPageButton(number);
  });

  pagination.appendChild(button);
}

function showPage(pageNumber) {
  productList.innerHTML = "";

  const page = itemsPerPage.find(p => p.pageCount === pageNumber);

  if (page) {
    page.items.forEach(element => {
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

      item.appendChild(img);
      item.appendChild(h1);
      item.appendChild(description);
      item.appendChild(price);
      item.appendChild(button);

      productList.appendChild(item);
    });
  }
}

function updateCurrentPageButton(currentPage) {
  const buttons = pagination.querySelectorAll('button');
  buttons.forEach(button => {
    button.classList.remove('current');
  });
  const currentButton = Array.from(buttons).find(button => button.textContent == currentPage);
  if (currentButton) {
    currentButton.classList.add('current');
  }
}

async function initGoods() {
  const goods = await loadGoods();
  let tempItems = [];
  let pageCount = 1;

  for (let i = 0; i < goods.length; i++) {
    const element = goods[i];
    tempItems.push(element);

    if (tempItems.length === 4 || i === goods.length - 1) {
      itemsPerPage.push({ pageCount, items: [...tempItems] });
      tempItems = [];
      createPageButton(pageCount); 
      pageCount += 1;
    }
  }
  showPage(1);
}

initGoods();
