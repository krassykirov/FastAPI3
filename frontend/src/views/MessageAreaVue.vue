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
        :favorites="favorites"
        :total="total"
        :user="user"
        :user_id="user_id"
        :profile="profile"
        @addToCart="addToCart"
        @removeFromCart="removeFromCart"
        @redirectToItemFromNavbar="redirectToItemFromNavbar"
      />
    </nav>
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
    <!-- <div class="message-area">ON SALE OFFERS TODAY</div> -->
    <div class="container">
      <span class="badge bg-danger" style="margin-top: 2%; font-size: 1em"
        >Sale %
      </span>
      <carousel
        :products="groupedProducts"
        carouselId="discount-products-carousel"
      />
      <span class="badge bg-danger" style="margin-top: 2%; font-size: 1em"
        >Laptops
      </span>
      <carousel
        :products="groupedlaptops"
        carouselId="laptop-products-carousel"
      />
    </div>
  </div>
</template>

<script>
// import ProductList from '@/components/ProductList.vue'
import Carousel from '@/views/CarouselVue.vue'
import NavBar from '../components/MyNavbar.vue'
import config from '@/config'
// import axios from 'axios'
/* global bootstrap */

export default {
  components: {
    NavBar,
    Carousel
  },
  props: ['profile'],
  data() {
    return {
      backendEndpoint: `${config.backendEndpoint}`
    }
  },
  mounted() {
    const carousels = document.querySelectorAll('.carousel')
    carousels.forEach(carouselElement => {
      const carouselId = carouselElement.id
      const carousel = new bootstrap.Carousel(carouselElement, {
        interval: false
      })
      const carouselControlPrev = document.getElementById(
        `${carouselId}-control-prev`
      )
      const carouselControlNext = document.getElementById(
        `${carouselId}-control-next`
      )
      carouselControlPrev.addEventListener('click', function () {
        carousel.next()
      })

      carouselControlNext.addEventListener('click', function () {
        carousel.prev()
      })
    })
  },
  created() {
    this.$store.dispatch('getProducts')
    this.$store.dispatch('readFromCartVue').then(() => {
      const fetchRatingsPromises = this.$store.getters.filteredLaptops.map(
        product => {
          return this.$store.dispatch('getItemRating', product.id)
        }
      )
      console.log('fetchRatingsPromises', fetchRatingsPromises)
      return Promise.all(fetchRatingsPromises)
    })
  },
  computed: {
    groupedProducts() {
      const itemsPerSlide = 6
      const products = this.discountedProducts
      const grouped = []

      // Loop through the products, adding each group of items
      for (let i = 0; i < products.length; i += itemsPerSlide) {
        const group = products.slice(i, i + itemsPerSlide)
        const nextGroup = products.slice(
          i + itemsPerSlide,
          i + itemsPerSlide * 2
        )

        // If the current group is not a full group and there is a next group, merge them
        if (group.length < itemsPerSlide && nextGroup.length > 0) {
          const remainingItems = itemsPerSlide - group.length
          group.push(...nextGroup.slice(0, remainingItems))
        }

        grouped.push(group)
      }

      return grouped
    },
    groupedlaptops() {
      const itemsPerSlide = 6
      const grouped = []
      for (let i = 0; i < this.filteredLaptops.length; i += itemsPerSlide) {
        grouped.push(this.filteredLaptops.slice(i, i + itemsPerSlide))
      }
      return grouped
    },
    discountedProducts() {
      return this.$store.getters.filteredProducts.filter(
        product => product.discount > 0
      )
    },
    filteredLaptops() {
      return this.$store.getters.filteredLaptops
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
    user_id() {
      return this.$store.getters.user_id
    },
    ratings() {
      return this.$store.getters.ratings
    },
    cart() {
      return this.$store.state.cart
    },
    favorites() {
      return this.$store.state.favorites
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
    addToCart(product) {
      this.$store.dispatch('addToCart', product)
    },
    truncateName(description, maxLength) {
      if (!description) return '' // Add this guard clause
      if (description.length > maxLength) {
        return description.substring(0, maxLength) + '..'
      }
      return description
    },
    removeFromCart(itemId) {
      this.$store.dispatch('removeFromCart', itemId)
    },
    redirectToItemFromCart(itemId) {
      this.$store.dispatch('redirectToItem', itemId)
    },
    redirectToItemFromNavbar(itemId) {
      this.$router.push({ name: 'Item', params: { itemId } })
    },
    redirectToItemFromProduct(itemId) {
      this.$store.dispatch('redirectToItem', itemId)
    }
  }
}
</script>
