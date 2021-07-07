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
import FieldTypeSelect from './FieldTypeSelect';
import DisplayConditionEditor from './DisplayConditionEditor';
import CustomSettingsEditor from './CustomSettingsEditor';
import OptionsListSelect from './OptionsListSelect';

import {
  newConfig,
  inputGroupConfig,
  contentGroupConfig,
  inputHiddenConfig,
} from 'constants/commonConfigs';

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

  let configFields: Field[] = [];
  if (mode === 'add' && !newFieldType) {
    configFields = newConfig();
  } else if (!!fieldConfig) {
    if (fieldConfig.group === 'input') {
      if (fieldConfig.type === 'hidden') configFields = inputHiddenConfig(mode);
      else configFields = inputGroupConfig(mode);
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
    configFields = inputGroupConfig(mode);
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
        {
          type: 'customSettings',
          name: '_customSettings',
          label: 'Custom Settings',
        },
      ]}
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
        fieldTypeSelect: {
          component: (props) => (
            <FieldTypeSelect
              {...props}
              newFieldType={newFieldType}
              setNewFieldType={setNewFieldType}
            />
          ),
          defaultValue: '',
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
      }}
    />
  );
}
