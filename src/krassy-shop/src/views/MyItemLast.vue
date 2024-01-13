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
                  class="w-100"
                  src="https://cdn.pixabay.com/photo/2015/07/24/18/40/model-858754_960_720.jpg"
                  alt="Sale"
                />
              </div>
              <div class="col-md-3">
                <img
                  class="w-100"
                  src="https://cdn.pixabay.com/photo/2015/07/24/18/38/model-858749_960_720.jpg"
                  alt="Sale"
                />
              </div>
              <div class="col-md-3">
                <img
                  class="w-100"
                  src="https://cdn.pixabay.com/photo/2015/07/24/18/39/model-858751_960_720.jpg"
                  alt="Sale"
                />
              </div>
              <div class="col-md-3">
                <img
                  class="w-100"
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
              <p class="new-price text-bold mb-1">${{ item.discount_price }}</p>
              <!-- <p class="text-secondary mb-1">
                (Additional tax may apply on checkout)
              </p> -->
            </div>
            <p style="cursor: pointer; margin-bottom: 1%" v-if="item">
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
                  >{{ item.rating_float }}</span
                >
              </i>
              <span :id="'overall-rating' + item.id">
                ({{ item.reviewNumber }})
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
</style>
