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
                  src="https://cdn.pixabay.com/photo/2015/07/24/18/40/model-858754_960_720.jpg"
                  alt="Sale"
                />
              </div>
              <div class="col-md-3">
                <img
                  class="w-75"
                  src="https://cdn.pixabay.com/photo/2015/07/24/18/38/model-858749_960_720.jpg"
                  alt="Sale"
                />
              </div>
              <div class="col-md-3">
                <img
                  class="w-75"
                  src="https://cdn.pixabay.com/photo/2015/07/24/18/39/model-858751_960_720.jpg"
                  alt="Sale"
                />
              </div>
              <div class="col-md-3">
                <img
                  class="w-75"
                  src="https://cdn.pixabay.com/photo/2015/07/24/18/37/model-858748_960_720.jpg"
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
              <!-- <p class="text-secondary mb-1">
                (Additional tax may apply on checkout)
              </p> -->
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
            <div class="buttons d-flex justify-content-center my-5">
              <div class="block">
                <a href="#" class="shadow btn custom-btn">Wishlist</a>
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

          <div class="product-details my-4" v-if="item">
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
    <div class="container" style="margin-top: 1%">
      <div class="tab-container">
        <nav class="tab-nav">
          <div class="mobile-select">
            <i class="bi bi-chevron-down"></i>
          </div>
          <ul>
            <li>
              <button class="btn tab-btn active" id="html">Reviews</button>
            </li>
            <li>
              <button class="btn tab-btn" id="csss">Specification</button>
            </li>
            <li><button class="btn tab-btn" id="js">Details</button></li>
          </ul>
        </nav>
        <div class="tab-content">
          <div class="tab-item" data-id="html" id="reviewTab">
            <nav aria-label="Review Pagination" v-if="item && item.reviews">
              <ul class="pagination" style="margin-left: 20px">
                <li class="page-item">
                  <a class="page-link" @click="prevPage" aria-label="Previous">
                    <span aria-hidden="true"></span>
                  </a>
                </li>
                <li
                  v-for="(page, index) in pages"
                  :key="index"
                  :class="{
                    'page-item': true,
                    active: page === currentPage
                  }"
                >
                  <a class="page-link" @click="setCurrentPage(page)">{{
                    page
                  }}</a>
                </li>
                <li class="page-item">
                  <a class="page-link" @click="nextPage" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
            </nav>
            <div v-if="item">
              <div
                class="cardgroup1"
                v-for="review in reviewsData"
                :key="review.id"
                :id="'card' + review.id"
                style="display: block; width: 550px; margin-bottom: 2px"
              >
                <div class="row">
                  <div class="col-12">
                    <p></p>
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      <img
                        src="http://127.0.0.1:8000/static/img/img_avatar.png"
                        class="avatar"
                        style="padding: 5px"
                      />
                      <span style="text-align: center">{{
                        review.created_by
                      }}</span>
                    </div>
                    <span
                      class="fa fa-star"
                      :class="{ checked: star.checked }"
                      :id="star.id"
                      v-for="star in updateStarRatings(review)"
                      :key="star.id"
                    ></span>
                    <hr />
                    <div>
                      <p style="text-align: left; padding: 15px">
                        {{ review.text }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row pb-2" style="width: 700px">
              <div
                class="card"
                id="RatingCard"
                style="width: 550px; margin-left: 35px"
              >
                <div class="row">
                  <div class="col-12" style="margin-bottom: 5px">
                    <div class="comment-box ml-2">
                      <input
                        type="number"
                        id="comment-item-id"
                        required
                        hidden
                      />
                      <div class="rating" style="padding: 10px">
                        <input
                          type="radio"
                          name="rating"
                          value="5"
                          id="5"
                        /><label for="5">☆</label>
                        <input
                          type="radio"
                          name="rating"
                          value="4"
                          id="4"
                        /><label for="4">☆</label>
                        <input
                          type="radio"
                          name="rating"
                          value="3"
                          id="3"
                        /><label for="3">☆</label>
                        <input
                          type="radio"
                          name="rating"
                          value="2"
                          id="2"
                        /><label for="2">☆</label>
                        <input
                          type="radio"
                          name="rating"
                          value="1"
                          id="1"
                        /><label for="1">☆</label>
                      </div>
                      <div class="comment-area">
                        <textarea
                          class="form-control"
                          placeholder="Write a Review.."
                          rows="4"
                          id="comment-area"
                        ></textarea>
                      </div>
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
          </div>
          <div class="tab-item hide" data-id="csss">
            <p v-if="item">{{ item.description }}</p>
          </div>
          <div class="tab-item hide" data-id="js">
            <li>
              Samsung UE43CU8072U - 43" Diagonal Class CU8000 Series LED-backlit
              LCD TV
            </li>
            <li>Flat 2.16 m (85") LCD</li>
            <li>
              Crystal UHD - Smart TV - Tizen OS - 4K UHD (2160p) 3840 x 2160 -
              HDR - black
            </li>
            <li>DVB-S2, DVB-T2, ISDB-C</li>
            <li>Smart TV Internet TV</li>
            <li>Wi-Fi Ethernet LAN Bluetooth</li>
            <li>High Dynamic Range (HDR) supported</li>
            <li>G 168 kWh 168 W</li>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="container similar-products my-4">
      <hr />
      <p class="display-5">Similar Products</p>

      <div class="row">
        <div class="col-md-3">
          <div class="similar-product">
            <img
              class="w-100"
              src="https://source.unsplash.com/gsKdPcIyeGg"
              alt="Preview"
            />
            <p class="title">Lovely black dress</p>
            <p class="price">$100</p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="similar-product">
            <img
              class="w-100"
              src="https://source.unsplash.com/sg_gRhbYXhc"
              alt="Preview"
            />
            <p class="title">Lovely Dress with patterns</p>
            <p class="price">$85</p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="similar-product">
            <img
              class="w-100"
              src="https://source.unsplash.com/gJZQcirK8aw"
              alt="Preview"
            />
            <p class="title">Lovely fashion dress</p>
            <p class="price">$200</p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="similar-product">
            <img
              class="w-100"
              src="https://source.unsplash.com/qbB_Z2pXLEU"
              alt="Preview"
            />
            <p class="title">Lovely red dress</p>
            <p class="price">$120</p>
          </div>
        </div>
      </div>
    </div> -->
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
      reviewsData: []
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
    getItemRatingItem(item_id) {
      try {
        fetch(`http://127.0.0.1:8000/api/reviews/item/rating?id=${item_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
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
            for (let i = 1; i <= 5; i++) {
              const star = document.getElementById('star' + i)
              if (i <= data.rating) {
                star.classList.add('checked')
              } else {
                star.classList.remove('checked')
              }
            }
            document.getElementById('overall-rating').innerText =
              ' ' +
              parseFloat(data.rating_float).toFixed(2) +
              ' based on (' +
              data.review_number +
              ' reviews)'
          })
          .catch(error => {
            console.error('Error:', error)
          })
      } catch (error) {
        console.error('Error:', error)
      }
    },
    addReview() {
      const review = document.getElementById('comment-area').value
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
          // const reviewDiv = document.getElementsByClassName('card group1');
          const newCard = `
            <div class="card group1" id="card${data.id}" style="display: flex; margin-left: 25px; margin-bottom:3; width:550px">
              <div class="row" style="margin-left:0;">
                <div class="col-12" style="margin-bottom: 3px; margin-left:0;">
                  <p style="margin-left:0">
                    <div style="display: flex; align-items: center; justify-content: center;">
                      <img src="/static/img/img_avatar.png" class="avatar" style="padding: 5px;">
                      <span style="text-align: center;">${data.created_by}</span>
                    </div>
                    <span class="fa fa-star checked" id="star${data.id}1"></span>
                    <span class="fa fa-star checked" id="star${data.id}2"></span>
                    <span class="fa fa-star checked" id="star${data.id}3"></span>
                    <span class="fa fa-star" id="star${data.id}4"></span>
                    <span class="fa fa-star" id="star${data.id}5"></span>
                    <div>  <i>${data.text} </i></div>
                  </p>
                </div>
              </div>
            </div>
          `
          this.getItemRatingItem(id)
          this.setReviewsRating(id)
          $('#reviewTab').append(newCard)
        })
        .catch(error => {
          console.error('Error:', error)
        })
    },
    RatingHide() {
      document.getElementById('RatingCard').style.display = 'none'
    },
    scrollToTarget() {
      var targetDiv = document.getElementById('reviewTab')
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
    }
  }
}
</script>
<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
@import url('https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css');
@import url('//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
@import url('https://fonts.googleapis.com/css?family=Raleway');

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
  margin-top: 10px !important;
  margin-right: 10% !important;
  align-items: left;
}
.tab-content {
  padding: 12px !important;
  margin-top: 10px !important;
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
</style>
