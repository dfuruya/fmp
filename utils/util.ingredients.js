import { cleanUpInput } from '../utils/util.common'

export const splitIngredients = (data) => {
  const inStock = []
  const notInStock = []
  for (let item of data) {
    if (item.in_stock) {
      inStock.push(item)
    }
    else {
      notInStock.push(item)
    }
  }
  return { inStock, notInStock }
}

export const mapIngredientsById = (ingredients) => {
  const baseObj = { id: {}, ndb_no: {} }
  if (!ingredients) {
    return baseObj
  }
  return ingredients.reduce((ingMap, ing) => {
    if (ing.ndb_no) {
      ingMap.ndb_no[ing.ndb_no] = ing.id
    }
    ingMap.id[ing.id] = ing
    return ingMap
  }, {...baseObj})
}

export const clearSearchResults = () => {
  return { newRes: new Map(), storedRes: new Map(), searchRes: new Map() }
}

export const prepSearchResults = ({
  debouncedText, 
  results, 
  idMap: { id, ndb_no }, 
  ingredientsData
}) => {
  const inputText = cleanUpInput(debouncedText)
  const regex = new RegExp(inputText)
  // console.log({ inputText, debouncedText })

  const newRes = new Map()
  newRes.set(inputText, { id: '', ndb_no: null, name: inputText, tags: [] })
  const storedRes = new Map()
  const searchRes = new Map()

  // if search result exists in stored, then filter out from results
  for (let result of results) {
    const resId = ndb_no[result.ndb_no]
    if (id[resId]) {
      storedRes.set(result.name, id[resId])
    }
    else {
      if (result.name === inputText) {
        newRes.clear()
      }
      searchRes.set(result.name, result)
    }
  }

  // check stored data for matching results
  if (ingredientsData) {
    for (let ing of ingredientsData) {
      if (regex.test(ing.name)) {
        if (!newRes.length && !storedRes.has(ing.name)) {
          storedRes.set(ing.name, ing)
        }
        newRes.clear()
      }
    }
  }

  // if input is cleared
  if (!debouncedText) {
    newRes.pop()
  }

  return { newRes, storedRes, searchRes }
}

const baseTable = {
  key: '',
  name: '',
  in_stock: false,
  tags: [],
}

export const formatIngredientsDataForTable = ({
  ingredientsData,
}) => {
  if (!ingredientsData) {
    return [ baseTable ]
  }
  return ingredientsData.map(ing => ({
    key: ing.id,
    name: ing.name,
    in_stock: ing.in_stock,
    tags: ing.tags || [],
    tags_custom: ing.tags_custom,
  }))
}
