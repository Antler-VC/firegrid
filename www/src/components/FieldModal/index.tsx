import React, { useState } from 'react';
import _find from 'lodash/find';
import _findIndex from 'lodash/findIndex';
import _startCase from 'lodash/startCase';
import _omit from 'lodash/omit';
import shortHash from 'shorthash2';
import { useFiregridContext } from 'contexts/FiregridContext';

import {
  FormDialog,
  FieldType,
  FieldConfigs,
  Field,
  IFieldConfig,
  getFieldProp,
} from '@antlerengineering/form-builder';
import { CustomFieldConfigs } from 'components/CustomFields';
import CopyFieldConfigSelect from './CopyFieldConfigSelect';
import FieldTypeSelect from './FieldTypeSelect';
import DisplayConditionEditor from './DisplayConditionEditor';
import CustomSettingsEditor from './CustomSettingsEditor';
import OptionsListSelect from './OptionsListSelect';
import ImageUploader from 'components/CustomFields/Image/ImageComponent';

import {
  newConfig,
  inputGroupConfig,
  contentGroupConfig,
  inputHiddenConfig,
} from 'constants/commonConfigs';
import { DB_ROOT_FORMS } from 'constants/firegrid';

export const stringifyCustomSettings = (
  values: Record<string, any>,
  configFields: Field[]
) => {
  const {
    type,
    name,
    disabled,
    required,
    conditional,
    displayCondition,
    label,
    assistiveText,
    ...otherValues
  } = values;

  const customSettings = _omit(
    otherValues,
    configFields.map((field) => field.name as string)
  );

  return JSON.stringify(customSettings, null, '    ');
};

export type FieldModalRef = {
  openFieldModal: React.Dispatch<
    React.SetStateAction<string | number | boolean>
  >;
};

export default function FieldModal() {
  const { selectedForm, fieldModalRef, addField, editField } =
    useFiregridContext();

  const [open, setOpen] = useState<string | number | boolean>(false);
  const mode = typeof open === 'string' ? 'edit' : 'add';

  fieldModalRef.current = { openFieldModal: setOpen };

  const [newFieldType, setNewFieldType] = useState('');

  const handleClose = () => {
    setOpen(false);
    setNewFieldType('');
  };

  if (!selectedForm || !Array.isArray(selectedForm.fields)) return null;

  const selectedField =
    mode === 'edit'
      ? (_find(selectedForm!.fields, { name: open }) as Field) ?? {}
      : {};

  const selectedFieldIndex =
    mode === 'edit'
      ? _findIndex(selectedForm!.fields, { name: open as string })
      : -1;

  const fieldConfig: IFieldConfig | null =
    _find(CustomFieldConfigs, {
      type: (selectedField as Field)?.type || newFieldType,
    }) ||
    _find(FieldConfigs, {
      type: (selectedField as Field)?.type || newFieldType,
    }) ||
    null;

  const duplicateCheck = [
    'test',
    'duplicateCheck',
    'There is another field in this form with this key.',
    (name) => {
      console.log(name, selectedForm!.fields);

      return !_find(selectedForm!.fields, { name });
    },
  ];

  let configFields: Field[] = [];
  if (mode === 'add' && !newFieldType) {
    configFields = newConfig();
  } else if (!!fieldConfig) {
    if (fieldConfig.group === 'input') {
      if (fieldConfig.type === 'hidden')
        configFields = inputHiddenConfig(mode, duplicateCheck);
      else configFields = inputGroupConfig(mode, duplicateCheck);
    } else if (fieldConfig.group === 'content') {
      configFields = contentGroupConfig(mode);
    }

    configFields = [...configFields, ...fieldConfig.settings];

    if (
      fieldConfig.type === FieldType.singleSelect ||
      fieldConfig.type === FieldType.multiSelect ||
      fieldConfig.type === FieldType.radio
    ) {
      const index = _findIndex(configFields, ['name', 'options']);
      configFields.splice(index + 1, 0, {
        type: 'optionsList',
        name: '_optionsList',
        label: 'Options List',
      });
    }
  } else {
    configFields = inputGroupConfig(mode, duplicateCheck);
  }

  const values = {
    type: newFieldType,
    ...selectedField,
    _order:
      typeof open === 'number'
        ? open + 1
        : (selectedFieldIndex > -1
            ? selectedFieldIndex + 1
            : selectedForm.fields.length + 1
          ).toString(),
    _customSettings: stringifyCustomSettings(selectedField, configFields),
  };

  const handleSubmit = (values: Record<string, any>) => {
    const { _order, _customSettings, ...otherValues } = values;
    let config = { ...otherValues };
    const index = Math.max(_order - 1, 0);

    // Generate name for this field
    if (!config.name && getFieldProp('group', config.type) === 'content')
      config.name = `_${config.type}_${shortHash(new Date().toISOString())}`;

    if (_customSettings) {
      try {
        const customSettings = JSON.parse(_customSettings);
        config = { ...config, ...customSettings };
      } catch {
        alert('Failed to parse custom settings');
      }
    }

    if (mode === 'add') addField(index, config as Field);
    else if (mode === 'edit') editField(config.name, config as Field, index);
  };

  return (
    <FormDialog
      key={`${open}`}
      open={open !== false}
      onClose={handleClose}
      fields={
        [
          {
            type: FieldType.contentSubHeader,
            name: '_contentSubHeader_section',
            label: 'Section',
          },
          {
            type: FieldType.singleSelect,
            name: '_order',
            label: 'Order',
            options: [...selectedForm.fields, null].map((_, i) => ({
              label: `${i + 1}`,
              value: i + 1,
            })),
            searchable: true,
            required: true,
          },
          mode === 'add'
            ? {
                type: FieldType.contentSubHeader,
                name: '_contentSubHeader_copyFieldConfig',
                label: '',
              }
            : null,
          mode === 'add'
            ? {
                type: 'copyFieldConfigSelect',
                name: '_copyFieldConfig',
                label: 'Copy Field Config',
              }
            : null,
          ...configFields,
          {
            type: 'customSettings',
            name: '_customSettings',
            label: 'Custom Settings',
          },
        ].filter((x) => x !== null) as any
      }
      values={values}
      title={`${_startCase(mode)} Field${
        fieldConfig ? `: ${fieldConfig.name}` : ''
      }`}
      onSubmit={handleSubmit}
      SubmitButtonProps={{
        children: mode === 'edit' ? 'Update' : 'Add',
      }}
      DialogProps={{ maxWidth: 'xs' }}
      customComponents={{
        copyFieldConfigSelect: {
          component: (props) => (
            <CopyFieldConfigSelect
              {...props}
              newFieldType={newFieldType}
              setNewFieldType={setNewFieldType}
              restrictFieldType={(selectedField as any)?.type}
            />
          ),
          defaultValue: '',
        },
        fieldTypeSelect: {
          component: (props) => (
            <FieldTypeSelect
              {...props}
              newFieldType={newFieldType}
              setNewFieldType={setNewFieldType}
            />
          ),
          defaultValue: '',
          validation: [['string'], ['required', 'Required']],
        },
        displayCondition: {
          component: (props) => (
            <DisplayConditionEditor {...props} fields={selectedForm!.fields} />
          ),
          defaultValue: '',
        },
        readOnly: {
          component: () => <></>,
          defaultValue: '',
        },
        customSettings: {
          component: CustomSettingsEditor as any,
          defaultValue: '',
          validation: [
            ['string'],
            [
              'test',
              'json',
              'JSON could not be parsed. Please make sure you do not have any trailing commas.',
              (value) => {
                try {
                  JSON.parse(value);
                  return true;
                } catch (e) {
                  return false;
                }
              },
            ],
          ],
        },
        optionsList: {
          component: OptionsListSelect,
          defaultValue: '',
          validation: [['string']],
        },
        image: {
          component: (props) => (
            <ImageUploader
              {...props}
              docRef={DB_ROOT_FORMS + '/' + selectedForm.id}
            />
          ),
          defaultValue: [],
          validation: [['array']],
        },
      }}
    />
  );
}
