<template>
  <div class="card-wrapper">
    <div class="card">
      <div class="product-imgs" v-if="item">
        <div class="img-display">
          <div class="img-showcase">
            <img
              :src="`/static/img/${item.username}/${item.name}/${item.image}`"
            />
            <img
              :src="`/static/img/${item.username}/${item.name}/${item.image}`"
            />
            <img
              :src="`/static/img/${item.username}/${item.name}/${item.image}`"
            />
            <img
              :src="`/static/img/${item.username}/${item.name}/${item.image}`"
            />
          </div>
        </div>
        <div class="img-select">
          <div class="img-item">
            <a href="#" data-id="1">
              <img
                :src="`/static/img/${item.username}/${item.name}/${item.image}`"
              />
            </a>
          </div>
          <div class="img-item">
            <a href="#" data-id="2">
              <img
                :src="`/static/img/${item.username}/${item.name}/${item.image}`"
              />
            </a>
          </div>
          <div class="img-item">
            <a href="#" data-id="3">
              <img
                :src="`/static/img/${item.username}/${item.name}/${item.image}`"
              />
            </a>
          </div>
          <div class="img-item">
            <a href="#" data-id="4">
              <img
                :src="`/static/img/${item.username}/${item.name}/${item.image}`"
              />
            </a>
          </div>
        </div>
      </div>
      <div class="product-content">
        <h2 class="product-title" v-if="item">{{ item.name }}</h2>
        <div class="product-rating">
          <span class="fa fa-star" id="star1"></span>
          <span class="fa fa-star" id="star2"></span>
          <span class="fa fa-star" id="star3"></span>
          <span class="fa fa-star" id="star4"></span>
          <span class="fa fa-star" id="star5"></span>
          <span
            id="overall-rating"
            @click="scrollToTarget"
            style="cursor: pointer"
          ></span>
        </div>

        <div class="product-price">
          <p class="new-price" id="new-price" v-if="item && item.discount">
            Price:
            <span>
              <b> ${{ discountedPrice }} </b></span
            >
          </p>
          <p v-if="item && item.discount" class="last-price">
            Old Price:
            <span>
              <small> ${{ item.price }} </small>
            </span>
          </p>
          <span
            v-if="item && item.discount"
            class="badge bg-danger"
            style="font-size: 0.9em"
          >
            -{{ Math.floor(item.discount * 100) }}%
          </span>
        </div>

        <div class="product-detail">
          <h3>Description:</h3>
          <li v-if="item">
            {{ item.description }}
          </li>
          <li>Color: <span>Black</span></li>
          <li>Available: <span>in stock</span></li>
          <li id="category">
            Category: <span v-if="item">{{ item.category.name }} </span>
          </li>
          <li>Shipping Area: <span>All over the world</span></li>
          <li>Shipping Fee: <span>Free</span></li>
        </div>

        <div class="purchase-info">
          <input type="number" min="0" value="1" />
          <button
            type="button"
            class="btn"
            id="add-to-cart"
            ref="addToCartButton"
            @click="addToCart(item)"
          >
            Add to Cart <i class="fas fa-shopping-cart"></i>
          </button>
          <button type="button" class="btn">Compare</button>
        </div>
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
                    <a
                      class="page-link"
                      @click="prevPage"
                      aria-label="Previous"
                    >
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
              <div v-if="item && item.reviews">
                <div
                  class="cardgroup1"
                  v-for="review in displayedReviews"
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
                          {{ review.text }} CSS (Cascading Style Sheets) is a
                          stylesheet language used for describing the
                          presentation and layout of HTML documents. It plays a
                          critical role in web development by allowing web
                          developers to control the visual appearance of web
                          pages.
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
                          value="
                        item.id"
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
                        <div
                          class="comment-area"
                          style="width: 500px; padding: 10px"
                        >
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
                Samsung UE43CU8072U - 43" Diagonal Class CU8000 Series
                LED-backlit LCD TV
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
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
// import NavBar from '../components/MyNavbar.vue'

export default {
  components: {
    // NavBar
  },
  props: ['product', 'cart', 'total', 'user', 'avatar'],
  emits: ['addToCart'],
  data() {
    return {
      currentPage: 1,
      reviewsPerPage: 2,
      reviewsData: [],
      item: null
    }
  },
  created() {
    this.getProduct()
  },
  computed: {
    discountedPrice() {
      if (this.item.discount) {
        return this.item.price - this.item.price * this.item.discount
      } else {
        return this.item.price * 1
      }
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
        const res = await fetch(
          `http://127.0.0.1:8000/api/items/item/${itemId}`
        )
        const item = await res.json()
        this.item = item
        this.getItemRatingItem(this.item.id)
        this.setReviewsRating(this.item.id)
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    },
    itemAlreadyInCart(product) {
      return this.cart.some(item => item.id === product.id)
    },
    addToCart(product) {
      this.$emit('addToCart', product)
    },
    setReviewsRating(id) {
      fetch(`/api/reviews?item_id=${id}`, {
        method: 'GET',
        redirect: 'follow',
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
    getItemRatingItem(item_id) {
      try {
        fetch(`/api/reviews/item/rating?id=${item_id}`, {
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
        redirect: 'follow',
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
      fetch('/create_review_ajax', requestOptions)
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
                      <img src="http://127.0.0.1:8000/static/img/img_avatar.png" class="avatar" style="padding: 5px;">
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
<style scoped>
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

:root {
  --color-primary: #4670d9;
  --color-secondary: #2354d1;
  --color-tertiary: #2354d1;
}
*,
*::before,
*::after {
  box-sizing: border-box !important;
  margin: 0 !important;
  padding: 0 !important;
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

@media (min-width: 576px) {
  .container {
    max-width: 540px !important;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 720px !important;
  }
}

@media (min-width: 992px) {
  .container {
    max-width: 960px !important;
  }
}

@media (min-width: 1200px) {
  .container {
    max-width: 1140px !important;
  }
}

@media (min-width: 1440px) {
  .container {
    max-width: 1310px !important;
  }
}
section {
  padding: 10px 0 !important;
}
header {
  margin: 12px 0 !important;
}
.hide {
  display: none !important;
}

.tab-nav {
  max-width: 1% !important;
  margin: 0 auto !important;
  margin-top: 30% !important;
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

.cardgroup1 {
  margin-top: 10px !important;
  margin-right: 10% !important;
}
.tab-content {
  padding: 32px !important;
  margin-top: 10px !important;
  border: 1px solid var(--color-primary) !important;
}
@media (min-width: 992px) {
  .tab-nav ul {
    display: flex !important;
  }
}

@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap');

.card {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
  grid-gap: 1.5rem !important;
  justify-content: center !important;
  width: 145vh !important;
  text-align: center !important;
  margin-top: 2% !important;
  margin-bottom: 2% !important;
  margin-left: 2% !important;
  margin-right: 2% !important;
}
.card-wrapper {
  margin-top: 5px !important;
  margin-bottom: 1% !important;
  width: 100% !important;
  height: 75vh !important;
  margin: 0 auto !important;
}
img {
  width: 100% !important;
  display: block !important;
  max-height: 75vh !important;
}
.img-display {
  overflow: hidden !important;
  max-height: 65vh !important;
}
.img-showcase {
  display: flex !important;
  width: 40vh !important;
  transition: all 0.5s ease !important;
  padding: 5px !important;
  max-height: 65vh !important;
}
.img-showcase img {
  min-width: 100% !important;
}
.img-select {
  display: flex !important;
}
.img-item {
  margin: 0.3rem !important;
}
.img-item:nth-child(1),
.img-item:nth-child(2),
.img-item:nth-child(3) {
  margin-right: 0 !important;
}
.img-item:hover {
  opacity: 0.8 !important;
}
.product-content {
  padding: 2rem 1rem !important;
}
.product-title {
  font-size: 2rem !important;
  text-transform: capitalize !important;
  font-weight: 700 !important;
  position: relative !important;
  color: #12263a !important;
  margin: 1rem 0 !important;
}

.product-link {
  text-decoration: none !important;
  text-transform: uppercase !important;
  font-weight: 400 !important;
  font-size: 0.9rem !important;
  display: inline-block !important;
  margin-bottom: 0.5rem !important;
  background: #256eff;
  color: #fff;
  padding: 0 0.3rem !important;
  transition: all 0.5s ease !important;
}
.product-link:hover {
  opacity: 0.9;
}
.product-rating {
  color: #ffc107;
}
.product-rating span {
  font-weight: 600 !important;
  color: #252525;
}
.product-price {
  margin: 1rem 0 !important;
  font-size: 1rem !important;
  font-weight: 700 !important;
}
.product-price span {
  font-weight: 400 !important;
}
.last-price span {
  color: #f64749;
  text-decoration: line-through !important;
}
.new-price span {
  color: #256eff !important;
  font-size: 1.2rem !important;
  font-weight: 900 !important;
}
.product-detail h2 {
  text-transform: capitalize !important;
  color: #12263a !important;
  padding-bottom: 0.6rem !important;
}
.product-detail p {
  font-size: 0.9rem !important;
  padding: 0.3rem !important;
  opacity: 0.8 !important;
}
.product-detail ul {
  margin: 1rem 0 !important;
  font-size: 0.9rem !important;
}
.product-detail ul li {
  margin: 0 !important;
  list-style: none !important;
  background: url(https://fadzrinmadu.github.io/hosted-assets/product-detail-page-design-with-image-slider-html-css-and-javascript/checked.png)
    left center no-repeat;
  background-size: 18px !important;
  padding-left: 1.7rem !important;
  margin: 0.4rem 0 !important;
  font-weight: 600 !important;
  opacity: 0.9 !important;
}
.product-detail ul li span {
  font-weight: 400 !important;
}
.purchase-info {
  margin: 1.5rem 0 !important;
}
.purchase-info input,
.purchase-info .btn {
  border: 1.5px solid #ddd !important;
  border-radius: 25px !important;
  text-align: center !important;
  padding: 0.45rem 0.8rem !important;
  outline: 0 !important;
  margin-right: 0.2rem !important;
  margin-bottom: 1rem !important;
}
.purchase-info input {
  width: 60px !important;
}
.purchase-info .btn {
  cursor: pointer;
  color: #fff;
}
.purchase-info .btn:first-of-type {
  background: #256eff;
}
.purchase-info .btn:last-of-type {
  background: #f64749;
}
.purchase-info .btn:hover {
  opacity: 0.9 !important;
}
.social-links {
  display: flex;
  align-items: center;
}
.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: #000;
  border: 1px solid #000;
  margin: 0 0.2rem;
  border-radius: 50%;
  text-decoration: none;
  font-size: 0.8rem;
  transition: all 0.5s ease;
}
.social-links a:hover {
  background: #000;
  border-color: transparent;
  color: #fff;
}

@media screen and (min-width: 992px) {
  .card {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    grid-gap: 1.5rem !important;
    margin-bottom: 5% !important;
  }
  .card-wrapper {
    margin-top: 2% !important;
    margin-bottom: 3% !important;
    height: 50vh !important;
    width: 100% !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }
  .product-imgs {
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
  }
  .product-content {
    margin-top: 50px !important;
    padding-top: 0 !important;
  }
  .fa-star.unchecked {
    color: rgb(203, 197, 197) !important;
  }
  .fa-star.checked {
    color: orange !important;
  }
}
</style>
