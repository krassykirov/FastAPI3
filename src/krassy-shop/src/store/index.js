import { createStore } from 'vuex'
import VueCookies from 'vue-cookies'
import router from '@/router'
/* global bootstrap */
export default createStore({
  state: {
    min: 1,
    max: 10000,
    total: 0,
    products: [],
    filteredProducts: [],
    isDiscountedChecked: false,
    categories: [],
    cart: [],
    sortOrder: 'asc',
    selectedCategories: [],
    selectedRating: [],
    ratings: [1, 2, 3, 4, 5],
    user: null,
    accessToken: VueCookies.get('access_token') || null,
    user_id: null,
    productMin: 0,
    productMax: 10000
  },
  mutations: {
    SET_PRODUCT(state, product) {
      state.product = product
    },
    SET_PRODUCTS(state, products) {
      state.products = products
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
    UPDATE_SELECTED_CATEGORIES(state, selectedCategories) {
      state.selectedCategories = selectedCategories
    },
    SET_CATEGORIES(state, categories) {
      state.categories = categories
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
    ADD_TO_CART(state, product) {
      state.cart.push(product)
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
    },
    removeAccessToken(state) {
      state.accessToken = null
    },
    SET_SELECTED_RATING(state, value) {
      state.selectedRating = value
    },
    UPDATE_DISCOUNT_CHECKED(state, isChecked) {
      state.isDiscountedChecked = isChecked
    }
  },
  actions: {
    async getProduct({ commit }, itemId) {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/items/item/${itemId}`
        )
        const item = await res.json()
        commit('SET_PRODUCT', item)
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    },
    async getProducts({ commit }) {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/items')
        const products = await res.json()
        commit('SET_PRODUCTS', products)
        const maxPrice = Math.max(...products.map(product => product.price))
        const minPrice = Math.min(...products.map(product => product.price))
        commit('SET_MIN_PRICE', minPrice)
        commit('SET_MAX_PRICE', maxPrice)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },
    async login({ commit }, { username, password }) {
      const formData = new URLSearchParams()
      formData.append('grant_type', '')
      formData.append('username', username)
      formData.append('password', password)
      formData.append('scope', '')
      formData.append('client_id', '')
      formData.append('client_secret', '')
      try {
        const response = await fetch('http://127.0.0.1:8000/api/token', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        VueCookies.set('access_token', data.access_token, '12h')
        commit('setAccessToken', data.access_token)
        router.push('/')
      } catch (error) {
        console.error('error', error)
      }
    },
    async removeAccessToken({ commit }) {
      VueCookies.remove('access_token')
      commit('removeAccessToken')
      router.push('/login')
    },
    async fetchCategories({ commit }) {
      try {
        const res = await fetch(
          'http://127.0.0.1:8000/api/categories/category_items_len/'
        )
        const categories = await res.json()
        commit('SET_CATEGORIES', categories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },
    async getItemRating({ commit }, itemId) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/reviews/item/rating?id=${itemId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        commit('UPDATE_PRODUCT_RATING', { productId: itemId, ratingData: data })
        commit('UPDATE_CART_ITEM_RATING', {
          productId: itemId,
          ratingData: data
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
    async readFromCartVue({ commit, state }) {
      const headers = new Headers({
        Authorization: `Bearer ${state.accessToken}`,
        Accept: 'application/json'
      })

      const requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
      }
      const response = await fetch(
        'http://127.0.0.1:8000/api/items/user-items-in-cart',
        requestOptions
      )
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      commit('UPDATE_CART', data.items)
      commit('UPDATE_USER', data.user)
      commit('UPDATE_USER_ID', data.user_id)
      commit('UPDATE_TOTAL', data.total)
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
    updateInputs({ commit }) {
      let minVal = parseInt(document.querySelector('.min-range').value)
      let maxVal = parseInt(document.querySelector('.max-range').value)

      if (minVal >= maxVal) {
        minVal = maxVal
      }
      if (maxVal <= minVal) {
        maxVal = minVal
      }
      const rangeInput = document.querySelector('.min-range')
      const rangeInputMax = document.querySelector('.max-range')
      if (rangeInput) {
        rangeInput.value = this.min
      }
      if (rangeInputMax) {
        rangeInputMax.value = this.max
      }
      commit('SET_MIN_PRICE', minVal)
      commit('SET_MAX_PRICE', maxVal)
      commit('SET_RANGE_INPUT', { min: minVal, max: maxVal })
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
        fetch('http://127.0.0.1:8000/api/items/update-basket', requestOptions)
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
          `http://127.0.0.1:8000/api/items/update_item/${product_id}`,
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

      fetch('http://127.0.0.1:8000/user/remove-from-basket', requestOptions)
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
      return state.cart
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
    min: state => state.min,
    max: state => state.max,
    products: state => state.products,
    categories: state => state.categories,
    cart: state => state.cart,
    sortOrder: state => state.sortOrder,
    selectedCategories: state => state.selectedCategories,
    selectedRating: state => state.selectedRating,
    ratings: state => state.ratings,
    user: state => state.user,
    accessToken: state => state.accessToken,
    userId: state => state.user_id,
    productMin: state => state.productMin,
    productMax: state => state.productMax
  }
})
