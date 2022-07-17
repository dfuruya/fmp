import { MAX_WEIGHT, WEIGHTS } from "../consts"

const baseTable = {
  key: '',
  name: '',
  // match: '',
  tagWeight: 0,
  tags: [],
  ingredients: []
}

export const formatMealsDataForTable = ({
  mealsData,
  idMap,
}) => {
  if (!mealsData) {
    return [ baseTable ]
  }
  return mealsData.map(meal => ({
    key: meal.id,
    name: meal.name,
    // match: calculateMatch(meal.ingredients, idMap),
    tagWeight: calculateTagWeight(meal.ingredients, idMap),
    tags: collectTags(meal.ingredients, idMap),
    ingredients: meal.ingredients,
  }))
}

// export const calculateMatch = (ingredients, idMap) => {
//   const { id } = idMap
//   if (!ingredients || !id) {
//     return 0
//   }
//   const inStock = []
//   for (let ingId of ingredients) {
//     if (id[ingId]?.in_stock) {
//       inStock.push(ingId)
//     }
//   }
//   return Math.round(100 * (inStock.length / ingredients.length))
// }

export const calculateTagWeight = (ingredients, idMap) => {
  let weight = 0
  const tags = collectTags(ingredients, idMap)
  if (!tags.length) {
    return weight
  }
  for (let tagId of tags) {
    weight += WEIGHTS[tagId] || 0
  }
  return Math.floor(100 * (weight / MAX_WEIGHT))
}

export const collectTags = (ingredients, idMap) => {
  const { id } = idMap
  if (!ingredients || !id) {
    return []
  }
  const tags = new Set()
  for (let ingId of ingredients) {
    if (id[ingId]?.in_stock) {
      const [tagId] = id[ingId]?.tags || []
      if (tagId) {
        tags.add(tagId)
      }
    }
  }
  return Array.from(tags)
}

export const mapMealsById = (meals) => {
  const baseObj = {}
  if (!meals) {
    return baseObj
  }
  return meals.reduce((mealsMap, meal) => {
    mealsMap[meal.id] = meal
    return mealsMap
  }, {})
}
