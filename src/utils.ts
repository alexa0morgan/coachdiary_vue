import { ref } from 'vue'

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
  const urlObj = new URL(location.origin + url)
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

export function post(url: string, data?: Record<string | number, unknown> | unknown[]): Promise<Response> {
  return fetch(location.origin + url, {
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
  return fetch(location.origin + url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken') ?? ''
    },
    body: data ? JSON.stringify(data) : undefined
  })
}

export function patch(url: string, data?: Record<string | number, unknown>): Promise<Response> {
  return fetch(location.origin + url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken') ?? ''
    },
    body: data ? JSON.stringify(data) : undefined
  })
}

export function del(url: string): Promise<Response> {
  return fetch(location.origin + url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken') ?? ''
    }
  })
}


export function flattenObject(obj: any, parentKey: string = '', result: Record<string, any> = {}): Record<string, any> {
  if (typeof obj === 'string' && parentKey === '') {
    return {obj}
  }
  for (const key in obj) {
    // eslint-disable-next-line
    if (obj.hasOwnProperty(key)) {
      const newKey = parentKey ? `${parentKey}[${key}]` : key
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        flattenObject(obj[key], newKey, result)
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach((item: any, index: number) => {
          const arrayKey = `${newKey}[${index}]`
          if (typeof item === 'object') {
            flattenObject(item, arrayKey, result)
          } else {
            result[arrayKey] = item
          }
        })
      } else {
        result[newKey] = obj[key]
      }
    }
  }
  return result
}

export function getErrorMessage(error: any): string {
  if ('details' in error) {
    return Object.values(flattenObject(error.details)).join(' ')
  }
  if ('errors' in error) {
    return Object.values(flattenObject(error.errors)).join(' ')
  }
  if ('детали' in error) {
    return Object.values(flattenObject(error.детали)).join(' ')
  }
  if ('Детали' in error) {
    return Object.values(flattenObject(error.Детали)).join(' ')
  }
  if ('error' in error) {
    return Object.values(flattenObject(error.error)).join(' ')
  }
  return 'Неизвестная ошибка'
}


type Dialog = {
  title?: string
  text: string
  confirmText: string
  cancelText: string
  confirmAction: () => void
  cancelAction: () => void
}

export const confirmDialogs = ref<Dialog[]>([])

export function showConfirmDialog({ title, text, confirmText = 'Да', cancelText = 'Нет' }: {
  title?: string,
  text: string,
  confirmText?: string,
  cancelText?: string
}) {
  return new Promise((resolve, reject) => {
    const dialog: Dialog = {
      title,
      text,
      confirmText,
      cancelText,
      confirmAction: () => removeDialog(dialog, resolve as () => void),
      cancelAction: () => removeDialog(dialog, reject)
    }
    confirmDialogs.value.push(dialog)
  })
}

function removeDialog(dialog: Dialog, action: () => void) {
  const index = confirmDialogs.value.indexOf(dialog)
  confirmDialogs.value.splice(index, 1)
  action()
}