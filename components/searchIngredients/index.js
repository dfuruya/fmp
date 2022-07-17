import { Select } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { mapToArray, mergeValidProps } from '../../utils/util.common';

const defaultSelectProps = {
  autoClearSearchValue: false,
  defaultActiveFirstOption: false,
  filterOption: false,
  notFoundContent: null,
  onChange: () => {},
  onSearch: () => {},
  onInputKeyDown: () => {},
  optionFilterProp: 'value',
  optionLabelProp: 'label',
  placeholder: 'Type here to search',
  showArrow: false,
  showSearch: true,
  style: {
    width: '100%' 
  },
}

const SearchIngredients = (props) => {
  const mergedProps = mergeValidProps(props, defaultSelectProps)

  return (
    <Select {...mergedProps}>
      <Select.OptGroup label="Found">
        {mapToArray(props.searchResults?.searchRes || (new Map())).map(ing => (
          <Select.Option 
            key={ing.ndb_no} 
            label={ing.name}
            value={ing.ndb_no}
          >
            {ing.name}
          </Select.Option>
        ))}
      </Select.OptGroup>
      <Select.OptGroup label="Existing">
        {mapToArray(props.searchResults?.storedRes || (new Map())).map(ing => (
          <Select.Option 
            key={ing.id} 
            disabled={props.disableExisting && ing.in_stock}
            label={ing.name}
            value={ing.id}
          >
            {ing.name}
          </Select.Option>
        ))}
      </Select.OptGroup>
      <Select.OptGroup label="Add new">
        {mapToArray(props.searchResults?.newRes || (new Map())).map(ing => {
          const uid = uuidv4()
          return (
            <Select.Option 
              key={uid} 
              label={ing.name}
              value={uid}
            >
              {ing.name}
            </Select.Option>
          )
        })}
      </Select.OptGroup>
    </Select>
  )
}

export default SearchIngredients
