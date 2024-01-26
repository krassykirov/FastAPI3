export default {
  methods: {
    handleError(error) {
      if (error.message === 'Token Expired') {
        this.errorMessage = 'Session has expired. Please log in.'
      } else {
        console.error(error)
        this.errorMessage = 'Something went wrong, please try again'
      }
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        this.errorMessage =
          'Failed to fetch data. Please check your internet connection.'
      }
    }
  }
}
