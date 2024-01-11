<template>
  <div
    class="container"
    style="align-items: center; text-align: center; margin-left: 26%"
  >
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
      <a
        class="navbar-brand"
        href="#"
        style="font-size: 14px; margin-left: 1%; font-family: inherit"
      >
        <i class="fa fa-home"></i> <strong>KRASSY SHOP</strong>
      </a>
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link mx-2 text-uppercase" href="/products">Offers</a>
        </li>
        <li class="nav-item">
          <a class="nav-link mx-2 text-uppercase"
            ><router-link
              style="
                text-decoration: none;
                color: inherit;
                font-family: inherit;
              "
              to="/login"
              >Login</router-link
            >
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link mx-2 text-uppercase"
            ><router-link
              style="
                text-decoration: none;
                color: inherit;
                font-family: inherit;
              "
              to="/signup"
              >SignUp</router-link
            >
          </a>
        </li>
      </ul>
      <div v-if="user === 'krassy@mail.bg'" d-flex bd-highlight mb-3>
        <button
          class="btn btn-light btn-sm"
          data-toggle="modal"
          data-target="#addItem"
          href="#"
          style="font-family: inherit; margin-top: 14%"
        >
          Add Product
        </button>
      </div>
      <div
        v-if="cart"
        @mouseleave="hideCart()"
        @mouseenter="showCart()"
        d-flex
        bd-highlight
        mb-3
      >
        <button
          @click="displayCart = !displayCart"
          class="btn btn-light dropdown-toggle btn-sm"
          id="cartDropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <i class="bi bi-cart" style="font-size: 1rem"></i> Cart
          <span class="badge badge-pill badge-primary"> {{ cart.length }}</span>
        </button>
        <div
          v-if="!displayCart"
          class="list-group position-absolute"
          style="
            left: 60%;
            transform: translateX(-40%);
            z-index: 1000;
            min-width: 200px;
          "
        >
          <div
            v-for="(item, index) in cart.slice(0, Math.min(7, cart.length))"
            :key="index"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div class="d-flex align-items-center">
              <img
                :src="
                  'http://127.0.0.1:8000/static/img/' +
                  item.username +
                  '/' +
                  item.name +
                  '/' +
                  item.image
                "
                class="mr-2"
                style="
                  width: 60px;
                  height: 60px;
                  object-fit: cover;
                  border-radius: 5px;
                "
              />
              <div
                style="cursor: pointer"
                @click="redirectToItemFromNavbar(item.id)"
              >
                <div style="font-size: 0.9rem; width: 180px">
                  {{ item.name }} - ${{ item.price }}
                </div>
              </div>
            </div>
            <button
              @click="removeFromCart(item.id)"
              class="btn btn-light btn-sm ml-2"
              data-bs-placement="top"
              style="margin-top: 16px"
            >
              x
            </button>
          </div>
          <button
            id="total"
            class="btn btn-sm btn-light"
            style="pointer-events: none; opacity: 1; margin-bottom: 1px"
          >
            Total: {{ cart.length }} products - <b> ${{ total }} </b>
          </button>
          <button
            v-if="cart.length > 0"
            @click="redirectToCart"
            class="btn btn-sm btn-primary"
          >
            Go to Cart
          </button>
        </div>
      </div>
      <div
        class="ml-auto"
        style="
          font-family: Raleway;
          font-size: 14px;
          margin-left: 0;
          margin-right: 0;
        "
      >
        <form class="form-inline my-2" style="margin-right: 80px">
          <div class="dropdown" style="font-family: Raleway; font-size: 16px">
            <img :src="avatar" class="avatar" />
            <div class="dropdown-content" style="text-align: center">
              <a
                class="nav-link text-uppercase"
                href="http://127.0.0.1:8000/user/profile"
                style="width: 100%"
                >Profile</a
              >
              <a
                class="nav-link text-uppercase"
                href="http://127.0.0.1:8000/logout"
                style="width: 100%"
                >Logout</a
              >
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// import ProductList from 'ProductList.vue'
export default {
  props: ['cart', 'total', 'user', 'avatar'],
  emits: ['removeFromCart'],
  data() {
    return {
      displayCart: true
    }
  },
  methods: {
    redirectToItemFromNavbar(itemId) {
      this.$store.dispatch('redirectToItem', itemId)
    },
    redirectToCart() {
      this.$router.push({ name: 'ItemsInCart' })
      this.$store.dispatch('redirectToCart')
    },
    removeFromCart(itemId) {
      this.$store.dispatch('removeFromCart', itemId)
    },
    hideCart() {
      setTimeout(() => {
        this.displayCart = true
      }, 700)
    },
    showCart() {
      this.displayCart = false
    }
  }
}
</script>
