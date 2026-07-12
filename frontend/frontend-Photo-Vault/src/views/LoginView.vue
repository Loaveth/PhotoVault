<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { login as setAuth } from '@/auth'

const name = ref('')
const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

const router = useRouter()

async function login() {
  loading.value = true
  error.value = null

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name.value,
        password: password.value
      })
    })

    if (!response.ok) {
      throw new Error('Those details did not match. Try again.')
    }

    const data = await response.json()

    setAuth(data.token, name.value)

    router.push('/photos')
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : 'Something went wrong. Try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (localStorage.getItem('token')) {
    router.push('/photos')
  }
})
</script>

<template>
  <div class="login">
    <section class="login__hero">
      <div class="login__hero-inner">
        <p class="login__eyebrow">Private &middot; Shared &middot; Yours</p>
        <h1 class="login__title">Keep the moments<br />that matter.</h1>
        <p class="login__lede">
          A quiet corner of the internet for your family's photos. No feeds, no
          strangers &mdash; just the people you love and the pictures worth keeping.
        </p>
      </div>
    </section>

    <section class="login__panel">
      <form class="login__card" @submit.prevent="login">
        <h2 class="login__brand">Photo<span>Vault</span></h2>
        <p class="login__sub">Log in to view your album</p>

        <label class="login__label" for="name">Username</label>
        <input
          id="name"
          class="login__input"
          type="text"
          v-model="name"
          autocomplete="username"
          placeholder="e.g. user"
        />

        <label class="login__label" for="password">Password</label>
        <input
          id="password"
          class="login__input"
          type="password"
          v-model="password"
          autocomplete="current-password"
          placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
        />

        <button class="btn-primary login__submit" type="submit" :disabled="loading">
          {{ loading ? 'Logging in…' : 'Log in' }}
        </button>

        <p v-if="error" class="login__error">{{ error }}</p>

        <p class="login__hint">
          Invite-only. Ask a family admin to add you.
        </p>
      </form>
    </section>
  </div>
</template>

<style scoped>
.login {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  min-height: calc(100vh - 140px);
}

.login__hero {
  background:
    radial-gradient(120% 120% at 0% 0%, #d1743f 0%, #c4622d 40%, #9c4a1f 100%);
  color: #fdf3e9;
  display: flex;
  align-items: center;
  padding: 3rem;
}

.login__hero-inner {
  max-width: 460px;
  margin-left: auto;
}

.login__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.72rem;
  font-weight: 600;
  opacity: 0.85;
  margin: 0 0 1.2rem;
}

.login__title {
  font-size: clamp(2.2rem, 4vw, 3.4rem);
  line-height: 1.05;
  margin: 0 0 1.2rem;
  color: #fff;
}

.login__lede {
  font-size: 1.05rem;
  line-height: 1.6;
  opacity: 0.92;
  margin: 0;
}

.login__panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: var(--paper);
}

.login__card {
  width: 100%;
  max-width: 360px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 2.2rem;
  display: flex;
  flex-direction: column;
}

.login__brand {
  font-size: 1.9rem;
  text-align: center;
  margin: 0 0 0.2rem;
}

.login__brand span {
  color: var(--accent);
}

.login__sub {
  text-align: center;
  color: var(--muted);
  margin: 0 0 1.6rem;
  font-size: 0.92rem;
}

.login__label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ink-soft);
  margin-bottom: 0.35rem;
}

.login__input {
  font-family: var(--body);
  font-size: 0.95rem;
  padding: 0.7rem 0.85rem;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: #fff;
  color: var(--ink);
  margin-bottom: 1.1rem;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.login__input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(196, 98, 45, 0.15);
}

.login__submit {
  width: 100%;
  margin-top: 0.3rem;
}

.login__error {
  color: #b23b2e;
  background: #f7e4e0;
  border: 1px solid #e6c3bb;
  border-radius: 8px;
  padding: 0.6rem 0.8rem;
  font-size: 0.85rem;
  margin: 1rem 0 0;
  text-align: center;
}

.login__hint {
  text-align: center;
  color: var(--muted);
  font-size: 0.8rem;
  margin: 1.4rem 0 0;
}

@media (max-width: 820px) {
  .login {
    grid-template-columns: 1fr;
  }
  .login__hero {
    padding: 2.5rem 2rem;
  }
  .login__hero-inner {
    margin: 0 auto;
    text-align: center;
  }
}
</style>