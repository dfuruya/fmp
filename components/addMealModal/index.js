import { Button, Form, Input, Modal, Tag } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useState, useEffect } from "react";
import styled from "styled-components";

import createIngredient from "../../pages/api/ingredients/createIngredient";
import { mapToArray } from "../../utils/util.common";
import SearchIngredients from "../searchIngredients";
import createMeal from "../../pages/api/meals/createMeal";
import updateMeal from "../../pages/api/meals/updateMeal";

const ModalColumns = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 24px;
`

const FieldForm = styled(Form)`
  flex-basis: 100%;
`

const MealIngredients = styled.div`
  flex-basis: 50%;
`

const IngredientsListHeader = styled.div`
  margin-bottom: 16px;
`

const baseFields = {
  id: '',
  name: '',
  description: '',
  ingredients: [],
}

const AddMealModal = ({
  visible,
  onCancel,
  onOk,
  editProps,
  clearEditProps,
  idMap,
  handleSearch,
  searchedFoods,
  mutateIngredients,
}) => {
  const [form] = Form.useForm()

  const [fields, setFields] = useState(baseFields)

  const [isUpdating, setIsUpdating] = useState(false)

  const recipeAction = fields.id ? `Update` : `Add`

  const handleChange = (value, { label }) => {
    const addIngredient = async () => {
      const { id, ndb_no } = idMap
      let idToAdd

      if (ndb_no[value]) {  // if result previously found and stored
        idToAdd = ndb_no[value]
      }
      else if (id[value]) { // if custom result previously stored
        idToAdd = value
      }
      else {  // if new result 
        const res = searchedFoods.searchRes?.get(label)?.ndb_no === value 
          ? searchedFoods.searchRes : searchedFoods.newRes
        const [selected] = mapToArray(res || new Map())

        if (selected) {
          const created = await createIngredient({
            ndb_no: value, 
            name: label, 
            tags: selected.tags, 
          })

          idToAdd = created.id

          if (created) {
            mutateIngredients()
          }
        }
      }

      setFields({
        ...fields,
        ingredients: [...fields.ingredients, idToAdd ]
      })
    }

    addIngredient()
  }

  const handleFieldsChange = (changedFields) => {
    const [key] = Object.keys(changedFields)
    if (!changedFields.hasOwnProperty('ingredients')) {
      setFields({
        ...fields,
        [key]: changedFields[key]
      })
    }
  }

  const handleOk = () => {
    const addMeal = async () => {
      const {id, name, description, ingredients} = fields
      if (name && ingredients.length) {
        setIsUpdating(true)
        if (!id) {
          await createMeal({
            name,
            ingredients,
            description,
          })
        }
        else {
          await updateMeal({
            id,
            name,
            ingredients,
            description,
          })
        }
        setIsUpdating(false)
        onOk({update: true})
      }
    }

    addMeal()
  }

  const handleClose = () => {
    setFields(baseFields)
    clearEditProps()
  }

  const handleDeleteTag = (idx) => {
    const ingredients = [...fields.ingredients]
    ingredients.splice(idx, 1)
    setFields({...fields, ingredients })
  }

  useEffect(() => {
    if (editProps.id) {
      form.setFields([
        {
          name: 'name',
          value: editProps.name,
        },
        {
          name: 'description',
          value: editProps.description,
        }
      ])
      setFields({
        id: editProps.id,
        name: editProps.name,
        description: editProps.description,
        ingredients: editProps.ingredients,
      })
    }
  }, [editProps])

  return (
    <Modal
      title={`${recipeAction} recipe`} 
      width={'70%'}
      visible={visible} 
      onOk={handleOk} 
      onCancel={onCancel}
      destroyOnClose
      afterClose={handleClose}
      footer={[
        <Button 
          key="back" 
          onClick={onCancel}
        >
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          disabled={!fields.name}
          loading={isUpdating}
          onClick={handleOk}
        >
          {`${recipeAction} recipe`}
        </Button>,
      ]}
    >
      <ModalColumns>
        <FieldForm
          form={form}
          name="basic"
          preserve={false}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: false }}
          onValuesChange={handleFieldsChange}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Recipe name is required' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Ingredients"
            name="ingredients"
          >
            <SearchIngredients
              onChange={handleChange} 
              onSearch={handleSearch}
              placeholder={`E.g. "lettuce", "salmon", etc`}
              searchResults={searchedFoods}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <TextArea
              placeholder={`Add directions/notes/etc here`}
              autoSize={{ minRows: 3, maxRows: 25 }}
            />
          </Form.Item>
        </FieldForm>
        <MealIngredients>
          <IngredientsListHeader>
            Ingredients list:
          </IngredientsListHeader>
          <div>
            {(fields.ingredients || []).map((added, idx) => {
              const name = idMap.id[added]?.name
              return <Tag closable key={added} onClose={() => handleDeleteTag(idx)}>{name}</Tag>
            })}
          </div>
        </MealIngredients>
      </ModalColumns>
    </Modal>
  )
}

export default AddMealModal
