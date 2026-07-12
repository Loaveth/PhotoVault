const queue = []

self.addEventListener('fetch', (event) => {
  const request = event.request

  const isFavoriteRequest =
    request.url.includes('/likes') &&
    (request.method === 'POST' || request.method === 'DELETE')

  if (isFavoriteRequest) {
    event.respondWith(handleFavorite(request))
  }
})

async function handleFavorite(request) {
  try {
    return await fetch(request.clone())
  } catch {
     console.log('SW: fetch failed, queuing', request.url)
    const details = {
      url: request.url,
      method: request.method,
      headers: [...request.headers.entries()]
    }
    
    if (request.method === 'POST') {
      details.body = await request.clone().text()
    }

    queue.push(details)
    console.log('SW: queue length now', queue.length)
    return new Response(
      JSON.stringify({ queued: true }),
      {
        status: 202,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}

setInterval(async () => {
    if (queue.length > 0) console.log('SW: retrying', queue.length, 'items')
  for (let i = queue.length - 1; i >= 0; i--) {
    const request = queue[i]

    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body
      })

      if (response.ok) {
        queue.splice(i, 1)
      }
    } catch {
      // Still offline, keep it queued.
    }
  }
}, 3000)