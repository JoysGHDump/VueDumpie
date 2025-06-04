<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <form @submit.prevent="onSubmit" class="contact-form">
        <h2>{{ isEditModalOpen ? 'Edit Contact' : 'Add New Contact' }}</h2>
       
        <div class="form-field">
          <label class="input-label">Name</label>
          <input
            v-model="formData.name"
            type="text"
            class="contact-input"
            :class="{ 'error': errors.name }"
            @blur="validateName"
            @input="validateName"
          />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <div class="form-field">
          <label class="input-label">Contact Number</label>
          <input
            v-model="formData.phone"
            type="text"
            class="contact-input"
            :class="{ 'error': errors.phone }"
            maxlength="13"
            @input="handlePhoneChange"
            @blur="validatePhone"
          />
          <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
        </div>

        <div class="form-field">
          <label class="input-label">Email Address</label>
          <input
            v-model="formData.email"
            type="email"
            class="contact-input"
            :class="{ 'error': errors.email }"
            @blur="validateEmail"
            @input="validateEmail"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="contact-form-buttons">
          <button
            type="button"
            class="cancel-button"
            @click="closeModal"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="submit-button"
            :disabled="!isFormValid"
          >
            {{ isEditModalOpen ? 'Save Changes' : 'Add Contact' }}
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Snackbar -->
  <div v-if="snackbarOpen" class="snackbar">
    {{ snackbarMessage }}
  </div>
</template>

<script>
import './css/ContactFormModal.css'
import { ref, watch, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useContactStore } from '../stores/contactStore'

export default {
  name: 'ContactFormModal',
  props: {
    isOpen: Boolean,
    isEditModalOpen: Boolean,
    selectedContact: Object
  },
  emits: ['close-modal'],
  setup(props, { emit }) {
    const router = useRouter()
    const contactStore = useContactStore()
    
    const formData = ref({
      name: '',
      phone: '',
      email: ''
    })

    const errors = ref({})
    const snackbarOpen = ref(false)
    const snackbarMessage = ref('')

    const isFormValid = computed(() => {
      const hasAllFields = formData.value.name.trim() &&
                          formData.value.phone.trim() &&
                          formData.value.email.trim()
      const hasNoErrors = Object.keys(errors.value).length === 0
      return hasAllFields && hasNoErrors
    })

    const resetForm = () => {
      formData.value = {
        name: '',
        phone: '',
        email: ''
      }
      errors.value = {}
    }

    const formatPhone = (value) => {
      const cleaned = value.replace(/\D/g, '')
      if (cleaned.length <= 4) return cleaned
      if (cleaned.length <= 7) return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7, 11)}`
    }

    const handlePhoneChange = (e) => {
      const formatted = formatPhone(e.target.value)
      formData.value.phone = formatted
      // Validate immediately after formatting
      validatePhone()
    }

    const validateName = () => {
      if (!formData.value.name.trim()) {
        errors.value.name = 'Please enter a name.'
      } else {
        delete errors.value.name
      }
    }

    const validatePhone = () => {
      const phoneRegex = /^09\d{2}-\d{3}-\d{4}$/
      if (!formData.value.phone) {
        errors.value.phone = 'Please enter a contact number.'
      } else if (!phoneRegex.test(formData.value.phone)) {
        errors.value.phone = 'Please enter a valid Phone Number.'
      } else {
        delete errors.value.phone
      }
    }

    const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!formData.value.email) {
        errors.value.email = 'Please enter a valid email address.'
      } else if (!emailRegex.test(formData.value.email)) {
        errors.value.email = 'Please enter a valid email address.'
      } else {
        delete errors.value.email
      }
    }

    const onSubmit = async () => {
      validateName()
      validatePhone()
      validateEmail()

      if (Object.keys(errors.value).length > 0) {
        return
      }

      try {
        if (props.isEditModalOpen) {
          await contactStore.updateContact(props.selectedContact.id, formData.value)
          snackbarMessage.value = 'Updated Contact!'
        } else {
          await contactStore.addContact(formData.value)
          snackbarMessage.value = 'Successfully Added a New Contact!'
        }
       
        snackbarOpen.value = true
        setTimeout(() => {
          snackbarOpen.value = false
        }, 3000)
       
        closeModal()
        router.push('/contacts')
      } catch (error) {
        console.error('Error with contact operation:', error)
      }
    }

    const closeModal = () => {
      resetForm()
      // Remove focus from any active element to clear cursor
      nextTick(() => {
        if (document.activeElement) {
          document.activeElement.blur()
        }
      })
      emit('close-modal')
    }

    watch(() => props.selectedContact, (newContact) => {
      if (props.isEditModalOpen && newContact) {
        const formattedPhone = newContact.phone?.replace(/\D/g, '').replace(/^(\d{4})(\d{3})(\d{4})$/, '$1-$2-$3')
        formData.value = {
          ...newContact,
          phone: formattedPhone || ''
        }
        // Clear errors when editing
        errors.value = {}
      } else {
        resetForm()
      }
    })

    // Watch for modal open/close to handle focus
    watch(() => props.isOpen, (newValue) => {
      if (!newValue) {
        nextTick(() => {
          if (document.activeElement) {
            document.activeElement.blur()
          }
        })
      }
    })

    return {
      formData,
      errors,
      snackbarOpen,
      snackbarMessage,
      isFormValid,
      handlePhoneChange,
      validateName,
      validatePhone,
      validateEmail,
      onSubmit,
      closeModal
    }
  }
}
</script>

<style scoped>
</style>