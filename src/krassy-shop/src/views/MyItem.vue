<template>
  <body>
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
    </div>
    <main class="main bd-grid">
      <article class="card">
        <div class="card__img">
          <img src="https://i.postimg.cc/8PkwdTYd/image.png" alt="" />
        </div>
        <div class="card__name">
          <p>AIR ZOOM PEGASUS</p>
        </div>
        <div class="card__precis">
          <a href="" class="card__icon"
            ><ion-icon name="heart-outline"></ion-icon
          ></a>

          <div>
            <span class="card__preci card__preci--before">$990.00</span>
            <span class="card__preci card__preci--now">$749.00</span>
          </div>
          <a href="" class="card__icon"
            ><ion-icon name="cart-outline"></ion-icon
          ></a>
        </div>
      </article>

      <article class="card">
        <div class="card__img">
          <img src="https://i.postimg.cc/4dBHXR1Z/image.png" alt="" />
        </div>
        <div class="card__name">
          <p>AIR ZOOM PEGASUS</p>
        </div>
        <div class="card__precis">
          <a href="" class="card__icon"
            ><ion-icon name="heart-outline"></ion-icon
          ></a>
          <div>
            <span class="card__preci card__preci--before">$990.00</span>
            <span class="card__preci card__preci--now">$749.00</span>
          </div>
          <a href="" class="card__icon"
            ><ion-icon name="cart-outline"></ion-icon
          ></a>
        </div>
      </article>

      <article class="card">
        <div class="card__img">
          <img src="https://i.postimg.cc/DfRL0nTy/image.png" alt="" />
        </div>
        <div class="card__name">
          <p>AIR ZOOM PEGASUS</p>
        </div>
        <div class="card__precis">
          <a href="" class="card__icon"
            ><ion-icon name="heart-outline"></ion-icon
          ></a>

          <div>
            <span class="card__preci card__preci--before">$990.00</span>
            <span class="card__preci card__preci--now">$749.00</span>
          </div>
          <a href="" class="card__icon"
            ><ion-icon name="cart-outline"></ion-icon
          ></a>
        </div>
      </article>

      <article class="card">
        <div class="card__img">
          <img src="https://i.postimg.cc/DfRL0nTy/image.png" alt="" />
        </div>
        <div class="card__name">
          <p>AIR ZOOM PEGASUS</p>
        </div>
        <div class="card__precis">
          <a href="" class="card__icon"
            ><ion-icon name="heart-outline"></ion-icon
          ></a>

          <div>
            <span class="card__preci card__preci--before">$990.00</span>
            <span class="card__preci card__preci--now">$749.00</span>
          </div>
          <a href="" class="card__icon"
            ><ion-icon name="cart-outline"></ion-icon
          ></a>
        </div>
      </article>
    </main>
    <footer>
      <a href="https://github.com/bedimcode">CR : Bedimcode </a>
    </footer>
  </body>
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
      item: null,
      itemId: this.itemId
    }
  },
  created() {
    this.getProduct()
  },
  computed: {
    cartFromStore() {
      return this.$store.state.cart
    },
    user() {
      return this.$store.getters.user
    },
    accessToken() {
      return this.$store.state.accessToken
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
        this.getItemRatingItem(this.item.id)
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
      fetch(`http://127.0.0.1:8000/api/reviews?item_id=${id}`, {
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
    },
    nextSlide() {
      this.goToSlide(this.currentSlide + 1)
    },
    previousSlide() {
      this.goToSlide(this.currentSlide - 1)
    },
    goToSlide(n) {
      const sliderItems = this.$refs.sliderItems

      if (
        sliderItems &&
        sliderItems.children &&
        sliderItems.children.length > 0
      ) {
        const currentSlideElement = sliderItems.children[this.currentSlide]

        if (currentSlideElement) {
          currentSlideElement.classList.remove('sliderBlock_items__showing')
        }

        this.currentSlide = (n + this.slides.length) % this.slides.length

        const newCurrentSlideElement = sliderItems.children[this.currentSlide]

        if (newCurrentSlideElement) {
          newCurrentSlideElement.classList.add('sliderBlock_items__showing')
        }
      }
    },
    toggleSpecification() {
      // Implement the logic to toggle specification
      // For example, toggle classes or modify data
    },
    incrementQuantity() {
      this.quantity += 1
    },
    decrementQuantity() {
      if (this.quantity > 1) {
        this.quantity -= 1
      }
    }
  },
  beforeUnmount() {
    // Clear the interval when the component is destroyed
    clearInterval(this.slideInterval)
  }
}
</script>
<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
@import url('https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css');
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css');
@import url('//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
@import url('https://fonts.googleapis.com/css?family=Raleway');

/*-- VARIABLES CSS--*/
/*Colores*/
:root {
  --first-color: #e3f8ff;
  --second-color: #dcfafb;
  --third-color: #ffe8df;
  --accent-color: #ff5151;
  --dark-color: #161616;
}

/*Tipografia responsive*/
:root {
  --body-font: 'Open Sans';
  --h1-font-size: 1.5rem;
  --h3-font-size: 1rem;
  --normal-font-size: 0.938rem;
  --smaller-font-size: 0.75rem;
}
@media screen and (min-width: 768px) {
  :root {
    --h1-font-size: 2rem;
    --normal-font-size: 1rem;
    --smaller-font-size: 0.813rem;
  }
}

/*-- BASE --*/
*,
::after,
::before {
  box-sizing: border-box;
}
body {
  margin: 2rem 0 0 0;
  background-color: #fff;
  color: var(--dark-color);
  font-family: var(--body-font);
}
h1 {
  font-size: var(--h1-font-size);
}
img {
  max-width: 100%;
  height: auto;
}
a {
  text-decoration: none;
}

/*-- LAYAOUT --*/
.main {
  padding: 2rem 0;
}
.bd-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  max-width: 1200px;
  margin-left: 2.5rem;
  margin-right: 2.5rem;
  align-items: center;
  gap: 2rem;
}

/*-- PAGES --*/
.title-shop {
  position: relative;
  margin: 0 2.5rem;
}
.title-shop::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 72px;
  height: 2px;
  background-color: var(--dark-color);
  margin-left: 0.25rem;
}

/*-- COMPONENT --*/
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  overflow: hidden;
}
article:nth-child(1) {
  background-color: var(--first-color);
}
article:nth-child(2) {
  background-color: var(--second-color);
}
article:nth-child(3) {
  background-color: var(--third-color);
}
article:nth-child(4) {
  background-color: var(--second-color);
}
.card__img {
  width: 180px;
  height: auto;
  padding: 3rem 0;
  transition: 0.5s;
}
.card__name {
  position: absolute;
  left: -25%;
  top: 0;
  width: 3.5rem;
  height: 100%;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  text-align: center;
  background-color: var(--dark-color);
  color: #fff;
  font-weight: bold;
  transition: 0.5s;
}
.card__icon {
  font-size: 1.5rem;
  color: var(--dark-color);
}
.card__icon:hover {
  color: var(--accent-color);
}
.card__precis {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  transition: 0.5s;
}
.card__preci {
  display: block;
  text-align: center;
}
.card__preci--before {
  font-size: var(--smaller-font-size);
  color: var(--accent-color);
  margin-bottom: 0.25rem;
}
.card__preci--now {
  font-size: var(--h3-font-size);
  font-weight: bold;
}
/*Move left*/
.card:hover {
  box-shadow: 0 0.5rem 1rem #d1d9e6;
}
.card:hover .card__name {
  left: 0;
}
.card:hover .card__img {
  transform: rotate(30deg);
  margin-left: 3.5rem;
}
.card:hover .card__precis {
  margin-left: 3.5rem;
  padding: 0 1.5rem;
}

/*-- FOOTER --*/

footer {
  text-align: center;
}

/*-- MEDIA QUERIES --*/
@media screen and (min-width: 1200px) {
  body {
    margin: 3rem 0 0 0;
  }
  .title-shop {
    margin: 0 5rem;
  }
  .bd-grid {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
