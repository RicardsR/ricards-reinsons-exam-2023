<template>
    <div id="main-header" class="active">
        <div class="wrapper-logo">
            <img src="@/assets/logo.svg" alt="logo" />
            <h2>KRAKEN.FM</h2>
        </div>
        <div class="wrapper-profile">
            <div class="section-user">
                <span class="avatar"></span>
                <h3 id="txt-full-name">{{ fullName }}</h3>
            </div>
            <button id="btn-logout" @click="logout">LOGOUT</button>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export default {
    setup() {
        const authStore = useAuthStore()
        const user = authStore.user
        const fullName = computed(() => `${user.name} ${user.surname}`)
        const logout = () => {
            authStore.logout()
            router.push('/login')
        }
        return {
            fullName,
            logout,
        }
    },
}
</script>