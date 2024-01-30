export default {
  methods: {
    handleError(error) {
      if (error.message === 'Token Expired') {
        this.errorMessage = 'Session has expired. Please log in.'
      }
      if (error.message === 'Cannot read properties of null') {
        this.errorMessage = 'Something went wrong, please try again'
      }
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        this.errorMessage =
          'Failed to fetch data. Please check your internet connection.'
      } else {
        this.errorMessage = 'Something went wrong, please try again'
      }
    }
  }
}
