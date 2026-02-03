import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { formatDate } from '/script/utils/date.js';
import {getPrice} from '/script/utils/money.js';
import isWeekend from '/script/utils/isWeekEnds.js';
//can rename if it's default function 
export const deliveryOptions = [
  {
    id : '1',
    deliveryDays: 7,
    priceCents:0
  },{
    id : '2',
    deliveryDays: 3,
    priceCents:499
  },{
    id : '3',
    deliveryDays: 1,
    priceCents:799
  }
];

export function calculateDeliveryDays(deliveryOption) {
  let remainingDays = deliveryOption.deliveryDays;
  let deliveryDate = dayjs();

  while(remainingDays > 0) {
    deliveryDate = deliveryDate.add(1,'days');
    if(!isWeekend(deliveryDate)){
      remainingDays--;
    }
  }

  return deliveryDate;
}

export function renderDeliveryOptions(matchingProduct,cartItem){
  let deliveryOptionHtml = '';
  const today = dayjs();

  deliveryOptions.forEach((deliveryOption) => {
    const deliveryPrice = deliveryOption.priceCents === 0 ? 'Free': `$${getPrice(deliveryOption.priceCents)}-`;
    const isChecked = cartItem.deliveryOptionId === deliveryOption.id;

    deliveryOptionHtml +=
    `<div class="delivery-option delivery-option-${matchingProduct.id}-${deliveryOption.id}">
      <input type="radio" name="delivery-option-${matchingProduct.id}" class="delivery-option-input delivery-option-input-${matchingProduct.id}-${deliveryOption.id}" ${isChecked ?'checked':'' } value="${deliveryOption.id}" data-product-id="${matchingProduct.id}">
      <div class="delivery-option-detail">
        <span class="delivery-option-date">${formatDate(calculateDeliveryDays(deliveryOption))}</span>
        <span class="delivery-option-price">${deliveryPrice} Shipping</span>
      </div>
    </div>`
  });
  return deliveryOptionHtml;
}

export function getMatchingDeliveryOption(deliveryOptionId) {
  return deliveryOptions.find(deliveryOption => deliveryOptionId===deliveryOption.id);
}