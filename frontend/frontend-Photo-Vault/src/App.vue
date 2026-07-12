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
  <nav class="app-nav">
    <RouterLink to="/" class="app-nav__brand">Photo<span>Vault</span></RouterLink>
    <RouterLink to="/" class="app-nav__link">Home</RouterLink>
    <RouterLink to="/photos" class="app-nav__link">Photos</RouterLink>
    <RouterLink v-if="!token" to="/login" class="app-nav__link">Log in</RouterLink>
    <button v-else class="app-nav__logout" @click="logout">Log out</button>
  </nav>

  <main class="app-main">
    <RouterView />
  </main>

  <footer class="app-footer">
    <p><strong>PhotoVault</strong> — keeping the moments that matter, together.</p>
  </footer>
</template>

<style scoped></style>