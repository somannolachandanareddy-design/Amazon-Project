import {deliveryOptions} from '/data/deliveryOptions.js';

class Cart {
  //private
  cartItems;
  #localStorageKey;

  constructor(localStorageKey){
    this.#localStorageKey = localStorageKey;
    this.loadFromStorage();
  }
  loadFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey)) || [/*{
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 1,
      deliveryOptionId: '1'
    },
    {
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity:2,
      deliveryOptionId: '2'
    }*/];
  }

  addToCart (productId) {
    let matchingItem ='';
    let quantity = 1;
    if(document.querySelector(`.selector-${productId}`)){
     quantity = Number(document.querySelector(`.selector-${productId}`).value);
    }
  
    this.cartItems.forEach( (cartItem) => {
      if(productId === cartItem.productId){
        matchingItem = cartItem;
      }
    });
  
    if(!matchingItem){
      this.cartItems.push({
        productId,
        quantity,
        deliveryOptionId: '1'
      });
    }else{
      matchingItem.quantity += quantity;
    }
    this.saveToLocalStorage();
  }

  renderCartQuantity() {
    const $cartQuantity = document.querySelectorAll('.cart-quantity');
    $cartQuantity.forEach((cartQuantity) => {
      cartQuantity.innerHTML = this.calculateQuantity();
    });
  }

  deleteProduct (productId) {
    const newCart = this.cartItems.filter((cartItem) => {
      return cartItem.productId !== productId;
    });
  
    this.cartItems = newCart;
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    localStorage.setItem(this.#localStorageKey,JSON.stringify(this.cartItems));
  }

  updateQuantity(productId,quantity){
    this.cartItems.forEach((cartItem) => {
      if(cartItem.productId === productId){
        cartItem.quantity = quantity;
      }
    })
    this.saveToLocalStorage();
  }

  updateDeliveryDate(productId, deliveryOptionId){
    let matchingDeliveryOption;
    deliveryOptions.forEach((deliveryOption) => {
      if(deliveryOption.id === deliveryOptionId){
        matchingDeliveryOption = deliveryOption;
      }
    });
    if(!matchingDeliveryOption){
      return;
    }
    this.cartItems.forEach((cartItem) => {
      if(productId ===cartItem.productId){
        cartItem.deliveryOptionId = deliveryOptionId;
        this.saveToLocalStorage();
      }else{
        return;
      }
    });
  }

  getMatchingCartItem(productId) {
    this.cartItems.forEach((cartItem) => {
      if(productId === cartItem.productId){
        return cartItem;
      }
    })
  }

  calculateQuantity () {
    let totalQuantity = 0;
    this.cartItems.forEach( (cartItem) => {
      totalQuantity += cartItem.quantity;
    });
    return totalQuantity;
  }

  resetCart(){
    this.cartItems = [];
    this.saveToLocalStorage();
  }
}

export const cart = new Cart('cart');

