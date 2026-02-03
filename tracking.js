import { loadProductsFetch, getMatchingProduct} from '/data/products.js';
import {cart} from '/data/cart.js';
import {getMatchingOrderProduct, getOrder} from '/data/orders.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

const url = new URL(window.location.href);
const productId = url.searchParams.get('productId');
const orderId = url.searchParams.get('orderId');

cart.renderCartQuantity();
loadPage();

async function loadPage(){
  await loadProductsFetch();
  renderProduct();
}

function renderProduct() {
  const matchingOrder = getOrder(orderId);
  const matchingOrderItem = getMatchingOrderProduct(orderId,productId);
  const matchingProduct = getMatchingProduct(productId);

  const today = dayjs();
  const orderTime = -dayjs(matchingOrder.orderTime);
  const estimatedDeliveryTime = dayjs(matchingOrderItem.estimatedDeliveryTime);

  const progressPercent = ((today-orderTime)/(estimatedDeliveryTime-orderTime))*100;

  const html = `
    <p class="arriving-time">
      Arriving on ${estimatedDeliveryTime.format('dddd, MMMM, D')}
    </p>
    <p class="product-name">
      ${matchingProduct.name}
    </p>
    <p class="quantity">
      quantity: ${matchingOrderItem.quantity}
    </p>
    <img class="product-image" src="${matchingProduct.getProductImage()}" width="150px"></img>
    <div class="progress-labels-container">
      <span class="progress-label ${progressPercent <50 ? 'current-status':''}">
        Preparing
      </span>
      <span class="progress-label ${progressPercent >=50 && progressPercent< 100? 'current-status':''}">
        Shipped
      </span>
      <span class="progress-label ${progressPercent >= 100 ? 'current-status':''}">
        Delivered
      </span>
    </div>
    <div class="progress-bar-container">
      <div class="progress" style="width: ${progressPercent}%;"></div>
    </div>
  `
  document.querySelector('.product-container').innerHTML = html;
}