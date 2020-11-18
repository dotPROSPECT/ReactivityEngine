import { reactive, effect, ref } from './reactivityEngine';

let product = reactive( { quantity: 2, price: 5 } );
let salePrice = ref( 0 );
let total = 0;

effect( () => {
  salePrice.value = product.price * 0.9;
} );

effect( () => {
  total = salePrice.value * product.quantity;
} );

console.log(
  `Before updated quantity total (should be 9) = ${total} salePrice (should be 4.5) = ${salePrice.value}`
);
product.quantity = 3;
console.log(
  `After updated quantity total (should be 13.5) = ${total} salePrice (should be 4.5) = ${salePrice.value}`
);
product.price = 10;
console.log(
  `After updated price total (should be 27) = ${total} salePrice (should be 9) = ${salePrice.value}`
);