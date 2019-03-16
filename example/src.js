// example program source code
export const software = (type) => {
  switch (type) {
  case 'boolean':
    return true
  case 'string':
    return 'string'
  default:
    return null
  }
}

export const asyncSoftware = async (type) => {
  await new Promise(r => setTimeout(r, 50))
  return software(type)
}