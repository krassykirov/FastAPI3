<template>
  <div
    class="container-fluid"
    style="
      width: 100vw;
      position: sticky;
      margin: 0;
      padding: 0;
      align-items: center;
      text-align: center;
    "
  >
    <nav
      class="navbar navbar-expand-lg bg-white sticky-top navbar-light shadow-lg"
      style="
        height: 4em;
        margin-left: 0;
        margin-right: 0;
        align-items: center;
        text-align: center;
      "
    >
      <NavBar
        :cart="cart"
        :total="total"
        :user="user"
        :profile="profile"
        :favorites="favorites"
      />
    </nav>
    <!-- <MessageArea /> -->
    <div class="container-fluid mt-5" style="margin-left: 10%">
      <div
        class="row"
        style="
          display: -ms-flexbox;
          display: flex;
          -ms-flex-wrap: wrap;
          flex-wrap: wrap;
          margin: 0 -16px;
        "
      >
        <div>
          <h3 class="text-center mb-4">
            <h6 v-if="message" style="margin-right: 19%; margin-bottom: 3%">
              <i class="fa fa-search" style="font-size: 1.2rem"> </i>&nbsp;{{
                message
              }}
            </h6>
            <div v-else style="align-items: center; margin-right: 12%">
              <img :src="require('@/assets/no_result.gif')" />
            </div>
          </h3>
        </div>
        <div class="col-md-8" style="max-width: 1200px; margin-left: 3%">
          <table class="table table-hover">
            <tbody>
              <tr v-for="product in searchResults" :key="product.id">
                <td style="padding-top: 1%">
                  <img
                    :src="`${backendEndpoint}/static/img/${product.username}/${product.name}/${product.image}`"
                    class="img-fluid"
                    alt="Product Image"
                    style="
                      max-width: 270px;
                      height: 200px;
                      object-fit: cover;
                      cursor: pointer;
                    "
                    @click="redirectToItemFromCart(product.id)"
                  />
                </td>
                <td
                  style="cursor: pointer; padding-top: 1%; text-align: center"
                >
                  <h6 @click="redirectToItemFromCart(product.id)">
                    {{ truncateName(product.name, 45) }}
                  </h6>
                  <p
                    @click="redirectToItemFromCart(product.id)"
                    style="
                      font-size: 0.95em;
                      padding-top: 3%;
                      padding-right: 10%;
                      padding-left: 10%;
                      padding-bottom: 0;
                    "
                  >
                    {{ truncateName(product.description, 200) }}
                  </p>
                  <p style="cursor: pointer">
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
                    <span
                      :id="'overall-rating' + product.id"
                      class="overall-rating2"
                    >
                      ({{ product.reviewNumber }})
                    </span>
                  </p>
                  <button
                    class="btn btn-secondary"
                    ref="addToCartButton"
                    @click="addToCart(product)"
                    style="margin-top: 10px"
                  >
                    Add to Cart
                    <i class="bi bi-cart-fill" style="font-size: 1rem"> </i>
                  </button>
                </td>
                <td style="padding-top: 5.3%; padding-right: 10px">
                  <b
                    >${{
                      (
                        product.price -
                        product.price * product.discount
                      ).toFixed(2)
                    }}</b
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
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
  </div>
</template>

<script>
import NavBar from '../components/MyNavbar.vue'
// import MessageArea from '@/views/MessageAreaVue.vue'
import errorHandlingMixin from '../errorHandlingMixin'
import config from '@/config'

export default {
  components: {
    NavBar
    // MessageArea
  },
  props: ['profile'],
  data() {
    return {
      backendEndpoint: `${config.backendEndpoint}`
    }
  },
  mixins: [errorHandlingMixin],
  // created() {
  //   this.$store.dispatch('readFromCartVue')
  // },
  computed: {
    message() {
      return this.$store.state.message
    },
    errorMessage() {
      return this.$store.state.errorMessage
    },
    total() {
      return this.$store.getters.total
    },
    user() {
      return this.$store.getters.user
    },
    accessToken() {
      return this.$store.getters.accessToken
    },
    cart() {
      return this.$store.getters.cart
    },
    searchResults() {
      return this.$store.state.searchResults
    },
    favorites() {
      return this.$store.getters.favorites
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
    itemAlreadyInCart(product) {
      return this.cart.some(item => item.id === product.id)
    },
    addToCart(product) {
      this.$store.dispatch('addToCart', product)
    },
    removeFromCart(itemId) {
      this.$store.dispatch('removeFromCart', itemId)
    },
    redirectToItemFromCart(itemId) {
      this.$store.dispatch('redirectToItem', itemId)
    },
    truncateName(description, maxLength) {
      if (description.length > maxLength) {
        return description.substring(0, maxLength) + '..'
      }
      return description
    }
  }
}
</script>
