import axios from 'axios'

// 🧹 Рекурсивная очистка объекта от пустых строк и пустых массивов
const cleanDeep = (obj: any): any => {
  if (obj === '') return null
  if (obj === null || obj === undefined) return obj

  if (Array.isArray(obj)) {
    return obj
      .map(cleanDeep)
      .filter((v) => v !== null && v !== undefined)
  }

  if (typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      const val = obj[key]

      if (val === '') {
        obj[key] = null
      } else if (Array.isArray(val)) {
        obj[key] = cleanDeep(val)
        if (obj[key].length === 0) obj[key] = null
      } else if (typeof val === 'object' && val !== null) {
        obj[key] = cleanDeep(val)
      }
    }
  }

  return obj
}

// 🧠 Создаём экземпляр axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// ⚙️ Интерсептор для автоматической очистки перед отправкой
api.interceptors.request.use((config) => {
  const method = (config.method || '').toLowerCase()

  if (['post', 'put', 'patch'].includes(method)) {
    if (config.data && typeof config.data === 'object') {
      cleanDeep(config.data)
    }
  }

  return config
})

export default api
