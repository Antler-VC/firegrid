import { FieldType } from 'form-builder';

export const newConfig = () => [
  {
    type: FieldType.contentSubHeader,
    name: '_section_fieldSettings',
    label: 'Field Settings',
  },
  {
    type: FieldType.contentParagraph,
    name: '_paragraph_fieldSettings_warning',
    label:
      'You will not be able to edit the Field Type after you click “Add” to prevent data loss.',
  },
  {
    type: 'fieldTypeSelect',
    name: 'type',
  },
];

export const inputGroupConfig = (mode: string) => [
  {
    type: FieldType.contentSubHeader,
    name: '_section_fieldSettings',
    label: 'Field Settings',
  },
  {
    type: FieldType.contentParagraph,
    name: '_paragraph_fieldSettings_warning',
    label:
      mode === 'edit'
        ? 'You cannot edit the Field Key or Field Type to prevent data loss.'
        : 'You will not be able to edit the Field Key or Field Type after you click “Add” to prevent data loss.',
  },
  {
    type: 'fieldTypeSelect',
    name: 'type',
    disabled: mode === 'edit',
  },
  {
    type: FieldType.shortText,
    name: 'name',
    label: 'Field Key',
    assistiveText:
      'The name of the field in the database.\nVisible only to the Engineering team.',
    required: true,
    disabled: mode === 'edit',
  },
  {
    type: FieldType.checkbox,
    name: 'required',
    label: 'Make the field required (mandatory)',
  },
  {
    type: FieldType.checkbox,
    name: 'disabled',
    label: 'Make the field disabled (read-only)',
  },
  {
    type: FieldType.singleSelect,
    name: 'conditional',
    label: 'Conditional Field?',
    options: [
      { value: '', label: 'None' },
      { value: 'checkbox', label: 'Checkbox' },
      // { value: 'optionbox', label: 'Optionbox', disabled: true },
    ],
  },
  {
    type: 'displayCondition',
    name: 'displayCondition',
  },
  {
    type: FieldType.contentSubHeader,
    name: '_section_fieldDetails',
    label: 'Field Details',
  },
  {
    type: FieldType.shortText,
    name: 'label',
    label: 'Label',
    required: true,
  },
  {
    type: FieldType.paragraph,
    name: 'assistiveText',
    label: 'Assistive Text',
  },
];

export const contentGroupConfig = (mode: string) => [
  {
    type: FieldType.contentSubHeader,
    name: '_section_fieldSettings',
    label: 'Field Settings',
  },
  {
    type: FieldType.contentParagraph,
    name: '_paragraph_fieldSettings_warning',
    label:
      mode === 'edit'
        ? 'You cannot edit the Field Type to prevent data loss.'
        : 'You will not be able to edit the Field Type after you click “Add” to prevent data loss.',
  },
  {
    type: 'fieldTypeSelect',
    name: 'type',
    disabled: mode === 'edit',
  },
  {
    type: FieldType.shortText,
    name: 'name',
    label: 'Field Key',
    assistiveText:
      'TODO: REMOVE THIS. The name of the field in the database.\nVisible only to the Engineering team.',
    disabled: true,
  },
  {
    type: FieldType.contentSubHeader,
    name: '_section_fieldDetails',
    label: 'Field Details',
  },
];
