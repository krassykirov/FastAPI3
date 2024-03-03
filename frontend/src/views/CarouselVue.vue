<template>
  <div :id="carouselId" class="carousel slide">
    <div class="carousel-inner">
      <div
        v-for="(productGroup, index) in products"
        :key="index"
        :class="{ 'carousel-item': true, active: index === 0 }"
      >
        <div class="row">
          <div
            class="col-sm-2"
            v-for="product in productGroup"
            :key="product.id"
            :product="product"
            style="padding: 0; margin-bottom: 20px"
          >
            <div class="card-small">
              <div class="card-body">
                <span
                  class="badge bg-danger position-absolute top-0 start-5"
                  v-if="product.discount >= 0.01"
                  style="font-size: 0.8em; margin: 1%"
                >
                  -{{ Math.floor(product.discount * 100) }}%
                </span>
                <span
                  @click="addTofavorites(product)"
                  :class="getHeartClasses(product)"
                  style="
                    position: absolute;
                    top: 1%;
                    right: 10%;
                    font-weight: 900;
                    font-size: 1.2em;
                    cursor: pointer;
                  "
                >
                </span>
                <img
                  :src="`${backendEndpoint}/static/img/${product.username}/${product.name}/${product.image}`"
                  class="card-img-top"
                  @click="redirectToItemFromProduct(product.id)"
                  style="cursor: pointer; margin-bottom: 10px"
                />
                <p
                  class="card-text"
                  @click="redirectToItemFromProduct(product.id)"
                  style="
                    font-size: 0.9em;
                    margin-bottom: 10px;
                    margin-left: 12px;
                    cursor: pointer;
                  "
                >
                  <b> {{ truncateName(product.name, 35) }} </b>
                </p>
                <p
                  style="cursor: pointer; margin-bottom: 10px"
                  @click="redirectToItemFromProduct(product.id)"
                >
                  <span
                    v-for="i in 5"
                    :key="i"
                    :class="getStarClasses(i, product.rating_float)"
                    style="margin-right: 2px; font-size: 0.9rem"
                  ></span>
                  <span
                    :id="'overall-rating' + product.id + '-float'"
                    class="overall-rating"
                    style="font-size: 0.85em !important"
                  >
                    &nbsp;{{ parseFloat(product.rating_float).toFixed(2) }}
                  </span>
                  <span
                    :id="'overall-rating' + product.id"
                    class="overall-rating2"
                    style="font-size: 0.8rem; font-familly: sans-serif"
                  >
                    ({{ product.review_number }})
                  </span>
                </p>
                <!-- prettier-ignore -->
                <div style="justify-content: space-between">
                  <span
                    class="discount-price"
                    style="
                      font-size: 0.9em;
                      color: #dc3545;
                      font-weight: 700;
                      margin-bottom: 10px;
                      padding-right: 4%;
                    "
                  >
                  <span style="font-size: 0.9rem;">$</span>
                  <span style="font-size: 0.9rem;">{{ formatPrice(product.discount_price).integerPart }}</span>
                  <span style="font-size: 0.7em; position: relative; top: -0.4em;">.{{ formatPrice(product.discount_price).decimalPart }}</span>
                  </span>
                  <button
                    type="button"
                    ref="addToCartButton"
                    @click="addToCart(product)"
                    class="btn btn-outline-primary btn-sm m-0"
                    style="margin-bottom: 10px"
                  >
                    <i class="bi bi-cart-fill"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      class="carousel-control-prev"
      :id="carouselId + '-control-prev'"
      type="button"
      :data-bs-target="carouselId"
      data-bs-slide="prev"
      style="margin-left: -130px; height: 50px; margin-top: 6%"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Prev</span>
    </button>
    <button
      class="carousel-control-next"
      :id="carouselId + '-control-next'"
      type="button"
      :data-bs-target="carouselId"
      data-bs-slide="next"
      style="margin-right: -135px; height: 50px; margin-top: 6%"
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
    <ol class="carousel-indicators" style="margin-bottom: 0">
      <li
        v-for="(productGroup, index) in products"
        :key="index"
        :data-bs-target="'#' + carouselId"
        :data-bs-slide-to="index"
        :class="{ active: index === 0 }"
        style="background-color: rgb(214, 209, 209)"
      ></li>
    </ol>
  </div>
</template>

<script>
import config from '@/config'
// /* global bootstrap */

export default {
  props: {
    products: Array,
    carouselId: String
  },
  data() {
    return {
      backendEndpoint: `${config.backendEndpoint}`
    }
  },
  created() {
    Promise.all([
      this.$store.dispatch('getProducts'),
      this.$store.dispatch('checkFavoritesOnLoad')
    ])
  },
  computed: {
    errorMessage() {
      return this.$store.state.errorMessage
    },
    total() {
      return this.$store.getters.total
    },
    user() {
      return this.$store.getters.user
    },
    user_id() {
      return this.$store.getters.user_id
    },
    ratings() {
      return this.$store.getters.ratings
    },
    cart() {
      return this.$store.state.cart
    },
    favorites() {
      return this.$store.state.favorites
    }
  },
  methods: {
    formatPrice(price) {
      if (price !== null || price !== undefined) {
        const [integerPart, decimalPart] = price.toFixed(2).split('.')
        const formattedIntegerPart = integerPart.replace(
          /\B(?=(\d{3})+(?!\d))/g,
          '.'
        ) // Add dots for every 3 digits
        const formattedDecimalPart = decimalPart || '00' // Ensure two decimal places

        return {
          integerPart: formattedIntegerPart,
          decimalPart: formattedDecimalPart
        }
      }
    },
    getStarClasses(index, rating) {
      const filledStars = Math.floor(rating)
      if (index <= filledStars) {
        return 'fa fa-star checked'
      } else if (index === filledStars + 1 && rating % 1 !== 0) {
        return 'fa fa-star-half-full checked'
      } else {
        return 'fa fa-star-o checked'
      }
    },
    isFavorite(product) {
      return this.$store.state.favorites.some(
        favorite => favorite.id === product.id
      )
    },
    getHeartClasses(product) {
      const isFavorite = this.isFavorite(product)
      return isFavorite ? 'fa fa-heart red-color' : 'fa fa-heart-o'
    },
    addToCart(product) {
      this.$store.dispatch('addToCart', product)
    },
    addTofavorites(product) {
      this.$store.dispatch('addTofavorites', product)
    },
    truncateName(description, maxLength) {
      if (!description) return '' // Add this guard clause
      if (description.length > maxLength) {
        return description.substring(0, maxLength) + '..'
      }
      return description
    },
    removeFromCart(itemId) {
      this.$store.dispatch('removeFromCart', itemId)
    },
    redirectToItemFromCart(itemId) {
      this.$store.dispatch('redirectToItem', itemId)
    },
    redirectToItemFromNavbar(itemId) {
      this.$router.push({ name: 'Item', params: { itemId } })
    },
    redirectToItemFromProduct(itemId) {
      this.$store.dispatch('redirectToItem', itemId)
    }
  }
}
</script>
<style scoped>
.card-img,
.card-img-top,
.card-img-bottom {
  width: 80% !important;
  height: 90%;
  max-height: 160px !important;
  object-fit: cover !important;
  padding-left: 8px !important;
  padding-right: 8px !important;
  padding-bottom: 5px !important;
  margin-top: 10px !important;
}
.carousel .carousel-indicators li {
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background-color: rgb(76, 76, 172) !important;
}
</style>
