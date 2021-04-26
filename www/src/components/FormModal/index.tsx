import _uniq from 'lodash/uniq';
import _sortBy from 'lodash/sortBy';
import _debounce from 'lodash/debounce';
import { useFiregridContext } from 'contexts/FiregridContext';

import {
  FormDialog,
  IFormDialogProps,
  FieldType,
} from '@antlerengineering/form-builder';
import FormKey from './FormKey';

export interface IFormModalProps {
  showForm: 'add' | 'edit' | false;
  onClose: () => void;
  onSubmit: IFormDialogProps['onSubmit'];
}

export default function FormModal({
  showForm,
  onClose,
  onSubmit,
}: IFormModalProps) {
  const { forms, selectedForm } = useFiregridContext();

  const platforms = _uniq(forms.map((doc) => doc.app)) ?? [];
  const editorRoles =
    _uniq(
      Array.prototype.concat(...forms.map((doc) => doc.editorRoles ?? []))
    ) ?? [];

  return (
    <FormDialog
      key={showForm.toString()}
      open={!!showForm}
      onClose={onClose}
      onSubmit={onSubmit}
      title={`${showForm === 'add' ? 'Create New' : 'Edit'} Form`}
      fields={
        [
          {
            type: FieldType.singleSelect,
            name: 'app',
            label: 'Platform',
            labelPlural: 'platforms',
            options: platforms,
            searchable: true,
            freeText: true,
            required: true,
          },
          {
            type: FieldType.shortText,
            name: 'name',
            label: 'Form Name',
            required: true,
          },
          showForm === 'add'
            ? {
                type: 'formKey',
                name: 'id',
                label: 'Form Key',
                required: true,
              }
            : {
                type: FieldType.shortText,
                name: 'id',
                label: 'Form Key',
                required: true,
                disabled: true,
              },
          {
            type: FieldType.multiSelect,
            name: 'editorRoles',
            label: 'Editors',
            options: editorRoles,
            freeText: true,
          },
          showForm === 'add'
            ? {
                type: FieldType.checkbox,
                name: '_starterTemplateUsed',
                label: 'Use another form as a starter template',
              }
            : null,
          showForm === 'add'
            ? {
                type: FieldType.singleSelect,
                name: '_starterTemplate',
                label: 'Template',
                options: _sortBy(forms, ['app', 'name']).map((doc) => ({
                  label: doc.name,
                  app: doc.app,
                  value: doc.id,
                })),
                AutocompleteProps: {
                  groupBy: (option) => option.app || 'Other',
                },
                displayCondition: 'return !!values._starterTemplateUsed',
                searchable: true,
              }
            : null,
        ].filter((x) => x !== null) as any
      }
      customComponents={{
        formKey: {
          defaultValue: '',
          component: FormKey,
          validation: [
            ['string'],
            ['required', 'This form key is used by another form'],
          ],
        },
      }}
      values={showForm === 'add' ? {} : (selectedForm as Record<string, any>)}
      DialogProps={{ maxWidth: 'xs' }}
      SubmitButtonProps={{
        children: showForm === 'add' ? 'Create Form' : 'Update',
      }}
    />
  );
}
