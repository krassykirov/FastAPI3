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
        :avatar="'{{ avatar }}'"
      />
    </nav>
    <div class="container my-5">
      <div class="row">
        <div class="col-md-5">
          <div class="main-img" v-if="item">
            <span
              class="badge bg-danger position-absolute top-5 start-5"
              v-if="item.discount >= 0.1"
              style="font-size: 0.9em; margin: 1%; top: 5; start: 5"
              >-{{ Math.floor(item.discount * 100) }}%
            </span>
            <img
              class="img-fluid"
              :src="`http://127.0.0.1:8000/static/img/${item.username}/${item.name}/${item.image}`"
              alt="ProductS"
            />
            <div class="row my-3 previews">
              <div class="col-md-3">
                <img
                  class="w-75"
                  :src="`http://127.0.0.1:8000/static/img/${item.username}/${item.name}/${item.image}`"
                  alt="Sale"
                />
              </div>
              <div class="col-md-3">
                <img
                  class="w-75"
                  :src="`http://127.0.0.1:8000/static/img/${item.username}/${item.name}/${item.image}`"
                  alt="Sale"
                />
              </div>
              <div class="col-md-3">
                <img
                  class="w-75"
                  :src="`http://127.0.0.1:8000/static/img/${item.username}/${item.name}/${item.image}`"
                  alt="Sale"
                />
              </div>
              <div class="col-md-3">
                <img
                  class="w-75"
                  :src="`http://127.0.0.1:8000/static/img/${item.username}/${item.name}/${item.image}`"
                  alt="Sale"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-7">
          <div class="main-description px-2">
            <div class="category text-bold">Category: Women</div>
            <div class="product-title text-bold my-3" v-if="item">
              {{ item.name }}
            </div>
            <div class="price-area my-4" v-if="item">
              <p class="new-price text-bold mb-1">${{ item.discount_price }}</p>
              <p
                v-if="item.discount !== null"
                class="old-price mb-1"
                style="font-size: 1rem; text-decoration: line-through"
              >
                <span>${{ item.price }} </span>
                <span
                  class="old-price-discount text-danger"
                  v-if="item.discount"
                  >&nbsp;(-{{ Math.floor(item.discount * 100) }})%</span
                >
              </p>
            </div>
            <p
              style="cursor: pointer; margin-bottom: 1%"
              v-if="item"
              @click="scrollToTarget"
            >
              <i>
                <span
                  v-for="i in 5"
                  :key="i"
                  :class="getStarClasses(i, item.rating_float)"
                ></span>
                <span
                  :id="'overall-rating' + item.id + '-float'"
                  style="
                    font-size: 0.9em;
                    font-family: Raleway;
                    margin-bottom: 2%;
                  "
                  >&nbsp;{{ item.rating_float }}</span
                >
              </i>
              <span :id="'overall-rating' + item.id">
                ({{ item.reviewNumber }}) review's
              </span>
            </p>
            <div class="buttons d-flex justify-content-center my-4">
              <div class="block">
                <a @click="showModal" class="shadow btn custom-btn">Wishlist</a>
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
            <p class="description">
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
          <div class="delivery-options my-4">
            <p class="font-weight-bold mb-0">
              <span><i class="fa-solid fa-filter"></i></span>
              <b> Delivery options</b>
            </p>
            <p class="text-secondary">View delivery options here</p>
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
    <div class="container mt-4">
      <!-- Horizontal Tabs -->
      <ul class="nav nav-tabs justify-content-center">
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
      <!-- Tab Content -->
      <div class="tab-content mt-3">
        <!-- Reviews Tab -->
        <div
          v-if="activeTab === 'reviews'"
          class="tab-pane"
          :class="{ active: activeTab === 'reviews' }"
          id="reviews"
          style="justify-content-left"
        >
          <!-- Reviews content -->
          <div v-if="item">
            <div
              class="cardgroup1"
              v-for="review in reviewsData"
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
                  src="http://127.0.0.1:8000/static/img/img_avatar.png"
                  class="avatar"
                  style="padding: 5px"
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

            <!-- Add Review Textarea and Buttons -->
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
                      placeholder="Write a Review.."
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

        <!-- Specification Tab -->
        <div
          v-if="activeTab === 'specification'"
          class="tab-pane"
          :class="{ active: activeTab === 'specification' }"
          id="specification"
          style="align-text: left; margin-left: 20%; margin-right: 20%"
        >
          <!-- Specification content -->
          <p v-if="item">
            {{ item.description }}
          </p>
          <p v-else>No specification available.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import NavBar from '../components/MyNavbar.vue'

export default {
  components: {
    NavBar
  },
  props: ['product', 'cart', 'total', 'avatar'],
  emits: ['addToCart'],
  data() {
    return {
      item: this.item,
      itemId: this.itemId,
      currentPage: 1,
      reviewsPerPage: 2,
      reviewsData: [],
      activeTab: 'reviews'
    }
  },
  created() {
    this.getProduct()
    this.setReviewsRating(this.itemId)
    this.$store.dispatch('readFromCartVue')
  },
  computed: {
    cartFromStore() {
      return this.$store.state.cart
    },
    user() {
      return this.$store.getters.user
    },
    accessToken() {
      return this.$store.state.accessToken || null
    },
    totalPages() {
      return Math.ceil(this.item.reviews.length / this.reviewsPerPage)
    },
    pages() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1)
    },
    displayedReviews() {
      const startIndex = (this.currentPage - 1) * this.reviewsPerPage
      const endIndex = startIndex + this.reviewsPerPage
      return this.item.reviews.slice(startIndex, endIndex)
    }
  },
  methods: {
    async getProduct() {
      try {
        const itemId = this.$route.params.itemId
        this.itemId = itemId
        const res = await fetch(
          `http://127.0.0.1:8000/api/items/item/${itemId}`
        )
        const item = await res.json()
        this.item = item
        this.getItemRating(itemId)
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    },
    async getItemRating(itemId) {
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
        this.item.rating = data.rating
        this.item.rating_float = parseFloat(data.rating_float).toFixed(2)
        this.item.reviewNumber = data.review_number
      } catch (error) {
        console.log(error)
      }
    },
    addToCart(product) {
      this.$store.dispatch('addToCart', product)
    },
    itemAlreadyInCart(product) {
      return this.cart.some(item => item.id === product.id)
    },
    setReviewsRating(id) {
      fetch(`http://127.0.0.1:8000/api/reviews?item_id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          redirect: 'follow'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(
              `Error: ${response.status} - ${response.statusText}`
            )
          }
          return response.json()
        })
        .then(data => {
          this.reviewsData = data
        })
        .catch(error => {
          console.error('Error:', error)
        })
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
      console.log('commentArea', review)
      const id = this.item.id
      const username = this.user
      const rating = document.querySelector(
        'input[name="rating"]:checked'
      ).value
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.accessToken}`
        },
        body: JSON.stringify({
          text: review,
          item_id: id,
          rating: rating,
          created_by: username
        })
      }
      fetch('http://127.0.0.1:8000/create_review_ajax', requestOptions)
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
          this.getItemRatingItem(id)
          this.setReviewsRating(id)
        })
        .catch(error => {
          console.error('Error:', error)
        })
    },
    userHasWrittenReview() {
      return (
        this.reviewsData &&
        this.reviewsData.some(review => review.created_by === this.user)
      )
    },
    scrollToTarget() {
      var targetDiv = document.getElementById('reviews')
      if (targetDiv) {
        targetDiv.scrollIntoView({ behavior: 'smooth' })
      }
    },
    setCurrentPage(page) {
      this.currentPage = page
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
    switchTab(tabId) {
      this.activeTab = tabId
    },
    showModal() {
      $(document).ready(function () {
        $('#global-modal').modal('show')
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

.navbar {
  padding-left: 35% !important;
}
.text-bold {
  font-weight: 800;
}

text-color {
  color: #0093c4;
}

/* Main image - left */
.main-img img {
  width: 100%;
}

/* Preview images */
.previews img {
  width: 100%;
  height: 140px;
}

.main-description .category {
  text-transform: uppercase;
  color: #0093c4;
}

.main-description .product-title {
  font-size: 2rem;
}

.old-price-discount {
  font-weight: 600;
  font-size: 1rem;
}

.new-price {
  font-size: 1.5rem;
  color: rgb(222, 24, 24);
}

.details-title {
  text-transform: uppercase;
  font-weight: 600;
  font-size: 1.2rem;
  color: #757575;
}

.buttons .block {
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

.similar-product img {
  height: 400px;
}

.similar-product {
  text-align: left;
}

.similar-product .title {
  margin: 17px 0px 4px 0px;
}

.similar-product .price {
  font-weight: bold;
}

.questions .icon i {
  font-size: 2rem;
}

.questions-icon {
  font-size: 2rem;
  color: #0093c4;
}

/* Small devices (landscape phones, less than 768px) */
@media (max-width: 767.98px) {
  /* Make preview images responsive  */
  .previews img {
    width: 100%;
    height: auto;
  }
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

ul {
  list-style: none !important;
  padding-left: 0 !important;
  margin-bottom: 0 !important;
}
.text-center {
  text-align: center !important;
}

.container {
  max-width: 100% !important;
  width: 100%;
  padding-left: 15px !important;
  padding-right: 15px !important;
  margin-left: auto !important;
  margin-right: auto !important;
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
@media (min-width: 992px) {
  .tab-nav {
    max-width: 100% !important;
    border: 0 !important;
  }
  .tab-nav ul {
    gap: 16px !important;
    flex-direction: row !important;
  }
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
@media (min-width: 992px) {
  .tab-nav ul {
    display: flex !important;
  }
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
/* MODAL*/
</style>
