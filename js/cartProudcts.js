import products from "./utils.js";

let productsInCart = JSON.parse(localStorage.getItem("proudectInCart")) || [];

const productsContainer = document.querySelector(".products");
const totalContainer = document.querySelector(".total");
const totalPriceElement = document.querySelector(".total .totalPrice");

let total = localStorage.getItem("totalPrice") ? +localStorage.getItem("totalPrice") : 0;

if (productsInCart.length > 0) {
  renderCart(productsInCart);
} else {
  showEmptyCart();
}

// ------------------Cart Logices--------------------------------
function renderCart(products) {
  let tableHTML = `
    <table class="table cart-table align-middle text-center table-bordered table-striped">
      <thead class="thead-dark">
        <tr>
          <th>PRODUCT</th>
          <th>PRICE</th>
          <th>QUANTITY</th>
          <th>SUBTOTAL</th>
          <th></th>
        </tr>
      </thead>
      <tbody id="cartItems">
  `;

  let mobileHTML = `<div class="mobile-cart">`;

  products.forEach((item) => {
    const quantity = +(localStorage.getItem(`quantity-${item.id}`)) || 1;
    const subtotal = (item.salePrice * quantity);

    tableHTML += `
      <tr id="cart-item-${item.id}">
        <td class="text-left"><img src="${item.imageURL}" class="cart-img" alt="${item.title}"> ${item.title}</td>
        <td class="text-primary">${item.salePrice} EGP</td>
        <td>
          <button class="btn btn-outline-secondary btn-sm minus" data-product-id="${item.id}" data-product-price="${item.salePrice}">−</button>
          <span id="quantity-${item.id}" class="mx-2">${quantity}</span>
          <button class="btn btn-outline-secondary btn-sm plus" data-product-id="${item.id}" data-product-price="${item.salePrice}">+</button>
        </td>
        <td id="subtotal-${item.id}" class="text-success">${subtotal}</td>
        <td><button class="btn btn-outline-danger btn-sm RemoveFromCartBtn" data-product-id="${item.id}">&times;</button></td>
      </tr>
    `;

    mobileHTML += `
      <div class="mobile-cart-item" id="mobile-cart-${item.id}">
        <button class="mobile-cart-remove RemoveFromCartBtn" data-product-id="${item.id}">×</button>
        <div class="mobile-cart-header">
          <img class="mobile-cart-img" src="${item.imageURL}" alt="${item.title}">
          <div class="mobile-cart-info">
            <span class="mobile-cart-title">${item.title}</span>
            <span class="mobile-cart-price">${item.salePrice} EGP</span>
          </div>
        </div>
        <div class="mobile-cart-body">
          <div class="mobile-quantity-controls">
            <button class="minus" data-product-id="${item.id}" data-product-price="${item.salePrice}">−</button>
            <span id="quantity-${item.id}" class="mobile-quantity-display">${quantity}</span>
            <button class="plus" data-product-id="${item.id}" data-product-price="${item.salePrice}">+</button>
          </div>
          <div class="mobile-cart-subtotal" id="subtotal-${item.id}">${subtotal}</div>
        </div>
      </div>
    `;
  });

  tableHTML += `</tbody></table>`;
  mobileHTML += `</div>`;

  productsContainer.innerHTML = tableHTML + mobileHTML;

  updateTotal();
  registerCartEvents();
}

//-----------------Start Show empty cart message------------
function showEmptyCart() {
  productsContainer.innerHTML = `
    <div class="products-not-found text-center my-5">
      <img src="images/product_not_found.jpeg" alt="No products" class="img-fluid mb-3" style="max-width: 300px;">
      <h5 class="text-muted mb-3">Your Cart is Empty!</h5>
      <a href="index.html" class="btn btn-primary">
        Browse Products <i class="fas fa-shopping-cart"></i>
      </a>
    </div>
  `;
  totalContainer.style.display = "none";
}
//-----------------End Show empty cart message------------

//-----------------Start Update total price------------
function updateTotal() {
  total = productsInCart.reduce((sum, item) => {
    const quantity = +(localStorage.getItem(`quantity-${item.id}`)) || 1;
    return sum + item.salePrice * quantity;
  }, 0);

  totalPriceElement.textContent = `${total} EGP`;
  localStorage.setItem("totalPrice", total.toString());
}
//-----------------End Update total price------------

//-----------------Start Remove product from cart------------
function removeFromCart(id) {
  productsInCart = productsInCart.filter((item) => item.id !== id);
  localStorage.setItem("proudectInCart", JSON.stringify(productsInCart));
  localStorage.removeItem(`quantity-${id}`);

  const row = document.getElementById(`cart-item-${id}`);
  if (row) row.remove();

  updateTotal();

  if (productsInCart.length === 0) {
    showEmptyCart();
  }
}
//-----------------End Remove product from cart------------

//-----------------Start Increase quantity------------
function increaseQuantity(id, price) {
  const quantityEl = document.getElementById(`quantity-${id}`);
  let quantity = +(quantityEl.textContent) + 1;

  quantityEl.textContent = quantity;
  localStorage.setItem(`quantity-${id}`, quantity);
  updateSubtotal(id, price, quantity);
  updateTotal();
}
//-----------------End Increase quantity------------

//-----------------Start Decrease quantity------------
function decreaseQuantity(id, price) {
  const quantityEl = document.getElementById(`quantity-${id}`);
  let quantity = +(quantityEl.textContent);

  if (quantity > 1) {
    quantity--;
    quantityEl.textContent = quantity;
    localStorage.setItem(`quantity-${id}`, quantity);
    updateSubtotal(id, price, quantity);
    updateTotal();
  } else {
    removeFromCart(id);
  }
}
//-----------------End Decrease quantity------------

//-----------------Start Update subtotal for a product------------
function updateSubtotal(id, price, quantity) {
  const subtotalEl = document.getElementById(`subtotal-${id}`);
  if (subtotalEl) {
    subtotalEl.textContent = `${(price * quantity)}`;
  }
}
//-----------------End Update subtotal for a product------------

//------------------Start Register event listeners for cart buttons-------------
function registerCartEvents() {
  document.querySelectorAll(".plus").forEach((btn) => {
    btn.addEventListener("click", () =>
      increaseQuantity(Number(btn.dataset.productId), Number(btn.dataset.productPrice))
    );
  });

  document.querySelectorAll(".minus").forEach((btn) => {
    btn.addEventListener("click", () =>
      decreaseQuantity(Number(btn.dataset.productId), Number(btn.dataset.productPrice))
    );
  });

  document.querySelectorAll(".RemoveFromCartBtn").forEach((btn) => {
    btn.addEventListener("click", () =>
      removeFromCart(Number(btn.dataset.productId))
    );
  });
}
//------------------End Register event listeners for cart buttons-------------

// ------------------Start Favorite Logices--------------------------------
function drawFavData() {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  // let pro = [];
  // let indicators = '';
  let slideContent = '';
  // const itemsPerSlide = 3;

  for (let i = 0; i < favorites.length; i++) {
    const favoriteId = favorites[i];
    const item = products.find((product) => product.id === favoriteId);
    if (item) {
      const heartIconClass = 'fas';

      slideContent += `
          <div class="card">
            <img class="product-item-img card-img-top" src="${item.imageURL}" alt="Card image" style="width:80%; height: 150px;">
            <div class="product-items-box">
              <div class="product-itm-desc">
                <p class="card-title">Product: ${item.title}.</p>
                <p class="card-text">Category: ${item.category}.</p>
              </div>
                <i id="fav-${item.id}" class="${heartIconClass} fa-heart" data-heart-id ='${item.id}'></i>
            </div>
          </div>
      `;

    }
  }
  return slideContent
}
const carouselIndicators = document.querySelector('.carousel');
// carouselIndicators.innerHTML = ""
if(carouselIndicators) carouselIndicators.insertAdjacentHTML( "beforeend", drawFavData());


const heartBtn = document.querySelectorAll(".carousel .card i")

heartBtn.forEach( btn => {
    btn.addEventListener("click" , () => removeFromFavorites(Number(btn.dataset.heartId)))
})

function removeFromFavorites(id) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  var heartIcon = document.getElementById(`fav-${id}`);
  heartIcon.classList.remove("fas");
  heartIcon.classList.add("far");

  const index = favorites.indexOf(id);
  if (index !== -1) {
    favorites.splice(index, 1);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  drawFavData();

}
// ------------------End Favorite Logices--------------------------------

/* ------------start carousel--------------- */
const arrowBtns = document.querySelectorAll(".cards-wrapper .btn")
const wrapper = document.querySelector( '.cards-wrapper' );
const cardsContainer = document.querySelector( '.carousel' );
const cardWidth = cardsContainer.querySelector(".carousel .card")?.offsetWidth

cardsContainer.childElementCount === 0 ? wrapper.style.display = "none" : null
let isDragging=false, startX, startScrollLeft , timeout

arrowBtns.forEach( btn => {
    btn.addEventListener( "click", (e) => {
        e.target.classList.contains( "right" ) ?
                cardsContainer.scrollLeft += cardWidth : cardsContainer.scrollLeft -= cardWidth
    })
})

const autoPlay = () => {
    // if(window.innerWidth < 800) return // Disable autoplay on small screens
    timeout = setTimeout(() => {
        cardsContainer.scrollLeft+=cardWidth
        // autoPlay()
    }, 5000)
}
autoPlay()

const dragStart = (e) => {
    isDragging=true
    cardsContainer.classList.add( "dragging" )
    
    // Records the initial cursor and scroll position of the cardsContainer 
    startX=e.pageX
    startScrollLeft = cardsContainer.scrollLeft
}

const dragging = ( e ) => {
    // console.log(e.pageX)
    if ( !isDragging ) return // if isDragging is false return from here

    // Update the scroll position of the cardsContainer based on the cursor movement
    cardsContainer.scrollLeft = startScrollLeft -  (e.pageX - startX)
} 

const dragStop = () => {
    isDragging=false
    cardsContainer.classList.remove("dragging")
}


cardsContainer.addEventListener( "mousedown", dragStart)
cardsContainer.addEventListener( "mousemove", dragging)
document.addEventListener( "mouseup", dragStop)
wrapper.addEventListener( "mouseenter", () => clearTimeout(timeout))
wrapper.addEventListener( "mouseleave", autoPlay)

const infiniteScroll = () => {
    // If the user scrolls to the end of the container, reset the scroll position
    if ( cardsContainer.scrollLeft === 0 ) {
        cardsContainer.classList.add("no-transition")
        cardsContainer.scrollLeft = cardsContainer.scrollWidth - (cardsContainer.offsetWidth * 2)
        cardsContainer.classList.remove("no-transition")
    }
    // If the user scrolls to the start of the container, reset the scroll position
    else if ( Math.ceil( cardsContainer.scrollLeft ) >= cardsContainer.scrollWidth - cardsContainer.offsetWidth ) {
        // console.log("Last")
        cardsContainer.classList.add("no-transition")
        cardsContainer.scrollLeft = cardsContainer.offsetWidth
        cardsContainer.classList.remove("no-transition")
    }

    clearTimeout(timeout)
    if(!wrapper.matches(":hover")) autoPlay() // If the user is not hovering over the wrapper, start autoplay
}

cardsContainer.addEventListener( "scroll", infiniteScroll)

/* ------------End carousel--------------- */
