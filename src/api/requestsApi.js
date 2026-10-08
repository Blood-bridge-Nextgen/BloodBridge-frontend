const getErrorMessage = (data, fallback) => {
  const message = data?.message || data?.error || data?.detail || data?.details

  if (Array.isArray(message)) return message.join(' ')
  if (typeof message === 'string' && message.trim()) return message

  return fallback
}

const request = async (endpoint, options = {}) => {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(getErrorMessage(data, 'Unable to complete the request.'))
    error.status = response.status
    throw error
  }

  return data
}

export const createBloodRequest = (token, payload) =>
  request('/api/requests', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

export const getBloodRequests = ({ token, limit = 10, page = 1 }) => {
  const params = new URLSearchParams({ limit: String(limit), page: String(page) })

  return request(`/api/requests?${params.toString()}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
