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

  try {
    await loadFavorites()
  } catch {
    // offline — the favorite is queued and will sync; skip the refresh
  }
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
  <div class="photos">
    <header class="photos__head">
      <h1 class="photos__title">The album</h1>
      <p class="photos__meta" v-if="!loading && !error">
        {{ photos.length }} {{ photos.length === 1 ? 'photo' : 'photos' }}
      </p>
    </header>

    <p v-if="loading" class="photos__state">Opening the album…</p>

    <p v-else-if="error" class="photos__state photos__state--error">
      {{ error }}
    </p>

    <p v-else-if="photos.length === 0" class="photos__state">
      No photos yet. Be the first to add one.
    </p>

    <div v-else class="photos__grid">
      <figure v-for="photo in photos" :key="photo.id" class="snap">
        <div class="snap__frame">
          <img
            class="snap__img"
            :src="`http://localhost:3000/images/${photo.filename}`"
            :alt="photo.caption ?? photo.filename"
          />
          <button
            class="snap__fav"
            :class="{ 'snap__fav--on': isFavorite(photo.id) }"
            :aria-label="isFavorite(photo.id) ? 'Remove favorite' : 'Add favorite'"
            @click="toggleFavorite(photo)"
          >
            {{ isFavorite(photo.id) ? '★' : '☆' }}
          </button>
        </div>
        <figcaption class="snap__caption">
          <span class="snap__text" v-if="photo.caption">{{ photo.caption }}</span>
          <span class="snap__by">by {{ photo.uploadedBy }}</span>
        </figcaption>
      </figure>
    </div>
  </div>
</template>

<style scoped>
.photos {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 2rem 3rem;
}

.photos__head {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--line);
  padding-bottom: 1.2rem;
}

.photos__title {
  font-size: 2.2rem;
  margin: 0;
}

.photos__meta {
  color: var(--muted);
  font-size: 0.9rem;
  margin: 0;
}

.photos__state {
  color: var(--muted);
  font-size: 1rem;
  padding: 3rem 0;
  text-align: center;
}

.photos__state--error {
  color: #b23b2e;
}

.photos__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 2rem 1.6rem;
}

/* Printed snapshot card — the signature */
.snap {
  margin: 0;
  transition: transform 0.18s ease;
}

.snap:hover {
  transform: rotate(-1deg) translateY(-3px);
}

.snap__frame {
  position: relative;
  background: #fff;
  padding: 10px 10px 0;
  border-radius: 4px;
  box-shadow: var(--shadow);
  transition: box-shadow 0.18s ease;
}

.snap:hover .snap__frame {
  box-shadow: var(--shadow-lift);
}

.snap__img {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 2px;
}

.snap__fav {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  color: var(--muted);
  font-size: 1.15rem;
  line-height: 1;
  display: grid;
  place-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.12s, color 0.12s;
}

.snap__fav:hover {
  transform: scale(1.12);
}

.snap__fav--on {
  color: var(--accent);
}

.snap__caption {
  padding: 0.75rem 4px 0;
  font-family: var(--display);
}

.snap__text {
  display: block;
  color: var(--ink);
  font-size: 1.02rem;
  font-weight: 500;
  line-height: 1.3;
}

.snap__by {
  display: block;
  font-family: var(--body);
  color: var(--muted);
  font-size: 0.78rem;
  margin-top: 0.15rem;
}
</style>