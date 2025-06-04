<template>
  <div class="table-container">
    <table class="contact-table">
      <thead>
        <tr>
          <th class="table-header">Name</th>
          <th class="table-header">Contact Number</th>
          <th class="table-header">Email Address</th>
          <th class="table-header actions-col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="contacts.length === 0">
          <td colspan="4" class="table-cell no-contacts">No contacts found.</td>
        </tr>
        <tr v-for="contact in contacts" :key="contact.id">
          <td class="table-cell">
            <router-link :to="`/contacts/${contact.id}`" class="contact-table-link">
              {{ contact.name }}
            </router-link>
          </td>
          <td class="table-cell">{{ contact.phone }}</td>
          <td class="table-cell">{{ contact.email }}</td>
          <td class="table-cell actions-col">
            <div class="action-buttons">
              <v-btn icon variant="text" @click="editContact(contact)" :title="`Edit ${contact.name}`">
                <v-icon>mdi-pencil-outline</v-icon>
              </v-btn>
              <v-btn icon variant="text" @click="handleDelete(contact)" :title="`Delete ${contact.name}`">
                <v-icon>mdi-delete-outline</v-icon>
              </v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import './css/ContactTable.css'
export default {
  name: "ContactTable",
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