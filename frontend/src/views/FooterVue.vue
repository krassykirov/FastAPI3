<template>
  <div>
    <section
      id="newsletter"
      class="section-p1"
      style="margin-top: 2%; height: 50px; color: white; cursor: pointer"
      @click="goToTop"
    >
      <div style="cursor: pointer; padding-left: 45%">Back to Top</div>
    </section>

    <section id="newsletter" class="section-p1" style="margin-top: 1%">
      <div class="newstext">
        <h4 style="margin-top: 15px">Sign Up for Newsletters</h4>
        <p>Get Email updates about our latest shop and special offers.</p>
      </div>
      <div class="form" style="margin-top: 15px">
        <input type="text" placeholder="Your email address" />
        <button class="btn normal">Sign Up</button>
      </div>
    </section>

    <footer class="section-p1">
      <div class="col">
        <a href="#">
          <img
            class="logo"
            :src="require('@/assets/eshop-logo-png.png')"
            style="
              width: 100%;
              height: 50px;
              margin-bottom: 0;
              margin-top: 0;
              padding: 0;
            "
        /></a>
        <h4>Contact</h4>
        <p><strong>Phone:</strong>+123456789, +987654321</p>
        <p><strong>Hours:</strong>10.00 - 18.00, Mon - Sat</p>
        <div class="follow">
          <h4>Follow Us</h4>
          <div class="icon">
            <i class="fab fa-facebook-f"></i>
            <i class="fab fa-instagram"></i>
            <i class="fab fa-twitter"></i>
            <i class="fab fa-youtube"></i>
            <i class="fab fa-pinterest-p"></i>
          </div>
        </div>
      </div>

      <div class="sec">
        <div class="col">
          <h4>About</h4>
          <a href="#">About Us</a>
          <a href="#">Delivery Information</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms and Condition</a>
          <a href="#">Contact Us</a>
        </div>

        <div class="col">
          <h4>My Account</h4>
          <a href="#">View Cart</a>
          <a href="#">My Account</a>
          <a href="#">My Wishlist</a>
          <a href="#">Track my Order</a>
          <a href="#">Help</a>
        </div>

        <div class="col install">
          <h4>Install App</h4>
          <p>From App Store or Google Play</p>

          <div class="row"></div>
          <p>Secured Payment Gateways</p>
        </div>
      </div>

      <div class="coypright">
        <p>© 2024 All rights reserved!</p>
      </div>
    </footer>
  </div>
</template>
<script>
export default {
  props: ['cart', 'avatar', 'profile', 'favorites'],
  methods: {
    goToAllProducts() {
      this.$router.push({ name: 'home' })
      this.$nextTick(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
      })
    },
    goToTop() {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }
}
</script>
<style scoped>
html {
  scroll-behavior: smooth;
}

h1 {
  font-size: 50px;
  line-height: 64px;
  color: #222;
}

h2 {
  font-size: 46px;
  line-height: 54px;
  color: #222;
}

h4 {
  font-size: 20px;
  color: #222;
}

h6 {
  font-size: 12px;
  font-weight: 700;
}

p {
  font-size: 16px;
  color: #465b52;
  margin: 15px 0 20px 0;
}

.section-p1 {
  padding: 0 80px;
  margin-top: 5px;
  margin-bottom: 5px;
}

.section-m1 {
  padding: 40px 0;
}

#banner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 80vh;
  background-position: center;
  background-size: cover;
}

#banner h4 {
  color: #fff;
  font-size: 16px;
}

#banner h2 {
  color: #fff;
  font-size: 30px;
  padding: 10px 0;
}

#banner h2 span {
  color: #ef3636;
}

button.normal {
  color: #000;
  padding: 15px 25px;
  height: 50px;
  font-weight: 400;
  font-size: 14px;
  border-radius: 4px;
  background-color: #fff;
  border: none;
  outline: none;
  transition: 0.2s;
  cursor: pointer;
}

#banner button:hover {
  background-color: #088178;
  color: #fff;
}

#sm-banner .banner-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  text-align: center;
  background-image: url('../assets/laptop-banner.jpeg');
  min-width: 520px;
  height: 40vh;
  background-position: center;
  background-size: cover;
  padding: 30px;
  margin-bottom: 5px;
}

#sm-banner .banner-box2 {
  background-image: url('../assets/smartphone-banner.png');
}
#sm-banner .banner-box3 {
  background-image: url('../assets/ipad.jpeg');
}
#sm-banner .banner-box4 {
  background-image: url('../assets/smart-watch-banner.jpg');
}
#sm-banner .banner-box5 {
  background-image: url('../assets/tv-banner.webp');
}
#sm-banner .banner-box6 {
  background-image: url('../assets/smartwatches-banner.webp');
}

#sm-banner {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

#sm-banner h4 {
  color: #fff;
  font-size: 20px;
  font-weight: 300;
}

#sm-banner h2 {
  color: #fff;
  font-size: 20px;
  font-weight: 500;
}

#sm-banner span {
  color: #0e0e0e;
  font-size: 16px;
  font-weight: 500;
  padding-bottom: 16px;
}

button.white {
  color: #faf8f8;
  padding: 10px 20px;
  font-weight: 400;
  font-size: 14px;
  border-radius: 4px;
  background-color: transparent;
  border: 1px solid #fff;
  outline: none;
  transition: 0.2s;
  cursor: pointer;
}
button.white:hover {
  background-color: #088178 !important;
  color: #fff !important;
}

#sm-banner .banner-box:hover button {
  background-color: #088178;
  color: #fff;
  border: 1px solid #088178;
}

#banner3 {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 80px;
}

#banner3 .banner-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  text-align: center;
  min-width: 30%;
  height: 30vh;
  background-position: center;
  background-size: cover;
  padding: 30px;
  margin-bottom: 20px;
}

#banner3 h2 {
  color: #fff;
  font-weight: 900;
  font-size: 22px;
}

#banner3 h3 {
  color: #ec544e;
  font-weight: 800;
  font-size: 15px;
}

#newsletter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  background-repeat: no-repeat;
  background-position: 20% 30%;
  background-color: #041e42;
}

#newsletter h4 {
  color: #fff;
  font-weight: 700;
  font-size: 22px;
}

#newsletter p {
  color: #818ea0;
  font-weight: 600;
  font-size: 14px;
}

#newsletter p span {
  color: #ffbd27;
}

#newsletter input {
  height: 3.125rem;
  width: 100%;
  font-size: 14px;
  padding: 0 1.25em;
  border: 1px solid transparent;
  border-radius: 4px;
  outline: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

#newsletter button {
  background-color: #088178;
  color: #fff;
  white-space: nowrap;
}

#newsletter .form {
  display: flex;
  width: 40%;
}

footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  position: relative;
}

footer .col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
  margin-left: 50px;
}

footer .sec {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

footer .logo {
  margin-bottom: 20px;
}

footer h4 {
  font-size: 14px;
  padding-bottom: 20px;
}

footer p {
  font-size: 13px;
  margin: 0 0 8px 0;
}

footer a {
  font-size: 13px;
  text-decoration: none;
  color: #222;
  margin-bottom: 10px;
}

footer .follow {
  margin-top: 20px;
}

footer .follow i {
  color: #465b52;
  padding-right: 5px;
  cursor: pointer;
}

footer .follow i:hover,
footer a:hover {
  color: #088178;
}

footer .install .row img {
  border: 1px solid #088178;
  border-radius: 6px;
}

footer .install img {
  margin: 10px 0 15px 0;
}

footer .copyright {
  width: 100%;
  text-align: center;
}

/*----------------------Media Query ----------*/

@media (max-width: 920px) {
  .section-p1 {
    padding: 40px 40px;
  }

  #mobile {
    display: flex;
    align-items: center;
  }
  #mobile i {
    font-size: 32px;
    color: #1a1a1a;
    padding-left: 20px;
  }
  body #lg-bag {
    display: none;
  }

  #lg-bag {
    display: none;
  }

  #banner {
    height: 25vh;
  }

  #sm-banner .banner-box {
    min-width: 100%;
    height: 30vh;
  }

  #banner3 {
    padding: 0 40px;
  }

  #banner3 .banner-box {
    width: 28%;
  }

  #newsletter .form {
    width: 70%;
  }
}

@media (max-width: 477px) {
  .section-p1 {
    padding: 20px;
  }

  #header {
    padding: 10px 30px;
  }

  h2 {
    font-size: 30px;
  }

  h1 {
    font-size: 28px;
  }

  p {
    line-height: 24px;
    font-size: 10px;
  }

  #banner {
    height: 40vh;
  }
  #sm-banner .banner-box {
    height: 40vh;
  }

  #sm-banner .banner-box2 {
    margin-top: 20px;
  }

  #banner3 {
    padding: 0 20px;
  }

  #banner3 .banner-box {
    width: 100%;
  }

  #newsletter .form {
    width: 100%;
  }

  #newsletter {
    padding: 40px 20px;
  }

  footer .copyright {
    text-align: start;
  }
}
</style>
