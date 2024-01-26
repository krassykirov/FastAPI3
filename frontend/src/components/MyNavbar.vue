<template>
  <div
    class="container"
    style="align-items: center; text-align: center; margin-left: 35%"
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
          <a class="nav-link mx-2 text-uppercase"
            ><router-link
              style="
                text-decoration: none;
                color: inherit;
                font-family: inherit;
              "
              to="/"
              >Offers</router-link
            >
          </a>
        </li>
        <li class="nav-item" v-if="!accessToken">
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
        <li class="nav-item" v-if="!accessToken">
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
      <div
        v-if="favorites && accessToken"
        @mouseleave="hideFavorites()"
        d-flex
        bd-highlight
        mb-1
        style="margin-top: 18px"
      >
        <button
          @mouseenter="showFavorites()"
          @click="displayLiked = !displayLiked"
          @dblclick="handleDoubleClickFavorites"
          class="btn btn-light dropdown-toggle btn-sm"
          id="likedDropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <i class="fa fa-heart-o red-color" style="font-size: 1rem"></i>
          FAVORITES
          <span class="badge badge-pill badge-danger">
            {{ favorites.length }}</span
          >
        </button>
        <div
          v-if="!displayLiked"
          class="list-group position-absolute"
          style="
            left: 52%;
            transform: translateX(-40%);
            z-index: 1000;
            min-width: 200px;
            max-height: 400px;
            overflow-y: auto;
          "
        >
          <div
            v-for="(item, index) in favorites"
            :key="index"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div class="d-flex align-items-center">
              <img
                :src="
                  '/static/img/' +
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
                  font-family: Georgia, 'Times New Roman', Times, serif;
                "
              />
              <div
                style="cursor: pointer"
                @click="redirectToItemFromNavbar(item.id)"
              >
                <div style="font-size: 0.9rem; width: 180px">
                  {{ truncateDescription(item.name, 30) }} ${{
                    formatPrice(item.price)
                  }}
                </div>
              </div>
            </div>
            <button
              @click="removeFromFavorites(item.id)"
              class="btn btn-light btn-sm ml-2"
              data-bs-placement="top"
              style="margin-top: 16px"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <button
            v-if="favorites.length > 0"
            @click="redirectToFavorites"
            class="btn btn-sm btn-primary"
          >
            See Favorites
          </button>
        </div>
      </div>
      <div
        v-if="cart && accessToken"
        @mouseleave="hideCart()"
        d-flex
        bd-highlight
        mb-1
        style="padding-left: 35%; margin-top: 5px"
      >
        <button
          @mouseenter="showCart()"
          @click="displayCart = !displayCart"
          @dblclick="handleDoubleClick"
          class="btn btn-light dropdown-toggle btn-sm"
          id="cartDropdown"
          aria-haspopup="true"
          aria-expanded="false"
          style="margin-top: 16px"
        >
          <i class="bi bi-cart" style="font-size: 1rem"></i> CART
          <span class="badge badge-pill badge-primary"> {{ cart.length }}</span>
        </button>
        <div
          v-if="!displayCart"
          class="list-group position-absolute"
          style="
            left: 77%;
            transform: translateX(-40%);
            z-index: 1000;
            min-width: 200px;
            max-height: 400px;
            overflow-y: auto;
          "
        >
          <div
            v-for="(item, index) in cart"
            :key="index"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div class="d-flex align-items-center">
              <img
                :src="
                  '/static/img/' +
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
                  font-family: Georgia, 'Times New Roman', Times, serif;
                "
              />
              <div
                style="cursor: pointer"
                @click="redirectToItemFromNavbar(item.id)"
              >
                <div style="font-size: 0.9rem; width: 180px">
                  x{{ item.quantity }}
                  {{ truncateDescription(item.name, 30) }} ${{
                    formatPrice(item.price)
                  }}
                </div>
              </div>
            </div>
            <button
              @click="removeFromCart(item.id)"
              class="btn btn-light btn-sm ml-2"
              data-bs-placement="top"
              style="margin-top: 16px"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <button
            id="total"
            class="btn btn-sm btn-light"
            style="pointer-events: none; opacity: 1; margin-bottom: 1px"
          >
            Total: {{ cart.length }} products -
            <b> ${{ total }} </b>
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
    </div>
    <ul
      class="navbar-nav ms-auto mb-1 mb-lg-0 profile-menu"
      style="margin-right: 120px"
    >
      <li class="nav-item dropdown">
        <a
          class="nav-link dropdown-toggle"
          href="#"
          id="navbarDropdownMenuLink"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          style="cursor: pointer"
        >
          <img
            v-if="profile"
            :src="`/static/img/${user}/profile/${profile.avatar}`"
            width="50"
            height="50"
            class="rounded-circle"
          />
          <img
            v-else
            src="/static/img/img_avatar.png"
            width="50"
            height="50"
            class="rounded-circle"
          />
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <a class="dropdown-item" style="color: grey; pointer-events: none">
            {{ user }}
          </a>
          <a class="dropdown-item">
            <router-link
              style="
                text-decoration: none;
                color: inherit;
                font-family: inherit;
              "
              to="/Profile"
              >Profile</router-link
            >
          </a>
          <a class="dropdown-item" style="cursor: pointer" @click="logout"
            >Logout</a
          >
          <a
            class="dropdown-item"
            v-if="user === 'krassy@mail.bg'"
            data-toggle="modal"
            data-target="#addItem"
            href="#"
            style="font-family: inherit; margin-top: 14%"
          >
            Add Product
          </a>
        </div>
      </li>
    </ul>
    <div
      class="modal fade"
      id="addItem"
      role="dialog"
      aria-labelledby="addItemlLabel"
      aria-hidden="true"
      data-backdrop="false"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addItemLabel">Add Product</h5>
          </div>
          <div class="modal-body">
            <form
              enctype="multipart/form-data"
              data-toggle="validator"
              id="createItem"
            >
              <p id="error" style="text-align: left"></p>
              <div class="form-group">
                <label for="name" class="col-form-label">Name:</label>
                <input
                  type="text"
                  name="name"
                  id="item-name"
                  placeholder="Item Name"
                  maxlength="55"
                  required
                />
              </div>
              <div class="form-group">
                <label for="price" class="col-form-label">Price: </label>
                <input
                  type="number"
                  step="any"
                  name="price"
                  id="item-price"
                  placeholder="99.99"
                  max="10000"
                  min="1"
                  required
                />
              </div>
              <div class="form-group">
                <label for="discount" class="col-form-label">Discount: </label>
                <input
                  type="number"
                  step="0.01"
                  name="discount"
                  id="discount-price"
                  placeholder="0.8"
                  max="0.95"
                  min="0.1"
                />
              </div>
              <div class="form-group" form-group-file>
                <label for="file" class="col-form-label">Upload Photo:</label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  class="form-control"
                  data-filesize="1000000"
                  data-filesize-error="File must be smaller then 1MB"
                  accept="image/*"
                  required
                />
              </div>
              <div class="form-group">
                <label for="Category" class="col-form-label">Category:</label>
                <select name="Category">
                  <option value="Laptops">Laptops</option>
                  <option value="Smartphones">Smartphones</option>
                  <option value="Tablets">Tablets</option>
                  <option value="Smartwatches">Smart Watches</option>
                  <option value="TV">TV</option>
                </select>
              </div>
              <div class="form-group">
                <label for="Description" class="col-form-label"
                  >Description:</label
                >
                <textarea
                  name="Description"
                  id="add-description"
                  rows="4"
                  cols="50"
                  maxlength="250"
                ></textarea>
              </div>
              <button
                id="submit-button"
                class="btn btn-primary"
                @click="createItem"
              >
                Save
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import errorHandlingMixin from '../errorHandlingMixin'

export default {
  props: ['cart', 'avatar', 'profile', 'favorites'],
  emits: ['removeFromCart', 'removeAccessToken'],
  mixins: [errorHandlingMixin],
  data() {
    return {
      displayCart: true,
      displayLiked: true
    }
  },
  computed: {
    accessToken() {
      return this.$store.state.accessToken || null
    },
    total() {
      return this.$store.getters.total
    },
    user() {
      return this.$store.getters.user || null
    }
  },
  methods: {
    redirectToItemFromNavbar(itemId) {
      this.$store.dispatch('redirectToItem', itemId)
    },
    redirectToCart() {
      this.$router.push({ name: 'ItemsInCart' })
    },
    redirectToFavorites() {
      this.$router.push({ name: 'ItemsInFavorites' })
    },
    removeFromCart(itemId) {
      this.$store.dispatch('removeFromCart', itemId)
    },
    addTofavorites(product) {
      this.$store.dispatch('addTofavorites', product)
    },
    removeFromFavorites(itemId) {
      this.$store.dispatch('removeFromFavorites', itemId)
    },
    logout() {
      this.$store.dispatch('removeAccessToken')
    },
    hideCart() {
      setTimeout(() => {
        this.displayCart = true
      }, 600)
    },
    showCart() {
      setTimeout(() => {
        this.displayLiked = true
        this.displayCart = false
      }, 400)
    },
    hideFavorites() {
      setTimeout(() => {
        this.displayLiked = true
      }, 600)
    },
    showFavorites() {
      setTimeout(() => {
        this.displayCart = true
        this.displayLiked = false
      }, 400)
    },
    createItem() {
      $('#createItem').submit(e => {
        console.log('#createItem...', this.$store.state.accessToken)
        e.preventDefault()
        const formData = new FormData(e.target)
        $.ajax({
          url: '/products/create_item',
          type: 'POST',
          processData: false,
          contentType: false,
          headers: {
            Authorization: `Bearer ${this.$store.state.accessToken}`
          },
          data: formData,
          success: function () {
            window.location.href = '/'
          },
          error: function (xhr) {
            if (xhr.status === 403) {
              $('#error').text('Item with that name already exists!')
            }
          }
        })
      })
    },
    formatPrice(price) {
      return price.toFixed(2)
    },
    truncateDescription(description, maxLength) {
      if (description.length > maxLength) {
        return description.substring(0, maxLength) + '..'
      }
      return description
    },
    handleDoubleClick() {
      this.$router.push('/cart')
    },
    handleDoubleClickFavorites() {
      this.$router.push('/favorites')
    }
  }
}
</script>

<style>
.cart {
  padding-left: 15px !important;
}
</style>
