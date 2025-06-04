import { createRouter, createWebHistory } from 'vue-router'
import ContactsView from '../views/ContactsView.vue'
import ContactInfo from '../components/ContactInfo.vue'
import ContactErrorPage from '../components/ContactErrorPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/contacts'
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: ContactsView
  },
  {
    path: '/contacts/:id',
    name: 'ContactInfo',
    component: ContactInfo
  },
  {
    path: '/error',
    name: 'Error',
    component: ContactErrorPage
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/error'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router