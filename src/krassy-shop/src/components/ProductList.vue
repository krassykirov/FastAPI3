<template>
  <div
    class="card"
    :id="product.id"
    :data-category="product.category_id"
    style="margin: 0.15%; padding: 0.15%"
  >
    <div
      class="card-body"
      style="cursor: pointer; padding: 1%"
      @click="redirectToItemFromProduct(product.id)"
    >
      <span
        class="badge bg-danger position-absolute top-0 start-0"
        v-if="product.discount >= 0.1"
        style="font-size: 0.8em; margin: 1%; top: 0; start: 0"
        >-{{ Math.floor(product.discount * 100) }}%
      </span>
      <span
        class="fa fa-heart-o"
        style="
          position: absolute;
          top: 1%;
          right: 1%;
          font-weight: 900;
          font-size: 1.2em;
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
      />
      <h6
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
        "
      >
        {{ product.name }}
      </h6>
      <p style="cursor: pointer; margin-bottom: 1%">
        <i>
          <span
            v-for="i in 5"
            :key="i"
            :class="this.getStarClasses(i, product.rating_float)"
          ></span>
          <span
            :id="'overall-rating' + product.id + '-float'"
            style="font-size: 0.9em; font-family: Raleway; margin-bottom: 2%"
            >{{ product.rating_float }}</span
          >
        </i>
        <span :id="'overall-rating' + product.id">
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
        Price: ${{ discountedPrice
        }}<span
          v-if="!Number.isInteger(product.price)"
          style="font-size: 0.7em; vertical-align: top; color: #dc3545"
        >
          {{ product.price.toString().split('.')[1] }}
        </span>
      </span>
      <span
        v-if="product.discount >= 0.1"
        style="
          font-size: 0.8em;
          text-decoration: line-through;
          color: #404447;
          margin-top: 1%;
          margin-bottom: 2%;
        "
      >
        Old Price: ${{ Math.floor(product.price) }}
      </span>
      <div v-else style="font-size: 0.9em; margin-top: 1%">&nbsp;</div>
      <button
        ref="addToCartButton"
        @click="addToCart(product)"
        class="btn btn-secondary btn-sm"
        style="margin-top: 1%; margin-bottom: 0; padding: 1.2%; width: 100%"
      >
        Add to Cart <i class="bi bi-cart-fill" style="font-size: 1rem"> </i>
      </button>
    </div>
  </div>
</template>

<script>
// import MyNavbar from 'MyNavbar.vue'
export default {
  props: ['product', 'min', 'max', 'cart'],
  emits: ['addToCart'],
  // compatConfig: { MODE: 3 },
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
      // const toastContent = itemInCart
      //   ? `${product.name} is already in the cart`
      //   : `${product.name} was added to the cart`

      // const toastElement = new bootstrap.Toast(
      //   document.getElementById('cartToast'),
      //   {
      //     delay: 2000
      //   }
      // )

      // const toastBodyElement = document.getElementById('cartToastBody')
      // toastBodyElement.innerText = toastContent

      // toastElement.show()

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
          .then(() => {
            this.$emit('add-to-cart', product)
          })
          .catch(error => {
            console.error('error', error)
          })
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
    truncateDescription(description, maxLength) {
      if (description.length > maxLength) {
        return description.substring(0, maxLength) + '...'
      }
      return description
    }
  }
}
</script>
