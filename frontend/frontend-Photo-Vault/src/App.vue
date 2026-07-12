<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { token, logout as doLogout } from '@/auth'

const router = useRouter()

function logout() {
  doLogout()
  router.push('/')
}
</script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/photos">Photos</RouterLink>
    <RouterLink v-if="!token" to="/login">Login</RouterLink>
    <button v-else @click="logout">Logout</button>
  </nav>
<RouterView />
</template>

<style scoped></style>
