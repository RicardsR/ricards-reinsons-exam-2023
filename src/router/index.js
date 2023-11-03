import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import login from '../views/Login.vue'
import songs from '../views/Songs.vue'
import albums from '../views/Albums.vue'
import about from '../views/About.vue'

// ENG
// Middleware is a function that is executed before the route is changed
// argument "to" stores the address where we want to navigate/go
// argument "from" stores the address from where we're coming from

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: login,
        },
        {
            path: '/',
            name: 'Songs',
            component: songs,
        },
        {
            path: '/albums',
            name: 'Albums',
            component: albums,
        },
        {
            path: '/about',
            name: 'About',
            component: about,
        },
    ],
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const is_authenticated = authStore.is_authenticated
    if (to.path !== '/login' && !is_authenticated) {
        next('/login')
    } else if (to.path === '/login' && is_authenticated) {
        next('/')
    } else {
        next()
    }
})

export default router;