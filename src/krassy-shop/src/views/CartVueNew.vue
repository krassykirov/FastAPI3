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
        :avatar="'{{ avatar }}'"
      />
    </nav>
    <div class="container mt-5">
      <h2 class="text-center mb-4">Checkout</h2>
      <div class="checkout-container">
        <div
          v-for="product in cart"
          :key="product.id"
          class="product-card mb-3"
        >
          <div class="card w-100">
            <div class="row g-0">
              <div class="col-md-4">
                <span
                  class="badge bg-danger position-absolute top-5 start-5"
                  v-if="product.discount >= 0.1"
                  style="font-size: 0.8em; margin: 1%; top: 0; start: 0"
                  >-{{ Math.floor(product.discount * 100) }}%
                </span>
                <img
                  :src="`http://127.0.0.1:8000/static/img/${product.username}/${product.name}/${product.image}`"
                  class="card-img-top"
                  alt="Product Image"
                />
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <p>{{ product.name }}</p>
                  <p
                    v-if="product"
                    style="cursor: pointer"
                    @click="redirectToItemFromProduct(product.id)"
                  >
                    <i>
                      <span
                        v-for="i in 5"
                        :key="i"
                        :class="getStarClasses(i, product.rating_float)"
                      ></span>
                      <span
                        :id="'overall-rating' + product.id + '-float'"
                        style="
                          font-size: 0.9em;
                          font-family: Raleway;
                          margin-bottom: 2%;
                        "
                        >{{ product.rating_float }}</span
                      >
                    </i>
                    <span :id="'overall-rating' + product.id">
                      ({{ product.reviewNumber }})
                    </span>
                  </p>
                  <input type="number" :data-price="product.price" hidden />
                </div>
                <div class="card__precis">
                  <div class="product-price">
                    <p class="new-price" id="price" v-if="product">
                      Price:
                      <span>
                        <b>
                          ${{
                            product.price -
                            (product.price * product.discount).toFixed(2)
                          }}
                        </b></span
                      >
                    </p>

                    <p v-if="product && product.discount" class="last-price">
                      Old Price:
                      <span> ${{ product.price }} </span>
                    </p>
                    <h4
                      @click="removeFromCart(product.id)"
                      class="card__icon"
                      style="
                        align-items: right;
                        text-align: right;
                        cursor: pointer;
                        padding: 15px;
                      "
                    >
                      <i class="bi bi-trash"></i>
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="total-section">
      <h4 class="mb-3">Order Summary</h4>
      <ul class="list-group">
        <li
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          Subtotal:
          <span class="badge bg-primary">${{ calculateSubtotal() }}</span>
        </li>
        <li
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          Tax (10%):
          <span class="badge bg-primary">${{ calculateTax() }}</span>
        </li>
        <li
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <strong>Total:</strong>
          <span class="badge bg-success">${{ calculateTotal() }}</span>
        </li>
      </ul>
      <button class="btn btn-success mt-3">Proceed to Payment</button>
    </div>
  </div>
</template>

<script>
import NavBar from '../components/MyNavbar.vue'

export default {
  components: {
    NavBar
  },
  props: ['avatar'],
  data() {
    return {
      item: null,
      itemId: this.itemId
    }
  },
  created() {
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
      console.log(`Index: ${index}, Rating: ${rating}`)
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
    redirectToItemFromProduct(itemId) {
      this.$store.dispatch('redirectToItem', itemId)
    },
    calculateSubtotal() {
      return this.cart
        .reduce((total, product) => total + product.price, 0)
        .toFixed(2)
    },
    calculateTax() {
      return (this.calculateSubtotal() * 0.1).toFixed(2)
    },
    calculateTotal() {
      return (
        parseFloat(this.calculateSubtotal()) + parseFloat(this.calculateTax())
      ).toFixed(2)
    }
  }
}
</script>
<style>
.card {
  width: 52rem !important;
  margin-bottom: auto !important;
  margin-right: auto !important;
  margin-top: auto !important;
  margin-left: 5% !important;
  height: auto !important;
  text-align: center !important;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
.total-section {
  width: 20%;
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-left: 5% !important;
}
</style>
