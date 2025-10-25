import products from "./utils.js";


let proudectInCart=localStorage.getItem( "proudectInCart" )
const allProducts = document.querySelector(".products");
const totalEle = document.querySelector(".total")
const totalPrice = document.querySelector(".total .totalPrice")

if (proudectInCart) {
  drawProudectCart(JSON.parse(proudectInCart));
}

function drawProudectCart(products) {

  let y = products.map((item) => {
    let quantity = +(localStorage.getItem(`quantity-${item.id}`)) || 1;

    return `
        <div id="product-${item.id}" class="product-item col-lg-4 col-md-6 col-sm-12 mb-4">
        <div class="card border border-info">
          <div class="row">
            <div class="col-lg-12">
              <img class="product-item-img card-img-top " src="${item.imageURL}" alt="Card image">
            </div>
            <div class="col-md-12">
              <div class="product-item-desc card-body p-0">
                <p class="card-title">Product: ${item.title}.</p>
                <p class="card-text">Category: ${item.category}.</p>
                <p class="color">Color: ${item.color}.</p>
                <p class="card-price">Price: <span><del>${item.price}</del> EGP ${item.salePrice}</span></p>
              </div>

              <div class="product-item-action d-flex justify-content-between align-items-center ">
                <button id="remove-btn-${item.id}" class="RemoveFromCartBtn btn btn-primary mb-2 d-inline-block" data-product-id="${item.id}">Remove From Cart</button>
                <div class="d-flex align-items-center">
                  <span class="text-danger mins p-0 ml-2" style="font-size : 25px;  cursor: pointer; " data-product-id="${item.id}" data-product-price="${item.salePrice}">-</span>
                  <span class="text-success pls p-0 ml-2" style="font-size : 25px;  cursor: pointer; " data-product-id="${item.id}" data-product-price="${item.salePrice}">+</span>
                  <div class="text-primary ml-2" style="font-size : 20px" id="quantity-${item.id}">${quantity}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  } )
  allProducts.innerHTML = y.join('');
}

const noProductsFondEle = `
                          <div class="products-not-found container">
                            <img src="images/product_not_found.jpeg" alt="Products not found image" />
                            <a href="index.html">
                              Get Some Products <i class="fas fa-shopping-cart text-primary"></i>
                            </a>
                          </div>
                          `

if ( allProducts.childElementCount===0 ) {
  allProducts.innerHTML = noProductsFondEle
  totalEle.style.cssText = `display: none !important;`
}
// ---------------------------Start localStorage aria---------------------
let addItemStorage = localStorage.getItem("proudectInCart") ? JSON.parse(localStorage.getItem("proudectInCart")) : [];
let quantity = 1;
let total = localStorage.getItem("totalPrice") ? +(localStorage.getItem("totalPrice")) : 0;

if (addItemStorage) {
  addItemStorage.map((item) => {
    total += +item.salePrice * +(localStorage.getItem(`quantity-${item.id}`));
  })
  totalPrice.innerHTML = total / 2 + " EGP";

}
// ---------------------------End localStorage aria---------------------------

// ------- Start remove products from Cart--------------
const RemoveFromCartBtn = document.querySelectorAll(".RemoveFromCartBtn")

RemoveFromCartBtn.forEach( btn => {
  btn.addEventListener("click" , () => removeFromCart(Number(btn.dataset.productId)))
})

function removeFromCart(id) {
  let itemIndex = addItemStorage.findIndex((item) => item.id === id);
  let quantityElement = document.getElementById(`quantity-${id}`);
  let quantity = +(quantityElement.innerHTML);

  if (itemIndex !== -1) {
    addItemStorage.splice(itemIndex, 1);
    localStorage.setItem("proudectInCart", JSON.stringify(addItemStorage));

    total = 0;
    let productItem = document.getElementById(`product-${id}`);
    if (productItem) {
      productItem.remove();
    }
    addItemStorage.forEach((item) => {
      total += +item.salePrice * quantity;
      // total += +item.salePrice * +(localStorage.getItem(`quantity-${item.id}`));

    });
    totalPrice.innerHTML = total + " EGP";
    localStorage.setItem("totalPrice", JSON.stringify(total));
  }
  if ( allProducts.childElementCount===0 ) {
    allProducts.innerHTML = noProductsFondEle
    totalEle.style.cssText = `display: none !important;`
  }
  
}
// ------- End remove products from Cart--------------

//--------------Start Quantities Control---------------------
allProducts.addEventListener( "click", e => {
  let target = e.target
  if (!target) return;

  // Increase Quantity
  if (target.classList.contains('pls')) {
    const id = Number(target.dataset.productId);
    const price = Number(target.dataset.productPrice);
      
    if (Number.isFinite(id) && Number.isFinite(price)) {
        increaseQuantity(id, price);
    }
    return;
  }
  // Decrease Quantity
  if (target.classList.contains('mins')) {
    const id = Number(target.dataset.productId);
    const price = Number(target.dataset.productPrice);
    
    if (Number.isFinite(id) && Number.isFinite(price)) {
        decreaseQuantity(id, price);
    }
    return;
  }
})

function increaseQuantity(id, salePrice) {
  // console.log(item);

  let quantityElement = document.getElementById(`quantity-${id}`);
  let quantity = +(quantityElement.innerHTML);

  quantity++;
  quantityElement.innerHTML = quantity;
  localStorage.setItem(`quantity-${id}`, quantity.toString());
  total += (+salePrice);
  totalPrice.innerHTML = total + " EGP";
  localStorage.setItem("totalPrice", JSON.stringify(total));
}

function decreaseQuantity(id, salePrice) {
  // console.log(item);
  let quantityElement = document.getElementById(`quantity-${id}`);
  let quantity = +(quantityElement.innerHTML);

  if (quantity > 1) {
    quantity--;
    quantityElement.innerHTML = quantity;
    localStorage.setItem(`quantity-${id}`, quantity.toString());
    total -= (+salePrice);
    totalPrice.innerHTML = total + " EGP";
    localStorage.setItem("totalPrice", JSON.stringify(total));
  }
  else {
    removeFromCart(id);
  }
}
//--------------End Quantities Control---------------------

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

console.log(cardsContainer.childElementCount)
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
