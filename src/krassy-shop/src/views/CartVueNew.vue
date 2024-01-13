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
    <div
      class="toast"
      id="cartToast"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-bs-autohide="false"
      style="
        position: fixed;
        top: 10%;
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
    <main class="main bd-grid">
      <div
        v-for="product in cart"
        :key="product.id"
        class="col-lg-4 col-md-6 col-sm-12"
      >
        <article class="card">
          <div
            class="card-title"
            style="
              margin-bottom: 1%;
              padding: 1%;
              height: 2em;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              line-height: 1;
            "
          >
            {{ product.name }}
          </div>
          <div class="card__img">
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
              style="cursor: pointer; padding: 1%"
              @click="redirectToItemFromProduct(product.id)"
            />
          </div>
          <div class="card__name">
            <p>{{ product.name }}</p>
          </div>
          <div class="card-body">
            <span
              class="badge bg-danger position-absolute top-0 start-0"
              v-if="product.discount >= 0.1"
              style="font-size: 0.8em; margin: 1%; top: 0; start: 0"
              >-{{ Math.floor(product.discount * 100) }}%
            </span>
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
            <a class="card__icon"
              ><span
                class="fa fa-heart-o"
                style="font-weight: 900; font-size: 1em"
              ></span
            ></a>

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
            </div>
            <a @click="removeFromCart(product.id)" class="card__icon"
              ><i class="bi bi-trash"></i>
            </a>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<script>
import NavBar from '../components/MyNavbar.vue'

export default {
  components: {
    NavBar
  },
  props: ['product', 'avatar'],
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
        return 'fa fa-star-o'
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
    }
  }
}
</script>
<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
@import url('https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css');
@import url('https://fonts.googleapis.com/css?family=Raleway');

/*-- VARIABLES CSS--*/
/*Colores*/
:root {
  --first-color: #e3f8ff;
  --second-color: #dcfafb;
  --third-color: #ffe8df;
  --accent-color: #ff5151;
  --dark-color: #161616;
}

/*Tipografia responsive*/
body {
  margin: 0 !important;
  padding: 0 !important;
}
navbar {
  margin: 0 !important;
  padding: 0 !important;
}
/*-- BASE --*/
*,
::after,
::before {
  box-sizing: border-box;
}
body {
  margin: 0 !important;
  background-color: #fff !important;
  color: var(--dark-color) !important;
  font-family: var(--body-font) !important;
}
h1 {
  font-size: var(--h1-font-size);
}
img {
  max-width: 100% !important;
  height: auto !important;
}
a {
  text-decoration: none !important;
}

/*-- LAYAOUT --*/
.main {
  padding: 2rem 0;
}
.bd-grid {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)) !important;
  max-width: 1200px !important;
  margin-left: 2.5rem !important;
  margin-right: 2.5rem !important;
  align-items: center !important;
  gap: 2rem !important;
}

/*-- PAGES --*/
.title-shop {
  position: relative !important;
  margin: 0 2.5rem !important;
}
.title-shop::after {
  content: '' !important;
  position: absolute !important;
  top: 50% !important;
  width: 72px !important;
  height: 2px !important;
  background-color: var(--dark-color) !important;
  margin-left: 0.25rem !important;
}

/*-- COMPONENT --*/
.card {
  position: relative !important;
  width: 25vw !important;
  height: auto !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  padding: 1.5rem 2rem !important;
  border-radius: 1rem !important;
  overflow: hidden !important;
}
article:nth-child(1) {
  background-color: var(--first-color) !important;
}
article:nth-child(2) {
  background-color: var(--second-color) !important;
}
article:nth-child(3) {
  background-color: var(--third-color) !important;
}
article:nth-child(4) {
  background-color: var(--second-color) !important;
}
.card__img {
  width: 220px !important;
  height: auto !important;
  padding: 3rem 0 !important;
  transition: 0.5s !important;
}
.card__name {
  position: absolute !important;
  left: -25% !important;
  top: 0 !important;
  width: 3.5rem !important;
  height: 100% !important;
  writing-mode: vertical-rl !important;
  transform: rotate(180deg) !important;
  text-align: center !important;
  background-color: var(--dark-color) !important;
  color: #fff !important;
  font-weight: bold !important;
  transition: 0.5s !important;
}
.new-price span {
  color: #f64749;
  font-weight: 900 !important;
  font-size: 1.2rem !important;
}
.last-price span {
  color: #939497 !important;
  text-decoration: line-through !important;
}
.card__icon {
  font-size: 1.5rem !important;
  color: var(--dark-color) !important;
  cursor: pointer;
}
.card__icon:hover {
  color: var(--accent-color) !important;
}
.card__precis {
  width: 100% !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: flex-end !important;
  transition: 0.5s !important;
}
.card__preci {
  display: block !important;
  text-align: center !important;
}
.card__preci--before {
  font-size: var(--smaller-font-size) !important;
  color: var(--accent-color) !important;
  margin-bottom: 0.25rem !important;
}
.card__preci--now {
  font-size: var(--h3-font-size) !important;
  font-weight: bold !important;
}
/*Move left*/
.card:hover {
  box-shadow: 0 0.5rem 1rem #d1d9e6 !important;
}
.card:hover .card__name {
  left: 0 !important;
}
.card:hover .card__img {
  transform: rotate(30deg) !important;
  margin-left: 3.5rem !important;
}
.card:hover .card__precis {
  margin-left: 3.5rem !important;
  padding: 0 1.5rem !important;
}

/*-- FOOTER --*/

footer {
  text-align: center;
}
</style>
