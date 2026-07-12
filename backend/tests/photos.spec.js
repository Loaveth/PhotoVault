import { test, expect } from '@playwright/test'
import { loggedInRequest } from './helpers/loggedInRequest.js'

test.beforeEach(async ({ request }) => {
  // reset the DB to a clean state before every test
  await request.put('/reset_database')
})

test('GET /photos requires authentication', async ({ request }) => {
  const response = await request.get('/photos')
  expect(response.status()).toBe(401)
})

test('logged-in user can list photos', async ({ request }) => {
  const response = await loggedInRequest(request, 'user:user', {
    url: '/photos',
    method: 'GET'
  })
  expect(response.status()).toBe(200)
  const photos = await response.json()
  expect(photos.length).toBe(3)   // your seed has 3 photos
})

test('level-1 user cannot create a user', async ({ request }) => {
  const response = await loggedInRequest(request, 'user:user', {
    url: '/users',
    method: 'POST',
    data: {
      name: 'bob',
      password: 'bob',
      level: 1
    }
  })

  expect(response.status()).toBe(403)
})

test('admin can create a user', async ({ request }) => {
  const response = await loggedInRequest(request, 'admin:admin', {
    url: '/users',
    method: 'POST',
    data: {
      name: 'bob',
      password: 'bob',
      level: 1
    }
  })

  expect(response.status()).toBe(201)

  const usersResponse = await loggedInRequest(request, 'admin:admin', {
    url: '/users',
    method: 'GET'
  })

  expect(usersResponse.status()).toBe(200)

  const users = await usersResponse.json()

  expect(users.some(user => user.name === 'bob')).toBe(true)
})

test("user can't like on admin's behalf", async ({ request }) => {
  const response = await loggedInRequest(request, 'user:user', {
    url: '/users/admin/likes',
    method: 'POST',
    data: {
      photoId: 1
    }
  })

  expect(response.status()).toBe(403)
})

test('wrong password returns 401', async ({ request }) => {
  const response = await request.post('/login', {
    data: {
      name: 'user',
      password: 'wrong'
    }
  })

  expect(response.status()).toBe(401)
})

test('user can create a photo', async ({ request }) => {
  const createResponse = await loggedInRequest(request, 'user:user', {
    url: '/photos',
    method: 'POST',
    data: {
      filename: 'x.png',
      caption: 'test'
    }
  })

  expect(createResponse.status()).toBe(201)

  const photosResponse = await loggedInRequest(request, 'user:user', {
    url: '/photos',
    method: 'GET'
  })

  expect(photosResponse.status()).toBe(200)

  const photos = await photosResponse.json()

  expect(photos.length).toBe(4)
})

test('user can delete their own photo', async ({ request }) => {
  const deleteResponse = await loggedInRequest(request, 'user:user', {
    url: '/photos/3',
    method: 'DELETE'
  })

  expect(deleteResponse.status()).toBe(204)

  const photosResponse = await loggedInRequest(request, 'user:user', {
    url: '/photos',
    method: 'GET'
  })

  expect(photosResponse.status()).toBe(200)

  const photos = await photosResponse.json()

  expect(photos.length).toBe(2)
})

test("user can't delete someone else's photo", async ({ request }) => {
  const response = await loggedInRequest(request, 'user:user', {
    url: '/photos/1',
    method: 'DELETE'
  })

  expect(response.status()).toBe(403)
})

test('deleting a nonexistent photo returns 404', async ({ request }) => {
  const response = await loggedInRequest(request, 'admin:admin', {
    url: '/photos/999',
    method: 'DELETE'
  })

  expect(response.status()).toBe(404)
})