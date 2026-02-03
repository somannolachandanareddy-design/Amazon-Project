import { cart } from '/data/cart.js';
import { products, loadProductsFetch } from '/data/products.js';

const $productGrid = document.querySelector('#product-grid');
const $searchBox = document.querySelector('#search-box');


loadPage();

async function loadPage(){
  await loadProductsFetch();
  renderProducts();
  document.querySelector('#search-button').addEventListener('click',search);
}

function search(){
  window.location.href = `/html/amazon-home.html?search=${$searchBox.value}`;
  renderProducts();
}

function renderProducts() {
  cart.renderCartQuantity();

  const url = new URL(window.location.href);
  const search = url.searchParams.get('search');

  let filteredProducts = products;
  if(search){
    filteredProducts = products.filter((product) => {
      let matchingKeyword = false;

      product.keywords.forEach((keyword) => {
        if(keyword.toLowerCase().includes(search.toLowerCase())){
          matchingKeyword = true;
        }
      });

      return matchingKeyword || product.name.toLowerCase().includes(search.toLowerCase());
    });

  }

  let productHtml = '';

  filteredProducts.forEach((product) => {
    productHtml += `
    <div class="product-card" data-productId="${product.id}">
      <div class="image-container">
        <img src=${product.getProductImage()}>
      </div>
      <p class="product-name">${product.name}</p>
      <div class="rating">
        <img src=${product.getStarsUrl()} class="star-image">
        <span class="count">${product.rating.count}</span>
      </div>
      <span class="price">${product.getPrice()}</span>
      <select class="amount selector-${product.id}">
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
        <option>6</option>
        <option>7</option>
        <option>8</option>
        <option>9</option>
        <option>10</option>
      </select>
      <div class="added-pop-up added-pop-up-${product.id}">
        <img src="/images/checkmark.png" class="added-image">
        <span class="added-message">Added</span>
      </div>
      ${product.extraInfoHtml()}
      <button class="add-button" data-product-id="${product.id}">Add to Cart</button>
    </div>
  `});
  $productGrid.innerHTML = productHtml;
  
  const $addButtons = document.querySelectorAll('.add-button');
  
  $addButtons.forEach((addButton) => {
    //1.クリックされたときに個別にタイムアウトIDを管理する
    let addedMessageTimeoutId;
    addButton.addEventListener('click', () => {
      //const productId = addButton.dataset.productId;
      const {productId} = addButton.dataset;
      cart.addToCart(productId);
      cart.renderCartQuantity();
      const $addedPopUp = document.querySelector(`.added-pop-up-${productId}`);
      $addedPopUp.classList.add('show');
      //2.すでにタイムアウトがある場合クリアする
      if(addedMessageTimeoutId){
        clearTimeout(addedMessageTimeoutId);
      }
      //3.タイムアウトがない場合変数にタイムアウトを入れる
      const timeoutId = setTimeout(() => {
        $addedPopUp.classList.remove('show');
      }, 2000);
      //4.個別のタイムアウトIDにいれる
      addedMessageTimeoutId = timeoutId;
    });
  });
}



 