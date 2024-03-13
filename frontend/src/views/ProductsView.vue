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
                    :data-category-name="category[0]"
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
                    :class="{ disabled: isPriceRangesSelected }"
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
          <div class="range-input" :class="{ disabled: isPriceRangesSelected }">
            <input
              type="range"
              class="min-range"
              :min="productMin"
              :max="productMax"
              :value="min"
              step="1"
              @input="updateInputs"
              :disabled="isPriceRangesSelected"
            />
            <input
              type="range"
              class="max-range"
              :min="productMin"
              :max="productMax"
              :value="max"
              step="1"
              @input="updateInputs"
              :disabled="isPriceRangesSelected"
            />
          </div>
          <div style="padding-top: 11%; padding-bottom: 0"></div>
        </div>
        <div class="filter-card">
          <div class="card-body">
            <label style="font-size: 0.9rem; display: block; font-weight: 500">
              Price Range
            </label>
            <!-- Price range checkboxes -->
            <div
              class="form-check"
              style="padding-left: 5px"
              v-for="(range, index) in priceRanges"
              :key="index"
            >
              <input
                type="checkbox"
                class="price-checkbox"
                :value="range.value"
                :price-range="range.value"
                :data-price-label="range.label"
                style="font-size: 0.9rem; margin-bottom: 2px; margin-left: 0"
                @change="handlePriceRangeChange"
              />
              <label :for="range.value" style="margin-left: 5px">{{
                range.label
              }}</label>
              <span
                class="text-muted"
                style="
                  font-size: 0.8rem;
                  font-family: sans-serif;
                  font-weight: 500;
                "
              >
                ({{ getProductCount(range.value) }})
              </span>
            </div>
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
                class="rating-checkbox"
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
      </div>
      <template
        v-if="isLoading && filteredProducts && filteredProducts.length === 0"
      >
        <div style="align-items: center; margin-left: 25%; margin-top: 5%">
          <img :src="require('@/assets/loading2.gif')" />
        </div>
      </template>
      <div class="container" style="padding-left: 0; margin-left: 0">
        <template v-if="appliedFilters && appliedFilters.length > 0">
          <div
            class="container"
            style="
              margin-top: 4%;
              border: 1px solid #cfcdcd;
              margin-left: 0;
              margin-bottom: 0;
              width: 1187px !important;
              max-height: 200px;
            "
          >
            <div
              style="
                font-weight: 500;
                font-size: 0.9rem;
                margin-bottom: 0;
                margin-top: 5px;
              "
            >
              Active Filters ({{ appliedFilters.length }}) Products ({{
                filteredProducts.length
              }})
            </div>
            <button
              v-for="(filter, index) in appliedFilters"
              :key="index"
              class="shadow btn custom-btn"
              style="margin-bottom: 0; margin-top: 10px"
              @click="removeFilter(filter)"
            >
              {{ filter }}
            </button>
            <hr />
            <div style="margin-top: 10px; margin-left: 0">
              <button
                type="button"
                class="shadow btn custom-btn"
                @click="toggleSortOrder"
                style="align-items: center"
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
              <button
                v-if="appliedFilters.length > 0"
                class="shadow btn custom-btn"
                @click="removeAllFilters"
                style="margin-bottom: 15px"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </template>
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
        <template
          v-else-if="
            !isLoading && filteredProducts && filteredProducts.length === 0
          "
        >
          <img
            :src="require('@/assets/no_result.gif')"
            style="margin-left: 15%"
          />
        </template>
        <nav
          v-if="filteredProducts.length > 32"
          aria-label="Pagination"
          style="margin-top: 30px; margin-left: 30%"
        >
          <ul class="pagination justify-content-left">
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
            <li
              class="page-item"
              :class="{ disabled: currentPage === totalPages }"
            >
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
      </div>
    </div>
    <Footer />
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
      visiblePageRange: 5,
      isLoading: true,
      appliedFilters: [],
      priceRanges: [
        { value: 'range1', label: 'Under $500' },
        { value: 'range2', label: '$500 - $1000' },
        { value: 'range3', label: '$1000 - $2000' },
        { value: 'range4', label: '$2000 & Above' }
      ]
    }
  },
  watch: {
    filteredProducts() {
      this.updateAppliedFilters()
    }
  },
  updated() {
    this.updateAppliedFilters()
  },
  beforeUnmount() {
    this.appliedFilters = []
  },
  mounted() {
    if (this.filteredProducts && this.filteredProducts.length > 0) {
      this.isLoading = false
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
    this.removeAllFilters()
    this.updateAppliedFilters()
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
    isPriceRangesSelected() {
      return this.$store.state.selectedPriceRanges.length > 0
    },
    selectedPriceRanges() {
      return this.$store.state.selectedPriceRanges
    },
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
    removeAllFilters() {
      this.appliedFilters = []
      const checkboxes = document.querySelectorAll('input[type="checkbox"]')
      checkboxes.forEach(checkbox => {
        checkbox.checked = false
      })
      const prices = this.$store.state.products.map(product => product.price)
      this.$store.state.productMin = Math.ceil(Math.min(...prices))
      this.$store.state.productMax = Math.ceil(Math.max(...prices))
      this.$store.state.min = Math.ceil(Math.min(...prices))
      this.$store.state.max = Math.ceil(Math.max(...prices))
      this.selectedRating = []
      this.isChecked = false
      this.handleCategoryChange()
      this.handlePriceRangeChange()
      this.handleDiscountChange()
    },
    removeFilter(filter) {
      if (filter === 'Discounted Products') {
        this.isChecked = false
        this.handleDiscountChange()
        return
      } else if (filter.startsWith('Rating')) {
        const rating = parseInt(filter.split(': ')[1])
        const index = this.appliedFilters.indexOf(rating)
        this.selectedRating.splice(index, 1)
        return
      } else if (
        filter.includes('-') ||
        filter.startsWith('Under') ||
        filter.includes('&')
      ) {
        // const formattedLabel = filter.replace(' - ', '-')
        const checkbox = document.querySelector(
          `input[data-price-label="${filter}"]`
        )
        if (checkbox) {
          checkbox.checked = false
        }
        this.handlePriceRangeChange()
        return
      } else {
        const checkbox = document.querySelector(
          `input[data-category-name="${filter}"]`
        )
        if (checkbox) {
          checkbox.checked = false
          this.handleCategoryChange()
        }
      }
    },
    updateAppliedFilters() {
      const filters = []
      const selectedCategories = this.$store.state.selectedCategories.map(
        categoryId => {
          return this.getCategoryLabel(categoryId)
        }
      )
      selectedCategories.forEach(category => {
        filters.push(category)
      })
      if (this.isChecked) {
        filters.push('Discounted Products')
      }
      if (this.$store.state.selectedRating.length > 0) {
        const selectedRatings = this.$store.state.selectedRating.map(rating => {
          // filters.push(`${rating}`)
          return `Rating: ${rating}`
        })
        filters.push(...selectedRatings)
      }
      const priceRanges = this.$store.state.selectedPriceRanges
        .map(range => {
          switch (range) {
            case 'range1':
              return 'Under $500'
            case 'range2':
              return '$500 - $1000'
            case 'range3':
              return '$1000 - $2000'
            case 'range4':
              return '$2000 & Above'
            default:
              return null
          }
        })
        .filter(range => range !== null)

      if (priceRanges.length > 0) {
        const prices = this.$store.state.products.map(product => product.price)
        this.$store.state.productMin = Math.ceil(Math.min(...prices))
        this.$store.state.productMax = Math.ceil(Math.max(...prices))
        this.$store.state.min = Math.ceil(Math.min(...prices))
        this.$store.state.max = Math.ceil(Math.max(...prices))
        filters.push(...priceRanges)
      } else {
        filters.push(`$${this.$store.state.min} - $${this.$store.state.max}`)
      }
      const newFilters = JSON.stringify(filters)
      if (newFilters !== JSON.stringify(this.appliedFilters)) {
        this.appliedFilters = filters
      }
    },
    getCategoryLabel(categoryId) {
      categoryId = parseInt(categoryId)
      const category = this.categories.find(cat => cat[2] === categoryId)
      return category ? category[0] : ''
    },
    getProductCount(rangeValue) {
      return this.products.filter(product => {
        switch (rangeValue) {
          case 'range1':
            return product.price <= 500
          case 'range2':
            return product.price > 500 && product.price <= 1000
          case 'range3':
            return product.price > 1000 && product.price <= 2000
          case 'range4':
            return product.price > 2000
        }
      }).length
    },
    async handlePriceRangeChange() {
      const selectedPriceRanges = await this.$store.dispatch(
        'getSelectedPriceRanges'
      )
      this.$store.commit('UPDATE_SELECTED_PRICE_RANGES', selectedPriceRanges)
      this.currentPage = 1
    },
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
<style scoped>
#newsletter {
  display: flex;
  width: 200px;
  height: 50px;
  margin-top: 4%;
  margin-left: 30%;
  margin-bottom: 0;
  padding: 0;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  background-repeat: no-repeat;
  background-color: #ffffff;
  color: blue;
}

.custom-btn {
  text-transform: capitalize;
  background-color: #fdfeff;
  font-size: 12.5px;
  color: rgb(10, 0, 0);
  max-width: 220px;
  height: 35px;
  border-radius: 5px;
  border: 1px solid #cfcdcd;
}
.custom-btn:hover {
  background-color: #608b95 !important;
  font-size: 12.5px;
  color: white !important;
}
</style>
