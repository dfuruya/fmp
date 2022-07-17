export const searchIngredients = async (searchText) => {
  const headers = {
    'Content-Type': 'application/json',
    'x-app-id': process.env.NEXT_PUBLIC_NUTRITIONIX_APP_ID,
    'x-app-key': process.env.NEXT_PUBLIC_NUTRITIONIX_APP_KEY,
  }
  const reqBody = {
    "query": searchText,
    "num_servings": 0,
    "line_delimited": false,
    "use_raw_foods": true,
    "include_subrecipe": false,
    "use_branded_foods": false,
    "locale": "en_US",
    "taxonomy": true,
    "ingredient_statement": false,
    "last_modified": false,
  }
  const req = {
    method: 'POST',
    // mode: 'cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
    headers,
    // redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(reqBody) // data type must match "Content-Type" header
  }
  const url = `https://trackapi.nutritionix.com/v2/natural/nutrients`
  const data = await fetch(url, req)

  const {
    foods: [
      {
        ndb_no,
        tags: {
          item,
          food_group,
        }
      }
    ] 
  } = await data.json()

  return [
    {
      id: '',
      name: item,
      ndb_no,
      tags: [ food_group ],
    }
  ]
}
