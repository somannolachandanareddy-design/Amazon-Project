import {cart} from '/data/cart.js';
import { getMatchingProduct, loadProductsFetch} from '/data/products.js';
import { formatDate } from './utils/date.js';
//use ESM version external file
import { renderDeliveryOptions, calculateDeliveryDays, getMatchingDeliveryOption} from '/data/deliveryOptions.js';
import { renderOrderSummary } from './orderSummary.js';

//create new promise instance, give a function in the parameter, when resolve called then then() will call
loadProductsFetch().then(() => {
  renderCheckoutPage();
});

export function renderCheckoutPage(){
  renderCartItems();
  renderOrderSummary();
  cart.renderCartQuantity();
}

export function renderCartItems() {
  let cartItemsHtml = '';
  cart.cartItems.forEach(cartItem => {
    let matchingProduct = getMatchingProduct(cartItem.productId);
    cartItemsHtml += `
    <div class="added-product added-product-${matchingProduct.id}">
      <div class="delivery-date delivery-date-${matchingProduct.id}">Delivery date:${formatDate(calculateDeliveryDays(getMatchingDeliveryOption(cartItem.deliveryOptionId)))}</div>
      <div class="added-product-main">
        <div class="product-info">
          <img src=${matchingProduct.getProductImage()}>
          <div class="added-product-details">
            <div class="added-product-name added-product-name-${matchingProduct.id}">${matchingProduct.name}</div>
            <span class="added-product-price added-product-price-${matchingProduct.id}">${matchingProduct.getPrice()}</span>
            <div class="quantity-section js-quantity-${matchingProduct.id}">
              <span>Quantity:</span>
              <span class="quantity quantity-${matchingProduct.id}">${cartItem.quantity}</span>
              <button class="update-button update-button-${matchingProduct.id}" data-product-id="${matchingProduct.id}">Update</button>
              <input class="quantity-input quantity-input-${matchingProduct.id}">
              <button class="save-quantity-button">Save</button>
              <button class="delete-button delete-button-${matchingProduct.id}" data-product-id="${matchingProduct.id}">Delete</button>
            </div>
          </div>
        </div>
        <div class="delivery-options">
          <span class="choose-delivery-option">Choose a delivery option:</span>
          ${renderDeliveryOptions(matchingProduct,cartItem)}
        </div>
      </div>
    </div>
    `;
    
  });
  document.querySelector('#added-product-container').innerHTML = cartItemsHtml;

  const $deleteButtons = document.querySelectorAll('.delete-button');
  $deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener('click', () => {
      const productId = deleteButton.dataset.productId;
      cart.deleteProduct(productId);
      renderCartItems();
      cart.renderCartQuantity();
      renderOrderSummary();
    });
  });

  const $updateButtons = document.querySelectorAll('.update-button');
  $updateButtons.forEach((updateButton) => {
    updateButton.addEventListener('click', () => {
      const productId = updateButton.dataset.productId;
      update(productId);
    });
  });

  const $deliveryOptions = document.querySelectorAll('.delivery-option-input');
  $deliveryOptions.forEach((deliveryOptionInput) => {
    deliveryOptionInput.addEventListener('click', () => {
      const productId = deliveryOptionInput.dataset.productId;
      cart.updateDeliveryDate(productId, deliveryOptionInput.value);

      renderOrderSummary();
      renderCartItems();
    })
  })
}

function save($addedProduct,productId) {
  $addedProduct.classList.remove('is-editing-quantity');
  const $quantityInput = document.querySelector(`.quantity-input-${productId}`);
  if($quantityInput){
    const newQuantity = Number($quantityInput.value);
    if($quantityInput.value === ''){
      cart.updateQuantity(productId,Number(document.querySelector(`.quantity-${productId}`).innerHTML));
      renderCartItems();
      cart.renderCartQuantity();
    }else{
      if(newQuantity > 0 && newQuantity <= 99){
        cart.updateQuantity(productId,newQuantity);
        renderCartItems();
        cart.renderCartQuantity();
        renderOrderSummary();
      }else if(newQuantity === 0){
        cart.deleteProduct(productId);
        renderCartItems();
        cart.renderCartQuantity();
        renderOrderSummary();
      }
    }
  }else{
    console.log('Quantity input is missing!');
  }
}

function update(productId) {
  const $addedProduct = document.querySelector(`.added-product-${productId}`);
  $addedProduct.classList.add('is-editing-quantity');
  const $quantityInput = document.querySelector(`.quantity-input-${productId}`);
  
  const $saveButtons = document.querySelectorAll('.save-quantity-button');
  $saveButtons.forEach((saveButton) => {
    saveButton.addEventListener('click', () => {
      save($addedProduct,productId);
    })
    $quantityInput.addEventListener('keydown', (event) => {
      if(event.key === 'Enter'){
        save($addedProduct,productId);
      }
    })
  })
}



