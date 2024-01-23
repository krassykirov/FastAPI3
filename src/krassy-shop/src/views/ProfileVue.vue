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
        :favorites="favorites"
        :profile="profile"
        :user="user"
      />
    </nav>
    <div class="card" v-if="profile">
      <img
        v-if="profile"
        :src="`http://127.0.0.1:8000/static/img/${user}/profile/${profile.avatar}`"
        id="avatar-image"
        style="width: 100%"
      />
      <h1 id="current_user"></h1>
      <p class="title">CEO & Founder, Birds</p>
      <p id="card-email">Email: {{ profile.email }}</p>
      <p id="card-phone">Phone: {{ profile.number }}</p>
      <p id="card-address">Address: {{ profile.address }}</p>
      <div style="margin: 24px 0">
        <a href="#"><i class="fa fa-dribbble"></i></a>
        <a href="#"><i class="fa fa-twitter"></i></a>
        <a href="#"><i class="fa fa-linkedin"></i></a>
        <a href="#"><i class="fa fa-facebook"></i></a>
      </div>
      <p><button>Contact</button></p>
    </div>
    <button
      v-if="profile"
      class="dropbtn"
      data-toggle="modal"
      data-target="#UpdateProfile"
      style="float: left"
    >
      Update Profile
    </button>

    <h2 style="text-align: center">No Profile yet, create one?</h2>
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
              <input
                type="email"
                name="primary_email"
                id="primary_email"
                :value="user"
                hidden
              />
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
                class="btn btn-primary"
              >
                Submit
              </button>
              <button
                id="Close-Profile"
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

    <div
      class="modal fade"
      id="UpdateProfile"
      role="dialog"
      aria-labelledby="UpdateProfileLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="UpdateProfileLabel">Update Profile</h5>
          </div>
          <div class="modal-body">
            <form
              id="update-profile"
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
                />
              </div>
              <div class="form-group">
                <label for="number" class="col-form-label">Number:</label>
                <input
                  type="tel"
                  name="number"
                  id="tel-number"
                  placeholder="Telephone number"
                />
              </div>
              <div class="form-group">
                <label for="address" class="col-form-label">Address:</label>
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
                />
              </div>
              <button
                id="submit-button"
                class="btn btn-primary"
                style="margin-bottom: 5px"
                @click="updateProfile"
              >
                Save
              </button>
              <button
                type="button"
                id="close-button"
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
// import router from '@/router'
import $ from 'jquery'
import NavBar from '../components/MyNavbar.vue'

export default {
  props: ['cart', 'profile', 'favorites'],
  components: {
    NavBar
  },
  data() {
    return {
      item: null,
      itemId: this.itemId
    }
  },
  computed: {
    cartFromStore() {
      return this.$store.state.cart
    },
    user() {
      return this.$store.getters.user
    },
    user_id() {
      return this.$store.getters.user_id
    },
    accessToken() {
      return this.$store.state.accessToken || null
    }
  },
  created() {
    this.$store.dispatch('initializeUser')
    this.$store.dispatch('getProfile')
  },
  methods: {
    updateProfile() {
      $('#update-profile').submit(e => {
        e.preventDefault()
        const formData = new FormData(e.target)
        $.ajax({
          url: 'http://127.0.0.1:8000/user/update_profile',
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
            console.log('user', user)
            var img_path = `http://127.0.0.1:8000/static/img/${user}/profile/${data.avatar}`
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
        $.ajax({
          url: 'http://127.0.0.1:8000/create_profile',
          type: 'POST',
          processData: false,
          contentType: false,
          headers: {
            Authorization: `Bearer ${this.$store.state.accessToken}`
          },
          data: formData,
          success: data => {
            console.log('profile', data)
            $('#CreateProfile').modal('hide')
            $('#Close-Profile').click()
            var user = this.$store.getters.user
            console.log('user', user)
            var img_path = `http://127.0.0.1:8000/static/img/${user}/profile/${data.avatar}`
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
    }
  }
}
</script>

<style>
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  /* max-width: 300px; */
  margin: auto;
  text-align: center;
  font-family: arial;
}

.title {
  color: grey;
  font-size: 18px;
}

button {
  border: none;
  outline: 0;
  display: inline-block;
  padding: 8px;
  color: white;
  background-color: #000;
  text-align: center;
  cursor: pointer;
  width: 100%;
  font-size: 18px;
}
</style>
