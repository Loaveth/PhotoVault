import { ref } from 'vue'

export const token = ref<string | null>(localStorage.getItem('token'))
export const name = ref<string | null>(localStorage.getItem('name'))

export function login(newToken: string, newName: string) {
  token.value = newToken
  name.value = newName
  localStorage.setItem('token', newToken)
  localStorage.setItem('name', newName)
}

export function logout() {
  token.value = null
  name.value = null
  localStorage.removeItem('token')
  localStorage.removeItem('name')
}