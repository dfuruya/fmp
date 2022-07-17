import { Checkbox, Table, Tag, Typography } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import SearchIngredients from '../../components/searchIngredients';
import createIngredient from '../api/ingredients/createIngredient';
import updateIngredient from '../api/ingredients/updateIngredient';
import { formatIngredientsDataForTable } from '../../utils/util.ingredients';
import { mapToArray } from '../../utils/util.common';
import { FOOD_GROUPS } from '../../consts';
import Spinner from '../../components/spinner';

const Ingredients = ({
  ingredientsData,
  mutateIngredients,
  idMap,
  handleSearch,
  searchedFoods,
}) => {
  const [isEditingTags, setIsEditingTags] = useState(false)

  const handleEditTags = () => setIsEditingTags(!isEditingTags)

  const handleChange = (value, { label }) => {
    const addOrUpdateStock = async () => {
      if (!id[value]) {
        const res = searchedFoods.searchRes?.get(label)?.ndb_no === value 
          ? searchedFoods.searchRes : searchedFoods.newRes
        const [selected] = mapToArray(res || new Map())
        if (selected) {
          const created = await createIngredient({
            ndb_no: value, 
            name: label, 
            tags: selected.tags, 
            in_stock: true,
          })
          if (created) {
            mutateIngredients()
          }
        }
      }
      else {
        const ing = idMap.id[value]
        const target = {
          id: ing.id,
          checked: !ing.in_stock,
        }
        handleUpdate({ target })
      }
    }

    addOrUpdateStock()
  }

  const handleUpdate = (evt) => {
    const updateStock = async (id, checked) => {
      if (id) {
        const newStockState = checked
        const updated = await updateIngredient(id, newStockState)
        if (updated) {
          mutateIngredients()
        }
      }
    }

    const { id, checked } = evt.target
    updateStock(id, checked)
  }

  const columns = [
    { 
      title: 'In', 
      key: 'in_stock', 
      dataIndex: 'in_stock', 
      width: 48, 
      filters: [
        { text: 'Yes', value: true },
        { text: 'No', value: false },
      ],
      onFilter: (value, record) => record.in_stock === value,
      filterMultiple: false,
      render: (_, { key, in_stock }) => (
        <Checkbox id={key} checked={in_stock} onChange={handleUpdate}/>
      ),
    },
    { 
      title: 'Name', 
      key: 'name', 
      dataIndex: 'name',
    },
    { 
      title: 'Food group', 
      key: 'tags', 
      dataIndex: 'tags', 
      render: (_, { tags }) => {
        return isEditingTags ? (<div onClick={handleEditTags}>hello</div>) : (
          <div onClick={handleEditTags}>
            {tags.map(tagId => {
              const foodGroup = FOOD_GROUPS[tagId]
              return (
                <Tag key={uuidv4()} color={foodGroup.tagColor}>{foodGroup.name}</Tag>
              )
            })}
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <Typography.Title>
        Stocked items
      </Typography.Title>
      <SearchIngredients
        onChange={handleChange} 
        onSearch={handleSearch}
        placeholder={`E.g. "lettuce", "salmon", etc`}
        searchResults={searchedFoods} 
        disableExisting
      />
      <Spinner loading={!ingredientsData}>
        <Table
          dataSource={formatIngredientsDataForTable({ingredientsData})}
          columns={columns}
          pagination={{ position: ['topLeft', 'bottomLeft'] }}
        />
      </Spinner>
    </div>
  )
}

export default Ingredients
