<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Photo {
  id: number
  filename: string
  caption: string | null
  uploadedBy: string
  uploadedAt: string
}

const photos = ref<Photo[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const favorites = ref<Photo[]>([])

function isFavorite(photoId: number): boolean {
  return favorites.value.some(photo => photo.id === photoId)
}

async function toggleFavorite(photo: Photo) {
  const token = localStorage.getItem('token')
  const name = localStorage.getItem('name')

  if (!token || !name) {
    throw new Error('You are not logged in.')
  }

  if (isFavorite(photo.id)) {
    const response = await fetch(
      `http://localhost:3000/users/${name}/likes/${photo.id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
  } else {
    const response = await fetch(
      `http://localhost:3000/users/${name}/likes`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          photoId: photo.id
        })
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
  }

  await loadFavorites()
}

async function loadFavorites() {
  const token = localStorage.getItem('token')
  const name = localStorage.getItem('name')

  if (!token || !name) {
    throw new Error('You are not logged in.')
  }

  const response = await fetch(
    `http://localhost:3000/users/${name}/likes`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  favorites.value = await response.json()
}

onMounted(async () => {
  loading.value = true
  error.value = null

    try {
    const token = localStorage.getItem('token')

    if (!token) {
        throw new Error('You are not logged in.')
    }

    const response = await fetch('http://localhost:3000/photos', {
        headers: {
        Authorization: `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
    }

    photos.value = await response.json()
    await loadFavorites()

    const source = new EventSource('http://localhost:3000/events')
    source.onmessage = (event) => {
    const data = JSON.parse(event.data)

        if (data.type === 'like') {
            const myName = localStorage.getItem('name')
            if (data.user !== myName) {
            alert(`${data.user} favorited ${data.photo}`)
            }
        } else if (data.type === 'newPhoto') {
            photos.value.push(data.photo)
        }
    }
    } catch (err) {
    error.value =
        err instanceof Error ? err.message : 'An unknown error occurred.'
    } finally {
    loading.value = false
    }
})
</script>

<template>
  <div>
    <p v-if="loading">Loading photos...</p>

    <p v-else-if="error" class="error">
      Error: {{ error }}
    </p>

    <ul v-else>
        <li v-for="photo in photos" :key="photo.id">
            <img
            :src="`http://localhost:3000/images/${photo.filename}`"
            :alt="photo.caption ?? photo.filename"
            width="200"
            />

            <p v-if="photo.caption">{{ photo.caption }}</p>

            <small>
            Uploaded by {{ photo.uploadedBy }} on {{ photo.uploadedAt }}
            </small>
            
            <button @click="toggleFavorite(photo)">
                {{ isFavorite(photo.id) ? '★ Favorited' : '☆ Favorite' }}
            </button>
        </li>
    </ul>
  </div>
</template>