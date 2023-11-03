<template>
    <div id="login-view">
        <form class="login-form">
            <div class="wrapper-logo">
                <img src="@/assets/logo.svg" />
                <div>KRAKEN.FM</div>
            </div>
            <input id="input-email" placeholder="E-mail" v-model="email" />
            <input id="input-password" placeholder="Password" v-model="password" type="password" />
            <button id="btn-submit" :disabled="!isFormValid" @click="submitForm">LOGIN</button>
        </form>
    </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
    data() {
        return {
            email: '',
            password: '',
        }
    },
    computed: {
        isFormValid() {
            return this.email && this.password && this.password.length >= 6
        },
    },
    methods: {
        submitForm() {
            const authStore = useAuthStore()
            authStore.authenticate(this.email, this.password)
        },
    },
}
</script>