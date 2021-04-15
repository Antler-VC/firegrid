import _uniq from 'lodash/uniq';
import _sortBy from 'lodash/sortBy';

import { useFiregridContext } from 'contexts/FiregridContext';
import {
  FormDialog,
  IFormDialogProps,
  FieldType,
} from '@antlerengineering/form-builder';

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
            options: _uniq(forms.map((doc) => doc.app)),
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
      values={showForm === 'add' ? {} : (selectedForm as Record<string, any>)}
      DialogProps={{ maxWidth: 'xs' }}
      SubmitButtonProps={{
        children: showForm === 'add' ? 'Create Form' : 'Update',
      }}
    />
  );
}
