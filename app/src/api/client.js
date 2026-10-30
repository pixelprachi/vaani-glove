import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('vaaniglove_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function login(email, password) {
  return apiClient.post('/auth/login', null, {
    params: { email, password },
  })
}

export function register(email, password, displayName) {
  return apiClient.post('/auth/register', null, {
    params: { email, password, display_name: displayName },
  })
}

export function getPersonalSigns(userId) {
  return apiClient.get('/vocabulary/personal', {
    params: { user_id: userId },
  })
}

export function addPersonalSign(userId, textMeaning) {
  return apiClient.post('/vocabulary/personal', {
    user_id: userId,
    text_meaning: textMeaning,
    template_windows: [],
  })
}

export function deletePersonalSign(signId) {
  return apiClient.delete(`/vocabulary/personal/${signId}`)
}

export function recordPersonalSign(userId, textMeaning) {
  return apiClient.post('/vocabulary/personal/record', {
    user_id: userId,
    text_meaning: textMeaning,
  })
}

export function getSignStatus(signId) {
  return apiClient.get(`/vocabulary/personal/${signId}/status`)
}

export default apiClient

export function getHubStatus() {
  return apiClient.get('/hub/status')
}
