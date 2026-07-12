export async function loggedInRequest(request, credentials, options) {
  const [name, password] = credentials.split(':')

  const loginResponse = await request.post('/login', {
    data: { name, password }
  })
  const { token } = await loginResponse.json()

  return request.fetch(options.url, {
    method: options.method,
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: options.data   // for POST bodies
  })
}
