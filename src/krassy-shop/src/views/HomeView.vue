<template>
  <div
    class="container-fluid"
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
        @addToCart="addToCart"
        @removeFromCart="removeFromCart"
      />
    </nav>
    <div
      class="toast"
      id="cartToast"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-bs-autohide="false"
      style="
        position: fixed;
        top: 10%;
        right: 5%;
        transform: translate(0, -50%);
        width: 250px;
        z-index: 1000;
      "
    >
      <div
        class="toast-body"
        id="cartToastBody"
        style="font-weight: 900; font: 1.1em"
      ></div>
    </div>
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
        <transition-group name="product-fade">
          <ProductList
            v-for="product in filteredProducts"
            :key="product.id"
            :cart="cart"
            class="row g-0 col-auto"
            :product="product"
            :min="min"
            :max="max"
            :total="total"
            @addToCart="addToCart"
            @removeFromCart="removeFromCart"
            v-on:redirectToItem="redirectToItem"
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
import 'bootstrap'
import VueCookies from 'vue-cookies'
import ProductList from '@/components/ProductList.vue'
import MyNavbar from '@/components/MyNavbar.vue'

/* global bootstrap */

export default {
  name: 'HomeView',
  data() {
    return {
      min: ref(1),
      max: ref(10000),
      products: ref([]),
      isDiscountedChecked: ref(false),
      categories: ref([]),
      cart: ref([]),
      sortOrder: ref('asc'),
      selectedCategories: ref([]),
      selectedRating: ref([]),
      ratings: ref([1, 2, 3, 4, 5]),
      user: ref([]),
      accessToken: VueCookies.get('access_token') || '',
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
    getCookie() {
      const access_token = this.$cookies.get('access_token')
      console.log('access_token from HomeVue methods', access_token)
    },
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
      try {
        const headers = new Headers({
          Authorization: `Bearer ${this.accessToken}`,
          Accept: 'application/json'
        })

        const requestOptions = {
          method: 'GET',
          headers: headers,
          redirect: 'follow'
        }
        const response = await fetch(
          'http://127.0.0.1:8000/api/items/user-items-in-cart',
          requestOptions
        )
        if (!response.ok) {
          console.log('readFromCartVue error')
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()

        this.cart = data.items
        this.user = data.user
        this.user_id = data.user_id
      } catch (error) {
        console.error('error', error)
      }
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
      console.log('redirectToItem in HomeVue', itemId)
      this.$router.push({ name: 'Item', params: { itemId } })
      // var currentPath = window.location.pathname
      // var regex = /\/items\/(.*)/
      // var match = regex.exec(currentPath)
      // if (!match) {
      //   window.location.href = 'items/' + itemId
      // }
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
      const headers = new Headers({
        Authorization: `Bearer ${this.accessToken}`,
        Accept: 'application/json'
      })
      const requestOptions = {
        method: 'POST',
        headers: headers,
        redirect: 'follow',
        body: JSON.stringify({
          item_id: product.id
        })
      }
      const itemInCart = this.cart.find(item => item.id === product.id)
      const toastContent = itemInCart
        ? `${product.name} is already in the cart`
        : `${product.name} was added to the cart`

      const toastElement = new bootstrap.Toast(
        document.getElementById('cartToast'),
        {
          delay: 2000
        }
      )

      const toastBodyElement = document.getElementById('cartToastBody')
      toastBodyElement.innerText = toastContent

      toastElement.show()
      if (!itemInCart) {
        fetch('http://127.0.0.1:8000/api/items/update-basket', requestOptions)
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
    },
    removeFromCart(itemId) {
      console.log('removeFromCart', this.accessToken)
      const headers = new Headers({
        Authorization: `Bearer ${this.accessToken}`,
        Accept: 'application/json'
      })
      const requestOptions = {
        method: 'POST',
        headers: headers,
        redirect: 'follow',
        body: JSON.stringify({
          item_id: itemId
        })
      }
      fetch('http://127.0.0.1:8000/user/remove-from-basket', requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }
          return response.json()
        })
        .then(() => {
          const index = this.cart.findIndex(item => item.id === itemId)
          if (index !== -1) {
            this.cart.splice(index, 1)
          }
        })
        .catch(error => {
          console.error('Error removing item from cart:', error)
        })
    }
  },
  filters: {
    formatPrice(price) {
      return Number.isInteger(price) ? price : price.toFixed(2)
    }
  }
}
</script>
