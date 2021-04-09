import React, { useState } from 'react';
import _find from 'lodash/find';
import _findIndex from 'lodash/findIndex';
import _startCase from 'lodash/startCase';
import shortHash from 'shorthash2';
import { useFiregridContext } from 'contexts/FiregridContext';

import { Button } from '@material-ui/core';

import {
  FormDialog,
  FieldType,
  FieldConfigs,
  Field,
  IFieldConfig,
  getFieldProp,
} from '@antlerengineering/form-builder';
import FieldTypeSelect from './FieldTypeSelect';

import {
  newConfig,
  inputGroupConfig,
  contentGroupConfig,
} from 'constants/commonConfigs';

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
  };

  const handleSubmit = (values: Record<string, any>) => {
    const { _order, ...config } = values;
    const index = Math.max(_order - 1, 0);

    // Generate name for this field
    if (!config.name && getFieldProp('group', config.type) === 'content')
      config.name = `_${config.type}_${shortHash(new Date().toISOString())}`;

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
          options: [...selectedForm.fields, null].map((_, i) => `${i + 1}`),
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
          component: () => (
            <Button variant="outlined">Display Condition</Button>
          ),
          defaultValue: '',
        },
      }}
    />
  );
}
