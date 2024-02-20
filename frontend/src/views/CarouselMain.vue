<template>
  <div :id="carouselId" class="carousel slide" data-ride="carousel">
    <ol class="carousel-indicators">
      <li
        v-for="(product, index) in products"
        :key="index"
        :data-target="'#' + carouselId"
        :data-slide-to="index"
        :class="{ active: index === 0 }"
      ></li>
    </ol>

    <div class="carousel-inner" role="listbox">
      <div
        v-for="(product, index) in products"
        :key="index"
        :class="{ 'carousel-item': true, active: index === 0 }"
      >
        <div class="row justify-content-center align-items-center">
          <img
            class="d-block img-fluid"
            :src="`${backendEndpoint}/static/img/${product.username}/${product.name}/${product.image}`"
            :alt="product.name"
          />
          <div class="carousel-caption d-none d-md-block">
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>
            <!-- Add any other product details you want to display -->
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
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
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
      this.$store.dispatch('checkFavoritesOnLoad'),
      this.$store.dispatch('readFromCartVue').then(() => {
        const fetchRatingsPromises = this.$store.getters.filteredProducts.map(
          product => {
            return this.$store.dispatch('getItemRating', product.id)
          }
        )
        return Promise.all(fetchRatingsPromises)
      })
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
    getHeartClasses(product) {
      const isFavorite = this.isFavorite(product)
      return isFavorite ? 'fa fa-heart red-color' : 'fa fa-heart-o'
    },
    isFavorite(product) {
      return this.$store.state.favorites.some(
        favorite => favorite.id === product.id
      )
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
.carousel img {
  height: 550px;
  max-height: 550px;
  width: 60%;
}
</style>
