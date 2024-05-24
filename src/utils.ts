export function getCookie(name: string): string | null {
  const cookieArr = document.cookie.split(';')

  for (const cookie of cookieArr) {
    const cookiePair = cookie.split('=')

    if (name === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1])
    }
  }
  return null
}

export function get(url: string, data?: Record<string | number, unknown | unknown[]>): Promise<Response> {
  const urlObj = new URL(import.meta.env.VITE_APP_API_BASE + url)
  for (const key in data) {
    if (Array.isArray(data[key])) {
      for (const item of data[key] as unknown[]) {
        urlObj.searchParams.append(key, item?.toString() ?? '')
      }
    } else {
      urlObj.searchParams.append(key, data[key]?.toString() ?? '')
    }
  }

  return fetch(urlObj.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function post(url: string, data?: Record<string | number, unknown>): Promise<Response> {
  return fetch(import.meta.env.VITE_APP_API_BASE + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken') ?? ''
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include'
  })
}

export function put(url: string, data?: Record<string | number, unknown>): Promise<Response> {
  return fetch(import.meta.env.VITE_APP_API_BASE + url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken') ?? ''
    },
    body: data ? JSON.stringify(data) : undefined
  })
}

export function patch(url: string, data?: Record<string | number, unknown>): Promise<Response> {
  return fetch(import.meta.env.VITE_APP_API_BASE + url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken') ?? ''
    },
    body: data ? JSON.stringify(data) : undefined
  })
}

export function del(url: string): Promise<Response> {
  return fetch(import.meta.env.VITE_APP_API_BASE + url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken') ?? ''
    }
  })
}