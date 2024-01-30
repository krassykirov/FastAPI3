<template>
  <div
    class="container-fluid"
    style="width: 100vw; position: sticky; margin: 0; padding: 0"
  >
    <nav
      class="navbar navbar-expand-lg bg-white sticky-top navbar-light ms-auto shadow-lg"
      style="height: 4em"
    >
      <MyNavbar
        :cart="cart"
        :favorites="favorites"
        :total="total"
        :user="user"
        :profile="profile"
        @addToCart="addToCart"
        @removeFromCart="removeFromCart"
        @redirectToItemFromNavbar="redirectToItemFromNavbar"
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
        top: 12%;
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
        placeholder="Search for product.."
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
        </div>
        <div class="filter-card">
          <div class="card-body">
            <label style="font-size: 1rem; display: block; margin-bottom: 5px"
              >Price</label
            >
            <div class="price-input row">
              <div class="form-group col-md-6">
                <label
                  for="minPrice"
                  style="font-size: 0.9rem; margin-left: 23px"
                  >Min Price</label
                >
                <input
                  v-model.number="min"
                  style="font-size: 0.9rem"
                  type="text"
                  class="min-input form-control"
                  id="minPrice"
                  :min="productMin"
                  :max="productMax"
                  pattern="[1-9][0-9]*"
                  disabled
                  required
                />
              </div>
              <div class="form-group col-md-6">
                <label
                  for="maxPrice"
                  style="font-size: 0.9rem; margin-left: 12px"
                  >Max Price</label
                >
                <input
                  v-model.number="max"
                  style="font-size: 0.9rem"
                  type="text"
                  class="max-input form-control"
                  id="maxPrice"
                  pattern="[1-9][0-9]*"
                  :min="productMin"
                  :max="productMax"
                  disabled
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
        </div>
        <div
          class="filter-card"
          style="height: 45px; align-items: center; text-align: left"
        >
          <div class="filter-content collapse show" id="collapse_3">
            <div
              class="form-check form-check-inline"
              style="display: flex; align-items: center"
            >
              <input
                class="form-check-input"
                type="checkbox"
                id="discountCheckbox"
                v-model="isChecked"
                @change="handleDiscountChange"
                style="margin-top: 0; margin-bottom: 0"
              />
              <label style="font-size: 1rem; margin-top: 0; margin-bottom: 0"
                >Discount > 10%</label
              >
            </div>
          </div>
        </div>
        <div class="filter-card">
          <div
            class="filter-content collapse show"
            id="collapse_4"
            v-if="ratings && ratings.length"
          >
            <label style="font-size: 1rem">Overall Rating</label>
            <div
              class="form-check form-check-inline"
              v-for="rating in ratings.slice().reverse()"
              :key="rating"
              style="display: flex; align-items: center; font-size: 1rem"
            >
              <input
                style="font-size: 1rem; margin-top: 3px !important"
                class="form-check-input"
                type="checkbox"
                :id="'rating' + rating"
                :value="rating"
                :disabled="getRatingItemCount(rating) === 0"
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
                <!-- prettier-ignore -->
                <span style="font-size: 0.9rem"
                >&nbsp;({{ getRatingItemCount(rating) }})
              </span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="product-list" id="mycard">
        <transition-group name="product-fade">
          <ProductList
            v-for="product in filteredProducts"
            :key="product.id"
            :cart="cart"
            :favorites="favorites"
            class="row g-0 col-auto"
            :product="product"
            :min="min"
            :max="max"
            :total="total"
            @addToCart="addToCart"
            @addTofavorites="addTofavorites"
            @removeFromCart="removeFromCart"
            @removeFromFavorites="removeFromFavorites"
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
import 'bootstrap'
// import VueCookies from 'vue-cookies'
import ProductList from '@/components/ProductList.vue'
import MyNavbar from '@/components/MyNavbar.vue'
import errorHandlingMixin from '../errorHandlingMixin'

export default {
  name: 'HomeView',
  components: {
    ProductList,
    MyNavbar
  },
  mixins: [errorHandlingMixin],
  data() {
    return {
      isChecked: this.$store.state.isDiscountedChecked
    }
  },
  created() {
    this.$store
      .dispatch('initializeUser')
      .catch(this.handleError)
      .then(() => this.$store.dispatch('getProfile'))
      .then(() => this.$store.dispatch('getProducts'))
      .then(() => this.$store.dispatch('readFromCartVue'))
      .then(() => this.$store.dispatch('checkFavoritesOnLoad'))
      .then(() => this.$store.dispatch('fetchCategories'))
      .then(() => this.$store.dispatch('updateProductRange'))
      .then(() => {
        const fetchRatingsPromises = this.$store.state.products.map(product => {
          return this.$store.dispatch('getItemRating', product.id)
        })
        return Promise.all(fetchRatingsPromises)
      })
      .catch(error => {
        if (error.message !== 'Token Expired') {
          console.error('error', error)
        }
      })
  },
  computed: {
    total() {
      return this.$store.getters.total
    },
    filteredProducts() {
      return this.$store.getters.filteredProducts
    },
    cart() {
      return this.$store.getters.cart
    },
    favorites() {
      return this.$store.getters.favorites
    },
    min() {
      return this.$store.getters.min
    },
    max() {
      return this.$store.getters.max
    },
    productMin() {
      return this.$store.getters.productMin
    },
    productMax() {
      return this.$store.getters.productMax
    },
    selectedCategories() {
      return this.$store.getters.selectedCategories
    },
    selectedRating: {
      get() {
        return this.$store.getters.selectedRating
      },
      set(value) {
        this.$store.commit('SET_SELECTED_RATING', value)
      }
    },
    ratings() {
      return this.$store.getters.ratings
    },
    accessToken() {
      return this.$store.getters.accessToken
    },
    user_id() {
      return this.$store.getters.user_id
    },
    user() {
      return this.$store.getters.user
    },
    profile() {
      return this.$store.getters.profile
    },
    categories() {
      return this.$store.getters.categories
    },
    sortOrder() {
      return this.$store.getters.sortOrder
    }
  },
  methods: {
    async getProduct(itemId) {
      this.$store.dispatch('getProduct', itemId)
    },
    async getProducts() {
      this.$store.dispatch('getProducts')
    },
    async fetchCategories() {
      this.$store.dispatch('fetchCategories')
    },
    async getItemRating(itemId) {
      this.$store.dispatch('getItemRating', itemId)
    },
    async handleCategoryChange() {
      const selectedCategories = await this.$store.dispatch(
        'getSelectedCategories'
      )
      this.$store.commit('UPDATE_SELECTED_CATEGORIES', selectedCategories)
    },
    getSelectedCategories() {
      this.$store.dispatch('getSelectedCategories')
    },
    toggleSortOrder() {
      this.$store.dispatch('toggleSortOrder')
    },
    async readFromCartVue() {
      this.$store.dispatch('readFromCartVue')
    },
    redirectToItem(itemId) {
      this.$store.dispatch('redirectToItem', itemId)
    },
    handleRatingChange(rating) {
      this.$store.dispatch('handleRatingChange', rating)
    },
    getRatingItemCount(rating) {
      const items = this.$store.state.products // Assuming products are stored in the store
      const count = items.reduce((accumulator, item) => {
        const floatRating = parseFloat(item.rating_float)
        const roundedRating = Math.floor(floatRating + 0.5) // Round to the nearest integer
        if (roundedRating === rating) {
          return accumulator + 1
        }
        return accumulator
      }, 0)
      return count
    },
    updateInputs() {
      this.$store.dispatch('updateInputs')
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
      this.$store.dispatch('addToCart', product)
    },
    removeFromCart(itemId) {
      this.$store.dispatch('removeFromCart', itemId)
    },
    addTofavorites(product) {
      this.$store.dispatch('addTofavorites', product)
    },
    removeFromFavorites(itemId) {
      this.$store.dispatch('removeFromFavorites', itemId)
    },
    handleDiscountChange() {
      this.$store.dispatch('handleDiscountChange', this.isChecked)
    },
    redirectToItemFromNavbar(itemId) {
      this.$store.dispatch('redirectToItem', itemId)
    }
  }
}
</script>
