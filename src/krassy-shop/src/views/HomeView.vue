<template>
  <div
    class="container-fluid"
    id="app"
    style="width: 100vw; position: sticky; margin: 0; padding: 0"
  >
    <nav
      class="navbar navbar-expand-lg bg-white sticky-top navbar-light ms-auto shadow-lg"
      style="height: 4em; margin-left: 0; margin-right: 0"
    >
      <MyNavbar
        :cart="cart"
        :total="total"
        :user="user"
        :avatar="'{{ avatar }}'"
      >
      </MyNavbar>
    </nav>

    <form class="d-flex">
      <input
        class="form-control mr-sm-2"
        id="filter"
        v-on:keyup="Search()"
        type="text"
        placeholder="Search by product name"
        style="
          width: 50vw;
          margin-top: 1.25%;
          margin-left: 28%;
          margin-right: 5%;
        "
      />
    </form>
    <div class="product-container">
      <div class="filter-products-container row col-2">
        <div class="filter-card">
          <article class="filter-group">
            <div class="filter-content collapse show" id="collapse_2">
              <label
                style="
                  font-size: 1rem;
                  display: block;
                  margin-bottom: 10px;
                  font-weight: 400;
                "
                >Categories
              </label>
              <div class="card-body">
                <div
                  class="container"
                  v-for="category in categories"
                  :key="category[2]"
                  :class="{ active: category[1] !== 0 }"
                >
                  <label style="font-size: 1rem">
                    <input
                      style="font-size: 1rem; margin-bottom: 2px"
                      type="checkbox"
                      class="cat-checkbox"
                      :data-category="category[2]"
                      :disabled="category[1] === 0"
                      @change="handleCategoryChange"
                    />
                    {{ category[0] }}
                  </label>
                  <span class="text-muted" style="font-size: 0.9rem">
                    ({{ category[1] }})
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>
        <div class="filter-card">
          <article class="filter-group">
            <div class="card-body">
              <label style="font-size: 1rem; display: block; margin-bottom: 5px"
                >Price</label
              >
              <div class="price-input row">
                <div class="form-group col-md-6">
                  <label for="minPrice" style="font-size: 0.9rem"
                    >Min Price</label
                  >
                  <input
                    v-model.number="min"
                    type="text"
                    class="min-input form-control"
                    id="minPrice"
                    @input="updateRange"
                    :min="productMin"
                    :max="productMax"
                    pattern="[1-9][0-9]*"
                    required
                  />
                </div>
                <div class="form-group col-md-6">
                  <label for="maxPrice" style="font-size: 0.9rem"
                    >Max Price</label
                  >
                  <input
                    v-model.number="max"
                    type="text"
                    class="max-input form-control"
                    id="maxPrice"
                    @input="updateRange"
                    pattern="[1-9][0-9]*"
                    :min="productMin"
                    :max="productMax"
                    required
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="slider-container">
                    <div
                      class="price-slider"
                      :style="{
                        left: `${(min / productMax) * 100}%`,
                        right: `${100 - (max / productMax) * 100}%`
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Slider -->
            <div class="range-input">
              <input
                type="range"
                class="min-range"
                :min="productMin"
                :max="productMax"
                :value="min"
                step="1"
                @input="updateInputs"
              />
              <input
                type="range"
                class="max-range"
                :min="productMin"
                :max="productMax"
                :value="max"
                step="1"
                @input="updateInputs"
              />
            </div>
            <div style="padding-top: 11%; padding-bottom: 1%">
              <button
                type="button"
                class="custom-button"
                @click="toggleSortOrder"
                style="align-items: center"
              >
                Sort Price
                <span
                  v-if="sortOrder === 'asc'"
                  class="bi bi-sort-up-alt"
                  style="font-size: 1rem"
                ></span>
                <span
                  v-else
                  class="bi bi-sort-down"
                  style="font-size: 1rem"
                ></span>
              </button>
            </div>
          </article>
        </div>
        <div
          class="filter-card"
          style="height: 45px; align-items: center; text-align: left"
        >
          <article class="filter-group">
            <div class="filter-content collapse show" id="collapse_3">
              <div
                class="form-check form-check-inline"
                style="display: flex; align-items: center"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="discountCheckbox"
                  v-model="isDiscountedChecked"
                  style="margin-top: 0; margin-bottom: 0"
                />
                <label style="font-size: 1rem; margin-top: 0; margin-bottom: 0"
                  >Discount > 10%</label
                >
              </div>
            </div>
          </article>
        </div>
        <div class="filter-card">
          <article class="filter-group">
            <div class="filter-content collapse show" id="collapse_3">
              <label style="font-size: 1rem">Overall Rating</label>
              <div
                class="form-check form-check-inline"
                v-for="rating in ratings.slice().reverse()"
                :key="rating"
              >
                <input
                  style="font-size: 1rem; margin-top: 7px"
                  class="form-check-input"
                  type="checkbox"
                  :id="'rating' + rating"
                  :value="rating"
                  v-model="selectedRating"
                />
                <label class="form-check-label" :for="'rating' + rating">
                  <span
                    v-for="i in 5"
                    :key="i"
                    class="fa"
                    :class="{
                      'fa-star checked': i <= rating,
                      'fa-star unchecked': i > rating
                    }"
                    style="font-size: 1rem; margin-top: 7px"
                  >
                  </span>
                  <span style="font-size: 0.9rem"
                    >( {{ getRatingItemCount(rating) }})
                  </span>
                </label>
              </div>
            </div>
          </article>
        </div>
      </div>
      <div class="product-list" id="mycard">
        <transition-group name="product-fade" mode="out-in">
          <ProductList
            v-for="product in filteredProducts"
            :key="product.id"
            :cart="cart"
            class="row g-0 col-auto"
            :product="product"
            :min="min"
            :max="max"
            :total="total"
            style="justify-content: left"
          >
          </ProductList>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
// import $ from 'jquery'
import { ref } from 'vue'
import ProductList from '@/components/ProductList.vue'
import MyNavbar from '@/components/MyNavbar.vue'
export default {
  name: 'HomeView',
  data() {
    return {
      min: ref(1),
      max: ref(10000),
      products: ref([]),
      isDiscountedChecked: ref(false),
      item: ref(null),
      categories: ref([]),
      cart: ref([]),
      sortOrder: ref('asc'),
      selectedCategories: ref([]),
      selectedRating: ref([]),
      ratings: ref([1, 2, 3, 4, 5]),
      user: ref([]),
      user_id: ref(null),
      productMin: ref(0),
      productMax: ref(10000)
    }
  },
  components: {
    MyNavbar,
    ProductList
  },
  async created() {
    await this.getProducts()
    await this.readFromCartVue()
    await this.fetchCategories()
    this.products.forEach(product => {
      this.getItemRating(product.id)
      this.updateRange()
    })
  },
  computed: {
    total() {
      const sum = this.cart.reduce(
        (total, item) => total + Number(item.price),
        0
      )
      return sum.toFixed(2)
    },
    filteredProducts() {
      return this.products.filter(item => {
        const priceCondition = item.price >= this.min && item.price <= this.max
        const categoryCondition =
          this.selectedCategories.length === 0 ||
          this.selectedCategories.includes(String(item.category_id))
        const ratingCondition =
          this.selectedRating.length === 0 ||
          this.selectedRating.includes(Math.ceil(item.rating_float))
        const discountCondition =
          !this.isDiscountedChecked || item.discount != null
        return (
          priceCondition &&
          categoryCondition &&
          ratingCondition &&
          discountCondition
        )
      })
    }
  },
  methods: {
    async getProduct(itemId) {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/items/item/${itemId}`
        )
        const item = await res.json()
        this.item = item
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    },
    async getProducts() {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/items')
        const products = await res.json()
        this.products = products
        const maxPrice = Math.max(
          ...this.products.map(product => product.price)
        )
        const minPrice = Math.min(
          ...this.products.map(product => product.price)
        )
        this.max = maxPrice
        this.min = minPrice
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },
    async fetchCategories() {
      try {
        const res = await fetch(
          'http://127.0.0.1:8000/api/categories/category_items_len'
        )
        this.categories = await res.json()
        console.log('this.categories', this.categories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },
    async getItemRating(itemId) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/reviews/item/rating?id=${itemId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        const product = this.products.find(p => p.id === itemId)
        if (product) {
          product.rating = data.rating
          product.reviewNumber = data.review_number
          product.rating_float = parseFloat(data.rating_float).toFixed(2)
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleCategoryChange() {
      this.selectedCategories = this.getSelectedCategories()
    },
    getSelectedCategories() {
      var selectedCategories = []
      var checkboxes = document.querySelectorAll('.cat-checkbox:checked')
      checkboxes.forEach(checkbox => {
        var categoryId = checkbox.getAttribute('data-category')
        selectedCategories.push(categoryId)
      })
      return selectedCategories
    },
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      this.sortProducts()
    },
    sortProducts() {
      if (this.sortOrder === 'asc') {
        this.products.sort((a, b) => a.price - b.price)
      } else {
        this.products.sort((a, b) => b.price - a.price)
      }
    },
    async readFromCartVue() {
      fetch('http://127.0.0.1:8000/user_items_in_cart', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }
          return response.json()
        })
        .then(data => {
          this.cart = data.items
          this.user = data.user
          this.user_id = data.user_id
        })
        .catch(error => {
          console.error('error', error)
        })
    },
    async getProfile() {
      const response = await fetch(
        `http://127.0.0.1:8000/api/profile/${this.user_id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      if (!response.ok) {
        console.log(response.error)
      } else {
        const data = await response.json()
        console.log('response', response)
        this.profile = `http://127.0.0.1:8000/static/img/${this.user}/profile/${data.avatar}`
      }
    },
    redirectToItem(itemId) {
      var currentPath = window.location.pathname
      var regex = /\/items\/(.*)/
      var match = regex.exec(currentPath)
      if (!match) {
        window.location.href = 'items/' + itemId
      }
    },
    // redirectToCart(itemId) {
    //   window.location.href = '/items-in-cart/'
    // },
    handleRatingChange(rating) {
      const index = this.selectedRating.indexOf(rating)
      if (index === -1) {
        this.selectedRating.push(rating)
      } else {
        this.selectedRating.splice(index, 1)
      }
    },
    getRatingItemCount(rating) {
      const items = this.filteredProducts
      return items.filter(item => Math.ceil(item.rating_float) === rating)
        .length
    },
    updateRange() {
      const productMinPrice = Math.min(
        ...this.products.map(product => product.price)
      )
      const productMaxPrice = Math.max(
        ...this.products.map(product => product.price)
      )

      if (this.min > this.max || this.min === '' || isNaN(this.min)) {
        this.min = productMinPrice
      }
      if (
        this.max < this.min ||
        this.max === '' ||
        isNaN(this.max) ||
        this.max > productMaxPrice
      ) {
        this.max = productMaxPrice
      }
      const rangeInput = document.querySelector('.min-range')
      if (rangeInput) {
        rangeInput.value = this.min
      }
      const rangeInputMax = document.querySelector('.max-range')
      if (rangeInputMax) {
        rangeInputMax.value = this.max
      }
    },
    updateInputs() {
      let minVal = parseInt(document.querySelector('.min-range').value)
      let maxVal = parseInt(document.querySelector('.max-range').value)
      if (minVal >= maxVal) {
        minVal = maxVal
      }
      if (maxVal <= minVal) {
        maxVal = minVal
      }
      this.min = minVal
      this.max = maxVal
      const rangeInput = document.querySelector('.min-range')
      const rangeInputMax = document.querySelector('.max-range')

      if (rangeInput) {
        rangeInput.value = this.min
      }

      if (rangeInputMax) {
        rangeInputMax.value = this.max
      }
    },
    Search() {
      var input, filter, cards, cardContainer, title, i
      input = document.getElementById('filter')
      filter = input.value.toUpperCase()
      cardContainer = document.getElementById('mycard')
      cards = cardContainer.getElementsByClassName('card')
      for (i = 0; i < cards.length; i++) {
        title = cards[i].querySelector('.card-body h6.card-title')
        if (title.innerText.toUpperCase().indexOf(filter) > -1) {
          cards[i].style.display = ''
        } else {
          cards[i].style.display = 'none'
        }
      }
    },
    scrollToTop() {
      document.body.scrollIntoView({ behavior: 'smooth' })
    },
    addToCart(product) {
      const itemInCart = this.cart.find(item => item.id === product.id)
      // const toastContent = itemInCart
      //   ? `${product.name} is already in the cart`
      //   : `${product.name} was added to the cart`

      // const toastElement = new bootstrap.Toast(
      //   document.getElementById('cartToast'),
      //   {
      //     delay: 2000
      //   }
      // )

      // const toastBodyElement = document.getElementById('cartToastBody')
      // toastBodyElement.innerText = toastContent

      // toastElement.show()

      if (!itemInCart) {
        fetch('/update-basket', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            item_id: product.id
          })
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`)
            }
            return response.json()
          })
          .then(() => {
            this.cart.push(product)
          })
          .catch(error => {
            console.error('error', error)
          })
      }
    }
  },
  filters: {
    formatPrice(price) {
      return Number.isInteger(price) ? price : price.toFixed(2)
    }
  }
}
</script>

<style>
@import url('//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
@import url('https://fonts.googleapis.com/css?family=Raleway');

html {
  width: 100vw;
}
body {
  overflow-x: hidden;
  scrollbar-gutter: stable both-edges;
  background-color: #f2f6f6;
}

* {
  font-family: 'Raleway';
}

.product-fade-enter-active,
.product-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.product-fade-enter,
.product-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.dropdown-menu {
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  margin-bottom: 0;
}

label {
  font-size: 14px;
  font-weight: 400;
}

body.modal-open {
  padding-right: -17px;
}

.card-img-top {
  width: 100%;
  height: 13vw;
  object-fit: cover;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 5px;
  margin-top: 15px;
}

.card {
  margin-bottom: 3px;
  margin-left: 1px;
  margin-right: 1px;
  width: 16vw;
  justify-content: left;
  /* border: 2px solid #969696; */
  text-align: center;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

.card-title {
  margin-top: 0;
  /* margin: 0; */
}
/* .card-body{
  padding: 0;
  padding-left: 0;
  padding-top: 0;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
} */

.dropbtn {
  background-color: #919d98;
  color: white;
  padding: 14px;
  font-size: 14px;
  border: none;
  border-radius: 4em;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  font-size: 13px;
}

.dropdown-content a {
  color: black;
  padding: 10px 14px;
  text-decoration: none;
  display: block;
}

.avatar {
  vertical-align: middle;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.form-control:focus {
  color: #495057;
  background-color: #fff;
  border-color: #ffffff;
  outline: 0;
  box-shadow: 0 0 0 1px rgb(139, 133, 133) !important;
}

.form-control {
  font-size: 0.9rem;
}

.send {
  color: #fff;
  background-color: #13b942;
  border-color: #ff0000;
}
.send:hover {
  color: #fff;
  background-color: #029cf5;
  border-color: #02b0f5;
}
.rating {
  display: flex;
  margin-top: -10px;
  flex-direction: row-reverse;
  margin-left: -4px;
  float: left;
}
.rating > input {
  display: none;
}
.rating > label {
  position: relative;
  width: 19px;
  font-size: 25px;
  color: orange;
  cursor: pointer;
}
.rating > label::before {
  content: '\2605';
  position: absolute;
  opacity: 0;
}
.rating > label:hover:before,
.rating > label:hover ~ label:before {
  opacity: 1 !important;
}
.rating > input:checked ~ label:before {
  opacity: 1;
}
.rating:hover > input:checked ~ label:before {
  opacity: 0.4;
}
.price {
  color: grey;
  font-size: 22px;
}

.card button:hover {
  opacity: 0.7;
}
/* Style the tab */

.checked {
  color: orange;
}
.dropdown-content a:hover {
  background-color: #ddd;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown:hover .dropbtn {
  background-color: #606c97;
}

/* Styles for the price input container */

.price-input .price-field {
  display: flex;
  margin-bottom: 22px;
}

.price-field span {
  margin-right: 10px;
  margin-top: 10px; /* Adjusted margin-top */
  font-size: 17px;
  color: #404447;
}

.price-field input {
  flex: 1;
  height: 35px;
  font-size: 15px;
  font-family: 'DM Sans', sans-serif;
  border-radius: 9px;
  text-align: center;
  border: 0px;
  background: #e4e4e4;
}

.price-input {
  width: 100%;
  font-size: 19px;
  color: #555;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.slider-container {
  width: 100%;
}

.slider-container {
  height: 6px;
  position: relative;
  background: #e4e4e4;
  border-radius: 5px;
}

.slider-container .price-slider {
  height: 100%;
  left: 0%;
  right: 0%;
  position: absolute;
  border-radius: 5px;
  background: #5e95e2;
}

.range-input {
  position: relative;
}

.range-input input {
  position: absolute;
  width: 100%;
  height: 5px;
  background: none;
  top: -5px;
  pointer-events: none;
  cursor: pointer;
  -webkit-appearance: none;
}

/* Styles for the range thumb in WebKit browsers */
input[type='range']::-webkit-slider-thumb {
  height: 14px;
  width: 14px;
  border-radius: 70%;
  background: #1261b5;
  pointer-events: auto;
  -webkit-appearance: none;
}

@media screen and (max-width: 768px) {
  .price-input {
    flex-direction: column;
    align-items: center;
  }
}

/* From Base_OLD */

#cartDropdown {
  margin-top: 14px;
}
.last-price {
  color: #f64749;
  text-decoration: line-through;
}
.btn {
  /* border: 1px solid #ddd; */
  /* border-radius: 25px; */
  text-align: center;
  padding: 0.45rem 0.7rem;
  outline: 0;
  margin-right: 0.2rem;
  margin-bottom: 1rem;
}

INPUT[type='checkbox']:focus {
  outline: 1px solid rgba(0, 0, 0, 0.2);
}

INPUT[type='checkbox'] {
  background-color: #e6eaeb;
  border-radius: 1px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 17px;
  height: 17px;
  cursor: pointer;
  position: relative;
  top: 5px;
}

INPUT[type='checkbox']:checked {
  background-color: #409fd6;
  background: #409fd6
    url('data:image/gif;base64,R0lGODlhCwAKAIABAP////3cnSH5BAEKAAEALAAAAAALAAoAAAIUjH+AC73WHIsw0UCjglraO20PNhYAOw==')
    3px 3px no-repeat;
}

INPUT[type='checkbox']:disabled {
  background: #e6e6e6;
  opacity: 0.6;
  pointer-events: none;
}

.product-container {
  display: flex;
}

.filter-products-container {
  display: flex;
  flex-direction: column;
  margin-left: 5.5%;
  margin-top: 1.2%;
}

.product-list {
  flex-grow: 1;
  padding-right: 1%;
  padding-left: 0.03%;
  margin-top: 1.2%;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.filter-card {
  margin-bottom: 5px;
  padding: 10px;
  border: 1px solid #cfcdcd;
  border-radius: 9px;
  background-color: white;
}

.filter-group {
  user-select: none;
  margin-bottom: 30px;
  border-bottom: 10px solid #ddd;
  padding-bottom: 10px;
}

.filter-group:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.fa-star.unchecked {
  color: rgb(203, 197, 197);
}
.fa-star.checked {
  color: orange;
}
.custom-button {
  width: 150px;
  margin: auto;
  margin-left: 14%;
  margin-bottom: 3px;
  font-size: 14px;
  border-radius: 20px;
  border: 1px solid #ccc;
  background-color: #fff;
  padding: 6px 30px;
  cursor: pointer;
  color: #000;
}

.form-check {
  display: block;
  margin-bottom: 5px; /* Adjust the margin as needed */
}

.custom-button:hover {
  background-color: #e0e0e0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  z-index: 1;
}
.fade-enter-to {
  opacity: 1;
}
.fade-enter-from {
  opacity: 0;
}
</style>
