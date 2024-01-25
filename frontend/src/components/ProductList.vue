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
        v-if="product.discount >= 0.1"
        style="font-size: 0.8em; margin: 1%; top: 0; start: 0"
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
          'http://127.0.0.1:8000/static/img/' +
          product.username +
          '/' +
          product.name +
          '/' +
          product.image
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
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          line-height: 1;
          cursor: pointer;
        "
      >
        {{ product.name }}
      </h6>
      <p style="cursor: pointer; margin-bottom: 1%">
        <i>
          <span
            v-for="i in 5"
            :key="i"
            :class="getStarClasses(i, product.rating_float)"
          ></span>
          <span
            :id="'overall-rating' + product.id + '-float'"
            class="overall-rating"
            >&nbsp;{{ product.rating_float }}</span
          >
        </i>
        <span :id="'overall-rating' + product.id" class="overall-rating2">
          ({{ product.reviewNumber }})
        </span>
      </p>
      <input type="number" :data-price="product.price" hidden />
    </div>
    <div style="margin: 0; padding: 0; display: flex; flex-direction: column">
      <span
        style="
          font-size: 1em;
          color: #dc3545;
          font-weight: 900;
          margin-bottom: 1%;
          margin-top: 1.5%;
        "
      >
        Price: ${{ product.discount_price }}
        <!-- <span v-if="Number.isInteger(product.price)" class="decimal-part">
          {{ product.price }}
          {{ Math.floor(product.price).toString().split('.')[1] }}
        </span> -->
      </span>
      <span v-if="product.discount >= 0.1" class="old-price">
        Old Price: ${{ Math.floor(product.price) }}
      </span>
      <div v-else style="font-size: 0.9em; margin-top: 1%">&nbsp;</div>
      <button
        ref="addToCartButton"
        @click="addToCart(product)"
        class="btn btn-secondary btn-sm"
        style="margin-top: 1px; margin-bottom: 0; padding: 1.2%; width: 100%"
      >
        Add to Cart <i class="bi bi-cart-fill" style="font-size: 1rem"> </i>
      </button>
    </div>
  </div>
</template>

<script>
import errorHandlingMixin from '../errorHandlingMixin'
export default {
  props: ['product', 'min', 'max', 'cart'],
  emits: ['addToCart', 'redirectToItem', 'addTofavorites'],
  mixins: [errorHandlingMixin],
  computed: {
    filteredProducts() {
      return this.$store.state.filteredProducts
    },
    discountedPrice() {
      if (this.product.discount) {
        return (
          this.product.price -
          this.product.price * this.product.discount
        ).toFixed(2)
      } else {
        return (this.product.price * 1).toFixed(2)
      }
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
    }
  }
}
</script>
