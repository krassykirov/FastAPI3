<template>
  <div
    v-if="product.price <= Number(max) && product.price >= Number(min)"
    class="col-lg-auto"
  >
    <div
      class="card"
      :id="product.id"
      :data-category="product.category_id"
      style="margin: 1px; margin-bottom: 3px"
    >
      <div
        class="card-body"
        style="cursor: pointer"
        @click="redirectToItemFromProduct(product.id)"
      >
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
        />
        <h5 class="card-title">{{ product.name }}</h5>
        <span class="badge bg-danger" v-if="product.price <= 90">WOW</span>
        <span
          class="badge bg-primary"
          v-else-if="product.price > 90 && product.price <= 1000"
          >Value</span
        >
        <span class="badge bg-success" v-else-if="product.price > 1000"
          >TOP</span
        >
        ${{ product.price }}
        <input type="number" :data-price="product.price" hidden />
      </div>
      <p>
        <i>
          <span
            v-for="i in 5"
            :key="i"
            class="fa fa-star"
            :class="{ checked: i <= product.rating }"
          ></span>
          <span :id="'overall-rating' + product.id + '-float'"></span
        ></i>
        <span :id="'overall-rating' + product.id">
          ({{ product.reviewNumber }})</span
        >
      </p>
      <div>
        <button
          ref="addToCartButton"
          @click="addToCart(product)"
          class="btn btn-secondary btn-sm"
        >
          Add to Cart
        </button>
      </div>
      <div class="card-footer">
        <small class="text-muted"
          >Created: {{ product.date }} by {{ product.username }}
        </small>
      </div>
    </div>
  </div>
</template>

<script>
import $ from '../../node_modules/jquery'
// import MyNavbar from 'MyNavbar.vue'
export default {
  props: ['product', 'min', 'max', 'cart'],
  emits: ['addToCart'],
  compatConfig: { MODE: 3 },
  // components: {
  //   MyNavbar
  // },
  methods: {
    redirectToItemFromProduct(itemId) {
      this.$root.redirectToItem(itemId)
    },
    itemAlreadyInCart(product) {
      return this.cart.some(item => item.id === product.id)
    },
    addToCart(product) {
      const itemInCart = this.cart.find(item => item.id === product.id)
      const popoverContent = itemInCart
        ? `'${product.name} is already in the cart'`
        : `'${product.name} was added to the cart'`

      const buttonElement = this.$refs.addToCartButton
      $(buttonElement).popover({
        content: popoverContent,
        placement: 'right',
        trigger: 'manual'
      })
      $(buttonElement).popover('show')
      setTimeout(() => {
        $(buttonElement).popover('hide')
      }, 1000)
      if (!itemInCart) {
        fetch('/update-basket', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            item_id: product.id
          })
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`)
            }
            return response.json()
          })
          .then(data => {
            // this.cart.push(product)
            console.log('success', data)
          })
          .catch(error => {
            console.error('error', error)
          })
      }
    }
  }
}
</script>
