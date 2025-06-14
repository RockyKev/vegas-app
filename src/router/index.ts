import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CalendarView from '../views/CalendarView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/social-tips',
      name: 'social-tips',
      component: () => import('../views/SocialTipsView.vue')
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView
    },
    {
      path: '/travel-info',
      name: 'travel-info',
      component: () => import('../views/TravelInfoView.vue')
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: () => import('../views/ContactsView.vue')
    },
    {
      path: '/networking',
      name: 'networking',
      component: () => import('../views/NetworkingView.vue')
    }
  ]
})

export default router 