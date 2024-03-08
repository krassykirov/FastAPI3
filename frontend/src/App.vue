<template>
  <div>
    <router-view
      :is-idle="isIdle"
      :last-active-date="lastActiveDate"
      :inactive-time="inactiveTime"
    />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useIdle } from '@vueuse/core'
import store from '@/store/index.js'

export default {
  setup() {
    // Track idle status
    const { idle, lastActive } = useIdle(1 * 60 * 1000) // 5 min useIdle(5 * 60 * 1000) // 5 min
    let intervalId
    // Reactive variables to hold idle status and last active time
    const isIdle = ref(false)
    const lastActiveDate = ref(new Date(lastActive.value))
    const inactiveTime = ref(0)

    const updateValues = () => {
      const currentTime = new Date().getTime()
      const lastActiveTime = lastActive.value
      const diff = currentTime - lastActiveTime
      inactiveTime.value = Math.floor(diff / 60000) // Convert milliseconds to minutes
      isIdle.value = diff >= 1 * 10 * 1000 // Check if the user is idle for more than 5 minutes
      if (inactiveTime.value >= 30) {
        store.dispatch('inactiveLogout')
      }
    }
    const handlePopstate = function (event) {
      if (event.state && event.state.current === '/products') {
        window.location.assign('/products')
      }
    }
    const handlePopstate2 = function (event) {
      if (event.state && event.state.current.startsWith('/category')) {
        let navigateTo = event.state.current
        window.location.assign(navigateTo)
      }
    }
    window.addEventListener('popstate', handlePopstate)
    window.addEventListener('popstate', handlePopstate2)

    onMounted(() => {
      idle.value = false
      intervalId = setInterval(updateValues, 60000) // 1m, Check every second 1000
    })

    onUnmounted(() => {
      clearInterval(intervalId)
      lastActiveDate.value = new Date()
      inactiveTime.value = 0
      window.removeEventListener('popstate', handlePopstate)
      window.removeEventListener('popstate2', handlePopstate2)
    })

    watch(lastActive, () => {
      lastActiveDate.value = new Date(lastActive.value)
    })

    return {
      isIdle,
      lastActiveDate,
      inactiveTime
    }
  }
}
</script>
