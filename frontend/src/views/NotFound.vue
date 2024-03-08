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
        :profile="profile"
        :favorites="favorites"
      />
    </nav>
    <div>
      <img
        :src="require('@/assets/404.jpg')"
        style="width: 100%; height: 80%"
      />
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/MyNavbar.vue'

export default {
  components: {
    NavBar
  },
  props: [
    'cart',
    'total',
    'avatar',
    'favorites',
    'catchAll',
    'user',
    'profile'
  ],
  name: 'NotFound'
}
</script>
