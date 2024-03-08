import store from '@/store/index.js'

export default {
  methods: {
    handleError(error) {
      // console.log('Handling error:', error.message)
      if (
        error.message.startsWith('Invalid') ||
        error.message.startsWith('Username')
      ) {
        this.errorMessage = 'Username or password are incorrect!'
        // console.log('Username or password are incorrect!..')
      } else if (error.message.startsWith('No profile with')) {
        // console.log('No profile found')
      } else if (error.message === 'Token Expired') {
        // console.log('Handling error Mixin: Token Expired, logging out..')
        this.errorMessage = 'Session has expired. Please log in.'
        store.dispatch('logout')
      } else if (error.message === 'Cannot read properties of null') {
        // console.log(
        //   'Handling error Mixin: Something went wrong, please try again',
        //   error
        // )
        this.errorMessage = 'Something went wrong, please try again'
      } else if (
        error instanceof TypeError &&
        error.message === 'Failed to fetch'
      ) {
        // console.log(
        //   'Handling error Mixin: Please check your internet connection.',
        //   error
        // )
        this.errorMessage =
          'Failed to fetch data. Please check your internet connection.'
      } else {
        // console.log(
        //   'Handling error Mixin: Something went wrong, please try again',
        //   error
        // )
        this.errorMessage = 'Something went wrong, please try again'
      }
    }
  }
}
