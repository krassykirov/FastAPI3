import { createStore } from 'vuex'
import VueCookies from 'vue-cookies'
import { jwtDecode } from 'jwt-decode'
import router from '@/router'
import config from '@/config'
import axios from 'axios'
// import ratingCache from '@/cache'

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
    itemRatingsFetched: false,
    user: null,
    user_id: null,
    profile: null,
    min: 1,
    max: 10000,
    productMin: 0,
    productMax: 10000,
    total: 0,
    message: '',
    errorMessage: '',
    products: [],
    filteredProducts: [],
    searchResults: [],
    hasFilteredProducts: false,
    isDiscountedChecked: false,
    categories: [],
    cart: [],
    favorites: [],
    sortOrder: 'asc',
    selectedCategories: [],
    selectedBrands: [],
    selectedRating: [],
    selectedPriceRanges: [],
    productCounts: {
      range1: 0,
      range2: 0,
      range3: 0,
      range4: 0
    },
    ratings: [1, 2, 3, 4, 5]
  },
  mutations: {
    setMessage(state, payload) {
      state.message = payload
    },
    SET_SEARCH_RESULTS(state, results) {
      state.searchResults = results
    },
    SET_PRODUCT(state, product) {
      state.product = product
    },
    SET_PRODUCTS(state, products) {
      state.products = products
    },
    SET_ERROR_MESSAGE(state, message) {
      state.errorMessage = message
    },
    SET_SELECTED_BRANDS(state, selectedBrands) {
      state.selectedBrands = selectedBrands
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
    UPDATE_SELECTED_PRICE_RANGES(state, selectedPriceRanges) {
      state.selectedPriceRanges = selectedPriceRanges
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
    ADD_TO_CART(state, product) {
      state.cart.push(product)
    },
    REMOVE_ITEM_FROM_CART(state, index) {
      state.cart.splice(index, 1)
    },
    REMOVE_ITEM_FROM_FAVORITES(state, index) {
      state.favorites.splice(index, 1)
    },
    ADD_TO_FAVORITES(state, product) {
      state.favorites.push(product)
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
      state.profile = null
      state.cart = []
      state.favorites = []
      router.push('/login')
    },
    SET_SELECTED_RATING(state, value) {
      state.selectedRating = value
    },
    UPDATE_DISCOUNT_CHECKED(state, isChecked) {
      state.isDiscountedChecked = isChecked
    },
    UPDATE_ITEM_RATING(state, { index, rating }) {
      state.products[index].rating = rating.rating
      state.products[index].review_number = rating.review_number
      state.products[index].rating_float = rating.rating_float
    }
  },
  actions: {
    async handlePriceRangeChange({ commit, dispatch }) {
      const selectedPriceRanges = await dispatch('getSelectedPriceRanges')
      commit('UPDATE_SELECTED_PRICE_RANGES', selectedPriceRanges)
    },
    async getSelectedPriceRanges() {
      return new Promise(resolve => {
        const selectedPriceRanges = []
        const checkboxes = document.querySelectorAll('.price-checkbox:checked')
        checkboxes.forEach(checkbox => {
          const priceRange = checkbox.getAttribute('price-range')
          selectedPriceRanges.push(priceRange)
        })
        resolve(selectedPriceRanges)
      })
    },
    formattedPrice() {
      const price = this.product.discount_price
      const [integerPart, decimalPart] = price.toString().split('.')
      return {
        integerPart: parseInt(integerPart).toLocaleString(),
        decimalPart: decimalPart || '00'
      }
    },
    updateItemRating({ commit, state }, { itemId, rating }) {
      const itemIndex = state.products.findIndex(item => item.id === itemId)
      if (itemIndex !== -1) {
        commit('UPDATE_ITEM_RATING', { index: itemIndex, rating })
      }
    },
    updateMessage({ commit }, message) {
      commit('setMessage', message)
    },
    setErrorMessage({ commit }, message) {
      commit('SET_ERROR_MESSAGE', message)
    },
    logout({ commit }) {
      commit('removeAccessToken')
    },
    inactiveLogout({ state, dispatch }) {
      dispatch('setErrorMessage', "You've been logged out due to inactivity")
      // console.log('Youve been logged out due to inactivity')
      this.lastActiveDate = new Date()
      this.inactiveTime = 0
      VueCookies.remove('access_token')
      VueCookies.remove('refresh_token')
      state.accessToken = null
      state.refreshToken = null
      state.accessTokenExpiration = null
      state.refreshTokenExpiration = null
      state.profile = null
      state.cart = []
      state.favorites = []
      router.push('/login')
    },
    async refreshAccessToken({ commit, dispatch, state }) {
      // console.log('Refreshing token..')
      try {
        const response = await axios.post(
          `${config.backendEndpoint}/api/token/refresh`,
          {
            refresh_token: state.refreshToken
          }
        )
        if (response.status !== 200) {
          // console.log('response.status !== 200', response)
          dispatch('setErrorMessage', 'Session has expired. Please log in')
          dispatch('logout')
          throw new Error('Token has expired')
        }
        const data = response.data
        const expires_in = jwtDecode(data.access_token).exp
        const user = jwtDecode(data.access_token).sub
        const user_id = jwtDecode(data.access_token).user_id
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
        commit('UPDATE_USER', user)
        commit('UPDATE_USER_ID', user_id)
        // dispatch('startExpirationCheckTimer')
        return data.access_token
      } catch (error) {
        dispatch('setErrorMessage', 'Session has expired. Please log in')
        dispatch('logout')
        throw new Error('Token has expired')
      }
    },
    async login({ commit }, { username, password, rememberMe }) {
      const formData = new URLSearchParams()
      formData.append('grant_type', '')
      formData.append('username', username)
      formData.append('password', password)
      formData.append('scope', '')
      formData.append('client_id', '')
      formData.append('client_secret', '')
      formData.append('rememberMe', rememberMe ? 'true' : 'false')

      try {
        const response = await axios.post(
          `${config.backendEndpoint}/api/token`,
          formData
        )
        const data = response.data
        const expires_in = jwtDecode(data.access_token).exp
        const user = jwtDecode(data.access_token).sub
        const user_id = jwtDecode(data.access_token).user_id
        this.lastActiveDate = new Date()
        this.inactiveTime = 0
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
        VueCookies.set('refresh_token', data.refresh_token, {
          expires: new Date(
            Date.now() + expiresInMinutesrefreshToken * 60 * 1000
          )
        })
        commit('UPDATE_USER', user)
        commit('UPDATE_USER_ID', user_id)
        commit('setAccessToken', data.access_token)
        commit('setRefreshToken', data.refresh_token)
        router.push('/')
      } catch (error) {
        // catch: Cannot read properties of undefined (reading 'data') if no response.data
        if (error.message.startsWith('Cannot read')) {
          return
        }
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
    async getProducts({ commit, state }) {
      if (state.products.length === 0) {
        try {
          const response = await axios.get(
            `${config.backendEndpoint}/api/items`
          )
          const products = response.data
          commit('SET_PRODUCTS', products.items)
          commit('UPDATE_CART', products.items_in_cart)
          commit('UPDATE_FAVORITES', products.items_liked)
          commit('UPDATE_TOTAL', products.total)
          const maxPrice = Math.max(
            ...products.items.map(product => product.price)
          )
          const minPrice = Math.min(
            ...products.items.map(product => product.price)
          )
          commit('SET_MIN_PRICE', minPrice)
          commit('SET_MAX_PRICE', maxPrice)
          commit('setMessage', `Found ${products.length} products`)
        } catch (error) {
          if (error.response.data.detail === 'Not authorized') {
            throw new Error('Token Expired')
          }
        }
      }
    },
    async getProfiles({ commit, dispatch }) {
      try {
        const response = await axios.get(
          `${config.backendEndpoint}/api/profile`
        )
        if (response.status !== 200) {
          commit('UPDATE_PROFILES', null)
        } else {
          const data = response.data
          this.profiles = data
          commit('UPDATE_PROFILES', data)
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // console.log('Profile 401 trying to handle:', error.response)
        } else if (error === 'Token Expired') {
          dispatch('setErrorMessage', 'Session has expired. Please log in')
        } else if (error.response.data.detail === 'No profiles found') {
          // console.log(
          //   'Unexpected Profile error occured trying to handle: No profiles found',
          //   error
          // )
        }
      }
    },
    async getProfile({ commit, dispatch, state }) {
      if (!state.user_id || !state.accessToken) {
        const accessToken = VueCookies.get('access_token')
        if (accessToken) {
          const user = jwtDecode(accessToken).sub
          const user_id = jwtDecode(accessToken).user_id
          commit('UPDATE_USER', user)
          commit('UPDATE_USER_ID', user_id)
        } else {
          router.push('/login')
        }
      }
      try {
        const response = await axios.get(
          `${config.backendEndpoint}/api/profile/${state.user_id}`
        )
        if (response.status === 200) {
          commit('UPDATE_PROFILE', response.data)
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // console.log('Profile 401 trying to handle:', error.response)
        } else if (error.response && error.response.status === 404) {
          commit('UPDATE_PROFILE', null)
        } else if (error === 'Token Expired') {
          // console.log('Profile Other error occured trying to handle', error)
          dispatch('logout')
        } else {
          // console.log(
          //   'Unexpected Profile error occured trying to handle',
          //   error
          // )
          // throw new Error(error)
          // router.push('/login')
          // throw new Error('Token Expired')
        }
      }
    },
    async getSelectedBrands() {
      return new Promise(resolve => {
        const selectedBrands = []
        const checkboxes = document.querySelectorAll('.brand-checkbox:checked')
        checkboxes.forEach(checkbox => {
          const brand = checkbox.getAttribute('data-brand')
          selectedBrands.push(brand)
        })
        resolve(selectedBrands)
      })
    },
    handleBrandChange({ commit }) {
      this.$store.dispatch('getSelectedBrands').then(selectedBrands => {
        commit('SET_SELECTED_BRANDS', selectedBrands)
      })
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
        minVal = Math.floor(state.productMin)
      }
      if (maxVal <= state.min + 200) {
        maxVal = Math.ceil(state.productMax)
      }
      const rangeInput = document.querySelector('.min-range')
      const rangeInputMax = document.querySelector('.max-range')
      if (rangeInput) {
        rangeInput.value = Math.floor(minVal)
      }
      if (rangeInputMax) {
        rangeInputMax.value = Math.ceil(maxVal)
      }
      commit('SET_MIN_PRICE', minVal)
      commit('SET_MAX_PRICE', maxVal)
      // commit('SET_RANGE_INPUT', { min: minVal, max: maxVal })
    },
    updateHomeProductRange({ state, commit }) {
      const prices = this.state.products.map(product => product.price)
      state.productMin = Math.floor(Math.min(...prices))
      state.productMax = Math.ceil(Math.max(...prices))
      commit('SET_MIN_PRICE', state.productMin)
      commit('SET_MAX_PRICE', state.productMax)
    },
    updateProductRange({ state, commit }, cat) {
      const categoryId = state.categories.find(
        category => category[0] === cat
      )[2]
      const categoryProducts = state.products.filter(
        product => product.category_id === categoryId
      )
      const prices = categoryProducts.map(product => product.price)
      this.state.productMin = Math.floor(Math.min(...prices))
      this.state.productMax = Math.ceil(Math.max(...prices))
      commit('SET_MIN_PRICE', state.productMin)
      commit('SET_MAX_PRICE', state.productMax)
      commit('SET_RANGE_INPUT', {
        min: state.productMin,
        max: state.productMax
      })
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
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      })
    },
    async addToCart({ commit, state }, product) {
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
        try {
          const response = await axios.post(
            `${config.backendEndpoint}/api/items/update-basket`,
            {
              item_id: product.id
            }
          )

          if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }

          commit('ADD_TO_CART', product)
        } catch (error) {
          console.error('Error adding item to cart:', error)
          throw new Error(error)
        }
      }
    },
    async addTofavorites({ commit, state }, product) {
      const itemInfavorites = state.favorites.find(
        item => item.id === product.id
      )

      const toastContent = itemInfavorites
        ? `${product.name} has been removed from Favorites `
        : `${product.name} has been added to Favorites`

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
          const response = await axios.post(
            `${config.backendEndpoint}/api/items/remove-from-favorites`,
            { item_id: product.id }
          )

          if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }

          const index = state.favorites.findIndex(
            item => item.id === product.id
          )

          if (index !== -1) {
            commit('REMOVE_ITEM_FROM_FAVORITES', index)
            const element = document.getElementById(`heart${product.id}`)
            if (element) {
              element.classList.remove('red-color')
            }
          }
        } else {
          const response = await axios.post(
            `${config.backendEndpoint}/api/items/update-favorites`,
            { item_id: product.id }
          )

          if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }

          commit('ADD_TO_FAVORITES', product)

          const element = document.getElementById(`heart${product.id}`)
          if (element) {
            element.classList.add('red-color')
          }
        }
      } catch (error) {
        console.error('Error:', error)
        throw new Error(error)
      }
    },
    async checkFavoritesOnLoad({ state }) {
      const products = state.products
      const favorites = state.favorites
      for (const product of products) {
        const isFavorite = favorites.some(fav => fav.id === product.id)
        if (isFavorite) {
          const element = document.getElementById(`heart${product.id}`)
          if (element) {
            element.classList.add('red-color')
          }
        } else {
          const element = document.getElementById(`heart${product.id}`)
          if (element) {
            element.classList.remove('red-color')
          }
        }
      }
    },
    async UpdateItemQuantity({ commit, state }, { product_id, newQuantity }) {
      newQuantity = Math.max(1, Math.min(5, newQuantity))
      const itemInCart = state.cart.find(item => item.id === product_id)
      if (itemInCart) {
        try {
          const response = await axios.put(
            `${config.backendEndpoint}/api/items/update_item/${product_id}`,
            { quantity: newQuantity }
          )
          if (response && response.status && response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }
          commit('updateCartItemQuantity', { product_id, newQuantity })
        } catch (error) {
          // console.error('Error:', error)
          throw new Error(error)
        }
      }
    },
    async removeFromFavorites({ commit, state }, itemId) {
      try {
        const response = await axios.post(
          `${config.backendEndpoint}/api/items/remove-from-favorites`,
          {
            item_id: itemId
          }
        )
        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const index = state.favorites.findIndex(item => item.id === itemId)
        if (index !== -1) {
          commit('REMOVE_ITEM_FROM_FAVORITES', index)
          const element = document.getElementById(`heart${itemId}`)
          if (element) {
            element.classList.remove('red-color')
          }
        }
      } catch (error) {
        // console.error('Error removing item from favorites:', error)
        throw new Error(error)
      }
    },
    async removeFromCart({ commit, state }, itemId) {
      try {
        const response = await axios.post(
          `${config.backendEndpoint}/user/remove-from-basket`,
          {
            item_id: itemId
          }
        )
        if (response && response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const index = state.cart.findIndex(item => item.id === itemId)
        if (index !== -1) {
          commit('REMOVE_ITEM_FROM_CART', index)
        }
      } catch (error) {
        // console.error('Error removing item from cart:', error)
        throw new Error(error)
      }
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
          state.selectedPriceRanges.length === 0 ||
          state.selectedPriceRanges.some(range => {
            switch (range) {
              case 'range1':
                return item.price <= 500
              case 'range2':
                return item.price > 500 && item.price <= 1000
              case 'range3':
                return item.price > 1000 && item.price <= 2000
              case 'range4':
                return item.price > 2000 && item.price <= 10000
              default:
                return false
            }
          })
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
    filteredProductsByCategory: state => categoryName => {
      const categoryId = state.categories.find(
        category => category[0] === categoryName
      )[2]
      if (!categoryId) {
        return [] // Return empty array if category name is not found
      }
      return state.products.filter(item => {
        const priceCondition =
          item.price >= state.min &&
          item.price <= state.max &&
          item.category_id === parseInt(categoryId)
        const ratingCondition =
          state.selectedRating.length === 0 ||
          state.selectedRating.includes(Math.round(item.rating_float))
        const discountCondition =
          !state.isDiscountedChecked || item.discount != null
        const brandCondition =
          state.selectedBrands.length === 0 ||
          state.selectedBrands.includes(item.brand)
        return (
          priceCondition &&
          ratingCondition &&
          discountCondition &&
          brandCondition
        )
      })
    },
    accessToken: state => state.accessToken,
    user: state => state.user,
    user_id: state => state.user_id,
    profile: state => state.profile,
    profiles: state => state.profiles,
    products: state => state.products,
    category: state => state.category,
    cart: state => state.cart,
    favorites: state => state.favorites,
    searchResults: state => state.searchResults,
    min: state => state.min,
    max: state => state.max,
    categories: state => state.categories,
    sortOrder: state => state.sortOrder,
    selectedCategories: state => state.selectedCategories,
    selectedBrands: state => state.selectedBrands,
    selectedRating: state => state.selectedRating,
    ratings: state => state.ratings,
    productMin: state => state.productMin,
    productMax: state => state.productMax,
    isIdle: state => state.isIdle,
    lastActiveDate: state => state.lastActiveDate,
    inactiveTime: state => state.inactiveTime,
    errorMessage: state => state.errorMessage
  }
})
