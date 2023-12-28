const App = Vue.createApp({
  name: "App",
  delimiters: ['[[', ']]'],
  data() {
    return {
      min: 1,
      max: 10000,
      products: [],
      categories: [],
      cart: Vue.ref([]),
      sortOrder: 'asc',
      selectedCategories: [],
      showPopoverContent: false,
      selectedRating: [],
      ratings: [1, 2, 3, 4, 5],
      user: Vue.ref([]),
      productMin: 0,
      productMax: 10000,
    };
  },
  async beforeMount() {
    await this.readFromCartVue();
    await this.getProducts();
    await this.fetchCategories();
    this.products.forEach(product => {
    this.getItemRating(product.id);
    this.updateRange();
  });
  },
  computed: {
  total() {
    const sum = this.cart.reduce((total, item) => total + Number(item.price), 0);
    return sum.toFixed(2);
  },
  filteredProducts() {
  return this.products.filter(item => {
    const priceCondition = item.price >= this.min && item.price <= this.max;
    const categoryCondition = this.selectedCategories.length === 0 || this.selectedCategories.includes(String(item.category_id));
    const ratingCondition = this.selectedRating.length === 0 || this.selectedRating.includes(Math.ceil(item.rating_float));
    return priceCondition && categoryCondition && ratingCondition;
    });
   },
  },
  methods: {
    async getProducts() {
      try {
        const res = await fetch('/api/items');
        const products = await res.json();
        this.products = products;
        const maxPrice = Math.max(...this.products.map(product => product.price));
        const minPrice = Math.min(...this.products.map(product => product.price));
        this.max = maxPrice;
        this.min = minPrice;
        } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    async fetchCategories() {
      try {
        const res = await fetch('/api/categories/category_items_len/');
        this.categories = await res.json();
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    async getItemRating(itemId) {
      try {
        const response = await fetch(`/api/reviews/item/rating?id=${itemId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const product = this.products.find((p) => p.id === itemId);
        if (product) {
          product.rating = data.rating;
          product.reviewNumber = data.review_number;
          product.rating_float = parseFloat(data.rating_float).toFixed(2)
        }
      } catch (error) {
      }
    },
    handleCategoryChange() {
      this.selectedCategories = this.getSelectedCategories();
    },
    getSelectedCategories() {
        var selectedCategories = [];
        var checkboxes = document.querySelectorAll('.cat-checkbox:checked');
        checkboxes.forEach((checkbox) => {
          var categoryId = checkbox.getAttribute("data-category");
          selectedCategories.push(categoryId);
        });
        return selectedCategories;
      },
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      this.sortProducts();
    },
    sortProducts() {
      if (this.sortOrder === 'asc') {
      this.products.sort((a, b) => a.price - b.price);
      } else {
      this.products.sort((a, b) => b.price - a.price);
      }
    },
    validateMin() {
      const productMinPrice = Math.min(...this.products.map(product => product.price));
      this.min = String(this.min).replace(/^0+/, '');
        if (this.min === '' || isNaN(this.min)) {
              this.min = productMinPrice;
          }
          if (this.min > this.max) {
            this.min = this.max;
          }
       },
    validateMax() {
      const productMaxPrice = Math.max(...this.products.map(product => product.price));
      this.max = String(this.max).replace(/^0+/, '');
      if (this.max === '' || isNaN(this.max)) {
        this.max = productMaxPrice;
        }
      if (this.max < this.min) {
          this.max = this.min;
      }
      if (this.max > productMaxPrice) {
        this.max = productMaxPrice;
      }
    },
    async readFromCartVue(){
      fetch('/user_items_in_cart', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        this.cart  = data.items
        this.user  = data.user
      })
      .catch(error => {
        console.error('error', error);
      });
    },
    redirectToItem(itemId) {
      window.location.href = 'items/' + itemId;
    },
    redirectToCart(itemId) {
      window.location.href = 'items-in-cart/';
    },
    handleRatingChange(rating) {
    const index = this.selectedRating.indexOf(rating);
    if (index === -1) {
      this.selectedRating.push(rating);
    } else {
      this.selectedRating.splice(index, 1);
    }
    },
    updateRange() {
      // Ensure min is not greater than max
      if (this.min > this.max) {
        this.min = this.max;
      }
    
      // Ensure max is not less than min
      if (this.max < this.min) {
        this.max = this.min;
      }
    
      // Update range inputs based on min and max values
      const rangeInput = document.querySelector(".min-range");
      if (rangeInput) {
        rangeInput.value = this.min;
      }
    
      const rangeInputMax = document.querySelector(".max-range");
      if (rangeInputMax) {
        rangeInputMax.value = this.max;
      }
    },
    
    updateInputs() {
      // Parse min and max values of the range inputs
      let minVal = parseInt(document.querySelector(".min-range").value);
      let maxVal = parseInt(document.querySelector(".max-range").value);
    
      // Ensure min is not greater than max
      if (minVal > maxVal) {
        minVal = maxVal;
      }
    
      // Ensure max is not less than min
      if (maxVal < minVal) {
        maxVal = minVal;
      }
    
      // Update min and max values based on the range inputs
      this.min = minVal;
      this.max = maxVal;
    
      // Update range slider positions
      const rangeInput = document.querySelector(".min-range");
      const rangeInputMax = document.querySelector(".max-range");
      
      if (rangeInput) {
        rangeInput.value = this.min;
      }
    
      if (rangeInputMax) {
        rangeInputMax.value = this.max;
      }
    },
  },
  filters: {
    formatPrice(price) {
    return Number.isInteger(price) ? price : price.toFixed(2);
  }},
});

App.component('product-component', {
  props: ['product', 'min', 'max','cart','selectedRatings','formatPrice'],
  delimiters: ['[[', ']]'],
  emits: ['addToCart'],
  template: `
  <div class="col-lg-auto">
      <div class="card" :id="product.id" :data-category="product.category_id" style="margin: 1px; margin-bottom: 3px;">
        <div class="card-body" style="cursor: pointer; padding:0" @click="redirectToItemFromProduct(product.id)">
          <img :src="'static/img/' + product.username + '/' + product.name + '/' + product.image" class="card-img-top">
          <h5 class="card-title">[[ product.name ]]</h5>
          <p style="cursor: pointer">
            <i>
              <span v-for="i in 5" :key="i" :class="getStarClasses(i, product.rating_float)"></span>
              <span :id="'overall-rating' + product.id + '-float'"><small>&nbsp[[ product.rating_float ]]</small></span>
            </i>
            <span :id="'overall-rating' + product.id"> <small> ([[ product.reviewNumber ]]) </small> </span>
          </p>
          <span class="badge bg-danger" v-if="product.price <= 90">WOW</span>
          <span class="badge bg-primary" v-else-if="product.price > 90 && product.price <= 1000">Value</span>
          <span class="badge bg-success" v-else-if="product.price > 1000">TOP</span>
          <span> <small> $</small>[[ product.price | formatPrice  ]]</span>
          <span v-if="Number.isInteger(product.price) === false" style="font-size: 0.7em; vertical-align: top;">
            [[ product.price.toString().split('.')[1] ]]
          </span>
          <input type="number" :data-price="product.price" hidden>
        </div>
        <!-- Close the card-body div before opening the next div -->
        <div>
          <button ref="addToCartButton" @click="addToCart(product)" class="btn btn-secondary btn-sm" style="margin-bottom:15px; margin-top:22px">
            <i class="bi bi-cart" style="font-size: 0.9rem;"> Add to Cart</i> 
          </button>
        </div>
        <div class="card-footer">
          <small class="text-muted">Added: [[ product.date.slice(0, 10)  ]] </small>
       </div>
      </div>
    </div>
  `,
methods: {
    redirectToItemFromProduct(itemId) {
    this.$root.redirectToItem(itemId);
   },
    itemAlreadyInCart(product) {
       return this.cart.some(item => item.id === product.id);
    },
    addToCart(product) {
      const itemInCart = this.cart.find(item => item.id === product.id);
      const popoverContent = itemInCart
        ? `'${product.name} is already in the cart'`
        : `'${product.name} was added to the cart'`;

      const buttonElement = this.$refs.addToCartButton;
      $(buttonElement).popover({
        content: popoverContent,
        placement: 'top',
        trigger: 'manual',
      });
      $(buttonElement).popover('show');
      setTimeout(() => {
        $(buttonElement).popover('hide');
      }, 1000);
      if (!itemInCart) {
        fetch('/update-basket', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            item_id: product.id,
          }),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            this.cart.push(product);
          })
          .catch(error => {
            console.error('error', error);
          });
      }
    },
    getStarClasses(index, rating) {
        const filledStars = Math.floor(rating);
        if (index <= filledStars) {
          return 'fa fa-star checked';
        } else if (index === filledStars + 1 && rating % 1 !== 0) {
          return 'fa fa-star-half-full checked';
        } else {
          return 'fa fa-star-o checked';
        }
      },
  },
});

App.component('navbar-component', {
  props: ['product','cart', 'total', 'user'],
  data() {
  return {
    displayCart: true,
  };
},
  delimiters: ['[[', ']]'],
  template: `
 <div class="container-fluid" style="width: 100%; font-size: 14px;">
        <a class="navbar-brand" href="#" style="font-size: 14px;">
           <i class="fa fa-home"></i> <strong>KRASSY SHOP</strong>
         </a>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link mx-2 text-uppercase" aria-current="page" href="#"></a>
            </li>
            <li class="nav-item">
              <a class="nav-link mx-2 text-uppercase" href="#"></a>
            </li>
            <li class="nav-item">
              <a class="nav-link mx-2 text-uppercase" href="/products">Offers</a>
            </li>
            <li class="nav-item">
              <a class="nav-link mx-2 text-uppercase" href="/categories">Categories</a>
            </li>
            <li class="nav-item">
              <a class="nav-link mx-2 text-uppercase" href="/items-in-cart">Cart</a>
            </li>
            <li class="nav-item">
              <a class="nav-link mx-2 text-uppercase" href="#">About</a>
            </li>
          </ul>
          <form class="d-flex">
            <input class="form-control mr-sm-2" id="filter" v-on:keyup="Search()" type="text" placeholder="Search in offers">
          </form>
        <div v-if="cart" @mouseleave="hideCart()" @mouseenter="showCart()" d-flex bd-highlight mb-3>
          <button @click="displayCart = !displayCart" class="btn btn-light dropdown-toggle btn-sm" id="cartDropdown" aria-haspopup="true" aria-expanded="false">
          <i class="bi bi-cart" style="font-size: 1rem;"></i> Cart <span class="badge badge-pill badge-primary"> [[ cart.length ]]</span>
      </button>
          <div v-if="!displayCart"  class="list-group position-absolute">
            <div v-for="(item, index) in cart" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <img :src="'static/img/' + item.username + '/' + item.name + '/' + item.image" class="mr-2"
                  style="width: 50px; height: 60px; object-fit: cover; border-radius: 5px;">
              <div style="cursor: pointer" @click="redirectToItemFromNavbar(item.id)">
                <div> [[ item.name ]] - $[[ item.price ]] </div>
              </div>
            </div>
            <button @click="removeFromCart(item.id)" class="btn btn-light btn-sm ml-2" data-bs-placement="top">x</button>
          </div>
          <button id="total" class="btn btn-sm btn-light" style="pointer-events: none; opacity: 1; margin-bottom: 1px;">
            Total: [[ cart.length ]] products - <b> $[[ total ]]</b>
          </button>
          <button v-if="cart.length > 0" @click="redirectToCart" class="btn btn-sm btn-primary"> Go to Cart </button>
            </div>
        </div>
          <div class="ml-auto"></div> [[ user ]] 
          <form class="form-inline my-2 my-lg-0" style="margin-right: 120px; padding:0">
            <div class="dropdown" style="font-family: Raleway; font-size: 16px;">
               <img src="/static/img/img_avatar.png" class="avatar">
              <div class="dropdown-content">
              <a class="nav-link mx-2 text-uppercase" href="/user/profile"> Profile</a>
                <a class="nav-link mx-2 text-uppercase" href="/logout"> Logout</a>
              </div>
            </div>
          </form>

        </div>
      </div>
  `,
  methods:{
    redirectToItemFromNavbar(itemId) {
    this.$root.redirectToItem(itemId);
    // this.$root.redirectToCart();
  },
    redirectToCart() {
     window.location.href = `/items-in-cart`
    // this.$root.redirectToCart();
  },
  removeFromCart(itemId) {
      fetch('/user/remove-from-basket', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              item_id: itemId,
          }),
      })
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
        const index = this.cart.findIndex(item => item.id === itemId);

          if (index !== -1) {
              this.cart.splice(index, 1);
          }
      })
      .catch(error => {
          console.error('Error removing item from cart:', error);
      });
  },
  hideCart() {
    setTimeout(() => {
      this.displayCart = true;
          }, 700);
      },
  showCart() {
      this.displayCart = false;
      },
   Search() {
    var input, filter, cards, cardContainer, h5, title, i;
    input = document.getElementById("filter");
    filter = input.value.toUpperCase();
    cardContainer = document.getElementById("mycard");
    cards = cardContainer.getElementsByClassName("card");
    for (i = 0; i < cards.length; i++) {
        title = cards[i].querySelector(".card-body h5.card-title");
        if (title.innerText.toUpperCase().indexOf(filter) > -1) {
            cards[i].style.display = "";
        } else {
            cards[i].style.display = "none";
        }
    }
}
  }
});

// App.component('PriceSlider',{
//   delimiters: ['[[', ']]'],
//   data() {
//     return {
//       min: 2500,
//       max: 8500,
//       productMin: 0, // Set your actual product min value here
//       productMax: 10000, // Set your actual product max value here

//     };
//   },
//   template: `
//   <div class="main">
//     <div class="gfg">
//       <p>GeeksForGeeks</p>
//     </div>
//     <div class="custom-wrapper">
//       <div class="header">
//         <h2 class="projtitle">Price Range Slider</h2>
//       </div>
//       <div class="price-input-container">
//         <div class="price-input">
//           <div class="price-field">
//             <span>Minimum Price</span>
//             <input v-model.number="min" type="number" class="min-input" :min="0" :max="productMax" @input="updateRange">
//           </div>
//           <div class="price-field">
//             <span>Maximum Price</span>
//             <input v-model.number="max" type="number" class="max-input" :min="productMin" :max="10000" @input="updateRange">
//           </div>
//         </div>
//         <div class="slider-container">
//           <div class="price-slider"></div>
//         </div>
//       </div>
//       <!-- Slider -->
//       <div class="range-input">
//         <input type="range" class="min-range" :min="0" :max="10000" :value="min" step="1" @input="updateInputs">
//         <input type="range" class="max-range" :min="0" :max="10000" :value="max" step="1" @input="updateInputs">
//       </div>
//     </div>
//   </div>
// `,
// methods:{
//   updateInputs() {
//     // Update min and max values based on the range inputs
//     const rangeInput = this.$el.querySelector(".min-range");
//     this.min = parseInt(rangeInput.value);

//     const rangeInputMax = this.$el.querySelector(".max-range");
//     this.max = parseInt(rangeInputMax.value);
//   },
//   updateRange() {
//     // Update range inputs based on min and max values
//     const rangeInput = this.$el.querySelector(".min-range");
//     rangeInput.value = this.min;

//     const rangeInputMax = this.$el.querySelector(".max-range");
//     rangeInputMax.value = this.max;
//   },
// }
// });


App.mount('#app');