import { Button, Checkbox, Form, Input, Modal, Select, Tag } from "antd";
import { useState, useEffect } from "react";
import styled from "styled-components";

import { FOOD_GROUPS } from "../../consts";
import { v4 as uuidv4 } from "uuid";
import updateIngredient from "../../pages/api/ingredients/updateIngredient";

const FieldForm = styled(Form)`
  flex-basis: 100%;
`

const MODAL_TITLE = 'Update ingredient'

const grpKeys = Object.keys(FOOD_GROUPS)

const baseFields = {
  id: '',
  name: '',
  in_stock: '',
  tags: [],
}

const EditIngredientModal = ({
  onCancel,
  onOk,
  editProps,
}) => {
  const [form] = Form.useForm()

  const [fields, setFields] = useState(baseFields)

  const [isUpdating, setIsUpdating] = useState(false)

  const [tagVal] = fields.tags
  const tagLabel = tagVal ? FOOD_GROUPS[tagVal].name : ''

  const handleFieldsChange = (changedFields) => {
    const [key] = Object.keys(changedFields)
    let val = changedFields[key]
    if (key === 'in_stock') {
      val = !val
    }
    else if (key === 'tags') {
      val = [val]
    }
    setFields({
      ...fields,
      [key]: val
    })
  }

  const handleOk = () => {
    const update = async () => {
      const {id, name, in_stock, tags} = fields
      
      setIsUpdating(true)
      const updated = await updateIngredient(id, {
        name,
        in_stock,
        tags_custom: tags,
      })
      setIsUpdating(false)

      if (updated) {
        onOk()
        handleClose()
      }
    }

    update()
  }

  const handleClose = () => {
    setFields(baseFields)
    onCancel()
  }

  useEffect(() => {
    if (editProps?.key) {
      form.setFields([
        {
          name: 'name',
          value: editProps.name,
        },
        {
          name: 'in_stock',
          value: editProps.in_stock,
        },
        {
          name: 'tags',
          label: tagLabel,
          value: tagVal,
        },
      ])
      setFields({
        id: editProps.key,
        name: editProps.name,
        in_stock: editProps.in_stock,
        tags: editProps.tags_custom || editProps.tags,
      })
    }
  }, [editProps])

  return (
    <Modal
      title={MODAL_TITLE}
      width={'70%'}
      style={{maxWidth: 480}}
      centered
      visible={editProps} 
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
          {MODAL_TITLE}
        </Button>,
      ]}
    >
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
        >
          <Input disabled value={fields.name}/>
        </Form.Item>

        <Form.Item
          label="In stock"
          name="in_stock"
        >
          <Checkbox checked={fields.in_stock}/>
        </Form.Item>

        <Form.Item
          label="Food group"
          name="tags"
          initialValue={{value: tagVal, label: tagLabel}}
        >
          <Select
            id={fields.id}
            labelInValue
            optionLabelProp='label'
            options={grpKeys.map(grpKey => {
              const grp = FOOD_GROUPS[grpKey]
              return {
                key: uuidv4(),
                label: grp.name,
                value: grpKey,
                ingId: fields.id,
              }
            })}
          />
        </Form.Item>
      </FieldForm>
    </Modal>
  )
}

export default EditIngredientModal
