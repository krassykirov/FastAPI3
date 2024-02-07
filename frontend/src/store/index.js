import { createStore } from 'vuex'
import VueCookies from 'vue-cookies'
import { jwtDecode } from 'jwt-decode'
import router from '@/router'
import config from '@/config'
import axios from 'axios'

// const MINUTES_BEFORE_EXPIRATION_TO_LOGOUT = 5
/* global bootstrap */
export default createStore({
  state: {
    accessToken: VueCookies.get('access_token') || null,
    refreshToken: VueCookies.get('refresh_token') || null,
    accessTokenExpiration: null,
    refreshTokenExpiration: null,
    isIdle: false,
    lastActiveDate: null,
    inactiveTime: 0,
    user: null,
    user_id: null,
    profile: null,
    min: 1,
    max: 10000,
    total: 0,
    products: [],
    filteredProducts: [],
    isDiscountedChecked: false,
    categories: [],
    cart: [],
    favorites: [],
    sortOrder: 'asc',
    selectedCategories: [],
    selectedRating: [],
    ratings: [1, 2, 3, 4, 5],
    productMin: 0,
    productMax: 10000,
    errorMessage: null
  },
  mutations: {
    SET_PRODUCT(state, product) {
      state.product = product
    },
    SET_PRODUCTS(state, products) {
      state.products = products
    },
    SET_ERROR_MESSAGE(state, message) {
      state.errorMessage = message
    },
    UPDATE_PRODUCT_RATING(state, { productId, ratingData }) {
      const product = state.products.find(p => p.id === productId)
      if (product) {
        product.rating = ratingData.rating
        product.reviewNumber = ratingData.review_number
        product.rating_float = parseFloat(ratingData.rating_float).toFixed(2)
      }
    },
    UPDATE_CART_ITEM_RATING(state, { productId, ratingData }) {
      const cartItem = state.cart.find(item => item.id === productId)
      if (cartItem) {
        cartItem.rating = ratingData.rating
        cartItem.reviewNumber = ratingData.review_number
        cartItem.rating_float = parseFloat(ratingData.rating_float).toFixed(2)
      }
    },
    UPDATE_FAVORITES_ITEM_RATING(state, { productId, ratingData }) {
      const favoritesItem = state.favorites.find(item => item.id === productId)
      if (favoritesItem) {
        favoritesItem.rating = ratingData.rating
        favoritesItem.reviewNumber = ratingData.review_number
        favoritesItem.rating_float = parseFloat(
          ratingData.rating_float
        ).toFixed(2)
      }
    },
    UPDATE_SELECTED_CATEGORIES(state, selectedCategories) {
      state.selectedCategories = selectedCategories
    },
    SET_CATEGORIES(state, categories) {
      state.categories = categories
    },
    UPDATE_FAVORITES(state, items) {
      state.favorites = items
    },
    UPDATE_CART(state, items) {
      state.cart = items
    },
    UPDATE_TOTAL(state, total) {
      state.total = total
    },
    UPDATE_USER(state, user) {
      state.user = user
    },
    UPDATE_USER_ID(state, user_id) {
      state.user_id = user_id
    },
    UPDATE_PROFILE(state, profile) {
      state.profile = profile
    },
    UPDATE_PROFILES(state, profiles) {
      state.profiles = profiles
    },
    UPDATE_SELECTED_ITEM(state, itemId) {
      state.selectedItem = itemId
    },
    ADD_RATING(state, rating) {
      state.selectedRating.push(rating)
    },
    REMOVE_RATING(state, index) {
      state.selectedRating.splice(index, 1)
    },
    SET_MIN_PRICE(state, minPrice) {
      state.min = minPrice
    },
    SET_MAX_PRICE(state, maxPrice) {
      state.max = maxPrice
    },
    SET_RANGE_INPUT(state, { min, max }) {
      state.rangeInput = { min, max }
    },
    REMOVE_ITEM_FROM_CART(state, index) {
      state.cart.splice(index, 1)
    },
    REMOVE_ITEM_FROM_FAVORITES(state, index) {
      state.favorites.splice(index, 1)
    },
    ADD_TO_CART(state, product) {
      state.cart.push(product)
    },
    ADD_TO_FAVORITES(state, product) {
      state.favorites.push(product)
    },
    SET_FILTERED_PRODUCTS(state, filteredProducts) {
      state.filteredProducts = filteredProducts
    },
    updateCartItemQuantity(state, { product_id, newQuantity }) {
      const product = state.cart.find(item => item.id === product_id)
      if (product) {
        product.quantity = newQuantity
      }
    },
    TOGGLE_SORT_ORDER(state) {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc'
    },
    SORT_PRODUCTS(state) {
      if (state.sortOrder === 'asc') {
        state.products.sort((a, b) => a.price - b.price)
      } else {
        state.products.sort((a, b) => b.price - a.price)
      }
    },
    setAccessToken(state, accessToken) {
      state.accessToken = accessToken
      const expires_in = jwtDecode(accessToken).exp
      const expiresInMinutes = Math.max(
        0,
        Math.floor((expires_in - Math.floor(Date.now() / 1000)) / 60)
      )
      state.accessTokenExpiration = expiresInMinutes
    },
    // setIsIdle(state, value) {
    //   state.isIdle = value
    // },
    // setLastActiveDate(state, value) {
    //   state.lastActiveDate = value
    // },
    // setInactiveTime(state, value) {
    //   state.inactiveTime = value
    // },
    setRefreshToken(state, refreshToken) {
      state.refreshToken = refreshToken
      const expires_in = jwtDecode(refreshToken).exp
      const expiresInMinutes = Math.max(
        0,
        Math.floor((expires_in - Math.floor(Date.now() / 1000)) / 60)
      )
      state.refreshTokenExpiration = expiresInMinutes
    },
    removeAccessToken(state) {
      this.lastActiveDate = new Date()
      this.inactiveTime = 0
      VueCookies.remove('access_token')
      VueCookies.remove('refresh_token')
      state.accessToken = null
      state.refreshToken = null
      state.accessTokenExpiration = null
      state.refreshTokenExpiration = null
      router.push('/login')
    },
    SET_SELECTED_RATING(state, value) {
      state.selectedRating = value
    },
    UPDATE_DISCOUNT_CHECKED(state, isChecked) {
      state.isDiscountedChecked = isChecked
    }
  },
  actions: {
    setErrorMessage({ commit }, message) {
      commit('SET_ERROR_MESSAGE', message)
    },
    logout({ commit }) {
      commit('removeAccessToken')
    },
    // updateIdleStatus({ commit }, { isIdle, lastActiveDate, inactiveTime }) {
    //   commit('setIsIdle', isIdle)
    //   commit('setLastActiveDate', lastActiveDate)
    //   commit('setInactiveTime', inactiveTime)
    // },
    async refreshAccessToken({ commit, dispatch, state }) {
      try {
        const response = await axios.post(
          `${config.backendEndpoint}/api/token/refresh`,
          {
            refresh_token: state.refreshToken
          }
        )
        if (response.status !== 200) {
          dispatch('setErrorMessage', 'Session has expired. Please log in')
          dispatch('logout')
          throw new Error('Token Expired')
        }
        const data = response.data
        const expires_in = jwtDecode(data.access_token).exp
        const expiresInMinutes = Math.max(
          0,
          Math.floor((expires_in - Math.floor(Date.now() / 1000)) / 60)
        )
        VueCookies.set('access_token', data.access_token, {
          expires: new Date(Date.now() + expiresInMinutes),
          httponly: true,
          samesite: 'Lax'
          //secure: true
        })
        commit('setAccessToken', data.access_token)
        // dispatch('startExpirationCheckTimer')
        return data.access_token
      } catch (error) {
        dispatch('setErrorMessage', 'Session has expired. Please log in')
        dispatch('logout')
      }
    },
    async login({ commit, dispatch }, { username, password, rememberMe }) {
      const formData = new URLSearchParams()
      formData.append('grant_type', '')
      formData.append('username', username)
      formData.append('password', password)
      formData.append('scope', '')
      formData.append('client_id', '')
      formData.append('client_secret', '')
      formData.append('rememberMe', rememberMe ? 'true' : 'false')

      try {
        const response = await fetch(`${config.backendEndpoint}/api/token`, {
          method: 'POST',
          body: formData
        })

        if (response.status === 403) {
          const data = await response.json()
          commit('setErrorMessage', 'Forbidden!')
          throw new Error(data.detail)
        }

        const data = await response.json()
        const expires_in = jwtDecode(data.access_token).exp
        const user = jwtDecode(data.access_token).user
        const user_id = jwtDecode(data.access_token).user_id
        commit('UPDATE_USER', user)
        commit('UPDATE_USER_ID', user_id)
        this.lastActiveDate = new Date()
        this.inactiveTime = 0
        console.log(
          'lastActiveDate, inactiveTime',
          this.lastActiveDate,
          this.inactiveTime
        )
        const expiresInMinutes = Math.max(
          0,
          Math.floor((expires_in - Math.floor(Date.now() / 1000)) / 60)
        )

        VueCookies.set('access_token', data.access_token, {
          expires: new Date(Date.now() + expiresInMinutes * 60 * 1000)
        })
        const refresh_token_expires_in = jwtDecode(data.refresh_token).exp
        const expiresInMinutesrefreshToken = Math.max(
          0,
          Math.floor(
            (refresh_token_expires_in - Math.floor(Date.now() / 1000)) / 60
          )
        )
        console.log(
          'RefreshToken, AccessToken expires in minutes',
          expiresInMinutesrefreshToken,
          expiresInMinutes
        )
        VueCookies.set('refresh_token', data.refresh_token, {
          expires: new Date(
            Date.now() + expiresInMinutesrefreshToken * 60 * 1000
          )
        })
        commit('setAccessToken', data.access_token)
        commit('setRefreshToken', data.refresh_token)
        await dispatch('getProfile')
        router.push('/')
      } catch (error) {
        throw new Error(error)
      }
    },
    async initializeUser({ commit, dispatch, state }) {
      try {
        if (
          state.accessToken === null &&
          VueCookies.get('access_token') === null
        ) {
          router.push('/login')
        } else {
          const decoded = jwtDecode(state.accessToken)
          if (Date.now() >= decoded.exp * 1000 && state.refreshToken) {
            try {
              const response = await fetch(
                `${config.backendEndpoint}/api/token/refresh`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.refreshToken}`
                  },
                  body: JSON.stringify({
                    refresh_token: state.refreshToken
                  })
                }
              )
              if (!response.ok) {
                console.log('!response.ok Init User', response)
                dispatch(
                  'setErrorMessage',
                  'Session has expired. Please log in'
                )
                dispatch('logout')
                throw new Error('Token Expired')
              }
              const data = await response.json()
              const expires_in = jwtDecode(data.access_token).exp
              const expiresInMinutes = Math.max(
                0,
                Math.floor((expires_in - Math.floor(Date.now() / 1000)) / 60)
              )
              VueCookies.set('access_token', data.access_token, {
                expires: new Date(Date.now() + expiresInMinutes)
              })
              const user = jwtDecode(data.access_token).user
              const user_id = jwtDecode(data.access_token).user_id
              commit('setAccessToken', data.access_token)
              commit('UPDATE_USER', user)
              commit('UPDATE_USER_ID', user_id)
              router.push('/')
            } catch (refreshError) {
              console.log('refreshError: ', refreshError)
              dispatch('setErrorMessage', 'Session has expired. Please log in')
              dispatch('logout')
              throw new Error('Token Expired')
            }
          }
        }
      } catch (error) {
        router.push('/login')
        throw error
      }
    },
    async getProduct({ commit }, itemId) {
      try {
        const response = await axios.get(
          `${config.backendEndpoint}/api/items/item/${itemId}`
        )
        if (response.status === 200) {
          const item = response.data
          commit('SET_PRODUCT', item)
        } else if (response.status === 404) {
          throw new Error(`Item with ID ${itemId} not found`)
        } else {
          console.error('Error fetching product:', response)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    },
    async getProducts({ commit }) {
      try {
        const response = await axios.get(`${config.backendEndpoint}/api/items`)
        const products = response.data
        commit('SET_PRODUCTS', products)
        const maxPrice = Math.max(...products.map(product => product.price))
        const minPrice = Math.min(...products.map(product => product.price))
        commit('SET_MIN_PRICE', minPrice)
        commit('SET_MAX_PRICE', maxPrice)
      } catch (error) {
        console.error('Error fetching products:', error)
        // Re-throw the error for the component to handle if needed
        throw error
      }
    },
    async getProfiles({ commit, state }) {
      try {
        const response = await axios.get(
          `${config.backendEndpoint}/api/profile`,
          {
            headers: {
              Authorization: `Bearer ${state.accessToken}`,
              Accept: 'application/json'
            }
          }
        )
        if (response.status !== 200) {
          commit('UPDATE_PROFILES', null)
        } else {
          const data = response.data
          this.profiles = data
          commit('UPDATE_PROFILES', data)
        }
      } catch (error) {
        commit('UPDATE_PROFILES', null)
      }
    },
    async getProfile({ commit, state }) {
      // if (!state.user_id) {
      //   console.log('state.user_id??', state.user_id)
      //   return
      // }
      try {
        const response = await axios.get(
          `${config.backendEndpoint}/api/profile/${state.user_id}`
        )
        if (response.status === 200) {
          // Profile retrieved successfully
          commit('UPDATE_PROFILE', response.data)
        } else {
          commit('UPDATE_PROFILE', null)
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log('Profile 401 trying to handle:', error.response)
          // dispatch('setErrorMessage', 'Session has expired. Please log in')
          // dispatch('logout')
          // commit('UPDATE_PROFILE', null)
          throw error
        } else {
          console.log('Profile Other error occured trying to handle', error)
          throw error
          // dispatch('setErrorMessage', 'Session has expired. Please log in')
          // dispatch('logout')
          // commit('UPDATE_PROFILE', null)
        }
      }
    },
    async fetchCategories({ commit }) {
      try {
        const response = await axios.get(
          `${config.backendEndpoint}/api/categories/category_items_len/`
        )
        const categories = await response.data
        commit('SET_CATEGORIES', categories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },
    async getItemRating({ commit }, itemId) {
      try {
        const response = await axios.get(
          `${config.backendEndpoint}/api/reviews/item/rating?id=${itemId}`
        )
        const data = await response.data
        commit('UPDATE_PRODUCT_RATING', { productId: itemId, ratingData: data })
        commit('UPDATE_CART_ITEM_RATING', {
          productId: itemId,
          ratingData: data
        })
        commit('UPDATE_FAVORITES_ITEM_RATING', {
          productId: itemId,
          ratingData: data
        })
      } catch (error) {
        console.log(error)
      }
    },
    async getItemRatings({ commit, state }) {
      try {
        // Collect an array of promises for each API call
        const ratingPromises = state.products.map(async product => {
          const response = await axios.get(
            `${config.backendEndpoint}/api/reviews/item/rating?id=${product.id}`
          )
          const ratingData = response.data

          // Use Promise.resolve to keep the promise chain intact
          return Promise.resolve({
            productId: product.id,
            ratingData: ratingData
          })
        })

        // Wait for all promises to resolve
        const ratings = await Promise.all(ratingPromises)

        // Update the state or commit mutations as needed
        ratings.forEach(rating => {
          commit('UPDATE_PRODUCT_RATING', rating)
          commit('UPDATE_CART_ITEM_RATING', rating)
          commit('UPDATE_FAVORITES_ITEM_RATING', rating)
        })
      } catch (error) {
        console.log(error)
      }
    },
    async handleCategoryChange({ commit, dispatch }) {
      const selectedCategories = await dispatch('getSelectedCategories')
      commit('UPDATE_SELECTED_CATEGORIES', selectedCategories)
    },
    async getSelectedCategories() {
      return new Promise(resolve => {
        var selectedCategories = []
        var checkboxes = document.querySelectorAll('.cat-checkbox:checked')
        checkboxes.forEach(checkbox => {
          var categoryId = checkbox.getAttribute('data-category')
          selectedCategories.push(categoryId)
        })
        resolve(selectedCategories)
      })
    },
    toggleSortOrder({ commit }) {
      commit('TOGGLE_SORT_ORDER')
      commit('SORT_PRODUCTS')
    },
    async readFromCartVue({ commit }) {
      try {
        const response = await axios.get(
          `${config.backendEndpoint}/api/items/user-items-in-cart`
        )
        const data = response.data
        commit('UPDATE_CART', data.items)
        commit('UPDATE_FAVORITES', data.items_liked)
        commit('UPDATE_TOTAL', data.total)
        commit('UPDATE_USER', data.user)
        commit('UPDATE_USER_ID', data.user_id)
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log(
            'Handling error in readFromCartVue.response.status === 401...'
          )
          // dispatch('setErrorMessage', 'Session has expired. Please log in')
          // dispatch('logout')
        } else {
          // Handle other errors if needed
          console.error('Error in readFromCartVue:', error)
          // dispatch('setErrorMessage', 'Session has expired. Please log in')
          // dispatch('logout')
          // dispatch('logout')
        }
      }
    },
    redirectToItem({ commit }, itemId) {
      commit('UPDATE_SELECTED_ITEM', itemId)
      router.push({ name: 'Item', params: { itemId } })
    },
    handleRatingChange({ commit, state }, rating) {
      const index = state.selectedRating.indexOf(rating)
      if (index === -1) {
        commit('ADD_RATING', rating)
      } else {
        commit('REMOVE_RATING', index)
      }
    },
    updateInputs({ commit, state }) {
      let minVal = parseInt(document.querySelector('.min-range').value)
      let maxVal = parseInt(document.querySelector('.max-range').value)

      if (minVal >= maxVal) {
        minVal = maxVal
      } else if (maxVal <= minVal) {
        maxVal = minVal
      }
      if (minVal >= state.max - 200) {
        minVal = Math.ceil(state.productMin)
      }
      if (maxVal <= state.min + 200) {
        maxVal = Math.ceil(state.productMax)
      }
      const rangeInput = document.querySelector('.min-range')
      const rangeInputMax = document.querySelector('.max-range')
      if (rangeInput) {
        rangeInput.value = Math.ceil(minVal)
      }
      if (rangeInputMax) {
        rangeInputMax.value = Math.ceil(maxVal)
      }
      commit('SET_MIN_PRICE', minVal)
      commit('SET_MAX_PRICE', maxVal)
      commit('SET_RANGE_INPUT', { min: minVal, max: maxVal })
    },
    updateProductRange() {
      const prices = this.state.products.map(product => product.price)
      this.state.productMin = Math.ceil(Math.min(...prices))
      this.state.productMax = Math.ceil(Math.max(...prices))
    },
    Search() {
      var input, filter, cards, cardContainer, title, i
      input = document.getElementById('filter')
      filter = input.value.toUpperCase()
      cardContainer = document.getElementById('mycard')
      cards = cardContainer.getElementsByClassName('card')
      for (i = 0; i < cards.length; i++) {
        title = cards[i].querySelector('.card-body h6.card-title')
        if (title.innerText.toUpperCase().indexOf(filter) > -1) {
          cards[i].style.display = ''
        } else {
          cards[i].style.display = 'none'
        }
      }
    },
    scrollToTop() {
      document.body.scrollIntoView({ behavior: 'smooth' })
    },
    addToCart({ commit, state }, product) {
      const headers = new Headers({
        Authorization: `Bearer ${state.accessToken}`,
        Accept: 'application/json'
      })
      const requestOptions = {
        method: 'POST',
        headers: headers,
        redirect: 'follow',
        body: JSON.stringify({
          item_id: product.id
        })
      }
      const itemInCart = state.cart.find(item => item.id === product.id)
      const toastContent = itemInCart
        ? `${product.name} is already in the cart`
        : `${product.name} was added to the cart`

      const toastElement = new bootstrap.Toast(
        document.getElementById('cartToast'),
        {
          delay: 2000
        }
      )
      const toastBodyElement = document.getElementById('cartToastBody')
      toastBodyElement.innerText = toastContent
      toastElement.show()
      if (!itemInCart) {
        fetch(
          `${config.backendEndpoint}/api/items/update-basket`,
          requestOptions
        )
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`)
            }
            return response.json()
          })
          .then(() => {
            commit('ADD_TO_CART', product)
          })
          .catch(error => {
            console.error('error', error)
          })
      }
    },
    async addTofavorites({ commit, state }, product) {
      const headers = new Headers({
        Authorization: `Bearer ${state.accessToken}`,
        Accept: 'application/json'
      })

      const requestOptions = {
        method: 'POST',
        headers: headers,
        redirect: 'follow',
        body: JSON.stringify({
          item_id: product.id
        })
      }

      const itemInfavorites = state.favorites.find(
        item => item.id === product.id
      )

      const toastContent = itemInfavorites
        ? `${product.name} was removed from Favorites `
        : `${product.name} was addedd in Favorites`

      const toastElement = new bootstrap.Toast(
        document.getElementById('cartToast'),
        {
          delay: 2000
        }
      )

      const toastBodyElement = document.getElementById('cartToastBody')
      toastBodyElement.innerText = toastContent
      toastElement.show()

      try {
        if (itemInfavorites) {
          const response = await fetch(
            `${config.backendEndpoint}/api/items/remove-from-favorites`,
            requestOptions
          )

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }

          const index = state.favorites.findIndex(
            item => item.id === product.id
          )

          if (index !== -1) {
            commit('REMOVE_ITEM_FROM_FAVORITES', index)
            const element = document.getElementById(`heart${product.id}`)
            element.classList.remove('red-color')
          }
        } else {
          const response = await fetch(
            `${config.backendEndpoint}/api/items/update-favorites`,
            requestOptions
          )

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }

          commit('ADD_TO_FAVORITES', product)

          const element = document.getElementById(`heart${product.id}`)
          element.classList.add('red-color')
        }
      } catch (error) {
        console.error('Error:', error)
      }
    },
    async checkFavoritesOnLoad({ state }) {
      const products = state.products
      const favorites = state.favorites
      for (const product of products) {
        const isFavorite = favorites.some(fav => fav.id === product.id)
        const element = document.getElementById(`heart${product.id}`)
        if (isFavorite) {
          element.classList.add('red-color')
        } else {
          element.classList.remove('red-color')
        }
      }
    },
    UpdateItemQuantity({ commit, state }, { product_id, newQuantity }) {
      newQuantity = Math.max(1, Math.min(5, newQuantity))
      const headers = new Headers({
        Authorization: `Bearer ${state.accessToken}`,
        Accept: 'application/json'
      })
      const requestOptions = {
        method: 'PUT',
        headers: headers,
        redirect: 'follow',
        body: JSON.stringify({
          quantity: newQuantity
        })
      }
      const itemInCart = state.cart.find(item => item.id === product_id)
      if (itemInCart) {
        fetch(
          `${config.backendEndpoint}/api/items/update_item/${product_id}`,
          requestOptions
        )
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`)
            }
            return response.json()
          })
          .then(() => {
            commit('updateCartItemQuantity', { product_id, newQuantity })
          })
          .catch(error => {
            console.error('error', error)
          })
      }
    },
    removeFromFavorites({ commit, state }, itemId) {
      const headers = new Headers({
        Authorization: `Bearer ${state.accessToken}`,
        Accept: 'application/json'
      })
      const requestOptions = {
        method: 'POST',
        headers: headers,
        redirect: 'follow',
        body: JSON.stringify({
          item_id: itemId
        })
      }
      fetch(
        `${config.backendEndpoint}/api/items/remove-from-favorites`,
        requestOptions
      )
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }
          return response.json()
        })
        .then(() => {
          const index = state.favorites.findIndex(item => item.id === itemId)
          if (index !== -1) {
            commit('REMOVE_ITEM_FROM_FAVORITES', index)
            const element = document.getElementById(`heart${itemId}`)
            element.classList.remove('red-color')
          }
        })
        .catch(error => {
          console.error('Error removing item from cart:', error)
        })
    },
    removeFromCart({ commit, state }, itemId) {
      const headers = new Headers({
        Authorization: `Bearer ${state.accessToken}`,
        Accept: 'application/json'
      })
      const requestOptions = {
        method: 'POST',
        headers: headers,
        redirect: 'follow',
        body: JSON.stringify({
          item_id: itemId
        })
      }

      fetch(`${config.backendEndpoint}/user/remove-from-basket`, requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }
          return response.json()
        })
        .then(() => {
          const index = state.cart.findIndex(item => item.id === itemId)
          if (index !== -1) {
            commit('REMOVE_ITEM_FROM_CART', index)
          }
        })
        .catch(error => {
          console.error('Error removing item from cart:', error)
        })
    },
    handleDiscountChange({ commit }, isChecked) {
      commit('UPDATE_DISCOUNT_CHECKED', isChecked)
    }
  },
  getters: {
    discountedProducts: state => {
      return state.products.filter(product => product.isDiscounted)
    },
    total: state => {
      return (state.cart || [])
        .reduce((total, item) => total + Number(item.price * item.quantity), 0)
        .toFixed(2)
    },
    filteredProducts: state => {
      return state.products.filter(item => {
        const priceCondition =
          item.price >= state.min && item.price <= state.max
        const categoryCondition =
          state.selectedCategories.length === 0 ||
          state.selectedCategories.includes(String(item.category_id))
        const ratingCondition =
          state.selectedRating.length === 0 ||
          state.selectedRating.includes(Math.round(item.rating_float))
        const discountCondition =
          !state.isDiscountedChecked || item.discount != null
        return (
          priceCondition &&
          categoryCondition &&
          ratingCondition &&
          discountCondition
        )
      })
    },
    accessToken: state => state.accessToken,
    user: state => state.user,
    user_id: state => state.user_id,
    profile: state => state.profile,
    profiles: state => state.profiles,
    products: state => state.products,
    cart: state => state.cart,
    favorites: state => state.favorites,
    min: state => state.min,
    max: state => state.max,
    categories: state => state.categories,
    sortOrder: state => state.sortOrder,
    selectedCategories: state => state.selectedCategories,
    selectedRating: state => state.selectedRating,
    ratings: state => state.ratings,
    productMin: state => state.productMin,
    productMax: state => state.productMax,
    isIdle: state => state.isIdle,
    lastActiveDate: state => state.lastActiveDate,
    inactiveTime: state => state.inactiveTime
  }
})
