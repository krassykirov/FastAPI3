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
    <div class="container" style="margin-top: 2%">
      <div class="card" v-if="profile">
        <img
          :src="`${backendEndpoint}/static/img/${user}/profile/${profile.avatar}`"
          id="avatar-image"
          style="width: 100%"
          class="img-top"
        />
        <div class="card-body">
          <h4 :id="user">{{ user }}</h4>
          <p class="title">CEO & Founder, Birds</p>
          <p id="card-email">Secondary Email: {{ profile.email }}</p>
          <p id="card-phone">Phone: {{ profile.number }}</p>
          <p id="card-address">Address: {{ profile.address }}</p>
          <p>
            <button
              v-if="profile"
              class="dropbtn"
              data-toggle="modal"
              data-target="#UpdateProfile"
              style="padding: 15px"
            >
              Update Profile
            </button>
          </p>
        </div>
      </div>
      <h5 v-if="!profile" style="text-align: center">
        No Profile yet, create one?
      </h5>
      <button
        v-if="!profile"
        class="dropbtn"
        data-toggle="modal"
        data-target="#addProfile"
        style="float: left"
      >
        Add Profile
      </button>

      <div
        class="modal fade"
        id="addProfile"
        tabindex="-1"
        role="dialog"
        aria-labelledby="addProfileLabel"
        aria-hidden="true"
        data-backdrop="false"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addProfileLabel">Create Profile</h5>
            </div>
            <div class="modal-body">
              <form
                id="create-profile"
                enctype="multipart/form-data"
                data-toggle="validator"
              >
                <div class="form-group">
                  <label for="email" class="col-form-label"
                    >Secondary Email:</label
                  >
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    required
                  />
                  <!-- <input type="text" name="name" id="item-name" pattern="^[a-zA-Z]*" oninvalid="setCustomValidity('Please use only letters')" placeholder="Item Name"  required> -->
                </div>
                <div class="form-group">
                  <label for="number" class="col-form-label">Number:</label>
                  <input
                    type="tel"
                    name="number"
                    id="tel-number"
                    placeholder="Telephone number"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="address" class="col-form-label">Number:</label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Address"
                  />
                </div>
                <div class="form-group" form-group-file>
                  <label for="file" class="col-form-label"
                    >Upload Avatar Photo:</label
                  >
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
                <button
                  id="submit-button"
                  @click="createProfile"
                  class="dropbtn"
                >
                  Submit
                </button>
                <button
                  id="Close-Profile"
                  type="button"
                  class="dropbtn"
                  data-dismiss="modal"
                  style="margin-bottom: 5px; margin-top: 5px"
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal fade"
        id="UpdateProfile"
        role="dialog"
        aria-labelledby="UpdateProfileLabel"
        aria-hidden="true"
        data-backdrop="false"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="UpdateProfileLabel">
                Update Profile
              </h5>
            </div>
            <div class="modal-body">
              <form
                id="update-profile"
                enctype="multipart/form-data"
                data-toggle="validator"
              >
                <div class="form-group">
                  <label for="email" class="col-form-label">Email:&nbsp;</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                  />
                </div>
                <div class="form-group">
                  <label for="number" class="col-form-label"
                    >Number:&nbsp;</label
                  >
                  <input
                    type="tel"
                    name="number"
                    id="tel-number"
                    placeholder="Telephone number"
                  />
                </div>
                <div class="form-group">
                  <label for="address" class="col-form-label"
                    >Address:&nbsp;</label
                  >
                  <input
                    type="address"
                    name="address"
                    id="address"
                    placeholder="Address"
                  />
                </div>
                <div class="form-group" form-group-file>
                  <label for="file" class="col-form-label"
                    >Upload Avatar Photo:&nbsp;</label
                  >
                  <input
                    type="file"
                    id="file"
                    name="file"
                    class="form-control"
                    data-filesize="1000000"
                    data-filesize-error="File must be smaller then 1MB"
                    accept="image/*"
                  />
                </div>
                <button
                  id="submit-button"
                  class="dropbtn"
                  style="margin-bottom: 5px; margin-top: 15px"
                  @click="updateProfile"
                >
                  Save
                </button>
                <button
                  id="close-button"
                  type="button"
                  class="dropbtn"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
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
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import NavBar from '../components/MyNavbar.vue'
import errorHandlingMixin from '../errorHandlingMixin'
import config from '@/config'

export default {
  components: {
    NavBar
  },
  props: ['cart', 'total', 'avatar', 'favorites'],
  emits: ['addToCart'],
  mixins: [errorHandlingMixin],
  data() {
    return {
      item: this.item,
      itemId: this.itemId,
      backendEndpoint: 'https://fast3-backend.azurewebsites.net'
    }
  },
  computed: {
    user() {
      return this.$store.getters.user || null
    },
    user_id() {
      return this.$store.getters.user_id || null
    },
    profile() {
      return this.$store.getters.profile || null
    },
    accessToken() {
      return this.$store.state.accessToken || null
    }
  },
  created() {
    this.$store.dispatch('initializeUser').catch(this.handleError)
    this.getProfile()
  },
  methods: {
    async getProfile() {
      this.$store.dispatch('getProfile')
    },
    addToCart(product) {
      this.$store.dispatch('addToCart', product)
    },
    itemAlreadyInCart(product) {
      return this.cart.some(item => item.id === product.id)
    },
    showModal() {
      $(document).ready(function () {
        $('#global-modal').modal('show')
      })
    },
    updateProfile() {
      $('#update-profile').submit(e => {
        e.preventDefault()
        const formData = new FormData(e.target)
        $.ajax({
          url: `${config.backendEndpoint}/user/update_profile`,
          type: 'POST',
          processData: false,
          contentType: false,
          headers: {
            Authorization: `Bearer ${this.$store.state.accessToken}`
          },
          data: formData,
          success: data => {
            // Use an arrow function here
            $('#UpdateProfile').modal('hide')
            $('#close-button').click()
            var user = this.$store.getters.user
            var img_path = `${config.backendEndpoint}/static/img/${user}/profile/${data.avatar}`
            $('#card-email').text(`Email: ${data.email}`)
            $('#card-address').text(`Address: ${data.address}`)
            $('#card-phone').text(`Address: ${data.number}`)
            $('#avatar-image').attr('src', img_path)
          },
          error: function (xhr) {
            if (xhr.status === 404) {
              $('#UpdateProfileLabel').text(
                'Unable to process Profile update, please try again later!'
              )
            }
          }
        })
      })
    },
    createProfile() {
      $('#create-profile').submit(e => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('primary_email', this.user)
        console.log('formData', formData)
        $.ajax({
          url: `${config.backendEndpoint}/create_profile`,
          type: 'POST',
          processData: false,
          contentType: false,
          headers: {
            Authorization: `Bearer ${this.$store.state.accessToken}`
          },
          data: formData,
          success: () => {
            $('#create-profile').modal('hide')
            $('#Close-Profile').click()
            this.getProfile()
          },
          error: function (xhr) {
            if (xhr.status === 403) {
              $('#error').text('Item with that name already exists!')
            }
          }
        })
      })
    }
  }
}
</script>
<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
@import url('https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css');
@import url('//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
@import url('https://fonts.googleapis.com/css?family=Raleway');

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2) !important;
  margin-bottom: 10%;
  margin-top: 5% !important;
  margin: auto !important;
  text-align: center !important;
  font-family: arial !important;
  width: 20rem !important;
  height: 41rem !important;
}
.title {
  color: grey !important;
  font-size: 18px !important;
}

button {
  border: none !important;
  outline: 0 !important;
  display: inline-block !important;
  padding: 8px !important;
  color: white !important;
  background-color: #0093c4 !important;
  text-align: center !important;
  cursor: pointer !important;
  width: 100% !important;
  font-size: 18px !important;
}
</style>
