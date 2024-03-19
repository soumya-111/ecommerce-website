var prange=document.querySelector('.range');
var ddicon=document.querySelector('#pr')
var categories=document.querySelector('.categories');
var ct=document.querySelector('#ct')
var sleft=document.querySelector('.sleft')
var cart=document.querySelector('.cart');
let iconCart=document.querySelector('.cart-count')
let listProducts = [];
let carts = [];

var c=0, n=0;
function sign_in() {
    document.getElementById("login").innerHTML =
      '<h5><span>New Customer?</span><span><a href="signUp.html">Sign Up</a></span></h5><hr><h5><span class="myprofile"><i class="fa fa-user"> </i> My Profile</span></h5><h5><span><i class="fa fa-box"> </i> Orders</span></h5>';
  }
function sign_out() {
    document.getElementById("login").innerHTML = "";
  }

function showcart(){
  cart.classList.toggle('visible');

}


function cdrop(){
  if(n==0){
    // alert("connected")
    categories.innerHTML='<ul><li><input type="checkbox" name="fashion"><label for="Fashion">Fashion</label></li><li><input type="checkbox" name="jewelleries"><label for="Jewelleries">Jewelleries</label></li><li><input type="checkbox" name="accesories"><label for="Accesories">Accesories</label></li><li><input type="checkbox" name="electronics"><label for="Electronics">Electronics</label></li><li><input type="checkbox" name="make-up"><label for="Make Up">Make Up</label></li></ul>';
    ct.classList.remove('fa-caret-down');
    ct.classList.add('fa-caret-up');
    n=1;
  }else{
    categories.innerHTML='';
    ct.classList.remove('fa-caret-up');
    ct.classList.add('fa-caret-down');
    n=0;
  }

}

function dropdown(){
  if(c==0){
    prange.innerHTML='<li><h6>500</h6><input type="range"><h6>5000</h6></li>'
    ddicon.classList.remove('fa-caret-down');
    ddicon.classList.add('fa-caret-up')
    c=1;

  }else{
    prange.innerHTML='';
    ddicon.classList.remove('fa-caret-up');
    ddicon.classList.add('fa-caret-down');
    c=0;
  }
  
}

function filterdown(){
  // alert("connected")
  sleft.classList.toggle('visibility');

}

let listProductHTML = document.querySelector('.product');
let listCartHTML = document.querySelector('.listCart');
const addDataToHTML = () => {
  listProductHTML.innerHTML = ''; // Clear existing content

  if (listProducts.length > 0) {
      listProducts.forEach(product => {
          let newproduct = document.createElement('div');
          newproduct.classList.add('card');
          newproduct.setAttribute('data-id', product.id);
          newproduct.innerHTML =
              `<div class="pimg "><img src="${product.Image}" alt=""></div>
              <div class="details clr">
                <h6>${product.Product}</h6>
                <h6><i class="fa fa-inr"></i>${product.Price}</h6>
              </div>
              <div class="addtocart">
                <button class="btn">Add To Cart</button>
              </div> `;

          listProductHTML.appendChild(newproduct);
      });
  }
}


// let any=document.querySelector('.addtocart');
listProductHTML.addEventListener('click',(event)=>{
  let pclick=event.target;
  let cElement=pclick.closest('.card');
  // alert(cElement.dataset.id)
  if(cElement && cElement.dataset.id){
    let product_id=cElement.dataset.id;
    addToCart(product_id)
  }
})

const addToCart = (product_id) => {
  // alert(product_id)
  let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
  if (carts.length <= 0) {
      carts = [{
          product_id: product_id,
          quantity: 1
      }]

  } else if (positionThisProductInCart < 0) {
      carts.push({
          product_id: product_id,
          quantity: 1
      });
  } else
      carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
  // console.log(carts);
  addCartToHTML();
  addCartToMemory();
}
const addCartToMemory = () => {
  localStorage.setItem('cart', JSON.stringify(carts));
}

const addCartToHTML = () => {
  listCartHTML.innerHTML = '';
  let totalquantity = 0;
  // alert(carts.length)
  if (carts.length > 0) {
      carts.forEach(cart => {
          totalquantity = totalquantity + cart.quantity;
          let newCart = document.createElement('div');
          newCart.classList.add('item');
          // alert(cart.product_id)
          newCart.dataset.id = cart.product_id;

          let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
          let info = listProducts[positionProduct];
          newCart.innerHTML =
              `<div class="image">
          <img classname="p-img" src="${info.Image}" alt="">
          </div>
          <div class="Name">${info.Product}
          </div>
          <div class="totalprice">
              ${info.Price * cart.quantity}
          </div>
          <div class="quantity">


              <span class="minus"><i class="fa-solid fa-minus"></i></span>
              <span><b>${cart.quantity}</b></span>
              <span class="plus"><i class="fa-solid fa-plus"></i></span></div>`;
          listCartHTML.appendChild(newCart);
      })
  }
  iconCart.innerHTML = totalquantity;
}

listCartHTML.addEventListener('click', (event) => {
  let positionClick = event.target;

  // Check if the clicked element is the plus or minus button
  if (positionClick.classList.contains('plus') || positionClick.classList.contains('minus')) {
      let product_id = positionClick.closest('.item').dataset.id;
      let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
      changeQuantity(product_id, type);
  }
});

const changeQuantity = (product_id, type) => {
  let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
  if (positionItemInCart >= 0) {
      switch (type) {
          case 'plus':
              carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
              break;
          default:
              let valueChange = carts[positionItemInCart].quantity - 1;
              if (valueChange > 0) {
                  carts[positionItemInCart].quantity = valueChange;

              } else {
                  carts.splice(positionItemInCart, 1);
              }
              break;

      }

  }
  addCartToMemory();
  addCartToHTML();

}


const initApp = () => {
  //get data from json
  fetch('all.json')
      .then(response => response.json())
      .then(data => {
          listProducts = data;
          addDataToHTML();          
      })
      if (localStorage.getItem('cart')) {
        carts = JSON.parse(localStorage.getItem('cart'));
        addCartToHTML();
      }
}
initApp();