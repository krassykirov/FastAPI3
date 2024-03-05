<template>
  <div
    class="container-fluid"
    style="width: 100vw; position: sticky; margin: 0; padding: 0"
  >
    <nav class="navbar navbar-expand-lg fixed-top bg-light" style="height: 4em">
      <MyNavbar
        :cart="cart"
        :favorites="favorites"
        :total="total"
        :user="user"
        :user_id="user_id"
        :profile="profile"
      />
    </nav>
    <div
      class="container"
      style="margin-top: 5%; margin-left: 8%; background-color: white"
    >
      <CarouselMain carouselId="discount-products-carousel" />
    </div>
    <!-- prettier-ignore -->
    <h4 style="text-align: center; margin-top: 2%; margin-bottom: 2%">SHOP BY CATEGORY</h4>

    <section id="sm-banner" class="section-p1">
      <div class="banner-box">
        <h4>Laptops</h4>
        <h2>Up to 50% Discount</h2>
        <!-- <span>The best classic dress is on sales at cara</span> -->
        <div style="margin-top: 47%">
          <button class="btn white" @click="goToCategory('Laptops')">
            SHOP NOW
          </button>
        </div>
      </div>
      <div class="banner-box2 banner-box">
        <h4>Smartphones</h4>
        <h2>Special Offers</h2>
        <!-- <span>The best classic dress is on sales at cara</span> -->
        <div style="margin-top: 45%">
          <button class="btn white" @click="goToCategory('Smartphones')">
            SHOP NOW
          </button>
        </div>
      </div>
      <div class="banner-box3 banner-box">
        <h4>Tablets</h4>
        <h2>Special Offers</h2>
        <!-- <span>The best classic dress is on sales at cara</span> -->
        <div style="margin-top: 45%">
          <button class="btn white" @click="goToCategory('Tablets')">
            SHOP NOW
          </button>
        </div>
      </div>
      <div class="banner-box5 banner-box">
        <h4>TV's</h4>
        <h2>Special Offers</h2>
        <!-- <span>The best classic dress is on sales at cara</span> -->
        <div style="margin-top: 45%">
          <button class="btn white" @click="goToCategory('TV')">
            SHOP NOW
          </button>
        </div>
      </div>
      <div class="banner-box4 banner-box">
        <!-- <h4>Smartwatches</h4>
        <h2>Special Offers</h2> -->
        <!-- <span>The best classic dress is on sales at cara</span> -->
        <div style="margin-top: 66%">
          <button class="btn white" @click="goToCategory('Smartwatches')">
            SHOP NOW
          </button>
        </div>
      </div>
      <div class="banner-box6 banner-box">
        <!-- <h4>Discounts</h4>
        <h2>Special Offers</h2> -->
        <!-- <span>The best classic dress is on sales at cara</span> -->
        <div style="margin-top: 65%">
          <button class="btn white" @click="goToAllProducts()">SHOP NOW</button>
        </div>
      </div>
    </section>
    <div class="form" style="margin-top: 15px; margin-left: 30%">
      <button
        class="custom-button"
        style="height: 50px; width: 350px"
        @click="goToAllProducts()"
        @mouseover="hover = true"
        @mouseleave="hover = false"
        :style="{
          backgroundColor: hover ? '#088178' : 'transparent',
          color: hover ? '#fff' : 'inherit'
        }"
      >
        Browse All Products
      </button>
    </div>

    <section id="banner3" class="section-p1" style="margin-top: 15px">
      <div class="banner-box" @click="goToItem(24)" style="cursor: pointer">
        <!-- <h2>Today Offer</h2>
        <h3>-50% OFF</h3> -->
      </div>

      <div
        class="banner-box banner-img2"
        @click="goToItem(9)"
        style="cursor: pointer"
      >
        <!-- <h2>Today Offer</h2>
        <h3>-50% OFF</h3> -->
      </div>

      <div
        class="banner-box banner-img3"
        @click="goToItem(57)"
        style="cursor: pointer"
      >
        <!-- <h2>Today Offer</h2>
        <h3>-50% OFF</h3> -->
      </div>
    </section>
    <section
      id="newsletter"
      class="section-p1"
      style="
        margin-top: 0;
        margin-bottom: 10px;
        height: 50px;
        color: white;
        cursor: pointer;
      "
      @click="goToTop"
    >
      <div style="cursor: pointer; padding-left: 45%">Back to Top</div>
    </section>
    <section id="newsletter" class="section-p1">
      <div class="newstext">
        <h4 style="margin-top: 15px">Sign Up for Newsletters</h4>
        <p>Get Email updates about our latest shop and special offers.</p>
      </div>
      <div class="form" style="margin-top: 15px">
        <input type="text" placeholder="Your email address" />
        <button class="btn normal">Sign Up</button>
      </div>
    </section>

    <footer class="section-p1" style="margin-top: 25px">
      <div class="col">
        <a href="#">
          <img
            class="logo"
            src="../assets/eshop-logo-png.png"
            style="
              width: 100%;
              height: 50px;
              margin-bottom: 0;
              margin-top: 0;
              padding: 0;
            "
        /></a>
        <h4>Contact</h4>
        <p><strong>Phone:</strong>+123456789, +987654321</p>
        <p><strong>Hours:</strong>10.00 - 18.00, Mon - Sat</p>
        <div class="follow">
          <h4>Follow Us</h4>
          <div class="icon">
            <i class="fab fa-facebook-f"></i>
            <i class="fab fa-instagram"></i>
            <i class="fab fa-twitter"></i>
            <i class="fab fa-youtube"></i>
            <i class="fab fa-pinterest-p"></i>
          </div>
        </div>
      </div>

      <div class="sec">
        <div class="col">
          <h4>About</h4>
          <a href="#">About Us</a>
          <a href="#">Delivery Information</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms and Condition</a>
          <a href="#">Contact Us</a>
        </div>

        <div class="col">
          <h4>My Account</h4>
          <a href="#">View Cart</a>
          <a href="#">My Account</a>
          <a href="#">My Wishlist</a>
          <a href="#">Track my Order</a>
          <a href="#">Help</a>
        </div>

        <div class="col install">
          <h4>Install App</h4>
          <p>From App Store or Google Play</p>

          <div class="row">
            <img src="https://i.postimg.cc/Y2s5mLdR/app.jpg" alt="" />
            <img src="https://i.postimg.cc/7YvyWTS6/play.jpg" alt="" />
          </div>
          <p>Secured Payment Gateways</p>
          <img src="https://i.postimg.cc/kgfzqVRW/pay.png" alt="" />
        </div>
      </div>

      <div class="coypright">
        <p>© 2024 All rights reserved!</p>
      </div>
    </footer>
  </div>
</template>

<script>
// import $ from 'jquery'
// import 'bootstrap'
import router from '@/router'
import VueCookies from 'vue-cookies'
import { jwtDecode } from 'jwt-decode'
import MyNavbar from '@/components/MyNavbar.vue'
import CarouselMain from '@/views/CarouselMainNew.vue'
import errorHandlingMixin from '../errorHandlingMixin'
// /* global bootstrap */
// import config from '@/config'

export default {
  name: 'NewHome',
  components: {
    MyNavbar,
    CarouselMain
  },
  props: {
    isIdle: Boolean,
    lastActiveDate: Date,
    inactiveTime: Number
  },
  data() {
    return {
      hover: false
    }
  },
  mixins: [errorHandlingMixin],
  created() {
    if (!this.$store.state.accessToken) {
      const accessToken = VueCookies.get('access_token')
      if (accessToken) {
        const user = jwtDecode(accessToken).sub
        const user_id = jwtDecode(accessToken).user_id
        this.$store.commit('UPDATE_USER', user)
        this.$store.commit('UPDATE_USER_ID', user_id)
      } else {
        this.errorMessage = 'Session expired'
        router.push('/login')
      }
    }
    this.$store
      .dispatch('getProducts')
      .then(() => this.$store.dispatch('getProfile'))
      .then(() => this.$store.dispatch('fetchCategories'))
      .catch(error => {
        if (error.message !== 'Token Expired') {
          // console.error('error', error)
        }
      })
  },
  methods: {
    goToCategory(category) {
      this.$router.push({ name: 'category', params: { category: category } })
      this.$nextTick(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
      })
    },
    goToAllProducts() {
      this.$router.push({ name: 'home' })
      this.$nextTick(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
      })
    },
    goToItem(itemId) {
      this.$router.push({ name: 'Item', params: { itemId } })
    },
    goToTop() {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
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
    discountedProducts() {
      return this.$store.getters.filteredProducts.filter(
        product => product.discount > 0
      )
    },
    products() {
      return this.$store.getters.products
    },
    filteredProducts() {
      return this.$store.getters.filteredProducts
    },
    formattedLastActive() {
      if (!this.lastActiveDate) return ''
      return new Date(this.lastActiveDate).toLocaleString()
    },
    formattedInactiveTime() {
      return this.inactiveTime >= 0 ? `${this.inactiveTime} min` : ''
    },
    errorMessage() {
      return this.$store.getters.errorMessage
    },
    total() {
      return this.$store.getters.total
    },
    cart() {
      return this.$store.getters.cart
    },
    favorites() {
      return this.$store.getters.favorites
    },
    min() {
      return this.$store.getters.min
    },
    max() {
      return this.$store.getters.max
    },
    productMin() {
      return this.$store.getters.productMin
    },
    productMax() {
      return this.$store.getters.productMax
    },
    selectedCategories() {
      return this.$store.getters.selectedCategories
    },
    selectedRating: {
      get() {
        return this.$store.getters.selectedRating
      },
      set(value) {
        this.$store.commit('SET_SELECTED_RATING', value)
      }
    },
    ratings() {
      return this.$store.getters.ratings
    },
    accessToken() {
      return this.$store.getters.accessToken
    },
    accessTokenExpiration() {
      return this.$store.getters.accessTokenExpiration
    },
    refreshTokenExpiration() {
      return this.$store.getters.refreshTokenExpiration
    },
    user_id() {
      return this.$store.state.user_id
    },
    user() {
      return this.$store.state.user
    },
    profile() {
      return this.$store.state.profile
    },
    categories() {
      return this.$store.getters.categories
    }
  }
}
</script>
<style scoped>
html {
  scroll-behavior: smooth;
}

h1 {
  font-size: 50px;
  line-height: 64px;
  color: #222;
}

h2 {
  font-size: 46px;
  line-height: 54px;
  color: #222;
}

h4 {
  font-size: 20px;
  color: #222;
}

h6 {
  font-size: 12px;
  font-weight: 700;
}

p {
  font-size: 16px;
  color: #465b52;
  margin: 15px 0 20px 0;
}

.section-p1 {
  padding: 0 80px;
  margin-top: 5px;
  margin-bottom: 5px;
}

.section-m1 {
  padding: 40px 0;
}

#header {
  position: fixed;
  width: 100%;
  overflow: hidden;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 80px;
  background-color: #e3e6f3;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.06);
}

#mobile {
  display: none;
  align-items: center;
}

#banner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 80vh;
  background-position: center;
  background-size: cover;
}

#banner h4 {
  color: #fff;
  font-size: 16px;
}

#banner h2 {
  color: #fff;
  font-size: 30px;
  padding: 10px 0;
}

#banner h2 span {
  color: #ef3636;
}

button.normal {
  color: #000;
  padding: 15px 25px;
  height: 50px;
  font-weight: 400;
  font-size: 14px;
  border-radius: 4px;
  background-color: #fff;
  border: none;
  outline: none;
  transition: 0.2s;
  cursor: pointer;
}

#banner button:hover {
  background-color: #088178;
  color: #fff;
}

#sm-banner .banner-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  text-align: center;
  background-image: url('../assets/laptop-banner.jpeg');
  min-width: 520px;
  height: 40vh;
  background-position: center;
  background-size: cover;
  padding: 30px;
  margin-bottom: 5px;
}

#sm-banner .banner-box2 {
  background-image: url('../assets/smartphone-banner.png');
}
#sm-banner .banner-box3 {
  background-image: url('../assets/ipad.jpeg');
}
#sm-banner .banner-box4 {
  background-image: url('../assets/smart-watch-banner.jpg');
}
#sm-banner .banner-box5 {
  background-image: url('../assets/tv-banner.webp');
}
#sm-banner .banner-box6 {
  background-image: url('../assets/smartwatches-banner.webp');
}

#sm-banner {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

#sm-banner h4 {
  color: #fff;
  font-size: 20px;
  font-weight: 300;
}

#sm-banner h2 {
  color: #fff;
  font-size: 20px;
  font-weight: 500;
}

#sm-banner span {
  color: #0e0e0e;
  font-size: 16px;
  font-weight: 500;
  padding-bottom: 16px;
}

button.white {
  color: #faf8f8;
  padding: 10px 20px;
  font-weight: 400;
  font-size: 14px;
  border-radius: 4px;
  background-color: transparent;
  border: 1px solid #fff;
  outline: none;
  transition: 0.2s;
  cursor: pointer;
}
button.white:hover {
  background-color: #088178 !important;
  color: #fff !important;
}

#sm-banner .banner-box:hover button {
  background-color: #088178;
  color: #fff;
  border: 1px solid #088178;
}

#banner3 {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 80px;
}

#banner3 h2 {
  color: #fff;
  font-weight: 900;
  font-size: 22px;
}

#banner3 h3 {
  color: #ec544e;
  font-weight: 800;
  font-size: 15px;
}

#banner3 .banner-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  text-align: center;
  background-image: url('../assets/dell_xps_9730.jpg');
  min-width: 33%;
  height: 35vh;
  background-position: center;
  background-size: cover;
  padding: 10px;
  margin-bottom: 20px;
}
#banner3 .banner-img2 {
  background-image: url('../assets/Laptop.jpg');
}

#banner3 .banner-img3 {
  background-image: url('../assets/hp_zbook_studio_16.jpg');
}

#newsletter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  background-repeat: no-repeat;
  background-position: 20% 30%;
  background-color: #041e42;
}

#newsletter h4 {
  color: #fff;
  font-weight: 700;
  font-size: 22px;
}

#newsletter p {
  color: #818ea0;
  font-weight: 600;
  font-size: 14px;
}

#newsletter p span {
  color: #ffbd27;
}

#newsletter input {
  height: 3.125rem;
  width: 100%;
  font-size: 14px;
  padding: 0 1.25em;
  border: 1px solid transparent;
  border-radius: 4px;
  outline: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

#newsletter button {
  background-color: #088178;
  color: #fff;
  white-space: nowrap;
  border-left-right-radius: 0;
  border-left-right-radius: 0;
}
#newsletter .form {
  display: flex;
  width: 40%;
}

footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  position: relative;
}

footer .col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
  margin-left: 50px;
}

footer .sec {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

footer .logo {
  margin-bottom: 20px;
}

footer h4 {
  font-size: 14px;
  padding-bottom: 20px;
}

footer p {
  font-size: 13px;
  margin: 0 0 8px 0;
}

footer a {
  font-size: 13px;
  text-decoration: none;
  color: #222;
  margin-bottom: 10px;
}

footer .follow {
  margin-top: 20px;
}

footer .follow i {
  color: #465b52;
  padding-right: 5px;
  cursor: pointer;
}

footer .follow i:hover,
footer a:hover {
  color: #088178;
}

footer .install .row img {
  border: 1px solid #088178;
  border-radius: 6px;
}

footer .install img {
  margin: 10px 0 15px 0;
}

footer .copyright {
  width: 100%;
  text-align: center;
}

/*----------------------Media Query ----------*/

@media (max-width: 920px) {
  .section-p1 {
    padding: 40px 40px;
  }

  #mobile {
    display: flex;
    align-items: center;
  }
  #mobile i {
    font-size: 32px;
    color: #1a1a1a;
    padding-left: 20px;
  }
  body #lg-bag {
    display: none;
  }

  #lg-bag {
    display: none;
  }

  #banner {
    height: 25vh;
  }

  #sm-banner .banner-box {
    min-width: 100%;
    height: 30vh;
  }

  #banner3 {
    padding: 0 40px;
  }

  #banner3 .banner-box {
    width: 28%;
  }

  #newsletter .form {
    width: 70%;
  }
}

@media (max-width: 477px) {
  .section-p1 {
    padding: 20px;
  }

  #header {
    padding: 10px 30px;
  }

  h2 {
    font-size: 30px;
  }

  h1 {
    font-size: 28px;
  }

  p {
    line-height: 24px;
    font-size: 10px;
  }

  #banner {
    height: 40vh;
  }
  #sm-banner .banner-box {
    height: 40vh;
  }

  #sm-banner .banner-box2 {
    margin-top: 20px;
  }

  #banner3 {
    padding: 0 20px;
  }

  #banner3 .banner-box {
    width: 100%;
  }

  #newsletter .form {
    width: 100%;
  }

  #newsletter {
    padding: 40px 20px;
  }

  footer .copyright {
    text-align: start;
  }
}
</style>
