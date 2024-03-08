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
    <div class="container-fluid mt-5" style="margin-left: 15%">
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
          <h3 class="text-center mb-4" style="margin-right: 3%">
            <i class="bi bi-cart-fill" style="font-size: 1.6rem"> </i>
            Shopping Cart
          </h3>

          <table class="table table-hover">
            <thead>
              <tr style="height: auto">
                <th scope="col"></th>
                <th scope="col" style="padding-left: 25%">Product</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in cart" :key="product.id">
                <td>
                  <img
                    :src="`${backendEndpoint}/static/img/${product.username}/${product.name}/${product.image}`"
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
                <!-- prettier-ignore -->
                <td style="width: 100px">
                   <!-- prettier-ignore -->
                  <span style="font-size: 1rem;">$</span>
                  <span style="font-size: 1rem;">{{ formatPrice(product.discount_price).integerPart }}</span>
                  <span style="font-size: 0.7em; position: relative; top: -0.4em;">.{{ formatPrice(product.discount_price).decimalPart }}</span>
                </td>
                <td class="align-left text-left">
                  <div
                    class="input-group"
                    style="max-width: 100px; margin-left: 55px; padding: 0"
                  >
                    <button
                      class="btn btn-outline-secondary btn-sm"
                      style="font-size: 12px; width: 25px; height: 31px"
                      type="button"
                      @click="updateQuantity(product.id, product.quantity - 1)"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      class="form-control text-center align-middle"
                      min="1"
                      max="3"
                      :value="product.quantity"
                      disabled
                      style="
                        text-align: center;
                        font-size: 14px;
                        max-width: 30px;
                        max-height: 31px;
                        padding-left: 8px;
                      "
                    />
                    <button
                      class="btn btn-outline-secondary btn-sm"
                      style="font-size: 12px; width: 25px; height: 31px"
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
          <div>
            <!-- prettier-ignore -->
            <h4>
              <span style="font-size: 1.3rem;">$</span>
              <span style="font-size: 1.3rem;">{{ formatTotal(total).integerPart }}</span>
              <span style="font-size: 0.8rem; position: relative; top: -0.6em;">.{{ formatTotal(total).decimalPart }}</span>
            </h4>
            <button
              type="button"
              class="btn btn-primary"
              data-toggle="modal"
              data-target="#exampleModal"
            >
              Proceed to Payment
            </button>
          </div>
          <div class="delivery my-4">
            <p class="font-weight-bold mb-0">
              <span><i class="fa-solid fa-truck"></i></span>
              <b> Delivery done in 3 days from date of purchase</b>
            </p>
            <p class="text-secondary">Order now to get this product delivery</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      data-backdrop="false"
    >
      <div class="modal-dialog" role="document" style="width: 628px">
        <div class="modal-content" style="width: 628px">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Payment Details</h5>
            <button
              type="button"
              class="close"
              id="close-modal"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" style="width: 628px">
            <div class="row">
              <div class="col-75">
                <div class="col-25" style="padding: 0">
                  <div class="container">
                    <h5>
                      Cart
                      <span style="color: black"
                        ><i class="fa fa-shopping-cart"></i>
                        <b>&nbsp;{{ cart.length }}</b></span
                      >
                    </h5>
                    <tbody style="width: 100%">
                      <tr v-for="product in cart" :key="product.id">
                        <td>
                          <img
                            :src="`${backendEndpoint}/static/img/${product.username}/${product.name}/${product.image}`"
                            class="img-fluid"
                            alt="Product Image"
                            style="
                              max-width: 50px;
                              max-height: 35px;
                              margin: 5px;
                            "
                          />
                        </td>
                        <td class="align-left text-left">
                          <div
                            class="input-group"
                            style="
                              max-width: 120px;
                              margin: auto;
                              max-height: 40px;
                            "
                          >
                            <button
                              class="btn btn-outline-secondary"
                              type="button"
                              @click="
                                updateQuantity(product.id, product.quantity - 1)
                              "
                            >
                              -
                            </button>
                            <input
                              type="number"
                              class="form-control text-center"
                              min="1"
                              max="3"
                              :value="product.quantity"
                              disabled
                            />
                            <button
                              class="btn btn-outline-secondary"
                              type="button"
                              @click="
                                updateQuantity(product.id, product.quantity + 1)
                              "
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <!-- prettier-ignore -->
                        <td
                          @click="redirectToItemFromCart(product.id)"
                          style="cursor: pointer"
                        >
                          <p style="cursor: pointer; margin: 15px; font-size: 14px">
                            {{ truncateName(product.name, 20) }}
                          </p>
                        </td>
                        <!-- prettier-ignore -->
                        <td style="width: 100px">
                          <!-- prettier-ignore -->
                          <div>
                          <span style="font-size: 0.9rem;">$</span>
                          <span style="font-size: 0.9rem;">{{ formatPrice(product.discount_price).integerPart }}</span>
                          <span style="font-size: 0.6em; position: relative; top: -0.4em;">.{{ formatPrice(product.discount_price).decimalPart }}</span>
                        </div>
                        </td>
                        <td>
                          <button
                            type="button"
                            class="btn btn-outline-danger btn-sm"
                            style="margin-bottom: 1px"
                            @click="removeFromCart(product.id)"
                          >
                            <i class="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                    <hr />
                    <div
                      style="
                        width: 100%;
                        white-space: nowrap;
                        align-items: right;
                        white-space: nowrap;
                        overflow: hidden;
                      "
                    >
                      <!-- prettier-ignore -->
                      <div class="text-end mt-4">
                        <h4
                          style="
                            width: 150px;
                            margin-left: 60%;
                            margin-right: 5%;
                          "
                        > <!-- prettier-ignore -->
                          <!-- Total: ${{ total }} -->
                          <span style="font-size: 1.3rem;">$</span>
                          <span style="font-size: 1.3rem;">{{ formatTotal(total).integerPart }}</span>
                          <span style="font-size: 0.8rem; position: relative; top: -0.6em;">.{{ formatTotal(total).decimalPart }}</span>
                        </h4>
                      </div>
                    </div>
                    <hr />
                  </div>
                </div>
                <div class="container">
                  <form
                    id="paymentForm"
                    enctype="multipart/form-data"
                    data-toggle="validator"
                  >
                    <div class="row">
                      <div class="col-50">
                        <h3>Shipping Address</h3>
                        <label for="fname"
                          ><i class="fa fa-user"></i> Full Name</label
                        >
                        <input
                          type="text"
                          id="fname"
                          name="firstname"
                          placeholder="John M. Doe"
                        />
                        <label for="email"
                          ><i class="fa fa-envelope"></i> Email</label
                        >
                        <input
                          type="text"
                          id="email"
                          name="email"
                          placeholder="john@example.com"
                        />
                        <label for="adr"
                          ><i class="fa fa-address-card-o"></i> Address</label
                        >
                        <input
                          type="text"
                          id="adr"
                          name="address"
                          placeholder="542 W. 15th Street"
                        />
                        <label for="city"
                          ><i class="fa fa-institution"></i> City</label
                        >
                        <input
                          type="text"
                          id="city"
                          name="city"
                          placeholder="New York"
                        />

                        <div class="row">
                          <div class="col-50">
                            <label for="state">Telephone</label>
                            <input
                              type="text"
                              id="state"
                              name="state"
                              placeholder="NY"
                            />
                          </div>
                          <div class="col-50">
                            <label for="zip">Zip</label>
                            <input
                              type="text"
                              id="zip"
                              name="zip"
                              placeholder="10001"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="col-50">
                        <h3>Payment</h3>
                        <label for="fname">Accepted Cards</label>
                        <div class="icon-container">
                          <i class="fa fa-cc-visa" style="color: navy"></i>
                          <i class="fa fa-cc-amex" style="color: blue"></i>
                          <i class="fa fa-cc-mastercard" style="color: red"></i>
                          <i
                            class="fa fa-cc-discover"
                            style="color: orange"
                          ></i>
                        </div>
                        <label for="cname">Name on Card</label>
                        <input
                          type="text"
                          id="cname"
                          name="cardname"
                          placeholder="John More Doe"
                        />
                        <label for="ccnum">Credit card number</label>
                        <input
                          type="text"
                          id="ccnum"
                          name="cardnumber"
                          placeholder="1111-2222-3333-4444"
                        />
                        <label for="expmonth">Exp Month</label>
                        <input
                          type="text"
                          id="expmonth"
                          name="expmonth"
                          placeholder="September"
                        />
                        <div class="row">
                          <div class="col-50">
                            <label for="expyear">Exp Year</label>
                            <input
                              type="text"
                              id="expyear"
                              name="expyear"
                              placeholder="2018"
                            />
                          </div>
                          <div class="col-50">
                            <label for="cvv">CVV</label>
                            <input
                              type="text"
                              id="cvv"
                              name="cvv"
                              placeholder="352"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="modal-footer" style="padding-right: 40%">
                      <button
                        type="button"
                        class="btn btn-primary"
                        @click="hideModal"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        class="btn btn-primary"
                        @click="paymentCheckout"
                      >
                        Pay
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import NavBar from '@/components/MyNavbar.vue'
import Footer from '@/views/FooterVue.vue'
// import MessageArea from '@/views/MessageAreaVue.vue'
import errorHandlingMixin from '../errorHandlingMixin'
import $ from 'jquery'
import config from '@/config'

export default {
  components: {
    NavBar,
    Footer
    // MessageArea
  },
  mixins: [errorHandlingMixin],
  props: ['profile'],
  data() {
    return {
      item: null,
      itemId: this.itemId,
      backendEndpoint: `${config.backendEndpoint}`
    }
  },
  created() {
    this.$store.dispatch('getProducts')
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
    formatTotal(price) {
      const [integerPart, decimalPart] = price.toString().split('.')
      return {
        integerPart: parseInt(integerPart).toLocaleString(),
        decimalPart: decimalPart || '00'
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
    },
    truncateName(description, maxLength) {
      if (description.length > maxLength) {
        return description.substring(0, maxLength) + '..'
      }
      return description
    },
    hideModal() {
      $(document).ready(function () {
        $('#close-modal').click()
      })
    }
    // paymentCheckout() {
    //   $('#paymentForm').submit(e => {
    //     e.preventDefault()
    //     const formData = new FormData(e.target)
    //     // formData.append('primary_email', this.user)
    //     $.ajax({
    //       url: `${config.backendEndpoint}/checkout`,
    //       type: 'POST',
    //       processData: false,
    //       contentType: false,
    //       headers: {
    //         Authorization: `Bearer ${this.$store.state.accessToken}`
    //       },
    //       data: formData,
    //       success: data => {
    //         // var user = this.$store.getters.user
    //         // var img_path = `/static/img/${user}/profile/${data.avatar}`
    //         // $('#card-email').text(`Email: ${data.email}`)
    //         // $('#card-address').text(`Address: ${data.address}`)
    //         // $('#card-phone').text(`Address: ${data.number}`)
    //         // $('#avatar-image').attr('src', img_path)
    //       },
    //       error: function (xhr) {
    //         if (xhr.status === 403) {
    //           $('#error').text('Item with that name already exists!')
    //         }
    //       }
    //     })
    //   })
    // }
  }
}
</script>

<style scoped>
input[type='number']::-webkit-inner-spin-button {
  position: absolute;
  width: 12.5%;
  height: 100%;
  top: 0;
  right: 0;
  margin: 0;
  padding: 0;
}
</style>
