import { createRouter, createWebHistory } from 'vue-router'
import JadwalSholat from '../views/JadwalSholat.vue'
import AlQuran from '../views/AlQuran.vue'

const routes = [
  {
    path: '/jadwalsholat',
    name: 'JadwalSholat',
    component: JadwalSholat
  },
  {
    path: '/alquran',
    name: 'AlQuran',
    component: AlQuran
  }
]

const router = createRouter({
  history: createWebHistory(''),
  routes
})

export default router
