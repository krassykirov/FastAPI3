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
                    <div
                      class="d-flex justify-content-center mx-4 mb-3 mb-lg-4"
                    >
                      <button
                        type="submit"
                        class="btn btn-info"
                        style="margin: 2px"
                        @click="getToken"
                      >
                        Login
                      </button>
                      <button
                        type="button"
                        class="btn btn-primary"
                        style="margin: 2px"
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
                    src="http://127.0.0.1:8000/static/img/draw1.webp"
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
export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    async getToken() {
      try {
        await this.$store.dispatch('login', {
          username: this.username,
          password: this.password
        })
      } catch (error) {
        this.errorMessage = 'Username or password are incorrect!'
      }
    },
    redirectToSignup() {
      router.push('/signup')
    }
  }
}
</script>
