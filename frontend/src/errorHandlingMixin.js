export default {
  methods: {
    handleError(error) {
      console.log('Handling error:', error.message)

      if (error.message === 'Token Expired') {
        console.log('Handling error Mixin: Token Expired')
        this.errorMessage = 'Session has expired. Please log in.'
      } else if (error.message === 'Cannot read properties of null') {
        console.log(
          'Handling error Mixin: Something went wrong, please try again'
        )
        this.errorMessage = 'Something went wrong, please try again'
      } else if (
        error instanceof TypeError &&
        error.message === 'Failed to fetch'
      ) {
        console.log(
          'Handling error Mixin: Please check your internet connection.'
        )
        this.errorMessage =
          'Failed to fetch data. Please check your internet connection.'
      } else {
        console.log(
          'Handling error Mixin: Something went wrong, please try again'
        )
        this.errorMessage = 'Something went wrong, please try again'
      }
    }
  }
}
