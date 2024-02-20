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
        top: 11%;
        right: 0;
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
    <div class="container" style="margin-top: 2%">
      <carousel
        :products="groupedProducts"
        carouselId="discount-products-carousel"
      />
      <div
        class="container"
        style="font-size: 1.3em; text-align: left; margin-bottom: 1%"
      >
        <b>Laptops</b>
      </div>
      <carousel
        :products="groupedlaptops"
        carouselId="laptop-products-carousel"
      />
      <div
        class="container"
        style="font-size: 1.3em; text-align: left; margin-bottom: 1%"
      >
        <b>Tablets</b>
      </div>
      <carousel
        :products="groupedTablets"
        carouselId="laptop-products-carousel"
      />
      <div
        class="container"
        style="font-size: 1.3em; text-align: left; margin-bottom: 1%"
      >
        <b>Smartphones</b>
      </div>
      <carousel
        :products="groupedSmartphones"
        carouselId="laptop-products-carousel"
      />
      <div
        class="container"
        style="font-size: 1.3em; text-align: left; margin-bottom: 1%"
      >
        <b>Smartwatches</b>
      </div>
      <carousel
        :products="groupedSmartwatches"
        carouselId="laptop-products-carousel"
      />
      <div
        class="container"
        style="font-size: 1.3em; text-align: left; margin-bottom: 1%"
      >
        <b>TV's</b>
      </div>
      <carousel :products="groupedTV" carouselId="laptop-products-carousel" />
    </div>
  </div>
</template>

<script>
// import ProductList from '@/components/ProductList.vue'
import Carousel from '@/views/CarouselVue.vue'
// import CarouselMain from '@/views/CarouselMain.vue'
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
    this.$store.dispatch('checkFavoritesOnLoad')
    this.$store.dispatch('readFromCartVue').then(() => {
      const fetchRatingsPromises = this.$store.getters.filteredLaptops.map(
        product => {
          return this.$store.dispatch('getItemRating', product.id)
        }
      )
      return Promise.all(fetchRatingsPromises)
    })
  },
  computed: {
    groupedProducts() {
      const itemsPerSlide = 6
      const products = this.discountedProducts
      const grouped = []
      if (products.length <= itemsPerSlide) {
        grouped.push(products)
        return grouped
      }
      for (let i = 0; i < products.length; i += itemsPerSlide) {
        const group = products.slice(i, i + itemsPerSlide)
        if (
          i + itemsPerSlide >= products.length &&
          group.length < itemsPerSlide
        ) {
          const remainingItems = itemsPerSlide - group.length
          const nextGroup = products.slice(0, remainingItems)
          group.push(...nextGroup)
        }
        grouped.push(group)
      }
      return grouped
    },
    groupedlaptops() {
      const itemsPerSlide = 6
      const products = this.filteredLaptops
      const grouped = []
      if (products.length <= itemsPerSlide) {
        grouped.push(products)
        return grouped
      }
      for (let i = 0; i < products.length; i += itemsPerSlide) {
        const group = products.slice(i, i + itemsPerSlide)
        if (
          i + itemsPerSlide >= products.length &&
          group.length < itemsPerSlide
        ) {
          const remainingItems = itemsPerSlide - group.length
          const nextGroup = products.slice(0, remainingItems)
          group.push(...nextGroup)
        }
        grouped.push(group)
      }
      return grouped
    },
    groupedTablets() {
      const itemsPerSlide = 6
      const products = this.filteredTablets
      const grouped = []
      if (products.length <= itemsPerSlide) {
        grouped.push(products)
        return grouped
      }
      for (let i = 0; i < products.length; i += itemsPerSlide) {
        const group = products.slice(i, i + itemsPerSlide)
        if (
          i + itemsPerSlide >= products.length &&
          group.length < itemsPerSlide
        ) {
          const remainingItems = itemsPerSlide - group.length
          const nextGroup = products.slice(0, remainingItems)
          group.push(...nextGroup)
        }
        grouped.push(group)
      }
      return grouped
    },
    groupedSmartwatches() {
      const itemsPerSlide = 6
      const products = this.filteredSmartwatches
      const grouped = []
      if (products.length <= itemsPerSlide) {
        grouped.push(products)
        return grouped
      }
      for (let i = 0; i < products.length; i += itemsPerSlide) {
        const group = products.slice(i, i + itemsPerSlide)
        if (
          i + itemsPerSlide >= products.length &&
          group.length < itemsPerSlide
        ) {
          const remainingItems = itemsPerSlide - group.length
          const nextGroup = products.slice(0, remainingItems)
          group.push(...nextGroup)
        }
        grouped.push(group)
      }
      return grouped
    },
    groupedSmartphones() {
      const itemsPerSlide = 6
      const products = this.filteredSmartphones
      const grouped = []
      if (products.length <= itemsPerSlide) {
        grouped.push(products)
        return grouped
      }
      for (let i = 0; i < products.length; i += itemsPerSlide) {
        const group = products.slice(i, i + itemsPerSlide)
        if (
          i + itemsPerSlide >= products.length &&
          group.length < itemsPerSlide
        ) {
          const remainingItems = itemsPerSlide - group.length
          const nextGroup = products.slice(0, remainingItems)
          group.push(...nextGroup)
        }
        grouped.push(group)
      }
      return grouped
    },
    groupedTV() {
      const itemsPerSlide = 6
      const products = this.filteredTV
      const grouped = []
      if (products.length <= itemsPerSlide) {
        grouped.push(products)
        return grouped
      }
      for (let i = 0; i < products.length; i += itemsPerSlide) {
        const group = products.slice(i, i + itemsPerSlide)
        if (
          i + itemsPerSlide >= products.length &&
          group.length < itemsPerSlide
        ) {
          const remainingItems = itemsPerSlide - group.length
          const nextGroup = products.slice(0, remainingItems)
          group.push(...nextGroup)
        }
        grouped.push(group)
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
    filteredTablets() {
      return this.$store.getters.filteredTablets
    },
    filteredSmartphones() {
      return this.$store.getters.filteredSmartphones
    },
    filteredSmartwatches() {
      return this.$store.getters.filteredSmartwatches
    },
    filteredTV() {
      return this.$store.getters.filteredTV
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
    },
    getHeartClasses(product) {
      const isFavorite = this.isFavorite(product)
      return isFavorite ? 'fa fa-heart red-color' : 'fa fa-heart-o'
    }
  },
  methods: {
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
