<template>
  <Carousel
    id="gallery"
    :items-to-show="1"
    :wrap-around="false"
    v-model="currentSlide"
  >
    <Slide v-for="(image, index) in item.images.images" :key="index">
      <div class="carousel__item">
        <img
          :src="`${backendEndpoint}/static/img/${item.name}/${image}`"
          alt="Image"
          class="img-fluid"
        />
      </div>
    </Slide>
  </Carousel>

  <Carousel
    id="thumbnails"
    :items-to-show="4"
    :wrap-around="true"
    v-model="currentSlide"
    ref="carousel"
  >
    <Slide v-for="(image, index) in item.images.images" :key="index">
      <div class="carousel__item" @click="slideTo(index)">
        <img
          :src="`${backendEndpoint}/static/img/${item.name}/${image}`"
          alt="Image"
          class="img-thumbnail"
          style="cursor: pointer"
        />
      </div>
    </Slide>
  </Carousel>
</template>

<script>
import { defineComponent } from 'vue'
import { Carousel, Slide } from 'vue3-carousel'

import 'vue3-carousel/dist/carousel.css'

export default defineComponent({
  name: 'GalleryExample',
  props: {
    backendEndpoint: {
      type: String,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  components: {
    Carousel,
    Slide
  },
  data: () => ({
    currentSlide: 0
  }),
  methods: {
    slideTo(val) {
      this.currentSlide = val
    }
  }
})
</script>
