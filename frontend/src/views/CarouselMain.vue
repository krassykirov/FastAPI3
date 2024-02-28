<template>
  <div
    :id="carouselId"
    class="carousel slide"
    data-ride="carousel"
    style="width: 90%; height: 60%"
  >
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
              v-if="product.discount >= 0.01"
              style="font-size: 1em; margin: 1%"
              class="badge bg-danger position-absolute top-0 start-0"
            >
              -{{ Math.floor(product.discount * 100) }}%
            </span>
          </div>
          <div class="carousel-caption d-none d-md-block">
            <h6 style="margin-right: 30%; margin-bottom: 3%">
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
      style="display: none"
    >
      <span
        class="carousel-control-prev-icon"
        style="display: none"
        aria-hidden="true"
      ></span>
      <span class="visually-hidden">Prev</span>
    </button>
    <button
      class="carousel-control-next"
      :id="carouselId + '-control-next'"
      type="button"
      :data-bs-target="carouselId"
      data-bs-slide="next"
      style="display: none"
    >
      <span
        class="carousel-control-next-icon"
        style="display: none"
        aria-hidden="true"
      ></span>
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
    Promise.all([this.$store.dispatch('checkFavoritesOnLoad')])
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
  margin-bottom: 1%;
}
.carousel .carousel-indicators li {
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background-color: rgb(76, 76, 172) !important;
}
.carousel-inner {
  background-color: rgb(95, 149, 182);
}
</style>
