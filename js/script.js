// localStorage.clear()
import products from "./utils.js";

const noInternet=document.querySelector( '.noInternet' );

// window.onload = () => window.navigator.onLine ? noInternet.style.display='none':
//                                                 noInternet.style.display='block';


// window.ononline = () => noInternet.style.display = 'none';
// window.onoffline = () => noInternet.style.display = 'block';

// -------------------------------------------------------------------------------------------------------------------
// window.addEventListener('DOMContentLoaded',() => (drawData() , search.focus()));

const allProducts = document.querySelector(".products")
const paginationNumbersContainer = document.querySelector(".pagination-numbers-container")
const prevBtn = document.querySelector(".prev")
const nextBtn = document.querySelector(".next")
const paginationBtns = document.querySelector(".pagination")

//-------------------Start render Data & pagination----------------

let itemsPerPage = 6
let currentPage = 1

let startIndex = (currentPage - 1) * itemsPerPage
let endIndex = currentPage * itemsPerPage

let totalItems
let totalPages

function renderData ( arr ) {
    let pro = arr.map((item) => {
        let isFavorite = checkFavorite(item.id);

        let heartIconClass = isFavorite ? "fas" : "far";
        let heightImage;
        switch (item.category) {
            case 'phone':
                heightImage = '330px';
                break;
            
            case 'smart watch':
                heightImage = '240px';
                break;

            default:
                heightImage = '200px';
                break;
        }

        return `
            <div class="product-item col-lg-4 col-md-6 col-sm-12 mb-4 p-4">
                <div class="card border border-info pt-3">
                    <img class="product-item-img card-img-top m-auto" src="${item.imageURL}" alt="Card image" style="width:80%; height:${heightImage};">
                    <div class="product-itm-desc card-body pb-0 pl-4">
                        <p class="card-title">Product: ${item.title}.</p>
                        <p class="card-text">Category :${item.category}.</p>
                        <p class="color">Color: ${item.color}.</p>
                        <p class="card-price">Price: <span> <del>${item.price} EGP</del> ${item.salePrice} EGP</span></p>
                    </div>
                    <div class="product-item-action d-flex justify-content-between pr-4 pl-4">
                    <button id="add-btn-${item.id}" class="AddToCartBtn btn btn-primary mb-2" data-product-id="${item.id}">Add To Cart</button>
                    <button id="remove-btn-${item.id}" class="RemoveFromCartBtn btn btn-primary mb-2" data-product-id="${item.id}">Remove From Cart</button>
                        <i id="fav-${item.id}" class="heart-icon ${heartIconClass} fa-heart" data-product-id="${item.id}"></i>
                    </div>
                </div>
            </div>
        `;
    } );

    totalItems = pro.length
    totalPages = Math.ceil(totalItems / itemsPerPage)

    let productsInPage = pro.slice(startIndex, endIndex)
    allProducts.innerHTML = "";
    allProducts.insertAdjacentHTML("afterbegin" , productsInPage.join(" "))


    if(currentPage === 1) {
        prevBtn.style.cssText = `opacity:45%; cursor:not-allowed;`
        prevBtn.disabled = true
    } else {
        prevBtn.style.cssText = `opacity:1; cursor:pointer;`
        prevBtn.disabled = false
    }

    if(currentPage >= totalPages) {
        nextBtn.style.cssText = `opacity:45%; cursor:not-allowed;`
        nextBtn.disabled = true
    } else {
        nextBtn.style.cssText = `opacity: 1; cursor:pointer;`
        nextBtn.disabled = false
    }
    
    
    let pageNumEle = ''
    for ( let num=1; num < totalPages + 1; num++ ) {
        pageNumEle += `<li class="page-num" data-page-num="${num}">${num}</li>`
    }

    paginationNumbersContainer.innerHTML = ""
    paginationNumbersContainer.insertAdjacentHTML("beforeend" , pageNumEle)
    
    const pageNum = document.querySelectorAll(".page-num")
    pageNum?.forEach( num => {
        // num.classList.remove("active")
        if ( currentPage === Number( num.dataset.pageNum ) ) {
            num.classList.add("active")
        }
    })
}

paginationBtns.addEventListener( "click", e => {
    let target = e.target
    if ( !target ) return;
    // console.log("Clicked !")
    if ( target.classList.contains( "page-num" ) ) { 
        currentPage = Number( target.dataset.pageNum )
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if ( target.classList.contains( "next" ) ) {
        currentPage++
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if ( target.classList.contains( "prev" ) ) {
        currentPage--
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    startIndex = (currentPage - 1) * itemsPerPage
    endIndex = currentPage * itemsPerPage
    renderData(products)
})    


function drawData() {
    renderData(products)
}
drawData();

//-------------------End render Data & pagination----------------

// ------- Start add products to Cart
const AddToCartBtn = document.querySelectorAll(".AddToCartBtn")

AddToCartBtn?.forEach( btn => {
    btn.addEventListener( "click", () => {
        addTOCartEvent( Number( btn.dataset.productId ) )
    } )
} )

function addTOCartEvent(id) {
    if (localStorage.getItem("userName")) {
        let choosenItem = products.find((item) => item.id === id);
        let itemIndex = addItemStorage.findIndex((item) => item.id === id);
        if (itemIndex === -1) {
            drawBuyProudect(choosenItem);

            addItemStorage = [...addItemStorage, choosenItem];
            localStorage.setItem("proudectInCart", JSON.stringify(addItemStorage));

            let quantity = localStorage.getItem(`quantity-${choosenItem.id}`) ? +(localStorage.getItem(`quantity-${choosenItem.id}`)) : 1;

            total += (+choosenItem.salePrice) * quantity;
            totalPrice.innerHTML = total +" EGP";
            localStorage.setItem("totalPrice", JSON.stringify(total));

            document.getElementById(`add-btn-${id}`).style.display = "none";
            document.getElementById(`remove-btn-${id}`).style.display = "inline-block";

            if (addItemStorage.length != 0) {
                badge.style.display = "block";
                badge.innerHTML = addItemStorage.length;
            }
        } else {
            badge.style.display = "none";
        }
    } else {
        window.location = "login.html";
    }

    handleViewProductsBtn()
}
// ------- End add products to Cart

// ------- Start remove products from Cart
const RemoveFromCartBtn = document.querySelectorAll(".RemoveFromCartBtn")

RemoveFromCartBtn?.forEach( btn => {
    btn.addEventListener( "click", () => removeFromCart( Number( btn.dataset.productId ) ) )
})

function removeFromCart(id) {
    let itemIndex = addItemStorage.findIndex((item) => item.id === id);
    let quantityElement = document.getElementById(`quantity-${id}`);
    let quantity = +(quantityElement.innerHTML);

    if (itemIndex !== -1) {
        addItemStorage.splice(itemIndex, 1);
        localStorage.setItem("proudectInCart", JSON.stringify(addItemStorage));

        total = 0;
        document.getElementById(`add-btn-${id}`).style.display = "inline-block";
        document.getElementById(`remove-btn-${id}`).style.display = "none";

        let buyProudectItem = document.getElementById(`buyProudectItem-${id}`);
        if (buyProudectItem) {
            buyProudectItem.remove();
        }

        addItemStorage.forEach((item) => {
            drawBuyProudect(item);
            total += +item.salePrice * quantity;
            // total += +item.salePrice * +(localStorage.getItem(`quantity-${item.id}`));

        });

        totalPrice.innerHTML = total +" EGP";
        localStorage.setItem("totalPrice", JSON.stringify(total));

        if (addItemStorage.length !== 0) {
            badge.style.display = "block";
            badge.innerHTML = addItemStorage.length;
        } else {
            badge.style.display = "none";
        }
    }
    handleViewProductsBtn()
}
// ------- End remove products from Cart

// --------------------Start Localstorge Aria--------------------------------
const badge = document.querySelector(".badge");
const buyProudect = document.querySelector(".buyProudect");
const totalPrice = document.querySelector(".total .totalPrice");
const shoppingCartIcon = document.querySelector(".shoppingCart");
const cartsProudect = document.querySelector(".cartsProudect");


function handleViewProductsBtn () {
    const viewProduct = document.querySelector(".ViewPro")
    !buyProudect.childElementCount ? viewProduct.style.display = "none" : viewProduct.style.display = "block"
} 

handleViewProductsBtn()
// let total = 0;
let quantity = 1;
let total = localStorage.getItem("totalPrice") ? +(localStorage.getItem("totalPrice")) : 0;

let addItemStorage = localStorage.getItem("proudectInCart") ? JSON.parse(localStorage.getItem("proudectInCart")) : [];

if (addItemStorage) {
    addItemStorage.map((item) => {
        drawBuyProudect(item);
        document.getElementById(`add-btn-${item.id}`).style.display = "none";
        document.getElementById(`remove-btn-${item.id}`).style.display = "inline-block";
        total += +item.salePrice * +(localStorage.getItem(`quantity-${item.id}`));
    })
    totalPrice.innerHTML = total / 2 +" EGP";


    if (addItemStorage.length != 0) {
        badge.style.display = "block";
        badge.innerHTML = addItemStorage.length;
    }
    else {
        badge.style.display = "none";
    }

}
//-----------------------End Localstorge Aria----------------------------------

//--------------Start Quantities Control---------------------

function increaseQuantity(id, salePrice) {
    let quantityElement = document.getElementById(`quantity-${id}`);
    let quantity = +(quantityElement.innerHTML);

    quantity++;
    quantityElement.innerHTML = quantity;
    localStorage.setItem(`quantity-${id}`, quantity.toString());
    total += (+salePrice);
    totalPrice.innerHTML = total +" EGP";
    localStorage.setItem("totalPrice", JSON.stringify(total));
    
    openCart();
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
        totalPrice.innerHTML = total +" EGP";
        localStorage.setItem("totalPrice", JSON.stringify(total));
    }
    else {
        removeFromCart(id);
    }
    openCart();
}

function drawBuyProudect(item) {
    if (!document.getElementById(`buyProudectItem-${item.id}`)) {
        let quantity = +(localStorage.getItem(`quantity-${item.id}`)) || 1;

        const buyProductEle = `  <div id="buyProudectItem-${item.id}" class="row my-2 pr-2">
                                        <span class="col-6 pro-title">${item.title}</span>
                                        <span class="col-2" id="quantity-${item.id}">${quantity}</span>
                                        <span class="text-danger mins col-2" id="mins-${item.id}" data-product-id="${item.id}" data-product-price="${item.salePrice}">-</span>
                                        <span class="text-success pls col-2" id="pls-${item.id}" data-product-id="${item.id}" data-product-price="${item.salePrice}">+</span>
                                </div>`

        // buyProudect.innerHTML = "";
        buyProudect.insertAdjacentHTML("beforeend" , buyProductEle)
    }
}

buyProudect.addEventListener('click', (e) => {
    const target = e.target;
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
        handleViewProductsBtn()
        return;
    }
});

//--------------End Quantities Control--------------------


// ------------------Start Favorite Logices--------------------------------
function checkFavorite(itemId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let isFavorite = favorites.includes(itemId);

    return isFavorite;
}

const heartIcon = document.querySelectorAll(".heart-icon")

heartIcon.forEach( btn => {
    btn.addEventListener( "click", () => addFav( Number( btn.dataset.productId ) ) )
})


function addFav(id) {
    if (localStorage.getItem("userName")) {
        let heartIcon = document.getElementById(`fav-${id}`);
        if (heartIcon.classList.contains("far")) {
            heartIcon.classList.remove("far");
            heartIcon.classList.add("fas");
            addToFavorites(id);
        } else {
            heartIcon.classList.remove("fas");
            heartIcon.classList.add("far");
            removeFromFavorites(id);
        }
    } else {
        window.location = "login.html";
    }
}

function addToFavorites(itemId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (!favorites.includes(itemId)) {
        favorites.push(itemId);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function removeFromFavorites(itemId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    let index = favorites.indexOf(itemId);
    if (index !== -1) {
        favorites.splice(index, 1);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
}
// ------------------End Favorite Logices--------------------------------


// ------------------Start handle Cart Icon ----------
shoppingCartIcon.addEventListener("click", openCart)

function openCart() {
    if (buyProudect.innerHTML !== "") {
        if (cartsProudect.style.display === "block") {
            cartsProudect.style.display = "none"
        } else {
            cartsProudect.style.display = "block"
        }
    }
    handleViewProductsBtn()
}
// ------------------End handle Cart Icon ------------

//-------------------Start Search logices ------------- 
const search = document.getElementById('search');
const searchOption = document.getElementById('searchOption');
const searchInput = document.getElementById("search")

let modeSearch = 'title';

searchOption.addEventListener('change', function () {
    let selectedValue = this.value;

    selectedValue === "searchTittle" ? modeSearch = 'title' : modeSearch = 'category';
    
    search.placeholder = `search by ${modeSearch}`;
    search.focus();
    search.value = '';
    drawData();
});

searchInput?.addEventListener( "keyup", () => searchData( searchInput?.value ) )

function searchData(value) {
    let filteredProducts = products.filter((item) => {
        if (modeSearch === 'title') {
            return item.title.toLowerCase().includes(value.toLowerCase());
        } else if (modeSearch === 'category') {
            return item.category.toLowerCase().includes(value.toLowerCase());
        }
    } );

    if ( filteredProducts.length > 0 ) {
        renderData(filteredProducts)
    } else {
        allProducts.innerHTML = `<img class="robot-404" src="../images/robot-404.jpg" alt="Robot 404 Image" />`
    }
}
//-------------------End Search logices ------------- 
