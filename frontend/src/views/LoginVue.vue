<template>
  <section class="vh-100" style="background-color: #eee">
    <div class="container h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-lg-12 col-xl-11">
          <div class="card-group text-black" style="border-radius: 25px">
            <div class="card-body p-md-5">
              <div class="row justify-content-center">
                <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                  <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                    Login
                  </p>
                  <p ref="error" id="error" style="text-align: center">
                    {{ errorMessage }}
                  </p>
                  <form class="mx-1 mx-md-4" @submit.prevent="getToken">
                    <div class="d-flex flex-row align-items-center mb-4">
                      <div class="form-outline flex-fill mb-0">
                        <input
                          v-model="username"
                          type="email"
                          id="username"
                          name="username"
                          class="form-control"
                          required
                        />
                        <label class="form-label" for="username"
                          >Your Name</label
                        >
                      </div>
                    </div>
                    <div class="d-flex flex-row align-items-center mb-4">
                      <div class="form-outline flex-fill mb-0">
                        <input
                          v-model="password"
                          type="password"
                          id="password"
                          name="password"
                          class="form-control"
                          required
                        />
                        <label class="form-label" for="password"
                          >Password</label
                        >
                      </div>
                    </div>
                    <div>
                      <label class="form-check-label" for="rememberMe">
                        Remember Me
                      </label>
                      <input
                        type="checkbox"
                        id="rememberMe"
                        v-model="rememberMe"
                        style="margin-left: 5px; margin-bottom: 1px"
                      />
                    </div>
                    <div
                      class="d-flex justify-content-center mx-4 mb-3 mb-lg-4"
                    >
                      <button
                        class="btn btn-info"
                        style="margin: 2px; margin-top: 15px"
                      >
                        Login
                      </button>
                      <button
                        type="button"
                        class="btn btn-primary"
                        style="margin: 2px; margin-top: 15px"
                        @click="redirectToSignup"
                      >
                        Signup
                      </button>
                    </div>
                  </form>
                </div>
                <div
                  class="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2"
                >
                  <img
                    :src="`${backendEndpoint}/static/img/draw1.webp`"
                    class="img-fluid"
                    alt="Sample image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import router from '@/router'
import errorHandlingMixin from '../errorHandlingMixin'
import config from '@/config'

export default {
  data() {
    return {
      username: '',
      password: '',
      rememberMe: '',
      backendEndpoint: `${config.backendEndpoint}`
    }
  },
  mixins: [errorHandlingMixin],
  watch: {
    errorMessage(newVal) {
      this.errorMessage = newVal
    }
  },
  computed: {
    errorMessage() {
      return this.$store.getters.errorMessage
    }
  },
  methods: {
    async getToken() {
      try {
        await this.$store.dispatch('login', {
          username: this.username,
          password: this.password,
          rememberMe: this.rememberMe
        })
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.detail === 'Username or password are incorrect!'
        ) {
          this.$store.dispatch(
            'setErrorMessage',
            'Username or password are incorrect!'
          )
        } else {
          // console.error('Login Error:', error)
        }
      }
    },
    redirectToSignup() {
      router.push('/signup')
    }
  }
}
</script>
<style>
input[type='checkbox'] {
  background-color: #b6c0c2 !important;
}
input[type='checkbox']:checked {
  background-color: #409fd6;
  background: #409fd6
    url('data:image/gif;base64,R0lGODlhCwAKAIABAP////3cnSH5BAEKAAEALAAAAAALAAoAAAIUjH+AC73WHIsw0UCjglraO20PNhYAOw==')
    3px 3px no-repeat !important;
}
</style>
