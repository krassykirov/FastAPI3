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
        <div class="col-md-8" style="max-width: 1200px">
          <h2 class="text-center mb-4">Favorites</h2>

          <table class="table table-hover">
            <thead>
              <tr style="height: auto">
                <th scope="col"></th>
                <th scope="col">Product</th>
                <th scope="col">Price</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in favorites" :key="product.id">
                <td>
                  <img
                    :src="`http://127.0.0.1:8000/static/img/${product.username}/${product.name}/${product.image}`"
                    class="img-fluid"
                    alt="Product Image"
                    style="max-width: 50px; max-height: 50px"
                  />
                </td>
                <td
                  @click="redirectToItemFromCart(product.id)"
                  style="cursor: pointer"
                >
                  {{ product.name }}
                </td>
                <td style="width: 100px">
                  <b
                    >${{
                      (
                        product.price -
                        product.price * product.discount
                      ).toFixed(2)
                    }}</b
                  >
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-outline-danger btn-sm"
                    @click="removeFromFavorites(product.id)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../components/MyNavbar.vue'
// import $ from 'jquery'

export default {
  components: {
    NavBar
  },
  props: ['profile', 'favorites'],
  data() {
    return {
      item: null,
      itemId: this.itemId
    }
  },
  created() {
    this.$store.dispatch('initializeUser').catch(this.handleError)
    this.$store.dispatch('readFromCartVue').then(() => {
      const fetchRatingsPromises = this.$store.state.cart.map(product => {
        return this.$store.dispatch('getItemRating', product.id)
      })
      return Promise.all(fetchRatingsPromises)
    })
  },
  computed: {
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
    removeFromFavorites(itemId) {
      this.$store.dispatch('removeFromFavorites', itemId)
    },
    redirectToItemFromCart(itemId) {
      this.$store.dispatch('redirectToItem', itemId)
    },
    updateQuantity(product_id, newQuantity) {
      this.$store.dispatch('UpdateItemQuantity', {
        product_id,
        newQuantity
      })
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
