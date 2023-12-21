<template>
  <section class="container">
    <my-navbar :cart="cart" />
    <div class="row col-2" style="float: left">
      <article class="filter-group">
        <p style="font-family: inherit; text-align: center">Categories</p>
        <hr />
        <div class="filter-content collapse show" id="collapse_2">
          <div class="card-body">
            <div
              class="cat"
              v-for="category in categories"
              :key="category[2]"
              :class="{ active: category[1] !== 0 }"
            >
              <label>
                <input
                  type="checkbox"
                  class="cat-checkbox"
                  :data-category="category[2]"
                  :disabled="category[1] === 0"
                  @change="handleCategoryChange"
                />
                <span>{{ category[0] }} </span>
                <!-- <b class="badge badge-light float-ri" v-if="category[1] !== 0">{{ category[1] }}</b> -->
              </label>
            </div>
          </div>
        </div>
      </article>
      <article class="filter-group" style="float: left; margin-left: 0">
        <hr />
        Sort:
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          @click="toggleSortOrder"
        >
          <span
            v-if="sortOrder === 'asc'"
            class="bi bi-sort-up-alt"
            style="font-size: 1rem"
          ></span>
          <span v-else class="bi bi-sort-down" style="font-size: 1rem"></span>
        </button>
        <div class="filter-content collapse show" id="collapse_3">
          <div class="card-body">
            <div class="form-row">
              <div class="form-group col-md-6">
                <label>Min price</label>
                <input
                  v-model="min"
                  class="form-control"
                  id="minPrice"
                  @input="validateMin"
                  placeholder="0"
                  min="0"
                  :max="max"
                  value="0"
                  pattern="[1-9][0-9]*"
                  type="text"
                  required
                />
              </div>
              <div class="form-group text-right col-md-6">
                <label>Max price</label>
                <input
                  v-model="max"
                  class="form-control"
                  id="maxPrice"
                  value="0"
                  placeholder="10000"
                  @input="validateMax"
                  pattern="[1-9][0-9]*"
                  type="text"
                  :min="min"
                  max="10000"
                  style="width: 100px"
                  required
                />
              </div>
            </div>
            <!-- <button class="btn btn-block btn-primary" @click="filterByPrice">Apply</button> -->
          </div>
        </div>
      </article>
      <article>
        <div>
          <div class="quick-filter ph-card">
            <label>
              <input type="checkbox" class="custom-control-input" />
              <button class="custom-button" @click="toggleSortOrder">
                Sort
              </button>
            </label>
          </div>
        </div>
      </article>
    </div>
    <div class="row g-0 col-auto" id="mycard" style="justify-content: left">
      <product-list
        v-for="product in products"
        :key="product.id"
        :product="product"
        :min="min"
        :max="max"
        :cart="cart"
      />
    </div>
  </section>
</template>

<script>
import $ from 'jquery'
import ProductList from '@/components/ProductList.vue'
import MyNavbar from '@/components/MyNavbar.vue'
export default {
  name: 'HomeView',
  data() {
    return {
      min: 1,
      max: 10000,
      products: [],
      categories: [],
      cart: [],
      sortOrder: 'asc',
      selectedCategories: [],
      showPopoverContent: false
    }
  },
  components: {
    MyNavbar,
    ProductList
  },
  async beforeMount() {
    await this.getProducts()
    console.log('Products', this.products)
    await this.fetchCategories()
    await this.readFromCart()
    this.products.forEach(product => {
      this.getItemRating(product.id)
    })
  },
  methods: {
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
          'http://127.0.0.1:8000/api/categories/category_items_len/'
        )
        this.categories = await res.json()
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
          document.getElementById(
            'overall-rating' + product.id + '-float'
          ).innerText = ' ' + parseFloat(data.rating_float).toFixed(2)
        }
      } catch (error) {
        console.log('error', error)
      }
    },
    filterByCategory() {
      var selectedCategories = this.getSelectedCategories()
      var cards = document.querySelectorAll('.card')
      cards.forEach(function (card) {
        var category = card.getAttribute('data-category')
        var displayCard =
          selectedCategories.length === 0 ||
          selectedCategories.includes(category)
        if (displayCard) {
          $(card).slideDown(300)
        } else {
          $(card).slideUp(300)
        }
      })
    },
    handleCategoryChange() {
      this.selectedCategories = this.getSelectedCategories()
      console.log('selectedCategories', this.selectedCategories)
      this.filterByCategory()
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
      console.log('Sort Order:', this.sortOrder)
      this.sortProducts()
    },
    sortProducts() {
      if (this.sortOrder === 'asc') {
        this.products.sort((a, b) => a.price - b.price)
      } else {
        this.products.sort((a, b) => b.price - a.price)
      }
    },
    filterByPrice() {
      // var selectedCategories = this.getSelectedCategories()
      var minPrice = parseFloat(document.getElementById('minPrice').value) || 0
      var maxPrice =
        parseFloat(document.getElementById('maxPrice').value) || 10000
      var cards = document.getElementsByClassName('card')
      for (var i = 0; i < cards.length; i++) {
        var categoryElement = cards[i].getAttribute('data-category')
        var category = categoryElement ? categoryElement.toUpperCase() : null
        var priceElement = cards[i].querySelector('[data-price]')
        var price = priceElement
          ? parseFloat(priceElement.getAttribute('data-price'))
          : 0
        var isCategoryMatch =
          !this.selectedCategories ||
          this.selectedCategories.length === 0 ||
          this.selectedCategories.includes(category)
        var isPriceMatch = price >= minPrice && price <= maxPrice
        var displayCard = isCategoryMatch && isPriceMatch
        if (displayCard) {
          cards[i].style.display = ''
        } else {
          cards[i].style.display = 'none'
        }
      }
    },
    validateMin() {
      const productMinPrice = Math.min(
        ...this.products.map(product => product.price)
      )
      this.min = this.min.replace(/^0+/, '')
      if (this.min === '' || isNaN(this.min)) {
        this.min = productMinPrice
      }
      if (this.min > this.max) {
        this.min = this.max
      }
    },
    validateMax() {
      const productMaxPrice = Math.max(
        ...this.products.map(product => product.price)
      )
      this.max = this.max.replace(/^0+/, '')
      if (this.max === '' || isNaN(this.max)) {
        this.max = productMaxPrice
      }

      if (this.max > productMaxPrice) {
        this.max = productMaxPrice
      }
      if (this.max < this.min) {
        this.max = this.min
      }
    },
    async readFromCart() {
      fetch('http://127.0.0.1:8000/api/items/items-in-cart', {
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
          this.cart = data
        })
        .catch(error => {
          console.error('error', error)
        })
    },
    redirectToItem(itemId) {
      window.location.href = 'items/' + itemId
    }
    // redirectToCart(itemId) {
    //   window.location.href = 'items-in-cart/'
    // }
  }
}
</script>

<style>
html {
  width: 100vw;
}
body {
  overflow-x: hidden;
  scrollbar-gutter: stable both-edges;
  width: 100%;
}

* {
  font-family: 'Raleway';
}

label {
  font-size: 14px;
}
body.modal-open {
  padding-right: -17px;
}
.card-img-top {
  width: 100%;
  height: 10vw;
  object-fit: cover;
}
.card {
  margin-bottom: 5px;
  margin-left: 1px;
  margin-right: 1px;
  width: 12vw;
  justify-content: left;
  /* border: 2px solid #969696; */
  text-align: center;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

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

/* .padding-0{
  padding-right:0;
  padding-left:50px;
} */

.badge-light {
  color: #212529;
  background-color: #f8f9fa;
}

input[type='range'] {
  -webkit-appearance: none;
  margin: 20px 0;
  width: 100%;
}
input[type='range']:focus {
  outline: none;
}
input[type='range']::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  animate: 0.2s;
  background: #03a9f4;
  border-radius: 25px;
}
input[type='range']::-webkit-slider-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 1);
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -8px;
}
input[type='range']:focus::-webkit-slider-runnable-track {
  background: #03a9f4;
}
.range-wrap {
  width: 170px;
  position: relative;
}
.range-value {
  position: absolute;
  top: -50%;
}
.range-value span {
  width: 10px;
  height: 24px;
  line-height: 10px;
  text-align: center;
  background: #03a9f4;
  color: #fff;
  font-size: 12px;
  display: block;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  border-radius: 6px;
}

.range-value span:before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-top: 10px solid #03a9f4;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  margin-top: -1px;
}

.cat {
  margin: 4px;
  background-color: #6c757d;
  border-radius: 40px;
  /* border: 1px solid #fff; */
  overflow: hidden;
  float: left;
}

.cat label {
  float: left;
  line-height: 3em;
  width: 10em;
  height: 3em;
  cursor: pointer;
  user-select: none;
}

.cat label span {
  text-align: center;
  padding: 3px 0;
  display: block;
  color: #fff;
}

.cat label input:disabled + span {
  background-color: #6c757d; /* Adjust the color as needed */
  cursor: not-allowed;
}

.cat label input {
  position: absolute;
  display: none;
  color: #fff !important;
}

.cat label input:checked + span {
  background-color: #007bff; /* Change the background color as needed */
}
.cat label b {
  margin-left: 5px; /* Adjust the margin as needed */
}
.custom-button {
  width: 160px;
  margin: 5px 10px 0 0;
  font-size: 14px;
  border-radius: 20px;
  border: 1px solid #ccc;
  background-color: #fff;
  padding: 6px 30px;
  cursor: pointer; /* Add cursor style for pointer */
  color: #000; /* Set text color */
}

.custom-button:hover {
  background-color: #e0e0e0; /* Change background color on hover if needed */
}
</style>
