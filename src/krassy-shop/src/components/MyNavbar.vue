<template>
  <nav
    class="navbar navbar-expand-lg bg-white sticky-top navbar-light p-3 shadow-lg"
    style="height: 70px; margin-left: 0; margin-right: 0; width: 100%"
  >
    <div
      class="container-fluid"
      style="padding: 0; width: 100%; font-size: 14px"
    >
      <a class="navbar-brand" href="#" style="font-size: 14px">
        <i class="fa fa-home"></i> <strong>KRASSY SHOP</strong>
      </a>
      <div class="mx-auto my-3 d-lg-none d-sm-block d-xs-block">
        <div class="input-group">
          <span class="border-warning input-group-text bg-warning text-white">
            <i class="fa-solid fa-magnifying-glass"></i>
          </span>
          <input
            type="text"
            class="form-control border-warning"
            style="color: #7a7a7a"
          />
          <button class="btn btn-warning text-white">Search</button>
        </div>
      </div>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link mx-2 text-uppercase" aria-current="page" href="#"
              >Offers</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link mx-2 text-uppercase"
              href="{{ url_for('get_products')}}"
              >Products</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link mx-2 text-uppercase"
              href="{{ url_for('get_category')}}"
              >Categories</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link mx-2 text-uppercase"
              href="{{ url_for('get_items_in_cart')}}"
              >Cart</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link mx-2 text-uppercase" href="#">About</a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link mx-2 text-uppercase"
              href="{{ url_for('get_items_in_cart')}}"
              >Cart</a
            >
          </li>
        </ul>
        <div v-if="cart" class="ml-auto">
          <button
            @click="displayCart = !displayCart"
            class="btn btn-sm btn-success"
            id="cartDropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <i class="bi bi-cart"></i> {{ cart.length }}
          </button>
          <div v-if="!displayCart" class="list-group position-absolute">
            <div
              v-for="(item, index) in cart"
              :key="index"
              class="list-group-item d-flex justify-content-between"
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
                    width: 50px;
                    height: 50px;
                    object-fit: cover;
                    border-radius: 5px;
                  "
                />
                <div
                  style="cursor: pointer"
                  @click="redirectToItemFromNavbar(item.id)"
                >
                  <div>{{ item.name }} - ${{ item.price }}</div>
                </div>
              </div>
              <div class="ml-3 font-weight-bold"></div>
            </div>
          </div>
        </div>
        <div v-if="cart" class="ml-auto"></div>
        {% raw %} {% if current_user %}
        <form class="form-inline my-2 my-lg-0" style="margin-right: 30px">
          <div class="dropdown" style="font-family: Raleway; font-size: 16px">
            {% if profile %}
            {{ current_user }}
            {% endif %}
            <div class="dropdown-content">
              <a
                class="nav-link mx-2 text-uppercase"
                href="{{ url_for('get_user_profile') }}"
              >
                Profile</a
              >
              <a
                class="nav-link mx-2 text-uppercase"
                href="{{ url_for('logout') }}"
              >
                Logout</a
              >
            </div>
          </div>
        </form>
        {% endif %} {% endraw %}
      </div>
    </div>
  </nav>
</template>

<script>
// import ProductList from 'ProductList.vue'
export default {
  props: ['product', 'cart'],
  data() {
    return {
      displayCart: true
    }
  },
  methods: {
    redirectToItemFromNavbar(itemId) {
      this.$root.redirectToItem(itemId)
    }
  }
}
</script>
