<template>
  <div>
    <!-- <MyNavbar /> -->
    <router-view />
  </div>
</template>

<script>
// import MyNavbar from '@/components/MyNavbar.vue'
// import Login from './views/Login.vue'

export default {
  components: {
    // MyNavbar
  }
}
</script>

<style>
@import url('//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
@import url('https://fonts.googleapis.com/css?family=Raleway');

html {
  width: 100vw;
}
body {
  overflow-x: hidden;
  scrollbar-gutter: stable both-edges;
  background-color: #f2f6f6;
}

* {
  font-family: 'Raleway';
}

.product-fade-enter-active,
.product-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.product-fade-enter,
.product-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.dropdown-menu {
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  margin-bottom: 0;
}

label {
  font-size: 14px;
  font-weight: 400;
}

body.modal-open {
  padding-right: -17px;
}

.card-img-top {
  width: 100%;
  height: 13vw;
  object-fit: cover;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 5px;
  margin-top: 15px;
}

.card {
  margin-bottom: 3px;
  margin-left: 1px;
  margin-right: 1px;
  width: 16vw;
  justify-content: left;
  /* border: 2px solid #969696; */
  text-align: center;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

.card-title {
  margin-top: 0;
  /* margin: 0; */
}
/* .card-body{
  padding: 0;
  padding-left: 0;
  padding-top: 0;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
} */

.dropbtn {
  background-color: #919d98;
  color: white;
  padding: 14px;
  font-size: 14px;
  border: none;
  border-radius: 4em;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  font-size: 13px;
}

.dropdown-content a {
  color: black;
  padding: 10px 14px;
  text-decoration: none;
  display: block;
}

.avatar {
  vertical-align: middle;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.form-control:focus {
  color: #495057;
  background-color: #fff;
  border-color: #ffffff;
  outline: 0;
  box-shadow: 0 0 0 1px rgb(139, 133, 133) !important;
}

.form-control {
  font-size: 0.9rem;
}

.send {
  color: #fff;
  background-color: #13b942;
  border-color: #ff0000;
}
.send:hover {
  color: #fff;
  background-color: #029cf5;
  border-color: #02b0f5;
}
.rating {
  display: flex;
  margin-top: -10px;
  flex-direction: row-reverse;
  margin-left: -4px;
  float: left;
}
.rating > input {
  display: none;
}
.rating > label {
  position: relative;
  width: 19px;
  font-size: 25px;
  color: orange;
  cursor: pointer;
}
.rating > label::before {
  content: '\2605';
  position: absolute;
  opacity: 0;
}
.rating > label:hover:before,
.rating > label:hover ~ label:before {
  opacity: 1 !important;
}
.rating > input:checked ~ label:before {
  opacity: 1;
}
.rating:hover > input:checked ~ label:before {
  opacity: 0.4;
}
.price {
  color: grey;
  font-size: 22px;
}

.card button:hover {
  opacity: 0.7;
}
/* Style the tab */

.checked {
  color: orange;
}
.dropdown-content a:hover {
  background-color: #ddd;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown:hover .dropbtn {
  background-color: #606c97;
}

/* Styles for the price input container */

.price-input .price-field {
  display: flex;
  margin-bottom: 22px;
}

.price-field span {
  margin-right: 10px;
  margin-top: 10px; /* Adjusted margin-top */
  font-size: 17px;
  color: #404447;
}

.price-field input {
  flex: 1;
  height: 35px;
  font-size: 15px;
  font-family: 'DM Sans', sans-serif;
  border-radius: 9px;
  text-align: center;
  border: 0px;
  background: #e4e4e4;
}

.price-input {
  width: 100%;
  font-size: 19px;
  color: #555;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.slider-container {
  width: 100%;
}

.slider-container {
  height: 6px;
  position: relative;
  background: #e4e4e4;
  border-radius: 5px;
}

.slider-container .price-slider {
  height: 100%;
  left: 0%;
  right: 0%;
  position: absolute;
  border-radius: 5px;
  background: #5e95e2;
}

.range-input {
  position: relative;
}

.range-input input {
  position: absolute;
  width: 100%;
  height: 5px;
  background: none;
  top: -5px;
  pointer-events: none;
  cursor: pointer;
  -webkit-appearance: none;
}

/* Styles for the range thumb in WebKit browsers */
input[type='range']::-webkit-slider-thumb {
  height: 14px;
  width: 14px;
  border-radius: 70%;
  background: #1261b5;
  pointer-events: auto;
  -webkit-appearance: none;
}

@media screen and (max-width: 768px) {
  .price-input {
    flex-direction: column;
    align-items: center;
  }
}

/* From Base_OLD */

#cartDropdown {
  margin-top: 14px;
}
.btn {
  /* border: 1px solid #ddd; */
  /* border-radius: 25px; */
  text-align: center;
  padding: 0.45rem 0.7rem;
  outline: 0;
  margin-right: 0.2rem;
  margin-bottom: 1rem;
}

INPUT[type='checkbox']:focus {
  outline: 1px solid rgba(0, 0, 0, 0.2);
}

INPUT[type='checkbox'] {
  background-color: #e6eaeb;
  border-radius: 1px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 17px;
  height: 17px;
  cursor: pointer;
  position: relative;
  top: 5px;
}

INPUT[type='checkbox']:checked {
  background-color: #409fd6;
  background: #409fd6
    url('data:image/gif;base64,R0lGODlhCwAKAIABAP////3cnSH5BAEKAAEALAAAAAALAAoAAAIUjH+AC73WHIsw0UCjglraO20PNhYAOw==')
    3px 3px no-repeat;
}

INPUT[type='checkbox']:disabled {
  background: #e6e6e6;
  opacity: 0.6;
  pointer-events: none;
}

.product-container {
  display: flex;
}

.filter-products-container {
  display: flex;
  flex-direction: column;
  margin-left: 5.5%;
  margin-top: 1.2%;
}

.product-list {
  flex-grow: 1;
  padding-right: 1%;
  padding-left: 0.03%;
  margin-top: 1.2%;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.filter-card {
  margin-bottom: 5px;
  padding: 10px;
  border: 1px solid #cfcdcd;
  border-radius: 9px;
  background-color: white;
}

.filter-group {
  user-select: none;
  margin-bottom: 30px;
  border-bottom: 10px solid #ddd;
  padding-bottom: 10px;
}

.filter-group:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.fa-star.unchecked {
  color: rgb(203, 197, 197);
}
.fa-star.checked {
  color: orange;
}
.custom-button {
  width: 150px;
  margin: auto;
  margin-left: 14%;
  margin-bottom: 3px;
  font-size: 14px;
  border-radius: 20px;
  border: 1px solid #ccc;
  background-color: #fff;
  padding: 6px 30px;
  cursor: pointer;
  color: #000;
}

.form-check {
  display: block;
  margin-bottom: 5px; /* Adjust the margin as needed */
}

.custom-button:hover {
  background-color: #e0e0e0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  z-index: 1;
}
.fade-enter-to {
  opacity: 1;
}
.fade-enter-from {
  opacity: 0;
}
</style>
