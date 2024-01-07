const App = Vue.createApp({
  name: "App",
  delimiters: ['[[', ']]'],
  data() {
    return {
      min: 1,
      max: 10000,
      products: [],
      isDiscountedChecked: false,
      item: null,
      categories: [],
      cart: Vue.ref([]),
      sortOrder: 'asc',
      selectedCategories: [],
      showPopoverContent: false,
      selectedRating: [],
      ratings: [1, 2, 3, 4, 5],
      user: Vue.ref([]),
      user_id: null,
      productMin: 0,
      productMax: 10000,
    };
  },
  async created() {
    await this.getProducts();
    await this.readFromCartVue();
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
    const discountCondition = !this.isDiscountedChecked || item.discount != null;
    return priceCondition && categoryCondition && ratingCondition && discountCondition;
    });
   },
  },
  methods: {
    async getProduct(itemId) {
      try {
        const res = await fetch(`/api/items/item/${itemId}`);
        const item = await res.json();
        this.item = item;
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    },
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
        this.user_id = data.user_id
      })
      .catch(error => {
        console.error('error', error);
      });
    },
    async getProfile() {
        const response = await fetch(`/api/profile/${this.user_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {

        } else {
          const data = await response.json();
          console.log('response', response)
          this.profile = `/static/img/${this.user}/profile/${data.avatar}`;
        }
      },
    redirectToItem(itemId) {
      var currentPath = window.location.pathname;
      var regex = /\/items\/(.*)/;
      var match = regex.exec(currentPath);
      if (!match) {
        window.location.href = 'items/' + itemId;
    }
    },
    redirectToCart(itemId) {
      window.location.href = '/items-in-cart/';
    },
    handleRatingChange(rating) {
    const index = this.selectedRating.indexOf(rating);
    if (index === -1) {
      this.selectedRating.push(rating);
    } else {
      this.selectedRating.splice(index, 1);
    }
    },
    getRatingItemCount(rating) {
      const items = this.filteredProducts;
      return items.filter(item => Math.ceil(item.rating_float) === rating).length;
    },
    updateRange() {
      const productMinPrice = Math.min(...this.products.map(product => product.price));
      const productMaxPrice = Math.max(...this.products.map(product => product.price));

      if (this.min > this.max || this.min === '' || isNaN(this.min)) {
        this.min = productMinPrice;
      }
      if (this.max < this.min || this.max === '' || isNaN(this.max) || this.max > productMaxPrice ) {
        this.max = productMaxPrice;
      }
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
      let minVal = parseInt(document.querySelector(".min-range").value);
      let maxVal = parseInt(document.querySelector(".max-range").value);
      if (minVal >= maxVal) {
        minVal = maxVal;
      }
      if (maxVal <= minVal) {
        maxVal = minVal;
      }
      this.min = minVal;
      this.max = maxVal;
      const rangeInput = document.querySelector(".min-range");
      const rangeInputMax = document.querySelector(".max-range");

      if (rangeInput) {
        rangeInput.value = this.min;
      }

      if (rangeInputMax) {
        rangeInputMax.value = this.max;
      }
    },
    Search() {
      var input, filter, cards, cardContainer, h5, title, i;
      input = document.getElementById("filter");
      filter = input.value.toUpperCase();
      cardContainer = document.getElementById("mycard");
      cards = cardContainer.getElementsByClassName("card");
      for (i = 0; i < cards.length; i++) {
          title = cards[i].querySelector(".card-body h6.card-title");
          if (title.innerText.toUpperCase().indexOf(filter) > -1) {
              cards[i].style.display = "";
          } else {
              cards[i].style.display = "none";
          }
      }
    },
    scrollToTop() {
      document.body.scrollIntoView({ behavior: 'smooth' });
    },
  },
  watch: {
    filteredProducts() {
      if (this.filteredProducts.length < 4 ) {
        this.scrollToTop();
      }
    }
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
  computed: {
    discountedPrice() {
      if (this.product.discount) {
      return (this.product.price - (this.product.price * this.product.discount)).toFixed(2);
      }
      else {
       return (this.product.price * 1).toFixed(2);
      }
    },
  },
  template: `
  <div class="card" :id="product.id" :data-category="product.category_id" style="margin: 1px; padding: 1px;">
  <div class="card-body" style="cursor: pointer; padding: 5px;" @click="redirectToItemFromProduct(product.id)">
    <span class="badge bg-danger position-absolute top-0 start-0" v-if="product.discount >= 0.1"
      style="font-size: 0.8em; margin: 5px; top: 0; start: 0;">-[[ Math.floor(product.discount * 100) ]]%
    </span>
    <span class="fa fa-heart-o" style="position: absolute; top:5px;right:5px; font-weight:900; font-size:1.5em"></span>
    <img :src="'static/img/' + product.username + '/' + product.name + '/' + product.image" class="card-img-top">
    <h6 class="card-title" style="margin-bottom: 3px; padding: 5px; height: 3em; overflow: hidden; display: -webkit-box;
    -webkit-line-clamp: 3; -webkit-box-orient: vertical; line-height: 1;">
      [[ product.name ]]
    </h6>
    <p style="cursor: pointer; margin-bottom: 2px;">
      <i>
        <span v-for="i in 5" :key="i" :class="getStarClasses(i, product.rating_float)"></span>
        <span :id="'overall-rating' + product.id + '-float'" style="font-size:0.9em">&nbsp[[ product.rating_float ]]</span>
      </i>
      <span :id="'overall-rating' + product.id"> ([[ product.reviewNumber ]]) </span>
    </p>
    <input type="number" :data-price="product.price" hidden>
  </div>
  <div style="margin:0; padding:0; display: flex; flex-direction: column;">
    <span style="font-size: 1em;color:#dc3545;font-weight: 900;">
      Price: $[[ product.price|formatPrice ]]<span v-if="!Number.isInteger(product.price)" style="font-size: 0.7em; vertical-align: top;color:#dc3545;">
        [[ product.price.toString().split('.')[1] ]]
      </span>
    </span>
    <span v-if="product.discount >= 0.1" style="font-size: 0.8em; 
    text-decoration: line-through; color: #404447; margin-top: 2%; margin-bottom: 2%;">
      Old Price: $[[ Math.floor(product.price) | formatPrice]]
    </span>
    <div v-else style="font-size: 0.9em; margin-top: 3px;">&nbsp;</div>
    <button ref="addToCartButton" @click="addToCart(product)" class="btn btn-secondary btn-sm"
      style="margin-top: 3%;; margin-bottom: 0; padding: 5px; width:100%;">
      Add to Cart <i class="bi bi-cart-fill" style="font-size: 0.9rem;"> </i>
    </button>
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
      const toastContent = itemInCart
        ? `${product.name} is already in the cart`
        : `${product.name} was added to the cart`;

      const toastElement = new bootstrap.Toast(document.getElementById('cartToast'), {
        delay: 2000,
      });

      const toastBodyElement = document.getElementById('cartToastBody');
      toastBodyElement.innerText = toastContent;

      toastElement.show();

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
    truncateDescription(description, maxLength) {
      if (description.length > maxLength) {
        return description.substring(0, maxLength) + '...';
      }
      return description;
    }
  },
});

App.component('navbar-component', {
  props: ['product','cart', 'total', 'user', 'avatar'],
  data() {
  return {
    displayCart: true,
  };
},
  delimiters: ['[[', ']]'],
  mounted() {
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navLinks.forEach(otherLink => {
            otherLink.classList.remove('active');
          });
          link.classList.add('active');
        });
      });
        const currentUrl = window.location.href;
        navLinks.forEach(link => {
          const linkUrl = link.href;
          if (currentUrl === linkUrl) {
            link.classList.add('active');
          }
        });
  },
  template: `
 <div class="container-fluid" style="width: 100%; font-size: 14px;">
        <a class="navbar-brand" href="#" style="font-size: 14px; margin-left:50px">
           <i class="fa fa-home"></i> <strong>KRASSY SHOP</strong>
         </a>
        <div class="container" style="align-items:center; text-align:center; margin-left:500px">
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link mx-2 text-uppercase" href="/products">Offers</a>
            </li>
            <li class="nav-item">
              <a class="nav-link mx-2 text-uppercase" href="#">About</a>
            </li>
          </ul>
        <div v-if="cart" @mouseleave="hideCart()" @mouseenter="showCart()" d-flex bd-highlight mb-3>
          <button @click="displayCart = !displayCart" class="btn btn-light dropdown-toggle btn-sm" id="cartDropdown" aria-haspopup="true" aria-expanded="false">
             <i class="bi bi-cart" style="font-size: 1rem;"></i> Cart <span class="badge badge-pill badge-primary"> [[ cart.length ]]</span>
         </button>
          <div v-if="!displayCart" class="list-group position-absolute">
            <div v-for="(item, index) in cart.slice(0, Math.min(7, cart.length))" :key="index"
            class="list-group-item d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
            <img :src="'/static/img/' + item.username + '/' + item.name + '/' + item.image" class="mr-2"
                  style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;">
              <div style="cursor: pointer" @click="redirectToItemFromNavbar(item.id)">
                <div style="font-size: 0.9rem; width:180px">[[ item.name  ]] - $[[ item.price ]]</div>
              </div>
            </div>
            <button @click="removeFromCart(item.id)" class="btn btn-light btn-sm ml-2" data-bs-placement="top"
            style="margin-top:16px;">x</button>
          </div>
          <button id="total" class="btn btn-sm btn-light" style="pointer-events: none; opacity: 1; margin-bottom: 1px;">
            Total: [[ cart.length ]] products - <b> $[[ total ]] </b>
          </button>
          <button v-if="cart.length > 0" @click="redirectToCart" class="btn btn-sm btn-primary"> Go to Cart </button>
            </div>
        </div>
        <div class="ml-auto" style="font-family: Raleway; font-size: 14px; margin-left: 0; margin-right: 0;">
        <form class="form-inline my-2" style="margin-right: 80px;">
          <div class="dropdown" style="font-family: Raleway; font-size: 16px;">
            <img :src="avatar" class="avatar">
            <div class="dropdown-content" style="text-align: center;">
              <a class="nav-link text-uppercase" href="/user/profile" style="width: 100%;">Profile</a>
              <a class="nav-link text-uppercase" href="/logout" style="width: 100%;">Logout</a>
            </div>
          </div>
        </form>
      </div>
      </div>
      </div>
      </div>
  `,
  methods:{
  redirectToItemFromNavbar(itemId) {
    this.$root.redirectToItem(itemId);
  },
   redirectToCart() {
     window.location.href = `/items-in-cart`
     this.$root.redirectToCart();
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
  }
});

App.component('whishlist-component', {
  props: ['product', 'min', 'max','cart','selectedRatings','formatPrice'],
  emits: ['addToCart'],
  data() {
  return {
  };
},
  delimiters: ['[[', ']]'],
  template: `
  <div class="col-md-3 col-sm-6">
    <div class="product-grid">
        <div class="product-image">
            <a href="#" class="image" @click="redirectToItemFromProduct(product.id)">
                <img :src="'static/img/' + product.username + '/' + product.name + '/' + product.image" class="pic-1">
                <img :src="'static/img/' + product.username + '/' + product.name + '/' + product.image" class="pic-2">
            </a>
            <a href="#" class="product-like-icon" data-tip="Add to Wishlist">
                <i class="far fa-heart"></i>
            </a>
            <span class="product-sale-label">Sale</span>
            <a href="#" class="product-like-icon" data-tip="Add to Wishlist">
                <i class="far fa-heart"></i>
            </a>
            <ul class="product-links">
                <li><a href="#"><i class="fa fa-search"></i></a></li>
                <li><a href="#" ref="addToCartButton" @click="addToCart(product)" style="cursor: pointer"><i class="fas fa-shopping-cart"></i></a></li>
                <li><a href="#"><i class="fa fa-random"></i></a></li>
            </ul>
        </div>
        <div class="product-content" style="cursor: pointer;" @click="redirectToItemFromProduct(product.id)">
            <h3 class="title"><a href="#">[[ product.name ]]</a></h3>
            <span><small> $</small>[[ product.price | formatPrice  ]]</span>
            <span v-if="Number.isInteger(product.price) === false" style="font-size: 0.7em; vertical-align: top;">
                [[ product.price.toString().split('.')[1] ]]
            </span>
            <p style="margin-top: 0.6em;">
                <i>
                    <span v-for="i in 5" :key="i" :class="getStarClasses(i, product.rating_float)"></span>
                    <span :id="'overall-rating' + product.id + '-float'"><small>&nbsp[[ product.rating_float ]]</small></span>
                </i>
                <span :id="'overall-rating' + product.id"> <small> ([[ product.reviewNumber ]]) </small> </span>
            </p>
            <span class="badge bg-danger" v-if="product.price <= 90">WOW</span>
            <span class="badge bg-primary" v-else-if="product.price > 90 && product.price <= 1000">Value</span>
            <span class="badge bg-success" v-else-if="product.price > 1000">TOP</span>
            <span><small> $</small>[[ product.price | formatPrice  ]]</span>
            <span v-if="Number.isInteger(product.price) === false" style="font-size: 0.7em; vertical-align: top;">
                [[ product.price.toString().split('.')[1] ]]
            </span>
            <input type="number" :data-price="product.price" hidden>
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

App.component('item-component', {
  props: ['item', 'cart', 'total', 'user'],
  delimiters: ['[[', ']]'],
  emits: ['addToCart'],
  data() {
    return {
      currentPage: 1,
      reviewsPerPage: 2,
      reviewsData: [],
    };
  },
    created() {
      this.getItemRatingItem(this.item.id);
      this.setReviewsRating(this.item.id);
  },
  computed: {
        discountedPrice() {
          if (this.item.discount) {
            return (this.item.price - (this.item.price * this.item.discount)).toFixed(2);
          }
          else {
           return (this.item.price * 1).toFixed(2);
          }
        },
        totalPages() {
          return Math.ceil(this.item.reviews.length / this.reviewsPerPage);
        },
        pages() {
          return Array.from({ length: this.totalPages }, (_, i) => i + 1);
        },
        displayedReviews() {
          const startIndex = (this.currentPage - 1) * this.reviewsPerPage;
          const endIndex = startIndex + this.reviewsPerPage;
          return this.item.reviews.slice(startIndex, endIndex);
        },
  },
  template: `
  <div class = "card-wrapper">
  <div class = "card">
    <div class = "product-imgs">
      <div class = "img-display">
        <div class = "img-showcase">
        <img :src="'/static/img/' + item.username + '/' + item.name + '/' + item.image">
        <img :src="'/static/img/' + item.username + '/' + item.name + '/' + item.image">
        <img :src="'/static/img/' + item.username + '/' + item.name + '/' + item.image">
        <img :src="'/static/img/' + item.username + '/' + item.name + '/' + item.image">
          </div>
      </div>
      <div class="img-select">
        <div class="img-item">
          <a href="#" data-id = "1">
          <img :src="'/static/img/' + item.username + '/' + item.name + '/' + item.image">
          </a>
        </div>
        <div class="img-item">
          <a href="#" data-id = "2">
          <img :src="'/static/img/' + item.username + '/' + item.name + '/' + item.image">
          </a>
        </div>
        <div class="img-item">
          <a href="#" data-id = "3">
          <img :src="'/static/img/' + item.username + '/' + item.name + '/' + item.image">
          </a>
        </div>
        <div class="img-item">
          <a href="#" data-id="4">
          <img :src="'/static/img/' + item.username + '/' + item.name + '/' + item.image">
          </a>
        </div>
      </div>
    </div>

    <div class = "product-content">
      <h2 class = "product-title">[[ item.name ]]</h2>
      <div class = "product-rating">
        <span class="fa fa-star" id="star1"></span>
        <span class="fa fa-star" id="star2"></span>
        <span class="fa fa-star" id="star3"></span>
        <span class="fa fa-star" id="star4"></span>
        <span class="fa fa-star" id="star5"></span>
        <span id="overall-rating" @click="scrollToTarget" style="cursor: pointer;"></span>
      </div>

      <div class="product-price">
        <p class="new-price" id="new-price">Price: <span> <b> $[[ discountedPrice ]] </b></span></p>
        <p v-if="item.discount" class="last-price">Old Price: <span> <small> $[[ item.price ]]  </small> </span></p>
          <span  v-if="item.discount" class="badge bg-danger" style="font-size: 0.9em;">
          -[[ Math.floor(item.discount * 100) ]]%
          </span>
      </div>

      <div class="product-detail">
        <h3>Description: </h3>
          <li> Made entirely of metal with a weight of 1.68kg. </li>
          <li> Intel i5-13500H processor with up to 4.7GHz.</li>
          <li> Intel Iris Xe integrated graphics.</li>
          <li>512GB or 1TB ultrafast SSD storage.</li>
          <li>16″ display in 2.5K resolution.</li>
          <li>16GB of dual-channel LPDDR5-6400 RAM.</li>
          <li>72Wh battery with Thunderbolt 4 type C charger <br />  with ultra-fast charging at 100W,<br /> 
           allowing you to charge up to 50% of the battery <br />  in just 35 minutes and, mind you, it can last up to 16 hours.</li>
        <ul>
          <li>Color: <span>Black</span></li>
          <li>Available: <span>in stock</span></li>
          <li id="category">Category: <span>[[ item.category.name ]] </span></li>
          <li>Shipping Area: <span>All over the world</span></li>
          <li>Shipping Fee: <span>Free</span></li>
        </ul>
      </div>

      <div class = "purchase-info">
        <input type = "number" min = "0" value = "1">
        <button type = "button" class="btn" id="add-to-cart" ref="addToCartButton" @click="addToCart(item)">
          Add to Cart <i class = "fas fa-shopping-cart"></i>
        </button>
        <button type = "button" class = "btn">Compare</button>
      </div>
    </div>
  </div>
</div>
<section class="container" style="margin-top: 160px;">
  <div class="tab-container">
      <nav class="tab-nav">
          <div class="mobile-select"> <i class="bi bi-chevron-down"></i></div>
          <ul>
              <li><button class="btn tab-btn active" id="html">Reviews</button></li>
              <li><button class="btn tab-btn" id="csss">Specification</button></li>
              <li><button class="btn tab-btn" id="js">Details</button></li>
          </ul>
      </nav>
      <div class="tab-content">
      <div class="tab-item" data-id="html" id="reviewTab">
        <nav aria-label="Review Pagination">
          <ul class="pagination" style="margin-left:20px">
          <li class="page-item">
          <a class="page-link"  @click="prevPage" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li v-for="(page, index) in pages" :key="index" :class="{ 'page-item': true, 'active': page === currentPage }">
              <a class="page-link" @click="setCurrentPage(page)">[[ page ]]</a>
            </li>
          <li class="page-item">
              <a class="page-link" @click="nextPage" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
        </ul>
        </nav>
        <div class="card group1" v-if="displayedReviews.length > 0" v-for="review in displayedReviews" :key="review.id" :id="'card'+review.id" style="display: block; width:550px; margin-bottom: 2px;">
        <div class="row">
            <div class="col-12">
              <p>
                <div style="display: flex; align-items: center; justify-content: center;">
                  <img src="/static/img/img_avatar.png" class="avatar" style="padding: 5px;">
                  <span style="text-align: center;">[[ review.created_by ]]</span>
                </div>
                <span class="fa fa-star" :class="{ checked: star.checked }" :id="star.id" v-for="star in updateStarRatings(review)"></span>
              </p>
              <hr>
              <div>
                <p style="text-align: left; padding: 15px;">[[ review.text ]]
                  CSS (Cascading Style Sheets) is a stylesheet language used for describing the presentation and
                  layout of HTML documents. It plays a critical role in web development by allowing web developers
                  to control the visual appearance of web pages.
                </p>
              </div>
            </div>
          </div>
        </div>
          <div class="row pb-2" style="width:700px">
            <div class="card" id="RatingCard" style="width:550px; margin-left: 35px;">
              <div class="row">
              <div class="col-12" style="margin-bottom: 5px;">
              <div class="comment-box ml-2">
              <input type="number" id="comment-item-id" value="item.id" required hidden>
              <div class="rating" style="padding:10px;"> <input type="radio" name="rating" value="5" id="5"><label for="5">☆</label> <input type="radio" name="rating" value="4" id="4"><label for="4">☆</label> <input type="radio" name="rating" value="3" id="3"><label for="3">☆</label> <input type="radio" name="rating" value="2" id="2"><label for="2">☆</label> <input type="radio" name="rating" value="1" id="1"><label for="1">☆</label> </div>
              <div class="comment-area" style="width:500px; padding:10px;"> <textarea class="form-control" placeholder="Write a Review.." rows="4" id="comment-area"></textarea> </div>
              <div class="comment-btns mt-2">
              <div class="row">
              <div class="col-6">
              <div class="pull-left"> <button class="btn btn-secondary btn-sm" id="RatingCancel" @click="RatingHide">Cancel</button> </div>
              </div>
              <div class="col-6">
              <div class="pull-right"> <button class="btn btn-success send btn-sm" @click="addReview"> Submit </button> </div>
              </div>
              </div>
              </div>
              </div>
            </div>
          </div>
         </div>
         </div>
         </div>
          <div class="tab-item hide" data-id="csss">
              <p>[[ item.description ]]</p>
          </div>
          <div class="tab-item hide" data-id="js">
          <li> Samsung UE43CU8072U - 43" Diagonal Class CU8000 Series LED-backlit LCD TV </li> 
          <li>  Flat 2.16 m (85") LCD </li>
          <li>  Crystal UHD - Smart TV - Tizen OS - 4K UHD (2160p) 3840 x 2160 - HDR - black</li>
          <li>  DVB-S2, DVB-T2, ISDB-C </li> 
          <li>  Smart TV Internet TV </li> 
          <li>  Wi-Fi Ethernet LAN Bluetooth </li> 
          <li>  High Dynamic Range (HDR) supported </li> 
          <li>  G 168 kWh 168 W </li> 
          </div>
      </div>
  </div>
</section>
  `,
  methods: {
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
    setReviewsRating(id) {
      fetch(`/api/reviews?item_id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          this.reviewsData = data;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },
    updateStarRatings(review) {
      return Array.from({ length: 5 }, (_, i) => i + 1).map(starIndex => ({
        id: `star${review.id}${starIndex}`,
        checked: starIndex <= review.rating,
      }));
    },
    getItemRatingItem(item_id) {
      try {
        fetch(`/api/reviews/item/rating?id=${item_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            return response.json();
          })
          .then((data) => {
            for (let i = 1; i <= 5; i++) {
              const star = document.getElementById('star' + i);
              if (i <= data.rating) {
                star.classList.add('checked');
              } else {
                star.classList.remove('checked');
              }
            }
            document.getElementById('overall-rating').innerText = ' ' +
              parseFloat(data.rating_float).toFixed(2) +
              ' based on (' +
              data.review_number +
              ' reviews)';
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      } catch (error) {
        console.error('Error:', error);
      }
    },
    addReview() {
      const review = document.getElementById('comment-area').value;
      const id = this.item.id;
      const username = this.$root.user;
      const rating = document.querySelector('input[name="rating"]:checked').value;
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: review,
          item_id: id,
          rating: rating,
          created_by: username,
        }),
      };

      fetch('/create_review_ajax', requestOptions)
        .then(response => {
          if (!response.ok) {
            if (response.status === 403) {
               $("#comment-area").val('You can write only one review for this item')
               return Promise.reject('403 Forbidden');
           }
          }
          return response.json();
        })
        .then(data => {
          const reviewDiv = document.getElementsByClassName('card group1');
          const newCard = `
            <div class="card group1" id="card${data.id}" style="display: flex; margin-left: 25px; margin-bottom:3; width:550px">
              <div class="row" style="margin-left:0;">
                <div class="col-12" style="margin-bottom: 3px; margin-left:0;">
                  <p style="margin-left:0">
                    <div style="display: flex; align-items: center; justify-content: center;">
                      <img src="/static/img/img_avatar.png" class="avatar" style="padding: 5px;">
                      <span style="text-align: center;">${data.created_by}</span>
                    </div>
                    <span class="fa fa-star checked" id="star${data.id}1"></span>
                    <span class="fa fa-star checked" id="star${data.id}2"></span>
                    <span class="fa fa-star checked" id="star${data.id}3"></span>
                    <span class="fa fa-star" id="star${data.id}4"></span>
                    <span class="fa fa-star" id="star${data.id}5"></span>
                    <div>  <i>${data.text} </i></div>
                  </p>
                </div>
              </div>
            </div>
          `;
          this.getItemRatingItem(id);
          this.setReviewsRating(id);
          $("#reviewTab").append(newCard)
        })
        .catch(error => {
          // console.error('Error:', error);
        });
    },
    RatingHide(){
      document.getElementById('RatingCard').style.display = "none"
    },
    scrollToTarget() {
      var targetDiv = document.getElementById('reviewTab');
      if (targetDiv) {
        targetDiv.scrollIntoView({ behavior: 'smooth' });
      }
    },
    setCurrentPage(page) {
      this.currentPage = page;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },  
  },
});


App.mount('#app');