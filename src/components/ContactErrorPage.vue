<template>
  <div class="error-container">
    <div class="error-icon">!</div>
    <h1 class="error-title">Oops! Page Not Found</h1>
    <p class="error-message">
      Sorry, the requested page was not found. Please check the URL again.
    </p>
    <button class="back-button" @click="handleBackClick">
      Go to Contacts
    </button>
  </div>
</template>

<script>
import './css/ContactErrorPage.css'
import { useRouter } from 'vue-router'

export default {
  name: 'ContactErrorPage',
  setup() {
    const router = useRouter()

    const handleBackClick = () => {
      router.push('/contacts')
    }

    return {
      handleBackClick
    }
  }
}
</script>

<style scoped>
</style>