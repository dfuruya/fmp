export function mergeValidProps(props, validProps) {
  const merged = {...validProps}
  for (let prop in props) {
    if (validProps[prop] !== undefined) {
      merged[prop] = props[prop]
    }
  }
  return merged
}

export const cleanUpInput = (text) => {
  return typeof text === 'string'
    ? text.trim().toLowerCase() : ''
}

export const mapToArray = (mapObj) => {
  return Array.from(mapObj.values())
}
