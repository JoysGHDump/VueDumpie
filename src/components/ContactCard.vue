<template>
  <div class="contact-card-container">
    <div v-for="contact in contacts" :key="contact.id" class="contact-cardholder">
      <div class="contact-card-content">
        <div class="contact-card-header">
          <h3 class="contact-name">
            <router-link :to="`/contacts/${contact.id}`">
              {{ contact.name }}
            </router-link>
          </h3>
          <div class="contact-actions">
            <v-btn
              icon 
              variant="text"
              @click="editContact(contact)"
              :title="`Edit ${contact.name}`"
            >
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn
              icon 
              variant="text"
              @click="handleDelete(contact)"
              :title="`Delete ${contact.name}`"
            >
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </div>
        </div>
        <p class="contact-info">{{ contact.email }}</p>
        <p class="contact-info">{{ contact.phone }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import './css/ContactCard.css'
export default {
  name: "ContactCard",
  props: {
    contacts: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["edit-contact", "delete-contact"],
  methods: {
    editContact(contact) {
      this.$emit("edit-contact", contact)
    },
    handleDelete(contact) {
      const confirmed = window.confirm(`Are you sure you want to delete ${contact.name}?`)
      if (confirmed) {
        this.$emit("delete-contact", contact)
      }
    },
  },
}
</script>

<style scoped>
</style>