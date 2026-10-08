const getErrorMessage = (data, fallback) => {
  const message = data?.message || data?.error || data?.detail || data?.details

  if (Array.isArray(message)) return message.join(' ')
  if (typeof message === 'string' && message.trim()) return message

  return fallback
}

const request = async (endpoint, payload) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(getErrorMessage(data, 'Unable to complete the request. Please try again.'))
    error.status = response.status
    throw error
  }

  return data
}

export const signIn = (payload) => request('/api/auth/sign-in', payload)

export const sendPasswordReset = (email) =>
  request('/api/auth/send-password-reset', { email })

export const verifyPasswordResetOtp = (email, otp) =>
  request('/api/auth/verify-password-reset-otp', { email, otp })

export const getCurrentUser = (token) => {
  const headers = new Headers({
    Accept: 'application/json',
  })

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  return fetch('/api/auth/user', { headers }).then(async (response) => {
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      const error = new Error(getErrorMessage(data, 'Unable to load the user.'))
      error.status = response.status
      throw error
    }

    return data
  })
}
