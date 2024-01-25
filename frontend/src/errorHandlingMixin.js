export default {
  methods: {
    handleError(error) {
      if (error.message !== 'Token Expired') {
        console.error(error)
      }
      this.errorMessage = 'Token has expired. Please log in.'
    }
  }
}
