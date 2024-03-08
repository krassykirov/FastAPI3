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
                    SignUp
                  </p>
                  <p
                    ref="errorUsername"
                    id="error-username"
                    style="text-align: center"
                  ></p>
                  <form
                    id="signup"
                    class="mx-1 mx-md-4"
                    @submit.prevent="submitForm"
                  >
                    <div class="d-flex flex-row align-items-center mb-4">
                      <div class="form-outline flex-fill mb-0">
                        <input
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
                    <div class="d-flex flex-row align-items-center mb-4">
                      <div class="form-outline flex-fill mb-0">
                        <input
                          type="password"
                          id="password2"
                          name="password2"
                          class="form-control"
                          required
                        />
                        <label class="form-label" for="password2"
                          >Repeat your password</label
                        >
                      </div>
                    </div>
                    <div
                      class="d-flex justify-content-center mx-4 mb-3 mb-lg-4"
                    >
                      <button
                        type="submit"
                        id="register"
                        class="btn btn-primary"
                        style="margin: 2px"
                      >
                        Register
                      </button>
                      <button
                        type="button"
                        class="btn btn-info"
                        style="margin: 2px"
                        @click="redirectToLogin"
                      >
                        Login
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
import config from '@/config'
export default {
  data() {
    return {
      backendEndpoint: `${config.backendEndpoint}`
    }
  },
  created() {
    this.$store.dispatch('setErrorMessage', null)
  },
  methods: {
    submitForm() {
      const password1 = document.getElementById('password').value
      const password2 = document.getElementById('password2').value
      if (password1 !== password2) {
        this.$refs.errorUsername.innerText = 'Passwords do not match!'
        return
      }
      const formData = new FormData(document.getElementById('signup'))
      fetch(`${config.backendEndpoint}/signup`, {
        method: 'POST',
        body: formData
      })
        .then(response => {
          if (response.ok) {
            router.push('/login')
          } else if (response.status === 403) {
            return response.json()
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }
        })
        .then(data => {
          if (data) {
            this.$refs.errorUsername.innerText = data.detail
          }
        })
        .catch(error => {
          throw error
        })
    },
    redirectToLogin() {
      router.push('/login')
    }
  }
}
</script>
