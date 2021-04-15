import React, { useState } from 'react';
import _find from 'lodash/find';
import _findIndex from 'lodash/findIndex';
import _startCase from 'lodash/startCase';
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
import FieldTypeSelect from './FieldTypeSelect';
import DisplayConditionEditor from './DisplayConditionEditor';
import CustomSettingsEditor from './CustomSettingsEditor';

import {
  newConfig,
  inputGroupConfig,
  contentGroupConfig,
  customGroupConfig,
} from 'constants/commonConfigs';

export const stringifyCustomSettings = (values: Record<string, any>) => {
  const {
    type,
    name,
    disabled,
    required,
    conditional,
    displayCondition,
    label,
    assistiveText,
    ...customSettings
  } = values;
  return JSON.stringify(customSettings, null, '    ');
};

export type FieldModalRef = {
  openFieldModal: React.Dispatch<
    React.SetStateAction<string | number | boolean>
  >;
};

export default function FieldModal() {
  const {
    selectedForm,
    fieldModalRef,
    addField,
    editField,
  } = useFiregridContext();

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
    _find(FieldConfigs, {
      type: (selectedField as Field)?.type || newFieldType,
    }) || null;

  let configFields: Field[] = [];
  if (mode === 'add' && !newFieldType) {
    configFields = newConfig();
  } else if (!!fieldConfig) {
    if (fieldConfig.group === 'input') {
      configFields = inputGroupConfig(mode);
    } else if (fieldConfig.group === 'content') {
      configFields = contentGroupConfig(mode);
    }

    configFields = [...configFields, ...fieldConfig.settings];
  } else {
    configFields = customGroupConfig(mode);
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
    _customSettings: stringifyCustomSettings(selectedField),
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
      fields={[
        {
          type: FieldType.contentSubHeader,
          name: '_section_section',
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
        ...configFields,
      ]}
      values={values}
      title={`${_startCase(mode)} Field${
        fieldConfig ? `: ${fieldConfig.name}` : ''
      }`}
      onSubmit={handleSubmit}
      SubmitButtonProps={{
        children: mode === 'edit' ? 'Update' : 'Add',
      }}
      DialogProps={{ maxWidth: 'xs', disableBackdropClick: true }}
      customComponents={{
        fieldTypeSelect: {
          component: React.forwardRef((props, ref) => (
            <FieldTypeSelect
              {...props}
              ref={ref}
              newFieldType={newFieldType}
              setNewFieldType={setNewFieldType}
            />
          )) as any,
          defaultValue: '',
        },
        displayCondition: {
          component: React.forwardRef((props, ref) => (
            <DisplayConditionEditor
              {...props}
              ref={ref}
              fields={selectedForm!.fields}
            />
          )) as any,
          defaultValue: '',
        },
        readOnly: {
          component: (() => <></>) as any,
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
      }}
    />
  );
}
