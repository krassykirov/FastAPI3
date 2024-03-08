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
        :user="user"
        :total="total"
        :favorites="favorites"
        :profile="profile"
      />
    </nav>
    <!-- <MessageArea /> -->
    <div class="container my-5">
      <div class="row">
        <div class="col-md-5" style="min-height: 550px; max-height: 550px">
          <div class="main-img" v-if="item" :id="'main-image-' + item.id">
            <span
              class="badge bg-danger position-absolute top-5 start-5"
              v-if="item.discount >= 0.01"
              style="font-size: 0.9em; margin: 1%; top: 5; start: 5"
              >-{{ Math.floor(item.discount * 100) }}%
            </span>
            <img
              class="img-fluid"
              :src="`${backendEndpoint}/static/img/${item.username}/${item.name}/${item.image}`"
              alt="ProductS"
            />
            <div class="row my-3 previews">
              <div class="col-md-3">
                <img
                  class="img-fluid"
                  :src="`${backendEndpoint}/static/img/${item.username}/${item.name}/${item.image}`"
                  alt="Sale"
                />
              </div>
              <div class="col-md-3">
                <img
                  class="img-fluid"
                  :src="`${backendEndpoint}/static/img/${item.username}/${item.name}/${item.image}`"
                  alt="Sale"
                />
              </div>
              <div class="col-md-3">
                <img
                  class="img-fluid"
                  :src="`${backendEndpoint}/static/img/${item.username}/${item.name}/${item.image}`"
                  alt="Sale"
                />
              </div>
              <div class="col-md-3">
                <img
                  class="img-fluid"
                  :src="`${backendEndpoint}/static/img/${item.username}/${item.name}/${item.image}`"
                  alt="Sale"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-7" style="min-height: 550px; max-height: 550px">
          <div class="main-description px-2">
            <div class="category text-bold" v-if="item">
              Category: {{ getCategoryNameById(item.category_id) }}
            </div>
            <div class="product-title text-bold my-3" v-if="item">
              <!-- {{ item.name }} -->
              {{ truncateName(item.name, 60) }}
            </div>
            <!-- prettier-ignore -->
            <div class="price-area my-4" v-if="item">
              <p class="new-price text-bold mb-1">
                <span style="font-size: 1.2rem;">$</span>
                <span style="font-size: 1.2rem;">{{ formatPrice(item.discount_price).integerPart }}</span>
                <span style="font-size: 0.7rem; position: relative; top: -0.6em;">.{{ formatPrice(item.discount_price).decimalPart }}</span>
              </p>
              <p v-if="item.discount">
                <del style="font-size: 0.9rem">${{ item.price }} </del>
                <span class="text-danger" v-if="item.discount">&nbsp;</span>
                <!-- <span style="font-size: 0.7rem" class="badge bg-danger"
                  >- {{ Math.floor(item.discount * 100) }}%</span
                > -->
              </p>
            </div>
            <p
              style="cursor: pointer; margin-bottom: 1%"
              v-if="item"
              @click="scrollToTarget"
            >
              <span
                v-for="i in 5"
                :key="i"
                :class="getStarClasses(i, item.rating_float)"
              ></span>
              <span
                class="overall-rating"
                style="font-size: 0.9rem !important"
                :id="'overall-rating' + item.id + '-float'"
                >&nbsp;{{ item.rating_float }}</span
              >
              <span :id="'overall-rating' + item.id" style="font-size: 0.9rem">
                ({{ item.reviewNumber }}) Review's
              </span>
            </p>
            <div class="buttons d-flex justify-content-center my-4">
              <div class="block">
                <a @click="addTofavorites(item)" class="shadow btn custom-btn"
                  >Favorites</a
                >
              </div>
              <div class="block">
                <button
                  class="shadow btn custom-btn"
                  @click="addToCart(item)"
                  ref="addToCartButton"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
          <div class="product-details my-2" v-if="item">
            <p class="details-title text-color mb-1">Product Details</p>
            <p class="description" style="margin-left: 20%; margin-right: 20%">
              {{ item.description }}
            </p>
          </div>

          <div class="row questions bg-light p-3">
            <div class="col-md-1 icon">
              <i class="fa-brands fa-rocketchat questions-icon"></i>
            </div>
            <div class="col-md-11 text">
              Have a question about our products at E-Store? Feel free to
              contact our representatives via live chat or email.
            </div>
          </div>
          <div class="delivery my-4">
            <p class="font-weight-bold mb-0">
              <span><i class="fa-solid fa-truck"></i></span>
              <b> Delivery done in 3 days from date of purchase</b>
            </p>
            <p class="text-secondary">Order now to get this product delivery</p>
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
    <div class="container" style="margin-top: 4%; font-size: 2em">
      <!-- <p class="display-5" v-if="item && getSimilarProducts.length"> -->
      You may also like
      <!-- </p> -->
    </div>
    <MessageArea />
    <div class="container" style="padding-left: 10%; margin: 0; width: 100%">
      <!-- Horizontal Tabs -->
      <ul class="nav nav-tabs justify-content-center" style="margin-left: 20%">
        <li class="nav-item">
          <a
            class="nav-link"
            @click="switchTab('reviews')"
            :class="{ active: activeTab === 'reviews' }"
          >
            Reviews ({{ reviewsData.length }})
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            @click="switchTab('specification')"
            :class="{ active: activeTab === 'specification' }"
          >
            Specification
          </a>
        </li>
      </ul>
    </div>
    <div class="tab-content mt-3">
      <div>
        <!-- Pagination controls -->
        <div
          v-if="activeTab === 'reviews'"
          class="tab-pane"
          :class="{ active: activeTab === 'reviews' }"
          :key="'reviews_' + activeTab"
          id="reviews"
          style="justify-content: center; align-items: center"
        >
          <nav aria-label="Page navigation example">
            <ul class="pagination" style="margin-left: 20%">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button
                  class="page-link"
                  @click="prevPage"
                  :disabled="currentPage === 1"
                >
                  Prev
                </button>
              </li>
              <li
                class="page-item"
                v-for="page in pages"
                :key="page"
                :class="{ active: currentPage === page }"
              >
                <button class="page-link" @click="setCurrentPage(page)">
                  {{ page }}
                </button>
              </li>
              <li
                class="page-item"
                :class="{ disabled: currentPage === totalPages }"
              >
                <button
                  class="page-link"
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
          <div v-if="item" style="margin-left: 20%">
            <div
              class="cardgroup1"
              v-for="review in displayedReviews"
              :key="review.id"
              :id="'card' + review.id"
              style="
                width: 55%;
                margin-bottom: 5px;
                border: 1px solid #ccc;
                padding: 2px;
                display: flex;
                justify-content: left;
              "
            >
              <!-- Left Side -->
              <div style="flex: 1; display: flex; align-items: center">
                <img
                  v-if="profile"
                  :src="`${backendEndpoint}/static/img/${user}/profile/${profile.avatar}`"
                  width="50"
                  height="50"
                  class="rounded-circle"
                />
                <img
                  v-else
                  :src="`${backendEndpoint}/static/img/img_avatar.png`"
                  width="50"
                  height="50"
                  class="rounded-circle"
                />
                <div style="margin-left: 2px">
                  <span>{{ review.created_by }}</span>
                  <br />
                  <span
                    class="fa fa-star"
                    :class="{ checked: star.checked }"
                    :id="star.id"
                    v-for="star in updateStarRatings(review)"
                    :key="star.id"
                  ></span>
                </div>
              </div>
              <!-- Right Side -->
              <div
                style="
                  flex: 2;
                  text-align: left;
                  padding: 10px;
                  text-align: left;
                "
              >
                <p>{{ review.text }}</p>
              </div>
            </div>
            <div
              class="cardgroup1"
              style="width: 650px; margin-bottom: 2px"
              v-if="!userHasWrittenReview()"
            >
              <div class="row">
                <div class="col-12">
                  <div class="rating" style="padding: 10px">
                    <input type="radio" name="rating" value="5" id="5" /><label
                      for="5"
                      >☆</label
                    >
                    <input type="radio" name="rating" value="4" id="4" /><label
                      for="4"
                      >☆</label
                    >
                    <input type="radio" name="rating" value="3" id="3" /><label
                      for="3"
                      >☆</label
                    >
                    <input type="radio" name="rating" value="2" id="2" /><label
                      for="2"
                      >☆</label
                    >
                    <input type="radio" name="rating" value="1" id="1" /><label
                      for="1"
                      >☆</label
                    >
                  </div>
                  <div class="comment-box ml-2">
                    <textarea
                      class="form-control"
                      placeholder="Write a Review and select a rating"
                      rows="4"
                      maxlength="700"
                      ref="commentArea"
                    ></textarea>
                    <div class="comment-btns mt-2">
                      <div class="row">
                        <div class="col-6">
                          <div class="pull-left">
                            <button
                              class="btn btn-secondary btn-sm"
                              id="RatingCancel"
                              @click="RatingHide"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="pull-right">
                            <button
                              class="btn btn-success send btn-sm"
                              @click="addReview"
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <p>No reviews available.</p>
          </div>
        </div>
      </div>
      <!-- Specification Tab -->
      <div
        v-if="activeTab === 'specification'"
        class="tab-pane"
        :class="{ active: activeTab === 'specification' }"
        :key="'specification_' + activeTab"
        id="specification"
        style="
          text-align: center;
          align-items: center;
          margin-left: 30%;
          margin-right: 30%;
        "
      >
        <!-- Specification content -->
        <p v-if="item">
          {{ item.description }}
        </p>
        <p v-else>No specification available.</p>
      </div>
    </div>
    <Footer />
    <div
      class="toast bg-info"
      id="cartToast2"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-bs-autohide="false"
      style="
        position: fixed;
        top: 70%;
        left: 30%;
        transform: translate(0, -50%);
        width: 250px;
        z-index: 1000;
      "
    >
      <div class="d-flex">
        <div
          class="toast-body bg-light"
          id="cartToastBody2"
          style="font-weight: 900; font: 1.1em"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
/* global bootstrap */
import $ from 'jquery'
import MessageArea from '@/views/MessageAreaVue.vue'
import Footer from '@/views/FooterVue.vue'
// import Carousel from '@/views/CarouselVue.vue'
import errorHandlingMixin from '../errorHandlingMixin'
import config from '@/config'
import NavBar from '../components/MyNavbar.vue'
// import router from '@/router'
// import VueCookies from 'vue-cookies'
// import { jwtDecode } from 'jwt-decode'

export default {
  components: {
    NavBar,
    MessageArea,
    Footer
  },
  mixins: [errorHandlingMixin],
  props: ['cart', 'profile', 'favorites'],
  emits: ['addToCart', 'redirectToItem'],
  data() {
    return {
      item: this.item,
      itemId: this.itemId,
      reviewsData: [],
      activeTab: 'reviews',
      currentPage: 1,
      reviewsPerPage: 2,
      backendEndpoint: `${config.backendEndpoint}`
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.getProduct(to.params.itemId)
    this.setReviewsRating(to.params.itemId)
    next()
  },
  created() {
    this.getProduct()
    this.$store.dispatch('fetchCategories')
    this.setReviewsRating(this.itemId)
    this.$store.dispatch('getProfile')
    this.$store.dispatch('getProfiles')
  },
  mounted() {
    const carousels = document.querySelectorAll('.carousel')
    carousels.forEach(carouselElement => {
      const carouselId = carouselElement.id
      const carousel = new bootstrap.Carousel(carouselElement, {
        interval: false
      })
      const carouselControlPrev = document.getElementById(
        `${carouselId}-control-prev`
      )
      const carouselControlNext = document.getElementById(
        `${carouselId}-control-next`
      )
      carouselControlPrev.addEventListener('click', function () {
        carousel.next()
      })

      carouselControlNext.addEventListener('click', function () {
        carousel.prev()
      })
    })
  },
  computed: {
    errorMessage() {
      return this.$store.state.errorMessage
    },
    user() {
      return this.$store.state.user
    },
    user_id() {
      return this.$store.state.user_id
    },
    total() {
      return this.$store.getters.total
    },
    profiles() {
      return this.$store.state.profiles
    },
    accessToken() {
      return this.$store.state.accessToken
    },
    categories() {
      return this.$store.getters.categories
    },
    totalPages() {
      return Math.ceil(this.reviewsData.length / this.reviewsPerPage)
    },
    pages() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1)
    },
    displayedReviews() {
      const startIndex = (this.currentPage - 1) * this.reviewsPerPage
      const endIndex = startIndex + this.reviewsPerPage
      return this.reviewsData.slice(startIndex, endIndex)
    }
  },
  methods: {
    truncateName(name, maxLength) {
      if (!name) return '' // Add this guard clause
      if (name.length > maxLength) {
        const firstLine = name.substring(0, maxLength)
        const remainingChars = name.substring(maxLength)
        const indexOfSpace = remainingChars.indexOf(' ') // Find the index of the next space after maxLength
        if (indexOfSpace !== -1) {
          // If there is a space within the remaining characters, split at that space
          const secondLine = remainingChars.substring(0, indexOfSpace)
          return `${firstLine}\n${secondLine}`
        } else {
          // If there is no space within the remaining characters, just return the truncated first line
          return `${firstLine}..`
        }
      }
      return name
    },
    formatPrice(price) {
      if (price !== null || price !== undefined) {
        const [integerPart, decimalPart] = price.toFixed(2).split('.')
        const formattedIntegerPart = integerPart.replace(
          /\B(?=(\d{3})+(?!\d))/g,
          '.'
        ) // Add dots for every 3 digits
        const formattedDecimalPart = decimalPart || '00' // Ensure two decimal places

        return {
          integerPart: formattedIntegerPart,
          decimalPart: formattedDecimalPart
        }
      }
    },
    async getProduct(itemId) {
      try {
        const resolvedItemId = itemId || this.$route.params.itemId
        const res = await fetch(
          `${config.backendEndpoint}/api/items/item/${resolvedItemId}`
        )
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`)
        }
        const item = await res.json()
        this.item = item

        this.$nextTick(() => {
          this.getItemRating(item.id)
        })

        this.scrollToTop()
      } catch (error) {
        this.$router.push({ name: 'NotFound' })
      }
    },
    async getItemRating(itemId) {
      try {
        const response = await fetch(
          `${config.backendEndpoint}/api/reviews/item/rating?id=${itemId}`,
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
        this.item.rating = data.rating
        this.item.rating_float = parseFloat(data.rating_float).toFixed(2)
        this.item.reviewNumber = data.review_number
        this.$store.dispatch('updateItemRating', {
          itemId: itemId,
          rating: data
        })
      } catch (error) {
        // console.log('error')
      }
    },
    addToCart(product) {
      this.$store.dispatch('addToCart', product)
    },
    redirectToItem(itemId) {
      this.$store.dispatch('redirectToItem', itemId)
    },
    itemAlreadyInCart(product) {
      return this.cart.some(item => item.id === product.id)
    },
    async setReviewsRating(itemId) {
      try {
        const resolvedItemId = itemId || this.$route.params.itemId
        const response = await fetch(
          `${config.backendEndpoint}/api/reviews?item_id=${resolvedItemId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              redirect: 'follow'
            }
          }
        )
        if (!response.ok) {
          if (response.status === 404) {
            // console.error(`Item with ID ${resolvedItemId} not found`)
          } else {
            throw new Error(
              `Error: ${response.status} - ${response.statusText}`
            )
          }
        } else {
          const data = await response.json()
          this.reviewsData = data
        }
      } catch (error) {
        // console.error('Error:', error)
      }
    },
    updateStarRatings(review) {
      return Array.from({ length: 5 }, (_, i) => i + 1).map(starIndex => ({
        id: `star${review.id}${starIndex}`,
        checked: starIndex <= review.rating
      }))
    },
    getStarClasses(index, rating) {
      let ratingValue = parseFloat(rating)
      let filledStars = Math.floor(ratingValue)
      if (index <= filledStars) {
        return 'fa fa-star checked'
      } else if (index === filledStars + 1 && rating % 1 !== 0) {
        return 'fa fa-star-half-full checked'
      } else {
        return 'fa fa-star-o checked'
      }
    },
    addReview() {
      const review = this.$refs.commentArea.value
      const rating = document.querySelector('input[name="rating"]:checked')
      if (!review || !rating) {
        const toastContent = 'Please Write a review and select a rating'
        const toastElement = new bootstrap.Toast(
          document.getElementById('cartToast2'),
          {
            delay: 2000
          }
        )
        const toastBodyElement = document.getElementById('cartToastBody2')
        toastBodyElement.innerText = toastContent
        toastElement.show()
        return
      }
      const id = this.item.id
      const username = this.$store.state.user
      const ratingValue = rating.value || 0
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.accessToken}`
        },
        body: JSON.stringify({
          text: review,
          item_id: id,
          rating: ratingValue,
          created_by: username
        })
      }
      fetch(`${config.backendEndpoint}/create_review_ajax`, requestOptions)
        .then(response => {
          if (!response.ok) {
            if (response.status === 403) {
              $('#comment-area').val(
                'You can write only one review for this item'
              )
              return Promise.reject('403 Forbidden')
            }
          }
          return response.json()
        })
        .then(data => {
          this.reviewsData.push(data)
          this.getItemRating(id)
          this.setReviewsRating(id)
        })
        .catch(error => {
          throw error
        })
    },
    userHasWrittenReview() {
      return (
        this.reviewsData &&
        this.reviewsData.some(review => review.created_by === this.user)
      )
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    setCurrentPage(page) {
      this.currentPage = page
    },
    scrollToTarget() {
      var targetDiv = document.getElementById('reviews')
      if (targetDiv) {
        targetDiv.scrollIntoView({ behavior: 'auto' })
      }
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'auto' })
    },
    switchTab(tabId) {
      const scrollPosition = window.scrollY || window.pageYOffset
      this.activeTab = tabId
      this.$nextTick(() => {
        window.scrollTo(0, scrollPosition)
      })
    },
    addTofavorites(product) {
      this.$store.dispatch('addTofavorites', product)
    },
    getCategoryNameById(categoryId) {
      const categoryIdToName = {
        1: 'Laptops',
        2: 'Smartphones',
        3: 'Tablets',
        4: 'Smartwatches',
        5: 'TV'
      }
      return categoryIdToName[categoryId]
    }
  }
}
</script>
<style scoped>
.price {
  font-size: 1em;
  color: #dc3545;
  font-weight: 900;
  margin-bottom: 1%;
  margin-top: 1.5%;
}
.old-price {
  font-size: 1em;
  color: #404447;
  margin-top: 1%;
  margin-bottom: 2%;
}
.text-bold {
  font-weight: 800;
}

text-color {
  color: #0093c4;
}

/* Main image - left */
.main-img {
  padding: 0;
  margin: 0;
  width: 90% !important;
  height: 100% !important;
  max-height: 550px !important;
}
.main-img img {
  width: 70% !important;
  max-height: 500px !important;
}

/* Preview images */
.previews img {
  width: 90% !important;
  height: auto !important;
  max-height: 200px !important;
}
.main-description .category {
  text-transform: uppercase;
  color: #0093c4;
}

.main-description .product-title {
  padding-top: 1%;
  font-size: 1.3rem;
}

.old-price-discount {
  font-weight: 600;
  font-size: 1rem;
}

.new-price {
  font-size: 1.1rem;
  color: rgb(222, 24, 24);
}

.details-title {
  text-transform: uppercase;
  font-weight: 600;
  font-size: 1.2rem;
  color: #757575;
}

.block {
  margin-right: 5px;
}

.quantity input {
  border-radius: 0;
  height: 40px;
}

.custom-btn {
  text-transform: capitalize;
  background-color: #0093c4;
  color: white;
  width: 150px;
  height: 40px;
  border-radius: 0;
}

.custom-btn:hover {
  background-color: #0093c4 !important;
  font-size: 18px;
  color: white !important;
}

.similar-products img {
  height: 330px !important;
  cursor: pointer;
}
.similar-products {
  text-align: center !important;
  cursor: pointer;
  max-height: 500px !important;
}
.display-5 {
  font-weight: 300;
  line-height: 1;
  font-size: 1.5em;
}
.similar-products .title {
  margin: 0px 0px 0px 0px;
}

.similar-products .price {
  font-weight: bold;
}

.questions .icon i {
  font-size: 2rem;
}

.questions-icon {
  font-size: 2rem;
  color: #0093c4;
}

.pagination {
  margin-top: 0.5% !important;
}

.pagination .page-item {
  display: inline-block !important;
  margin-right: 3px !important;
}

.pagination .page-item.active a {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}
.text-center {
  text-align: center !important;
}

.container.my-5 {
  min-width: 1200px !important;
  max-width: 100% !important;
  height: 550px !important;
  width: 100%;
  padding-left: 15px !important;
  padding-right: 15px !important;
  margin-left: auto !important;
  margin-right: auto !important;
}

.nav-item.dropdown {
  padding: 0 !important;
  margin: 0 !important;
}

.hide {
  display: none !important;
}
.tab-nav {
  max-width: 1% !important;
  margin: 0 auto !important;
  margin-top: 2% !important;
  border: 1px solid gainsboro !important;
}
.tab-nav button {
  width: 100% !important;
}
.tab-nav ul {
  display: none !important;
  flex-wrap: wrap !important;
  flex-direction: column !important;
  justify-content: center !important;
}
.tab-nav ul.show {
  display: block !important;
}
.form-control {
  margin-left: 1% !important;
}
.div.comment-area {
  margin-left: 1% !important;
  width: 30rem !important;
  padding: 2px !important;
}
textarea.form-control {
  margin-left: 0 !important;
  padding-left: 0 !important;
}
textarea#comment-area.form.control {
  margin-left: 1% !important;
}
.cardgroup1 {
  margin-top: 5px !important;
  margin-right: 10% !important;
  align-items: left;
}
.tab-content {
  padding: 12px !important;
  margin-top: 5px !important;
  border: 1px solid var(--color-primary) !important;
  overflow-y: auto; /* Enable vertical scroll */
  height: 400px; /* Set a fixed height */
  width: 100% !important;
}

div#RatingCard.card {
  padding-right: 1% !important;
  padding-bottom: 0 !important;
  padding: 0 !important;
}
.card-img-top {
  width: 90% !important;
  height: 12vw !important;
  object-fit: cover !important;
}
.card {
  width: 32rem !important;
  margin-bottom: auto !important;
  margin-right: auto !important;
  margin-top: auto !important;
  margin-left: 5% !important;
  /* border: 15px solid #969696; */
  text-align: center !important;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
.list-group {
  width: 200px; /* Set your preferred width */
}

.list-group-item {
  cursor: pointer;
}
.nav-tabs {
  width: 100%;
}
.nav-tabs .nav-link {
  color: gray;
  border: 0;
  border-bottom: 1px solid grey;
  cursor: pointer;
}

.nav-tabs .nav-link:hover {
  border: 0;
  border-bottom: 1px solid grey;
}
.nav-tabs .nav-link.active {
  color: #000000;
  border: 0;
  border-radius: 0;
  border-bottom: 2px solid blue;
}
.pagination {
  margin-top: 0.5% !important;
}

.pagination .page-item {
  display: inline-block !important;
  margin-right: 3px !important;
}

.pagination .page-item.active a {
  background-color: #007bff;
  color: #fff;
}
.overall-rating {
  font-size: 1em !important;
  margin-bottom: 2%;
}
.overall-rating2 {
  font-size: 0.9em !important;
  margin-bottom: 2%;
}
</style>
