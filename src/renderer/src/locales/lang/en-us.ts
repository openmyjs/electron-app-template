const flattenObject = (
  obj: Record<string, any>,
  parentKey = '',
  result: Record<string, any> = {}
): Record<string, any> => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        flattenObject(obj[key], newKey, result)
      } else {
        result[newKey] = obj[key]
      }
    }
  }
  return result
}

const getViewLocale = () => {
  const modules: Record<string, { default: Record<string, any> }> = import.meta.glob(
    '@renderer/views/**/locales/en-us.ts',
    { eager: true }
  )
  const data = {}
  Object.keys(modules).forEach((key) => {
    const regex = /\/views\/(.*?)\/locales\//
    const match = key.match(regex)
    if (match && match[1]) {
      Object.assign(data, flattenObject(modules[key].default, match[1].split('/').join('.')))
    }
  })
  return data
}

const getLayoutLocale = () => {
  const modules: Record<string, { default: Record<string, any> }> = import.meta.glob(
    '@renderer/layout/**/locales/en-us.ts',
    { eager: true }
  )
  const data = {}
  Object.keys(modules).forEach((key) => {
    const regex = /\/layout\/(.*?)\/locales\//
    const match = key.match(regex)
    if (match && match[1]) {
      const f = flattenObject(modules[key].default, match[1].split('/').join('.'))
      const newf = {}
      for (const fKey in f) {
        newf['layout.' + fKey] = f[fKey]
      }
      Object.assign(data, newf)
    }
  })
  return data
}

export default {
  ...getViewLocale(),
  ...getLayoutLocale(),
  login: '我是英文'
  // ...getLocalesLocale()
}
