<template>
  <div
    class="card"
    :id="product.id"
    :data-category="product.category_id"
    style="margin: 0.15%; padding: 0.15%"
  >
    <div class="card-body" style="padding: 1%">
      <span
        class="badge bg-danger position-absolute top-0 start-0"
        v-if="product.discount >= 0.01"
        style="font-size: 0.8rem; margin: 1%; top: 0; start: 0"
        >-{{ Math.floor(product.discount * 100) }}%
      </span>
      <span
        :class="getHeartClasses(product)"
        @click="addTofavorites(product)"
        :id="'heart' + product.id"
        style="
          position: absolute;
          top: 1%;
          right: 1%;
          font-weight: 900;
          font-size: 1.2em;
          cursor: pointer;
        "
      ></span>
      <img
        :src="
          `${backendEndpoint}/static/img/` + product.name + '/' + product.image
        "
        class="card-img-top"
        @click="redirectToItemFromProduct(product.id)"
        style="cursor: pointer"
      />
      <h6
        @click="redirectToItemFromProduct(product.id)"
        class="card-title"
        style="
          margin-bottom: 1%;
          padding: 1%;
          height: 3em;
          font-size: 1rem;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          line-height: 1;
          cursor: pointer;
        "
      >
        {{ truncateName(product.name, 60) }}
      </h6>
      <p
        style="cursor: pointer; margin-bottom: 1%; font-size: 0.9em"
        @click="redirectToItemFromProduct(product.id)"
      >
        <span
          v-for="i in 5"
          :key="i"
          :class="getStarClasses(i, product.rating_float)"
        ></span>
        <span
          :id="'overall-rating' + product.id + '-float'"
          class="overall-rating"
          >&nbsp;{{ parseFloat(product.rating_float).toFixed(2) }}</span
        >
        <span :id="'overall-rating' + product.id" class="overall-rating2">
          ({{ product.review_number }})
        </span>
      </p>
      <input type="number" :data-price="product.price" hidden />
      <div style="margin: 0; padding: 0; display: flex; flex-direction: column">
        <span
          style="
            font-size: 0.95rem;
            color: #dc3545;
            font-weight: 800;
            margin-bottom: 1%;
            margin-top: 1%;
            margin-left: -12px;
          "
        >
          <!-- prettier-ignore -->
          <div>
          <!-- prettier-ignore -->
          <span style="font-size: 1rem">$</span>
          <span v-if="product.discount_price" style="font-size: 1rem">{{ formattedPrice(product.discount_price).integerPart }}</span>
          <span v-if="product.discount_price" style="font-size: 0.7rem; position: relative; top: -0.4em">{{ formattedPrice(product.discount_price).decimalPart }}</span>
        </div>
        </span>
        <span v-if="product.discount >= 0.01" class="old-price">
          ${{ Math.floor(product.price) }}
        </span>
        <span v-else style="font-size: 1em; margin-top: 1%">&nbsp;</span>
        <button
          ref="addToCartButton"
          @click="addToCart(product)"
          class="btn btn-secondary btn-sm"
          style="margin-top: 1px; width: 100%"
        >
          Add to Cart <i class="bi bi-cart-fill" style="font-size: 0.9rem"> </i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config'

export default {
  props: ['product', 'min', 'max', 'cart', 'favorites', 'products'],
  emits: ['addToCart', 'redirectToItem', 'addTofavorites'],
  data() {
    return {
      backendEndpoint: `${config.backendEndpoint}`
    }
  },
  computed: {
    formattedPrice() {
      return this.$store.getters.formattedPrice
    },
    filteredProducts() {
      return this.$store.getters.filteredProducts
    },
    errorMessage() {
      return this.$store.getters.errorMessage
    },
    isFavorite(product) {
      return this.$store.state.favorites.some(
        favorite => favorite.id === product.id
      )
    },
    getHeartClasses() {
      return product => {
        const isFavorite = this.$store.state.favorites.some(
          favProduct => favProduct.id === product.id
        )
        return isFavorite ? 'fa fa-heart red-color' : 'fa fa-heart-o'
      }
    }
  },
  methods: {
    redirectToItemFromProduct(itemId) {
      this.$store.dispatch('redirectToItem', itemId)
    },
    itemAlreadyInCart(product) {
      return this.$store.getters.isItemInCart(product.id)
    },
    addToCart(product) {
      this.$store.dispatch('addToCart', product)
    },
    addTofavorites(product) {
      this.$store.dispatch('addTofavorites', product)
    },
    removeFromFavorites(itemId) {
      this.$store.dispatch('removeFromFavorites', itemId)
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
    truncateName(description, maxLength) {
      if (!description) return '' // Add this guard clause
      if (description.length > maxLength) {
        return description.substring(0, maxLength) + '..'
      }
      return description
    }
  }
}
</script>
