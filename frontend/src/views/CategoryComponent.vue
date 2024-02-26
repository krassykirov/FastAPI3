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
    <div class="product-container">
      <div class="filter-products-container row col-2">
        <div class="filter-card">
          <div class="filter-content collapse show" id="collapse_2">
            <label
              style="
                font-size: 0.9rem;
                display: block;
                margin-bottom: 10px;
                font-weight: 400;
              "
              >Brands</label
            >
            <div class="card-body" style="height: 200px; overflow-y: auto">
              <div
                class="container"
                v-for="brand in uniqueBrands"
                :key="brand"
                :class="{ active: getBrandCount(brand) !== 0 }"
              >
                <label style="font-size: 0.8rem">
                  <input
                    style="font-size: 0.9rem; margin-bottom: 2px"
                    type="checkbox"
                    class="brand-checkbox"
                    :data-brand="brand"
                    :disabled="getBrandCount(brand) === 0"
                    @change="handleBrandChange($event, brand)"
                  />
                  {{ brand }}
                </label>
                <span class="text-muted" style="font-size: 0.9rem">
                  ({{ getBrandCount(brand) }})
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="filter-card">
          <div class="card-body">
            <label style="font-size: 0.9rem; display: block; margin-bottom: 5px"
              >Price</label
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
                style="font-size: 0.8rem"
              ></span>
              <span
                v-else
                class="bi bi-sort-down"
                style="font-size: 0.8rem"
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
              <label style="font-size: 0.9rem; margin-top: 0; margin-bottom: 0"
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
            <label style="font-size: 0.9rem">Overall Rating</label>
            <div
              class="form-check form-check-inline"
              v-for="rating in ratings.slice().reverse()"
              :key="rating"
              style="display: flex; align-items: center; font-size: 0.9rem"
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
                  style="font-size: 0.9rem; margin-top: 7px"
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
      <template v-if="selectedProducts && selectedProducts.length > 0">
        <div class="product-list" id="mycard">
          <transition-group name="product-fade">
            <ProductList
              v-for="product in selectedProducts"
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
            ></ProductList>
          </transition-group>
        </div>
      </template>
      <template v-else>
        <div style="align-items: center; margin-left: 10%">
          <img :src="require('@/assets/no_result.gif')" />
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import config from '@/config'
import ProductList from '@/components/ProductList.vue'
import MyNavbar from '@/components/MyNavbar.vue'
import VueCookies from 'vue-cookies'
import { jwtDecode } from 'jwt-decode'
import router from '@/router'
// /* global bootstrap */

export default {
  components: {
    ProductList,
    MyNavbar
  },
  props: ['category'],
  data() {
    return {
      isChecked: this.$store.state.isDiscountedChecked,
      backendEndpoint: `${config.backendEndpoint}`,
      categoryName: null
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
    const category = this.$route.params.category
    if (category) {
      this.$store
        .dispatch('fetchCategories')
        .then(() => this.$store.dispatch('updateProductRange', category))
        .then(() => this.$store.dispatch('checkFavoritesOnLoad'))
        .catch(error => {
          if (error.message !== 'Token Expired') {
            console.error('error', error)
          }
        })
    }
  },
  computed: {
    selectedProducts() {
      if (!this.category) return []
      const category = this.$store.getters.categories.find(
        cat => cat[0] === this.category
      )
      if (category) {
        const categoryName = category[0]
        return this.filterProductsByCategory(categoryName)
      } else {
        return []
      }
    },
    uniqueBrands() {
      const brandCounts = {}
      let categoryId

      const selectedCategory = this.$route.params.category
      if (selectedCategory) {
        const category = this.$store.state.categories.find(
          category => category[0] === selectedCategory
        )
        if (category) {
          categoryId = category[2]
        }
      }
      if (categoryId !== undefined) {
        const filteredProducts = this.$store.state.products.filter(
          product => product.category_id === categoryId
        )
        filteredProducts.forEach(product => {
          const brand = product.brand
          brandCounts[brand] = (brandCounts[brand] || 0) + 1
        })
      }
      const uniqueBrands = Object.keys(brandCounts).filter(
        brand => brandCounts[brand] > 0
      )
      return uniqueBrands.sort()
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
    selectedBrands() {
      return this.$store.getters.selectedBrands
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
    categories() {
      return this.$store.getters.categories
    },
    profile() {
      return this.$store.getters.profile
    },
    // currentCategory() {
    //   return this.$store.getters.currentCategory
    // },
    sortOrder() {
      return this.$store.getters.sortOrder
    }
  },
  methods: {
    filterProductsByCategory(categoryID) {
      return this.$store.getters.filteredProductsByCategory(categoryID)
    },
    getBrandCount(brand) {
      const selectedCategory = this.$route.params.category
      const categoryId = this.$store.state.categories.find(
        category => category[0] === selectedCategory
      )[2]
      const filteredProducts = this.$store.state.products.filter(
        product => product.category_id === categoryId
      )
      return filteredProducts.filter(product => product.brand === brand).length
    },
    handleBrandChange(event, brand) {
      const checkbox = event.target
      const selectedBrands = [...this.selectedBrands]

      if (checkbox.checked) {
        selectedBrands.push(brand)
      } else {
        const index = selectedBrands.indexOf(brand)
        if (index !== -1) {
          selectedBrands.splice(index, 1)
        }
      }
      this.$store.commit('SET_SELECTED_BRANDS', selectedBrands)
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
    },
    getSelectedCategories() {
      this.$store.dispatch('getSelectedCategories')
    },
    toggleSortOrder() {
      this.$store.dispatch('toggleSortOrder')
    },
    // async readFromCartVue() {
    //   this.$store.dispatch('readFromCartVue')
    // },
    redirectToItem(itemId) {
      this.$store.dispatch('redirectToItem', itemId)
    },
    handleRatingChange(rating) {
      this.$store.dispatch('handleRatingChange', rating)
    },
    getRatingItemCount(rating) {
      let categoryId

      const selectedCategory = this.$route.params.category
      if (selectedCategory) {
        const category = this.$store.state.categories.find(
          category => category[0] === selectedCategory
        )
        if (category) {
          categoryId = category[2]
        }
      }
      if (categoryId !== undefined) {
        const filteredProducts = this.$store.state.products.filter(
          product => product.category_id === categoryId
        )
        const items = filteredProducts // Assuming products are stored in the store
        const count = items.reduce((accumulator, item) => {
          const floatRating = parseFloat(item.rating_float)
          const roundedRating = Math.floor(floatRating + 0.5) // Round to the nearest integer
          if (roundedRating === rating) {
            return accumulator + 1
          }
          return accumulator
        }, 0)
        return count
      }
    },
    updateInputs() {
      this.$store.dispatch('updateInputs')
    },
    // Search() {
    //   var input, filter, cards, cardContainer, title, i
    //   input = document.getElementById('filter')
    //   filter = input.value.toUpperCase()
    //   cardContainer = document.getElementById('mycard')
    //   cards = cardContainer.getElementsByClassName('card')
    //   for (i = 0; i < cards.length; i++) {
    //     title = cards[i].querySelector('.card-body h6.card-title')
    //     if (title.innerText.toUpperCase().indexOf(filter) > -1) {
    //       cards[i].style.display = ''
    //     } else {
    //       cards[i].style.display = 'none'
    //     }
    //   }
    // },
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
