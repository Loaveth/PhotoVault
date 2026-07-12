<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { token } from '@/auth'
</script>

<template>
  <section class="home">
    <div class="home__inner">
      <p class="home__eyebrow">A private family album</p>
      <h1 class="home__title">Every photo worth<br />keeping, in one place.</h1>
      <p class="home__lede">
        PhotoVault is a small, private space for the people you love. Add photos,
        favorite the ones that matter, and see new memories appear the moment
        someone shares them.
      </p>
      <div class="home__actions">
        <RouterLink v-if="token" to="/photos" class="btn-primary">Open the album</RouterLink>
        <RouterLink v-else to="/login" class="btn-primary">Log in to view</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: 3rem 2rem;
  background:
    radial-gradient(80% 120% at 100% 0%, #efe3d1 0%, var(--paper) 55%);
}

.home__inner {
  max-width: 640px;
  text-align: center;
}

.home__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent);
  margin: 0 0 1.2rem;
}

.home__title {
  font-size: clamp(2.4rem, 5vw, 4rem);
  line-height: 1.05;
  margin: 0 0 1.4rem;
}

.home__lede {
  font-size: 1.15rem;
  color: var(--ink-soft);
  line-height: 1.65;
  margin: 0 auto 2.2rem;
  max-width: 520px;
}

.home__actions {
  display: flex;
  justify-content: center;
}
</style>