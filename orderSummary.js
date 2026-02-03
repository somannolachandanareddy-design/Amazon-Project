import {cart} from '/data/cart.js';
import {getPrice} from '/script/utils/money.js';
import {getMatchingProduct} from '/data/products.js';
import {deliveryOptions} from '/data/deliveryOptions.js';
import { addOrder } from '/data/orders.js';


export function renderOrderSummary() {
  let itemTotalCents = 0;
  let shippingCostCents = 0;
  let cartQuantity = cart.calculateQuantity();

  cart.cartItems.forEach(cartItem => {
    const matchingProduct = getMatchingProduct(cartItem.productId);
    itemTotalCents += matchingProduct.priceCents * cartItem.quantity;

    deliveryOptions.forEach((deliveryOption) => {
      if(deliveryOption.id === cartItem.deliveryOptionId){
        shippingCostCents += deliveryOption.priceCents;
      }
    });
  });

  const totalBeforeTaxCents = itemTotalCents + shippingCostCents;
  const taxCents = totalBeforeTaxCents*0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  document.querySelector('#order-summary-container').innerHTML = 
   `
    <div id="order-summary">Order Summary</div>
    <div class="order-summary-row">
      <div>
        <span>Items(</span>
        <span class="cart-quantity">${cartQuantity}</span>
        <span>):</span>
      </div>
      <span>$${getPrice(itemTotalCents)}</span>
    </div>
    <div class="order-summary-row" >
      <span>Shipping&handling</span>
      <span id="order-summary-shipping">$${getPrice(shippingCostCents)}</span>
    </div>
    <div class="order-summary-row">
      <span>Total before tax:</span>
      <span>$${getPrice(totalBeforeTaxCents)}</span>
    </div>
    <div class="order-summary-row" id="last-row">
      <span>Estimated tax(10%)</span>
      <span>$${getPrice(taxCents)}</span>
    </div>
    <div class="order-summary-row" id="order-total-row">
      <span >order total</span>
      <span id="order-summary-total">$${getPrice(totalCents)}</span>
    </div>
    <button id="place-your-order-button">Place your order</button>
  `; 

  document.querySelector('#place-your-order-button').addEventListener('click',async () => {
    try{
      const response = await fetch('https://supersimplebackend.dev/orders',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          cart:cart
        })
      });
      const order = await response.json();
      addOrder(order);

    }catch(error){
      console.log('Unexpected error try again later');
    }

    window.location.href = 'orders.html';
  })
}


