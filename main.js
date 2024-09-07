let images = document.querySelectorAll(".container .card-img");
let categories = document.querySelectorAll(".container .des-name");
let names = document.querySelectorAll(".container .des-details");
let prices = document.querySelectorAll(".container .price");
let addToCart = document.querySelectorAll(".card .image");
let orders = document.querySelector(".orders");
let Totalcarts = document.querySelector(".orders .carts");
let orderTotal = document.querySelector(".orders .order-total");
let totalPrice = document.querySelector(".orders .order-total .total-price");
let carbonImage = document.querySelector(".orders .carbon-image");
let orderBtn = document.querySelector(".confirm-order .order-btn");
let overlay = document.querySelector(".overlay");

const products = new Map();
let fullData;

let cartTotal = 0;

async function getData() {
  let fetchData = await fetch("./data.json");
  fullData = await fetchData.json();
  // // create cards
  // console.log(fullData);
  // for (let i = 0; i < 9; i++) {
  //   image = fullData[i].image.thumbnail;
  //   console.log(image);
  // }

  images.forEach((img, index) => {
    img.src = fullData[index].image.desktop;
  });

  categories.forEach((cat, index) => {
    cat.innerHTML = fullData[index].category;
  });

  names.forEach((name, index) => {
    name.innerHTML = fullData[index].name;
    name.setAttribute("data-product-name", fullData[index].name);
  });

  prices.forEach((price, index) => {
    price.textContent = `$${fullData[index].price.toFixed(2)}`;
  });
}

getData();

let totalCartsCount = 0;
let sumAllTotal = 0;

addToCart.forEach((add, index) => {
  add.onclick = function () {
    add.innerHTML = "";

    orderTotal.style.display = "flex";
    carbonImage.style.display = "flex";
    orderBtn.style.display = "block";
    // confirmOrder();

    add.classList.replace("image", "inc-decre");

    document
      .querySelector(".inc-decre ")
      .previousElementSibling.classList.add("card-img-border-red");

    const decrementSpan = document.createElement("span");
    decrementSpan.className = "decrement";
    decrementSpan.textContent = "-";

    let numberSpan = document.createElement("span");
    numberSpan.className = "number";
    numberSpan.innerHTML = 0;

    const incrementSpan = document.createElement("span");
    incrementSpan.className = "increment";
    incrementSpan.textContent = "+";

    add.appendChild(decrementSpan);
    add.appendChild(numberSpan);
    add.appendChild(incrementSpan);

    products.set(fullData[index].name, 0);

    decrementSpan.addEventListener("click", () => {
      const quantity = products.get(fullData[index].name);
      if (quantity > 0) {
        // count--;
        event.stopPropagation();
        const newQuantity = quantity - 1;
        products.set(fullData[index].name, newQuantity);
        totalCartsCount--;
        numberSpan.innerHTML = newQuantity;
        updateCart(index, newQuantity, numberSpan);
      }
    });

    incrementSpan.addEventListener("click", () => {
      const quantity = products.get(fullData[index].name);
      // count++;
      event.stopPropagation();
      const newQuantity = quantity + 1;
      products.set(fullData[index].name, newQuantity);
      ++totalCartsCount;
      numberSpan.textContent = newQuantity;
      updateCart(index, newQuantity, numberSpan);
    });
  };
});

function updateCart(index, count, numberSpan) {
  const itemPrice = parseFloat(prices[index].innerHTML.slice(1));
  const total = itemPrice * count;
  const name = names[index].innerHTML;

  createOrderInfo(count, itemPrice, total, name, numberSpan);
  updateTotalPrice();
  updateTotalCarts();
}

function updateTotalPrice() {
  totalPrice.innerHTML = `$${sumAllTotal.toFixed(2)}`;
}

function updateTotalCarts() {
  Totalcarts.innerHTML = totalCartsCount;
}

function createOrderInfo(count, itemPrice, total, name, numberSpan) {
  let existingOrderInfo = Array.from(orders.children).find((child) => {
    return (
      child.classList.contains("order-info") &&
      child.querySelector(".order-name").textContent === name
    );
  });

  if (existingOrderInfo) {
    existingOrderInfo.querySelector(".amount").textContent = `${count}x`;
    existingOrderInfo.querySelector(
      ".total-price"
    ).innerHTML = `$${total.toFixed(2)}`;
  } else {
    Array.from(orders.children).forEach((child) => {
      if (
        child.classList.contains("cart-empty") ||
        child.classList.contains("image")
      ) {
        child.style.display = "none";
      }
    });

    const orderInfoDiv = document.createElement("div");
    orderInfoDiv.className = "order-info";

    const innerDiv = document.createElement("div");

    const orderNameP = document.createElement("p");
    orderNameP.className = "order-name";
    orderNameP.textContent = name;

    const amountSpan = document.createElement("span");
    amountSpan.className = "amount";
    amountSpan.textContent = `${count}x`;

    const itemPriceSpan = document.createElement("span");
    itemPriceSpan.className = "item-price";
    itemPriceSpan.textContent = `$${itemPrice.toFixed(2)}`;

    const totalPriceSpan = document.createElement("span");
    totalPriceSpan.className = "total-price";
    totalPriceSpan.innerHTML = `$${total.toFixed(2)}`;

    innerDiv.appendChild(orderNameP);
    innerDiv.appendChild(amountSpan);
    innerDiv.appendChild(itemPriceSpan);
    innerDiv.appendChild(totalPriceSpan);

    const deleteDiv = document.createElement("div");
    deleteDiv.className = "delete";
    deleteDiv.textContent = "X";

    deleteDiv.addEventListener("click", function () {
      const productName =
        event.target.parentElement.querySelector(".order-name").textContent;
      const cardProductName = document.querySelector(
        `[data-product-name="${productName}"]`
      );

      // console.log(cardProductName);

      const amount = parseInt(
        event.target.parentElement.querySelector(".amount").textContent
      );
      // Remove the orderInfoDiv from the DOM

      // document.querySelectorAll(".inc-decre .number").forEach((ele) => {
      //   document.querySelectorAll(".order-info .amount").forEach((ele2) => {
      //     console.log(ele);
      //     console.log(ele2);
      //     if (ele.innerHTML === ele2.innerHTML[0]) {
      //       count = 0;
      //       document.querySelector(".inc-decre .number").innerHTML = count;
      //     }
      //   });
      // });

      cardProductName.parentElement.previousElementSibling.querySelector(
        ".number"
      ).textContent = 0;
      products.set(productName, 0);

      orderInfoDiv.remove();

      // Reset the product count to 0 and update the UI

      // Subtract the deleted product's count from the total cart count
      totalCartsCount -= amount;
      updateTotalCarts();

      // Recalculate the total price by removing the deleted product's total
      sumAllTotal -= itemPrice * amount;
      updateTotalPrice();

      // Check if the cart is empty and reset the UI accordingly
      if (orders.children.length === 1) {
        Array.from(orders.children).forEach((child) => {
          child.style.display = "flex";
        });
        orderTotal.style.display = "none";
        carbonImage.style.display = "none";
        orderBtn.style.display = "none";
        sumAllTotal = 0;
        totalCartsCount = 0;
      }
    });

    orderInfoDiv.appendChild(innerDiv);
    orderInfoDiv.appendChild(deleteDiv);
    orders.appendChild(orderInfoDiv);
  }

  // Update sumAllTotal
  sumAllTotal = Array.from(orders.querySelectorAll(".order-info")).reduce(
    (acc, orderInfo) => {
      const price = parseFloat(
        orderInfo.querySelector(".total-price").textContent.slice(1)
      );
      return acc + price;
    },
    0
  );
}

// function updateTotalPrice() {
//   totalPrice.innerHTML = `$${sumAllTotal.toFixed(2)}`;
// }

function updateTotalCarts() {
  Totalcarts.innerHTML = totalCartsCount;
}

// confirm order

document.addEventListener("DOMContentLoaded", () => {
  confirmOrder(); // Call confirmOrder here
});

function confirmOrder() {
  orderBtn.addEventListener("click", (event) => {
    event.preventDefault();
    overlay.style.position = "fixed";
    document.querySelector(".holder").style.display = "block";
    createFinalOrder();
  });
}

function updateAllElements() {
  // Update the total price by recalculating the sum of all product prices in the cart
  updateTotalPrice();

  // Update the total cart items count
  updateTotalCarts();

  // Check if the cart is empty and reset the UI if necessary
  if (orders.children.length === 1) {
    // If only the placeholder is present, show empty cart message and hide other UI elements
    Array.from(orders.children).forEach((child) => {
      child.style.display = "flex";
    });
    orderTotal.style.display = "none";
    carbonImage.style.display = "none";
    orderBtn.style.display = "none";
    sumAllTotal = 0;
    totalCartsCount = 0;
  }
}

function createFinalOrder() {
  let orderInfos = document.querySelectorAll(".order-info div:first-child");
  let orderTotals = document.querySelectorAll(".order-total");
  // orderInfos = [...new Set(orderInfos)];
  let finalOrder = document.querySelector(".final-order");

  finalOrder.innerHTML = "";
  orderInfos.forEach((orderInfo, index) => {
    console.log(`Order ${index + 1}:`, orderInfo);
    finalOrder.appendChild(orderInfo.cloneNode(true)); // Print each orderInfo one at a time
  });
  orderTotals.forEach((orderTotal, index) => {
    finalOrder.appendChild(orderTotal.cloneNode(true)); // Print each orderInfo one at a time
  });
}

document.querySelector(".final-order-btn").onclick = function () {
  document.querySelector(".holder").style.display = "none";
  location.reload();
};
