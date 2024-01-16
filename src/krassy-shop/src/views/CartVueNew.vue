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
    <div class="container-fluid mt-5" style="margin-left: 10%">
      <div class="row">
        <div class="col-md-8">
          <h2 class="text-center mb-4">Checkout</h2>

          <table class="table table-striped table-hover">
            <thead>
              <tr style="height: auto">
                <th scope="col">Image</th>
                <th scope="col">Product</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in cart" :key="product.id">
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
                <td>
                  <b
                    >${{
                      (
                        product.quantity * product.price -
                        product.price * product.discount
                      ).toFixed(2)
                    }}</b
                  >
                </td>
                <td class="align-left text-left">
                  <div
                    class="input-group"
                    style="max-width: 120px; margin: auto"
                  >
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      @click="updateQuantity(product.id, product.quantity - 1)"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      class="form-control text-center"
                      min="1"
                      max="3"
                      :value="product.quantity"
                      readonly
                    />
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      @click="updateQuantity(product.id, product.quantity + 1)"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-outline-danger btn-sm"
                    @click="removeFromCart(product.id)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="text-end mt-4">
            <h4>Total: ${{ total }}</h4>
            <button class="btn btn-success">Proceed to Payment</button>
          </div>
        </div>
      </div>
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
    updateQuantity(product_id, newQuantity) {
      this.$store.dispatch('UpdateItemQuantity', {
        product_id,
        newQuantity
      })
    }
  }
}
</script>
<style>
.container-sm {
  max-width: 768px !important;
}
.card {
  width: 52rem !important;
  margin-bottom: auto !important;
  margin-right: auto !important;
  margin-top: auto !important;
  height: auto !important;
  text-align: center !important;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
.card-img,
.card-img-top,
.card-img-bottom {
  height: 75% !important;
}
.total-section {
  width: 20%;
  background-color: #ffffff;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 5% !important;
  float: right !important;
}
.row.g-0 {
  max-height: 230px !important;
}
.new-price span {
  color: #f64749;
  font-weight: 900 !important;
  font-size: 1.1rem !important;
}
.tr {
  display: inline-block !important;
  padding: 15px !important;
}
.td {
  display: inline-block !important;
  padding: 15px !important;
}
</style>
