import { useState } from 'react';
import _find from 'lodash/find';
import { useFiregridContext } from 'contexts/FiregridContext';

import {
  FormDialog,
  FieldType,
  FieldConfigs,
  getFieldProp,
} from 'form-builder';
import MultiSelect from '@antlerengineering/multiselect';

import { Field } from 'types/Field';
import { nth } from 'utils';

export default function FieldModal() {
  const { selectedForm } = useFiregridContext();

  const [open, setOpen] = useState<string | boolean>(true);
  const mode = typeof open === 'string' ? 'edit' : 'add';

  const selectedField =
    mode === 'edit'
      ? (_find(selectedForm!.fields, { name: open }) as Field) ?? null
      : null;

  const [newFieldType, setNewFieldType] = useState('');

  const handleClose = () => {
    setOpen(false);
    setNewFieldType('');
  };

  if (!selectedForm || !Array.isArray(selectedForm.fields)) return null;

  return (
    <FormDialog
      open={!!open}
      // TODO: ENABLE
      // onClose={handleClose}
      onClose={() => {}}
      fields={[
        {
          name: '_section_section',
          type: FieldType.contentSubHeader,
          label: 'Section',
        },
        {
          type: FieldType.date,
          name: 'datetest',
          label: 'Date',
        },
        {
          name: 'section',
          type: FieldType.multiSelect,
          label: 'Section (to be implemented)',
          options: [],
          multiple: false,
          disabled: true,
        },
        {
          name: '_order',
          type: FieldType.multiSelect,
          label: 'Order',
          options: [...selectedForm.fields, null].map((_, i) => nth(i + 1)),
          multiple: false,
        },
        {
          name: 'required',
          type: FieldType.checkbox,
          label: 'Make the field required (mandatory)',
        },
        {
          name: 'name',
          type: FieldType.shortText,
          label: 'Field Key',
          assistiveText:
            'The name of the field in the database, visible only to the Engineering team.\n\nYou will not be able to edit the field key after you click “Add” to prevent data loss.',
          required: true,
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
          name: '_section_fieldSettings',
          type: FieldType.contentSubHeader,
          label: 'Field Settings',
        },
        {
          name: 'conditional',
          type: FieldType.singleSelect,
          label: 'Conditional Field?',
          options: [
            { value: '', label: 'None' },
            { value: 'checkbox', label: 'Checkbox' },
            // { value: 'optionbox', label: 'Optionbox', disabled: true },
          ],
        },
        {
          name: 'label',
          type: FieldType.shortText,
          label: 'Label',
        },
        {
          name: 'assistiveText',
          type: FieldType.paragraph,
          label: 'Assistive Text',
        },
        {
          name: 'disabled',
          type: FieldType.checkbox,
          label: 'Make the field disabled (read-only)',
        },
        ...(getFieldProp('settings', newFieldType) ?? []),
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
              options={FieldConfigs.map((config) => ({
                value: config.type,
                label: config.name,
                group: config.group,
                icon: config.icon,
              }))}
              AutocompleteProps={{ groupBy: (option) => option.group }}
              itemRenderer={(option: any) => (
                <>
                  <span
                    style={{
                      marginRight: 16,
                      display: 'flex',
                      color: '#999',
                    }}
                  >
                    {option.icon}
                  </span>
                  {option.label}
                </>
              )}
              TextFieldProps={{
                helperText:
                  'You will not be able to edit the field type after you click “Add” to prevent data loss.',
                SelectProps: {
                  renderValue: () =>
                    newFieldType ? (
                      <>
                        {getFieldProp('group', newFieldType)}
                        &nbsp;–&nbsp;
                        {getFieldProp('name', newFieldType)}
                      </>
                    ) : null,
                },
              }}
            />
          ),
          defaultValue: '',
        },
      }}
    />
  );
}
