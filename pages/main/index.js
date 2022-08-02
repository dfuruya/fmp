import { useState, useEffect } from "react"
import useSWR from "swr"
import styled from 'styled-components'

import { fetcher } from "../../utils/util.fetcher"
import { clearSearchResults, mapIngredientsById, prepSearchResults } from "../../utils/util.ingredients"
import Ingredients from "../ingredients"
import Meals from "../meals"
import useDebounce from "../../hooks/useDebounce"
import { searchIngredients } from "../api/_external/searchIngredients"

const Column = styled.div`
  flex-basis: ${props => props.percent}%;
`

const Main = () => {
  const { data: ingredientsData, mutate: mutateIngredients } = useSWR('/api/ingredients/getIngredients', fetcher)
  const idMap = mapIngredientsById(ingredientsData)

  const [inputValue, setInputValue] = useState('')
  const debouncedText = useDebounce(inputValue, 1000)

  const [searchedFoods, setSearchedFoods] = useState({
    newRes: new Map(),
    storedRes: new Map(),
    searchRes: new Map(),
  })

  const handleSearch = (val) => {
    setInputValue(val)
  }

  useEffect(() => {
    const fetchData = async (isSubscribed) => {
      const results = await searchIngredients(debouncedText);

      if (results && isSubscribed) {
        const res = prepSearchResults({
          debouncedText, 
          results, 
          idMap, 
          ingredientsData,
        })
        setSearchedFoods(res)
      }
    }

    let isSubscribed = true;
    if (debouncedText) {
      fetchData(isSubscribed)
        .catch(console.error);;
    }
    else {
      setSearchedFoods(clearSearchResults())
    }
    // cancel any future `setData`
    return () => {
      isSubscribed = false
    }
  }, [debouncedText]);

  return (
    <div className="main-section">
      <Column percent={30}>
        <Ingredients 
          ingredientsData={ingredientsData} 
          idMap={idMap} 
          mutateIngredients={mutateIngredients}
          handleSearch={handleSearch}
          searchedFoods={searchedFoods}
        />
      </Column>
      <div className="main-section-divider" />
      <Column percent={70}>
        <Meals 
          ingredientsData={ingredientsData} 
          idMap={idMap} 
          mutateIngredients={mutateIngredients} 
          handleSearch={handleSearch} 
          searchedFoods={searchedFoods}
        />
      </Column>
    </div>
  )
}

export default Main
