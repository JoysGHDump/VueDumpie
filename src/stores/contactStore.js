import { defineStore } from 'pinia'
import axios from 'axios'

const apiUrl = 'http://localhost:5034/contacts'

export const useContactStore = defineStore('contact', {
  state: () => ({
    contacts: [],
    loading: false,
    error: null
  }),

  getters: {
    getContactById: (state) => (id) => {
      return state.contacts.find(contact => contact.id == id)
    },
    contactsCount: (state) => state.contacts.length
  },

  actions: {
    async fetchContacts() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(apiUrl)
        this.contacts = response.data
      } catch (error) {
        this.error = error.message
        console.error('Error fetching contacts:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchContactById(id) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${apiUrl}/${id}`)
        return response.data
      } catch (error) {
        this.error = error.message
        console.error('Error fetching contact:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async addContact(contact) {
      try {
        const response = await axios.post(apiUrl, contact)
        this.contacts.push(response.data)
        return response.data
      } catch (error) {
        this.error = error.message
        console.error('Error adding contact:', error)
        throw error
      }
    },

    async updateContact(id, updatedContact) {
      try {
        const response = await axios.put(`${apiUrl}/${id}`, updatedContact)
        const index = this.contacts.findIndex(contact => contact.id == id)
        if (index !== -1) {
          this.contacts[index] = response.data
        }
        return response.data
      } catch (error) {
        this.error = error.message
        console.error('Error updating contact:', error)
        throw error
      }
    },

    async deleteContact(id) {
      try {
        await axios.delete(`${apiUrl}/${id}`)
        this.contacts = this.contacts.filter(contact => contact.id != id)
      } catch (error) {
        this.error = error.message
        console.error('Error deleting contact:', error)
        throw error
      }
    }
  }
})