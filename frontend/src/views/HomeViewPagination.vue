<template>
  <div
    class="container-fluid"
    style="width: 100vw; position: sticky; margin: 0; padding: 0"
  >
    <nav class="navbar navbar-expand-lg fixed-top bg-light" style="height: 4em">
      <MyNavbar
        :cart="cart"
        :favorites="favorites"
        :total="total"
        :user="user"
        :user_id="user_id"
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
        right: 2%;
        transform: translate(0, -50%);
        width: 250px;
        z-index: 1000;
      "
    >
      <div
        class="toast-body"
        id="cartToastBody"
        style="font-weight: 500; font: 1.1rem"
      ></div>
    </div>
    <div class="product-container">
      <div class="filter-products-container row col-2">
        <div class="filter-card">
          <div class="filter-content collapse show" id="collapse_2">
            <label
              style="
                font-size: 0.9rem;
                display: block;
                margin-bottom: 10px;
                font-weight: 500;
              "
              >Filter by Category
            </label>
            <div class="card-body">
              <div
                class="container"
                v-for="category in categories"
                :key="category[2]"
                :class="{ active: category[1] !== 0 }"
                style="padding-left: 7px"
              >
                <label style="font-size: 0.9rem">
                  <input
                    style="font-size: 0.8rem; margin-bottom: 2px"
                    type="checkbox"
                    class="cat-checkbox"
                    :data-category="category[2]"
                    :disabled="category[1] === 0"
                    @change="handleCategoryChange"
                  />
                  <span
                    style="
                      padding-left: 5px;
                      font-size: 0.85rem;
                      font-weight: 400;
                    "
                  >
                    {{ category[0] }}
                  </span>
                </label>
                <span
                  class="text-muted"
                  style="
                    font-size: 0.8rem;
                    font-family: sans-serif;
                    font-weight: 500;
                  "
                >
                  ({{ category[1] }})
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="filter-card">
          <div class="card-body">
            <label
              style="
                font-size: 0.9rem;
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
              "
              >Filter by Price</label
            >
            <div class="price-input row">
              <div class="form-group col-md-6">
                <label
                  for="minPrice"
                  style="font-size: 0.8rem; margin-left: 23px"
                  >Min Price</label
                >
                <input
                  v-model.number="min"
                  style="font-size: 0.8rem"
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
                  style="font-size: 0.8rem; margin-left: 12px"
                  >Max Price</label
                >
                <input
                  v-model.number="max"
                  style="font-size: 0.8rem"
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
              style="align-items: center; font-size: 0.8rem"
            >
              Sort Price
              <span
                v-if="sortOrder === 'asc'"
                class="bi bi-sort-up-alt"
                style="font-size: 0.9rem"
              ></span>
              <span
                v-else
                class="bi bi-sort-down"
                style="font-size: 0.9rem"
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
              style="display: flex; align-items: left"
            >
              <input
                class="brand-checkbox"
                type="checkbox"
                id="discountCheckbox"
                v-model="isChecked"
                @change="handleDiscountChange"
                style="
                  font-size: 0.9rem;
                  margin-bottom: 9px;
                  margin-left: -17px;
                "
              />
              <label
                style="
                  font-size: 0.9rem;
                  margin-top: 0;
                  margin-bottom: 0;
                  padding-left: 5px;
                "
                >Discounted Products</label
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
            <label style="font-size: 0.9rem; font-weight: 500">
              Filter by Rating
            </label>
            <div
              class="form-check form-check-inline"
              v-for="rating in ratings.slice().reverse()"
              :key="rating"
              style="
                display: flex;
                align-items: center;
                font-size: 0.8rem;
                margin-left: 0;
                padding-left: 0;
              "
            >
              <input
                style="font-size: 0.9rem; margin-bottom: 8px; margin-left: 8px"
                class="brand-checkbox"
                type="checkbox"
                :id="'rating' + rating"
                :value="rating"
                :disabled="getRatingItemCount(rating) === 0"
                v-model="selectedRating"
              />
              <label
                class="form-check-label"
                :for="'rating' + rating"
                style="margin-left: 5px"
              >
                <span
                  v-for="i in 5"
                  :key="i"
                  class="fa"
                  :class="{
                    'fa-star checked': i <= rating,
                    'fa-star unchecked': i > rating
                  }"
                  style="font-size: 15px; margin-top: 8px"
                >
                </span>
                <!-- prettier-ignore -->
                <span class="text-muted"
                  style="
                    font-size: 0.8rem;
                    padding-left: 0;
                    font-weight: 500;
                  "
                >&nbsp;({{ getRatingItemCount(rating) }})
              </span>
              </label>
            </div>
          </div>
        </div>
        <!-- <PriceSlider /> -->
      </div>
      <template v-if="filteredProducts && filteredProducts.length > 0">
        <div class="product-list" id="mycard">
          <transition-group name="product-fade">
            <!-- Render ProductList if there are filteredProducts -->
            <ProductList
              :products="paginatedProducts"
              :key="products"
              :currentPage="currentPage"
              :itemsPerPage="itemsPerPage"
              :cart="cart"
              :favorites="favorites"
              @addToCart="addToCart"
              @addTofavorites="addTofavorites"
              @removeFromCart="removeFromCart"
              @removeFromFavorites="removeFromFavorites"
              @redirectToItem="redirectToItem"
              style="justify-content: left; margin-top: 0"
            />
          </transition-group>
        </div>
      </template>
      <template v-else>
        <div style="align-items: center; margin-left: 10%">
          <img :src="require('@/assets/loading.gif')" />
        </div>
      </template>
    </div>
    <nav aria-label="Pagination" style="margin-top: 30px">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button
            class="page-link"
            @click="prevPage"
            :disabled="currentPage === 1"
          >
            Prev
          </button>
        </li>
        <!-- Show pages around the current page -->
        <template v-for="page in visiblePages" :key="page">
          <li class="page-item" :class="{ active: currentPage === page }">
            <button class="page-link" @click="setCurrentPage(page)">
              {{ page }}
            </button>
          </li>
        </template>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button
            class="page-link"
            @click="nextPage"
            :disabled="currentPage === totalPages"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
    <Footer />
  </div>
</template>

<script>
// import $ from 'jquery'
import 'bootstrap'
import router from '@/router'
import VueCookies from 'vue-cookies'
import { jwtDecode } from 'jwt-decode'
import ProductList from '@/components/ProductListPagination.vue'
import MyNavbar from '@/components/MyNavbar.vue'
import Footer from '@/views/FooterVue.vue'
// import PriceSlider from '@/views/PriceSlider.vue'
// import MessageArea from '@/views/MessageAreaVue.vue'
import errorHandlingMixin from '../errorHandlingMixin'
import config from '@/config'
// import { handleError } from 'vue'

export default {
  name: 'HomeView',
  components: {
    ProductList,
    MyNavbar,
    Footer
    // PriceSlider
  },
  props: {
    isIdle: Boolean,
    lastActiveDate: Date,
    inactiveTime: Number
  },
  mixins: [errorHandlingMixin],
  data() {
    return {
      isChecked: this.$store.state.isDiscountedChecked,
      backendEndpoint: `${config.backendEndpoint}`,
      currentPage: 1,
      itemsPerPage: 32,
      visiblePageRange: 5
    }
  },
  created() {
    if (!this.$store.state.accessToken) {
      const accessToken = VueCookies.get('access_token')
      if (accessToken) {
        const user = jwtDecode(accessToken).sub
        const user_id = jwtDecode(accessToken).user_id
        this.$store.commit('UPDATE_USER', user)
        this.$store.commit('UPDATE_USER_ID', user_id)
      } else {
        this.errorMessage = 'Session expired'
        router.push('/login')
      }
    }
    this.$store
      .dispatch('getProducts')
      .then(() => this.$store.dispatch('getProfile'))
      .then(() => this.$store.dispatch('fetchCategories'))
      .then(() => this.$store.dispatch('checkFavoritesOnLoad'))
      .then(() => this.$store.dispatch('updateHomeProductRange'))
      .catch(error => {
        if (error.message !== 'Token Expired') {
          // console.error('error', error)
        }
      })
  },
  computed: {
    paginatedProducts() {
      const groupedProducts = this.groupedProducts
      const currentPageIndex = this.currentPage - 1
      if (currentPageIndex >= 0 && currentPageIndex < groupedProducts.length) {
        const currentPageProducts = groupedProducts[currentPageIndex]

        const filteredProducts = currentPageProducts.filter(item => {
          const categoryCondition =
            this.$store.state.selectedCategories.length === 0 ||
            this.$store.state.selectedCategories.includes(
              String(item.category_id)
            )
          const priceCondition =
            item.price >= this.$store.state.min &&
            item.price <= this.$store.state.max
          const ratingCondition =
            this.$store.state.selectedRating.length === 0 ||
            this.$store.state.selectedRating.includes(
              Math.round(item.rating_float)
            )
          const discountCondition =
            !this.$store.state.isDiscountedChecked || item.discount != null
          return (
            priceCondition &&
            categoryCondition &&
            ratingCondition &&
            discountCondition
          )
        })
        return filteredProducts
      }
      return [] // Return an empty array if page index is out of bounds
    },
    groupedProducts() {
      const itemsPerPage = this.itemsPerPage
      const filteredProducts = this.$store.getters.filteredProducts
      const grouped = []
      for (let i = 0; i < filteredProducts.length; i += itemsPerPage) {
        const group = filteredProducts.slice(i, i + itemsPerPage)
        grouped.push(group)
      }
      return grouped
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage)
    },
    visiblePages() {
      const start = Math.max(1, this.currentPage - this.visiblePageRange)
      const end = Math.min(this.totalPages, start + this.visiblePageRange * 2)
      const pages = []
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    },
    formattedLastActive() {
      if (!this.lastActiveDate) return ''
      return new Date(this.lastActiveDate).toLocaleString()
    },
    formattedInactiveTime() {
      return this.inactiveTime >= 0 ? `${this.inactiveTime} min` : ''
    },
    errorMessage() {
      return this.$store.getters.errorMessage
    },
    total() {
      return this.$store.getters.total
    },
    filteredProducts() {
      return this.$store.getters.filteredProducts
    },
    products() {
      return this.$store.getters.products
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
    accessTokenExpiration() {
      return this.$store.getters.accessTokenExpiration
    },
    refreshTokenExpiration() {
      return this.$store.getters.refreshTokenExpiration
    },
    user_id() {
      return this.$store.state.user_id
    },
    user() {
      return this.$store.state.user
    },
    profile() {
      return this.$store.state.profile
    },
    categories() {
      return this.$store.getters.categories
    },
    sortOrder() {
      return this.$store.getters.sortOrder
    }
  },
  methods: {
    handlePageChange(page) {
      this.currentPage = page
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
      this.scrollToTop()
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
      this.scrollToTop()
    },
    setCurrentPage(page) {
      this.currentPage = page
      this.scrollToTop()
    },
    updateProductRange() {
      const prices = this.$store.state.products.map(product => product.price)
      this.$store.state.productMin = Math.ceil(Math.min(...prices))
      this.$store.state.productMax = Math.ceil(Math.max(...prices))
    },
    async getProduct(itemId) {
      this.$store.dispatch('getProduct', itemId)
    },
    async getProducts() {
      this.$store.dispatch('getProducts')
    },
    async fetchCategories() {
      this.$store.dispatch('fetchCategories')
    },
    async handleCategoryChange() {
      const selectedCategories = await this.$store.dispatch(
        'getSelectedCategories'
      )
      this.$store.commit('UPDATE_SELECTED_CATEGORIES', selectedCategories)
      this.currentPage = 1
    },
    toggleSortOrder() {
      this.$store.dispatch('toggleSortOrder')
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
    scrollToTop() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      })
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
