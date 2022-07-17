export const WEIGHTS = {
  '0': 0,
  '1': 0,
  '2': 55,
  '3': 10,
  '4': 60,
  '5': 0,
  '6': 0,
  '7': 10,
  '8': 0,
  '9': 0,
}

export const MAX_WEIGHT = Object.values(WEIGHTS).reduce((acc, cur) => acc += cur, 0)

export const FOOD_GROUPS = {
  '0': {
    name: 'undefined', 
    tagColor: '',
    weight: WEIGHTS['0'],
  },
  '1': {
    name: 'Dairy', 
    tagColor: 'gold',
    weight: WEIGHTS['1'],
  },
  '2': {
    name: 'Protein', 
    tagColor: 'red',
    weight: WEIGHTS['2'],
  },
  '3': {
    name: 'Fruit', 
    tagColor: 'blue',
    weight: WEIGHTS['3'],
  },
  '4': {
    name: 'Vegetable', 
    tagColor: 'green',
    weight: WEIGHTS['4'],
  },
  '5': {
    name: 'Grain', 
    tagColor: 'cyan',
    weight: WEIGHTS['5'],
  },
  '6': {
    name: 'Fat', 
    tagColor: 'geekblue',
    weight: WEIGHTS['6'],
  },
  '7': {
    name: 'Legume', 
    tagColor: 'purple',
    weight: WEIGHTS['7'],
  },
  '8': {
    name: 'Combination',  // multiple food groups, not discernable
    tagColor: 'orange',
    weight: WEIGHTS['8'],
  },
  '9': {
    name: 'Not applicable', 
    tagColor: '',
    weight: WEIGHTS['9'],
  },
}
