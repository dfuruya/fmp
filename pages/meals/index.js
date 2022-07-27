import { useState } from 'react'
import useSWR from "swr";
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid';
import { Button, Progress, Space, Table, Tag, Typography } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { CloseOutlined, EditOutlined, PlusCircleTwoTone } from '@ant-design/icons';
import { presetPalettes } from '@ant-design/colors';

import deleteMeal from '../api/meals/deleteMeal';
import AddMealModal from '../../components/addMealModal';
import { fetcher } from '../../utils/util.fetcher';
import { formatMealsDataForTable, mapMealsById } from '../../utils/util.meals';
import { FOOD_GROUPS } from '../../consts';
import Spinner from '../../components/spinner';

const progressColors = [
  presetPalettes.volcano[5],
  presetPalettes.orange[5],
  presetPalettes.gold[5],
  presetPalettes.yellow[5],
  presetPalettes.lime[5],
  presetPalettes.cyan[5],
  presetPalettes.blue[5],
  presetPalettes.geekblue[5],
  presetPalettes.purple[5],
  presetPalettes.magenta[5],
]

const PageTitle = styled(Typography.Title)`
  display: flex;
  align-items: center;
`

const DeleteRecipeName = styled.span`
  font-weight: bold;
  text-decoration: underline;
`

const baseMealState = {
  id: '', 
  name: '',
  description: '',
  ingredients: [],
}

const Meals = ({
  ingredientsData,
  idMap,
  mutateIngredients,
  handleSearch,
  searchedFoods,
}) => {
  const { data: mealsData, mutate: mutateMeals } = useSWR('/api/meals/getMeals', fetcher)
  const mealsIdMap = mapMealsById(mealsData)

  const [isAddMealModalVisible, setIsAddMealModalVisible] = useState(false)
  const [isDeleteMealModalVisible, setIsDeleteMealModalVisible] = useState(false)

  const [selectedMeal, setSelectedMeal] = useState(baseMealState)

  const [isUpdating, setIsUpdating] = useState(false)

  const showAddMealModal = ({ update }) => {
    setIsAddMealModalVisible(!isAddMealModalVisible)
    if (update) {
      mutateMeals()
    }
  }

  const showDeleteMealModal = () => {
    setIsDeleteMealModalVisible(!isDeleteMealModalVisible)
  }

  const clearEditProps = () => setSelectedMeal(baseMealState)

  const handleDelete = () => {
    const deleteItem = async (id) => {
      if (id) {
        setIsUpdating(true)
        const deleted = await deleteMeal(id)
        if (deleted) {
          showDeleteMealModal()
          mutateMeals()
        }
        setIsUpdating(false)
      }
    }

    deleteItem(selectedMeal.id)
  }

  const handleAction = (evt) => {
    const { id, name } = evt.currentTarget
    const meal = mealsIdMap[id]
    setSelectedMeal(meal)

    if (name === 'delete-meal-button') {
      showDeleteMealModal()
    }
    else if (name === 'edit-meal-button') {
      showAddMealModal({})
    }
  }

  const columns = [
    { 
      title: 'Name', 
      key: 'name', 
      dataIndex: 'name',
    },
    { 
      title: 'Weight', 
      key: 'tagWeight', 
      dataIndex: 'tagWeight', 
      width: '15%',
      sorter: (a, b) => a.tagWeight - b.tagWeight,
      render: (_, { tagWeight }) => (
        <Progress
          percent={tagWeight} 
          strokeColor={progressColors[Math.floor(tagWeight / 20)]}
        />
      ),
    },
    { 
      title: 'Tags', 
      key: 'tags', 
      dataIndex: 'tags', 
      render: (_, { tags }) => (
        <>
          {tags.map(tagId => {
            const foodGroup = FOOD_GROUPS[tagId]
            return (
              <Tag key={uuidv4()} color={foodGroup.tagColor}>{foodGroup.name}</Tag>
            )
          })}
        </>
      ),
    },
    { 
      title: 'Ingredients', 
      key: 'ingredients', 
      dataIndex: 'ingredients', 
      render: (_, { ingredients }) => (
        <>
          {ingredients.map(ing => {
            const found = idMap.id[ing]
            const tagLabel = found?.name || ing
            const tagColor = found?.in_stock ? '' : 'black'
            return (
              <Tag key={ing} color={tagColor}>{tagLabel}</Tag>
            )
          })}
        </>
      ),
    },
    {
      title: 'Actions',
      key: 'row_actions',
      width: 100,
      render: (_, { key }) => (
        <Space size="small">
          <Button id={key} type="link" size="small" name="edit-meal-button" onClick={handleAction}>
            <EditOutlined />
          </Button>
          <Button id={key} type="link" size="small" name="delete-meal-button" onClick={handleAction}>
            <CloseOutlined />
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <PageTitle>
        Recipes&nbsp;
        <Button
          type="primary" 
          icon={<PlusCircleTwoTone />} 
          size={'large'}
          onClick={showAddMealModal}
        >
          Add a recipe
        </Button>
      </PageTitle>
      <Spinner loading={!mealsData}>
        <Table
          dataSource={formatMealsDataForTable({mealsData, idMap})}
          columns={columns}
          pagination={{ position: ['topLeft', 'bottomLeft'] }}
        />
      </Spinner>
      <AddMealModal
        visible={isAddMealModalVisible}
        onOk={showAddMealModal}
        onCancel={showAddMealModal}
        editProps={selectedMeal}
        clearEditProps={clearEditProps}
        idMap={idMap}
        ingredientsData={ingredientsData}
        mutateIngredients={mutateIngredients}
        handleSearch={handleSearch}
        searchedFoods={searchedFoods}
      />
      <Modal
        title={`Deleting recipe`}
        visible={isDeleteMealModalVisible}
        onOk={handleDelete}
        onCancel={showDeleteMealModal}
        footer={[
          <Button 
            key="back" 
            onClick={showDeleteMealModal}
          >
            Cancel
          </Button>,
          <Button 
            key="delete" 
            type="primary" 
            danger
            onClick={handleDelete}
            loading={isUpdating}
          >
            Delete
          </Button>,
        ]}
      >
        Are you sure you want to delete:&nbsp;
        <DeleteRecipeName>{selectedMeal.name}</DeleteRecipeName>?
      </Modal>
    </div>
  )
}

export default Meals
