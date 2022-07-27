import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button, Checkbox, Table, Tag, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import EditIngredientModal from '../../components/editIngredientModal';
import SearchIngredients from '../../components/searchIngredients';
import Spinner from '../../components/spinner';

import createIngredient from '../api/ingredients/createIngredient';
import updateIngredient from '../api/ingredients/updateIngredient';
import { formatIngredientsDataForTable } from '../../utils/util.ingredients';
import { mapToArray } from '../../utils/util.common';
import { FOOD_GROUPS } from '../../consts';

const Ingredients = ({
  ingredientsData,
  mutateIngredients,
  idMap,
  handleSearch,
  searchedFoods,
}) => {
  const [selectedIngredient, setSelectedIngredient] = useState(null)

  const tableData = formatIngredientsDataForTable({ingredientsData})

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

  const handleUpdate = (id, updateParams, cb) => {
    const update = async (id, updateParams, cb) => {
      if (id) {
        const updated = await updateIngredient(id, updateParams)
        if (updated) {
          mutateIngredients()
        }
        if (cb) {
          cb()
        }
      }
    }

    update(id, updateParams, cb)
  }

  const handleUpdateStock = (evt) => {
    const { id, checked } = evt.target
    handleUpdate(id, {in_stock: checked})
  }

  const handleOk = () => {
    mutateIngredients()
  }

  const handleOnCancel = () => {
    setSelectedIngredient(null)
  }

  const handleEditIngredient = (ix) => {
    const selected = tableData[ix]
    setSelectedIngredient(selected)
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
      onFilter: (value, { in_stock }) => in_stock === value,
      filterMultiple: false,
      render: (_, { key, in_stock }) => (
        <Checkbox id={key} checked={in_stock} onChange={handleUpdateStock}/>
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
      render: (_, { tags, tags_custom }) => {
        return (
          <div>
            {(tags_custom || tags).map(tagId => {
              const foodGroup = FOOD_GROUPS[tagId]
              return (
                <Tag key={uuidv4()} color={foodGroup.tagColor}>{foodGroup.name}</Tag>
              )
            })}
          </div>
        )
      },
    },
    { 
      title: 'Edit', 
      key: 'row_actions', 
      dataIndex: 'row_actions',
      width: 60, 
      render: (_, record, ix) => {
        return (
          <Button 
            type='link'
            icon={<EditOutlined />}
            size='small'
            onClick={() => handleEditIngredient(ix)}
          />
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
          dataSource={tableData}
          columns={columns}
          pagination={{ position: ['topLeft', 'bottomLeft'] }}
        />
      </Spinner>
      <EditIngredientModal
        onCancel={handleOnCancel}
        onOk={handleOk}
        editProps={selectedIngredient}
      />
    </div>
  )
}

export default Ingredients
