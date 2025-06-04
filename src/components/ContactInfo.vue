<template>
  <div v-if="contactStore.loading" class="loading">Loading...</div>
  <div v-else-if="contact" class="contact-container" tabindex="-1">
    <!-- Back button and header -->
    <div class="contact-header">
      <button class="back-button" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <h1 class="contact-title">Contact Information</h1>
    </div>

    <!-- Contact card -->
    <div class="contact-card">
      <!-- Contact information -->
      <div class="contact-info-section">
        <div class="info-group">
          <span class="info-label">First Name</span>
          <span class="info-value">{{ contact.name }}</span>
        </div>
        <div class="info-group">
          <span class="info-label">Email Address</span>
          <span class="info-value">{{ contact.email }}</span>
        </div>
        <div class="info-group">
          <span class="info-label">Contact Number</span>
          <span class="info-value">{{ contact.phone }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "./css/ContactInfo.css"
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useContactStore } from "../stores/contactStore"

export default {
  name: "ContactInfo",
  setup() {
    const route = useRoute()
    const router = useRouter()
    const contactStore = useContactStore()
    const contact = ref(null)

    const fetchContact = async () => {
      try {
        const response = await contactStore.fetchContactById(route.params.id)
        contact.value = response
      } catch (error) {
        console.error("Error fetching contact data:", error)
        router.push("/error")
      }
    }

    const goBack = () => {
      router.go(-1)
    }

    onMounted(() => {
      fetchContact()
    })

    return {
      contactStore,
      contact,
      goBack,
    }
  },
}
</script>

<style scoped>
</style>