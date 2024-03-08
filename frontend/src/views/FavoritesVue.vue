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
        <div class="col-md-8" style="max-width: 1200px; margin-left: 3%">
          <h3 class="text-center mb-4" style="margin-left: 2%">
            <i class="fa fa-heart red-color" style="font-size: 1.6rem"> </i>
            Favorite Products
          </h3>
          <table class="table table-hover">
            <tbody>
              <tr v-for="product in favorites" :key="product.id">
                <td style="padding-top: 1%">
                  <img
                    :src="`${backendEndpoint}/static/img/${product.username}/${product.name}/${product.image}`"
                    class="img-fluid"
                    alt="Product Image"
                    style="max-width: 270px; height: 150px; object-fit: cover"
                  />
                </td>
                <td
                  style="cursor: pointer; padding-top: 1%"
                  @click="redirectToItemFromCart(product.id)"
                >
                  <h6>{{ truncateName(product.name, 45) }}</h6>
                  <p
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
                    <span
                      v-for="i in 5"
                      :key="i"
                      :class="getStarClasses(i, product.rating_float)"
                    ></span>
                    <span
                      :id="'overall-rating' + product.id + '-float'"
                      class="overall-rating"
                      style="font-size: 0.9rem; font-familly: sans-serif"
                      >&nbsp;{{
                        parseFloat(product.rating_float).toFixed(2)
                      }}</span
                    >
                    <span
                      :id="'overall-rating' + product.id"
                      class="overall-rating2"
                      style="font-size: 0.9rem; font-familly: sans-serif"
                    >
                      ({{ product.review_number }})
                    </span>
                  </p>
                </td>
                <!-- prettier-ignore -->
                <td style="padding-top: 5.3%; padding-right: 10px">
                  <span style="font-size: 1.1rem;">$</span>
                  <span style="font-size: 1.1rem;">{{ formatPrice(product.discount_price).integerPart }}</span>
                  <span style="font-size: 0.8em; position: relative; top: -0.4em;">.{{ formatPrice(product.discount_price).decimalPart }}</span>
                </td>
                <td style="padding: 15px; padding-top: 5%">
                  <button
                    type="button"
                    ref="addToCartButton"
                    @click="addToCart(product)"
                    class="btn btn-outline-primary btn-sm m-0"
                  >
                    <i class="bi bi-cart-fill"></i>
                  </button>
                </td>
                <!-- <td style="padding: 0.15em; padding-top: 5%">
                  <button
                    type="button"
                    class="btn btn-outline-danger btn-sm m-0"
                    @click="removeFromFavorites(product.id)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td> -->
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="container" style="margin-top: 3%; font-size: 2em">
      <!-- <p class="display-5" v-if="item && getSimilarProducts.length"> -->
      You may also like
      <!-- </p> -->
    </div>
    <MessageArea />
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
import NavBar from '@/components/MyNavbar.vue'
import MessageArea from '@/views/MessageAreaVue.vue'
import Footer from '@/views/FooterVue.vue'
import errorHandlingMixin from '../errorHandlingMixin'
import config from '@/config'

export default {
  components: {
    NavBar,
    MessageArea,
    Footer
  },
  props: ['profile'],
  data() {
    return {
      backendEndpoint: `${config.backendEndpoint}`
    }
  },
  mixins: [errorHandlingMixin],
  created() {
    this.$store.dispatch('fetchCategories')
  },
  computed: {
    categories() {
      return this.$store.getters.categories
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
      return this.$store.state.accessToken
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
    itemAlreadyInCart(product) {
      return this.cart.some(item => item.id === product.id)
    },
    addToCart(product) {
      this.$store.dispatch('addToCart', product)
    },
    removeFromFavorites(itemId) {
      this.$store.dispatch('removeFromFavorites', itemId)
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
