<template>
  <div :id="carouselId" class="carousel slide" data-ride="carousel">
    <div class="carousel-inner" role="listbox">
      <div
        v-for="(product, index) in products"
        :key="index"
        :class="{ 'carousel-item': true, active: index === 0 }"
      >
        <div
          class="row justify-content-center align-items-center; position-relative"
        >
          <img
            class="d-block img-fluid"
            :src="`${backendEndpoint}/static/img/${product.username}/${product.name}/${product.image}`"
            :alt="product.name"
          />
          <div
            class="position-absolute top-0 start-0"
            style="margin-top: 5px; margin-left: 25%"
          >
            <span
              v-if="product.discount >= 0.1"
              style="font-size: 1em; margin: 1%"
              class="badge bg-danger position-absolute top-0 start-0"
            >
              -{{ Math.floor(product.discount * 100) }}%
            </span>
          </div>
          <div class="carousel-caption d-none d-md-block">
            <h6 style="margin-right: 30%; margin-bottom: 2%">
              {{ truncateName(product.name, 35) }}
            </h6>
            <!-- <p>{{ product.description }}</p> -->
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
    <ol class="carousel-indicators" style="margin-bottom: 0">
      <li
        v-for="(product, index) in products"
        :key="index"
        :data-bs-target="'#' + carouselId"
        :data-bs-slide-to="index"
        :class="{ active: index === 0 }"
        style="background-color: rgb(65, 96, 179); margin-top: 2%"
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
.carousel .carousel-indicators li {
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background-color: rgb(76, 76, 172) !important;
}
</style>
