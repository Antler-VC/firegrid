import { useState } from 'react'
import _find from 'lodash/find'
import { useFiregridContext } from 'contexts/FiregridContext'

import { FormDialog, FIELDS } from 'form-builder'
import MultiSelect from '@antlerengineering/multiselect'

import { Field } from 'types/Field'
import { nth } from 'utils'

export default function FieldModal() {
  const { selectedForm } = useFiregridContext()

  const [open, setOpen] = useState<string | boolean>(true)
  const mode = typeof open === 'string' ? 'edit' : 'add'

  const selectedField =
    mode === 'edit'
      ? (_find(selectedForm!.fields, { name: open }) as Field) ?? null
      : null

  const [newFieldType, setNewFieldType] = useState('')

  const handleClose = () => {
    setOpen(false)
    setNewFieldType('')
  }

  if (!selectedForm || !Array.isArray(selectedForm.fields)) return null

  return (
    <FormDialog
      open={!!open}
      onClose={handleClose}
      // formHeader={
      //   <MultiSelect
      //     label="Field Type"
      //     multiple={false}
      //     value={newFieldType}
      //     onChange={setNewFieldType as any}
      //     options={
      //       [
      //         { value: 'Sub-Header', label: 'Sub-Header', type: 'Content' },
      //         { value: 'Short Text', label: 'Short Text', type: 'Content' },
      //         // { value: 'Paragraph', label: 'Paragraph', type: 'Content' },
      //         { value: 'Image', label: 'Image', type: 'Content' },
      //         { value: 'Short Text', label: 'Short Text', type: 'Input' },
      //         { value: 'Paragraph', label: 'Paragraph', type: 'Input' },
      //         { value: 'Rich Text', label: 'Rich Text', type: 'Input' },
      //         { value: 'Date', label: 'Date', type: 'Input' },
      //         { value: 'Time & Date', label: 'Time & Date', type: 'Input' },
      //         { value: 'Checkbox', label: 'Checkbox', type: 'Input' },
      //         { value: 'Radio', label: 'Radio', type: 'Input' },
      //         { value: 'Single Select', label: 'Single Select', type: 'Input' },
      //         { value: 'Multi Select', label: 'Multi Select', type: 'Input' },
      //         { value: 'Slider', label: 'Slider', type: 'Input' },
      //         { value: 'List', label: 'List', type: 'Input' },
      //         { value: 'Color', label: 'Color', type: 'Input' },
      //         { value: 'File Upload', label: 'File Upload', type: 'Database' },
      //         {
      //           value: 'Image Upload',
      //           label: 'Image Upload',
      //           type: 'Database',
      //         },
      //       ] as any
      //     }
      //     AutocompleteProps={{
      //       groupBy: (option) => option.type,
      //     }}
      //     TextFieldProps={{
      //       helperText:
      //         'You will not be able to edit the field type after you click “Add”.',
      //     }}
      //   />
      // }
      fields={[
        {
          type: FIELDS.heading,
          label: 'Section',
        },
        {
          name: 'section',
          type: FIELDS.multiSelect,
          label: 'Section (to be implemented)',
          options: [],
          multiple: false,
          disabled: true,
        },
        {
          name: '_order',
          type: FIELDS.multiSelect,
          label: 'Order',
          options: [...selectedForm.fields, null].map((_, i) => nth(i + 1)),
          multiple: false,
        },
        {
          name: 'required',
          type: FIELDS.checkbox,
          label: 'Make the field required (mandatory)',
        },
        {
          name: 'name',
          type: 'text',
          label: 'Field Key',
          helperText:
            'The name of the field in the database, visible only to the Engineering team. You will not be able to edit the field key after you click “Add” to prevent data loss.',
        },
        {
          name: 'type',
          type: 'fieldTypeSelect',
        },
        {
          name: 'displayCondition',
          type: 'displayCondition',
        },
        {
          type: FIELDS.heading,
          label: 'Field Settings',
        },
        {
          name: 'conditional',
          type: FIELDS.singleSelect,
          label: 'Conditional Field?',
          options: [
            { value: '', label: 'None' },
            { value: 'checkbox', label: 'Checkbox' },
            { value: 'optionbox', label: 'Optionbox' },
          ],
        },
        {
          name: 'label',
          type: FIELDS.text,
          label: 'Label',
        },
        {
          name: 'assistiveText',
          type: FIELDS.text,
          label: 'Assistive Text',
        },
        {
          name: 'disabled',
          type: FIELDS.checkbox,
          label: 'Make the field disabled (read-only)',
        },
      ]}
      title={`${typeof open === 'boolean' ? 'Add' : 'Edit'} Field${
        selectedField ? `: ${selectedField.name}` : ''
      }`}
      onSubmit={(values) => console.log(values)}
      SubmitButtonProps={{
        children: typeof open === 'boolean' ? 'Add' : 'Update',
      }}
      DialogProps={{ maxWidth: 'xs', disableBackdropClick: true }}
      customComponents={{
        fieldTypeSelect: {
          component: () => (
            <MultiSelect
              label="Field Type*"
              multiple={false}
              value={newFieldType}
              onChange={setNewFieldType as any}
              options={
                [
                  { value: 'Sub-Header', label: 'Sub-Header', type: 'Content' },
                  { value: 'Short Text', label: 'Short Text', type: 'Content' },
                  // { value: 'Paragraph', label: 'Paragraph', type: 'Content' },
                  { value: 'Image', label: 'Image', type: 'Content' },
                  { value: 'Short Text', label: 'Short Text', type: 'Input' },
                  { value: 'Paragraph', label: 'Paragraph', type: 'Input' },
                  { value: 'Rich Text', label: 'Rich Text', type: 'Input' },
                  { value: 'Date', label: 'Date', type: 'Input' },
                  { value: 'Time & Date', label: 'Time & Date', type: 'Input' },
                  { value: 'Checkbox', label: 'Checkbox', type: 'Input' },
                  { value: 'Radio', label: 'Radio', type: 'Input' },
                  {
                    value: 'Single Select',
                    label: 'Single Select',
                    type: 'Input',
                  },
                  {
                    value: 'Multi Select',
                    label: 'Multi Select',
                    type: 'Input',
                  },
                  { value: 'Slider', label: 'Slider', type: 'Input' },
                  { value: 'List', label: 'List', type: 'Input' },
                  { value: 'Color', label: 'Color', type: 'Input' },
                  {
                    value: 'File Upload',
                    label: 'File Upload',
                    type: 'Database',
                  },
                  {
                    value: 'Image Upload',
                    label: 'Image Upload',
                    type: 'Database',
                  },
                ] as any
              }
              AutocompleteProps={{
                groupBy: (option) => option.type,
              }}
              TextFieldProps={{
                helperText:
                  'You will not be able to edit the field type after you click “Add”.',
              }}
            />
          ),
          defaultValue: '',
        },
      }}
    />
  )
}
