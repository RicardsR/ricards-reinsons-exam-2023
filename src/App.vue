<template>
    <Header v-if="is_authenticated"></Header>
    <div id="section-body">
        <NavigationComponent v-if="is_authenticated" />
        <router-view class="section-router"></router-view>
    </div>
    <div id="section-player" v-if="is_authenticated">
        <AudioPlayer />
    </div>
</template>

<script>
import Header from '@/components/HeaderComponent.vue'
import AudioPlayer from '@/components/AudioPlayerComponent.vue'
import NavigationComponent from '@/components/NavigationComponent.vue'
import { useAuthStore } from '@/stores/auth'
import { watchEffect } from 'vue'

export default {
    components: {
        Header,
        AudioPlayer,
        NavigationComponent,
    },
    setup() {
        const authStore = useAuthStore()
        const is_authenticated = authStore.is_authenticated
        watchEffect(() => {
            const isAuthenticated = authStore.is_authenticated
            if (isAuthenticated !== is_authenticated) {
                location.reload()
            }
        })

        return {
            is_authenticated,
        }
    },
}
</script>