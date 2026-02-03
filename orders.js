import {getPrice} from '/script/utils/money.js';
import {getMatchingProduct, loadProductsFetch} from '/data/products.js';
import {orders} from '/data/orders.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {cart} from '/data/cart.js';



window.addEventListener('load',() => {
  loadProductsFetch().then(() => {
    if (window.location.pathname.includes('orders.html')) {
      renderOrders(orders);
      cart.renderCartQuantity();
    }
  });
})

function renderOrders(orders){
  let OrderHtml = '';
  const orderTimeString = dayjs(orders.orderTime).format('MMMM D');

  orders.forEach((order) => {
    const deliveryTimeString = dayjs(order.estimatedDeliveryTime).format('MMMM d');
    let OrderProductsHtml = '';
    order.products.forEach((product) => {
      const matchingProduct = getMatchingProduct(product.productId);
      OrderProductsHtml += `
        <div class="order-product-container">
          <section class="order-product-left">
            <img src="/${matchingProduct.image}" width="100px">
          </section>
          <section class="order-product-middle">
            <p class="order-product-name">
            ${matchingProduct.name}
            </p>
            <p>
              Arriving on:${deliveryTimeString}
            </p>
            <p>
              Quantity:${product.quantity}
            </p>
            <button class="buy-again-button" data-product-id="${matchingProduct.id}">
              <img class="buy-again-image" src="/images/buy-again.png" width="30px">
              <span>Buy it again</span>
            </button>
          </section>
          <section class="order-product-right">
            <button data-product-id="${matchingProduct.id}" data-order-id="${order.id}" class="track-package-button" >Track package</button>
          </section>
        </div>
      `;
    });

    OrderHtml += `
      <div class="order-container">
        <div class="order-header">
          <section class="order-header-left">
            <span class="order-header-top">
              Order Placed:
            </span>
            <span class="order-header-down">
              ${orderTimeString}
            </span>
          </section>
          <section class="order-header-middle">
            <span class="order-header-top">
              Total:
            </span>
            <span class="order-header-down">
              $${getPrice(order.totalCostCents)}
            </span>
          </section>
          <section class="order-header-right">
            <span class="order-header-top">
              Order ID:
            </span>
            <span class="order-header-down">
              ${order.id}
            </span>
          </section>
        </div>
        <div class="order-main">
          <div class="order-products-container">${OrderProductsHtml}</div>
        </div>
      </div>
    `;
  });
  document.querySelector('#orders-container').innerHTML = OrderHtml;

  document.querySelectorAll('.buy-again-button').forEach((button) => {
    button.addEventListener('click',() => {
      const productId = button.dataset.productId;
      cart.addToCart(productId);
      cart.renderCartQuantity();
      button.innerHTML = `<span class="buy-again-button">Added</span>`;

      setTimeout(() => {
        button.innerHTML = `
          <img class="buy-again-image" src="/images/buy-again.png" width="30px">
          <span>Buy it again</span>
        `;
      },1000)
    });
  });

  document.querySelectorAll('.track-package-button').forEach((button) => {
    button.addEventListener('click',() => {
      const orderId = button.dataset.orderId;
      const productId = button.dataset.productId;
      window.location.href = `tracking.html?orderId=${orderId}&productId=${productId}`;
    })
  })
}

