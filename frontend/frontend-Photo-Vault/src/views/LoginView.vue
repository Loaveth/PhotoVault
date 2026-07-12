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
      throw new Error('Invalid username or password.')
    }

    const data = await response.json()

    setAuth(data.token, name.value)

    router.push('/photos')
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : 'An unknown error occurred.'
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
  <main>
    <h1>Login</h1>

    <div>
      <label for="name">Username</label>
      <input
        id="name"
        type="text"
        v-model="name"
      />
    </div>

    <div>
      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        v-model="password"
      />
    </div>

    <button @click="login" :disabled="loading">
      {{ loading ? 'Logging in...' : 'Login' }}
    </button>

    <p v-if="error">{{ error }}</p>
  </main>
</template>