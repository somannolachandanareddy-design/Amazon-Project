//copied
import {getPrice} from '/script/utils/money.js';

class Product {
  id;
  image;
  name;
  rating;
  priceCents;
  keywords;
  
  constructor(productDetails){
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
    this.keywords = productDetails.keywords;
  }

  getStarsUrl() {
    return `/images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice(){
    return`$${getPrice(this.priceCents)}`;
  }

  getProductImage() {
    return `/${this.image}`;
  }

  extraInfoHtml() {
    return '';
  }
}

class Clothing extends Product{
  sizeChartLink;

  constructor(productDetails){
    super(productDetails);

    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHtml() {
    return `
    <a href="/${this.sizeChartLink}" target="_blank">
      Size Chart
    </a>
    `
  }
}
export function getMatchingProduct(productId) {
  return products.find((product) => {
    return productId === product.id
  });
};

export let products = [];

export function loadProductsFetch() {
  //fetch uses promise
  const promise = fetch('https://supersimplebackend.dev/products').then((response) => {
    //response.json() is the data which is in the response
    return response.json();
  }).then((data) => {
    //data is already converted to js object
    products = data.map((productDetails) => {
      if(productDetails.type === 'clothing'){
        return new Clothing(productDetails);
      }
      return new Product(productDetails);
    });
  });
  return promise;
}

loadProductsFetch().then(() => {

})

/*
export function loadProducts(fun){
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load',() => {
    products = JSON.parse(xhr.response).map((productDetails) => {
      if(productDetails.type === 'clothing'){
        return new Clothing(productDetails);
      }
      return new Product(productDetails);
    });

    fun();
  })
  xhr.open('GET','https://supersimplebackend.dev/products');
  xhr.send();
}
*/
