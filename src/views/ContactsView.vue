<template>
    <div class="app-container" tabindex="-1">
        <!-- Header Section -->
        <div class="header-section">
            <div>
                <h1 class="header-title">Contacts Information</h1>
                <p class="header-subtitle">Your list of contacts appear here. To add a new contact, click on the Add New Contact button.</p>
            </div>
            <button class="add-contact-button" @click="openAddModal">Add New Contact</button>
        </div>

        <!-- View Toggle Section -->
        <div class="toggle-section">
            <v-btn class="toggle-button" :class="{ active: view === 'card' }" @click="setView('card')" icon elevation="0">
                <v-icon>mdi-view-grid</v-icon>
            </v-btn>
            <v-btn class="toggle-button" :class="{ active: view === 'table' }" @click="setView('table')" icon elevation="0">
                <v-icon>mdi-menu</v-icon>
            </v-btn>
        </div>

        <!-- Loading State -->
        <div v-if="contactStore.loading" class="loading">Loading...</div>

        <!-- Contact View -->
        <ContactCard v-else-if="view === 'card'" :contacts="contactStore.contacts" @edit-contact="handleEditContact" @delete-contact="handleDeleteContact" />
        <ContactTable v-else :contacts="contactStore.contacts" @edit-contact="handleEditContact" @delete-contact="handleDeleteContact" />

        <!-- Modal -->
        <ContactFormModal :is-open="isModalOpen || isEditModalOpen" :is-edit-modal-open="isEditModalOpen" :selected-contact="selectedContact" @close-modal="handleCloseModal" />
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import ContactCard from "../components/ContactCard.vue";
import ContactTable from "../components/ContactTable.vue";
import ContactFormModal from "../components/ContactFormModal.vue";
import { useContactStore } from "../stores/contactStore";

export default {
    name: "ContactsView",
    components: {
        ContactCard,
        ContactTable,
        ContactFormModal,
    },
    setup() {
        const contactStore = useContactStore();
        const isModalOpen = ref(false);
        const isEditModalOpen = ref(false);
        const selectedContact = ref(null);
        const view = ref("card");

        const openAddModal = () => {
            isModalOpen.value = true;
            isEditModalOpen.value = false;
            selectedContact.value = null;
        };

        const handleEditContact = (contact) => {
            selectedContact.value = contact;
            isEditModalOpen.value = true;
            isModalOpen.value = false;
        };

        const handleDeleteContact = async (contact) => {
            try {
                await contactStore.deleteContact(contact.id);
            } catch (error) {
                console.error("Error deleting contact:", error);
            }
        };

        const handleCloseModal = () => {
            isModalOpen.value = false;
            isEditModalOpen.value = false;
            // Refresh contacts list
            contactStore.fetchContacts();
        };

        const setView = (newView) => {
            view.value = newView;
        };

        onMounted(() => {
            contactStore.fetchContacts();
        });

        return {
            contactStore,
            isModalOpen,
            isEditModalOpen,
            selectedContact,
            view,
            openAddModal,
            handleEditContact,
            handleDeleteContact,
            handleCloseModal,
            setView,
        };
    },
};
</script>

<style scoped>
.app-container {
    padding: 1.5rem;
    max-width: 150rem;
    height: 100%;
    margin: 0 auto;
    background-color: #f9fafb;
    user-select: none;
}

.app-container:focus {
    outline: none;
}

.header-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
    margin: 3rem;
    /* margin-left: 7rem; */
}

@media (min-width: 768px) {
    .header-section {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-left: 7rem;
    }
}

.header-title {
    font-size: 24px;
    font-weight: bold;
}

.header-subtitle {
    color: #4b5563;
    font-size: 16px;
}

.button-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.add-contact-button {
    background-color: #a100ff;
    color: #fff;
    text-transform: none;
    border-radius: 50px;
    border: none;
    padding: 12px 24px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
}

.add-contact-button:hover {
    background-color: #8a00e6;
}

.toggle-section {
    display: flex;
    justify-content: flex-end;
    margin-right: 5rem;
    margin-bottom: 1.5rem;
}

.toggle-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.5;
    transition: opacity 0.2s ease;
}

.toggle-button.active {
    opacity: 1;
}

.toggle-button:hover {
    opacity: 0.7;
}

@media (max-width: 768px) {
    .header-section {
        flex-direction: column;
        align-items: stretch;
    }

    .header-title {
        font-size: 1.5rem;
    }

    .add-contact-button {
        align-self: flex-start;
    }
}
</style>
