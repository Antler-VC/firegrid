import _uniq from 'lodash/uniq';
import _sortBy from 'lodash/sortBy';
import { useListEditorContext } from 'contexts/ListEditorContext';

import {
  FormDialog,
  IFormDialogProps,
  FieldType,
} from '@antlerengineering/form-builder';
import ListKey from './ListKey';

export interface IListModalProps {
  showListModal: 'add' | 'edit' | false;
  onClose: () => void;
  onSubmit: IFormDialogProps['onSubmit'];
}

export default function ListModal({
  showListModal,
  onClose,
  onSubmit,
}: IListModalProps) {
  const { lists, selectedList } = useListEditorContext();

  const editorRoles =
    _uniq(
      Array.prototype.concat(...lists.map((doc) => doc.editorRoles ?? []))
    ) ?? [];

  return (
    <FormDialog
      key={showListModal.toString()}
      open={!!showListModal}
      onClose={onClose}
      onSubmit={onSubmit}
      title={`${showListModal === 'add' ? 'Create New' : 'Edit'} List`}
      fields={
        [
          {
            type: FieldType.shortText,
            name: 'name',
            label: 'List Name',
            required: true,
          },
          showListModal === 'add'
            ? {
                type: 'listKey',
                name: 'id',
                label: 'List Key',
                required: true,
              }
            : {
                type: FieldType.shortText,
                name: 'id',
                label: 'List Key',
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
          showListModal === 'add'
            ? {
                type: FieldType.checkbox,
                name: '_starterTemplateUsed',
                label: 'Use another list as a starter template',
              }
            : null,
          showListModal === 'add'
            ? {
                type: FieldType.singleSelect,
                name: '_starterTemplate',
                label: 'Template',
                options: _sortBy(lists, ['name']).map((doc) => ({
                  label: doc.name,
                  value: doc.id,
                })),
                displayCondition: 'return !!values._starterTemplateUsed',
                searchable: true,
              }
            : null,
        ].filter((x) => x !== null) as any
      }
      customComponents={{
        listKey: {
          defaultValue: '',
          component: ListKey,
          validation: [
            ['string'],
            ['required', 'This list key is used by another list'],
          ],
        },
      }}
      values={
        showListModal === 'add' ? {} : (selectedList as Record<string, any>)
      }
      DialogProps={{ maxWidth: 'xs' }}
      SubmitButtonProps={{
        children: showListModal === 'add' ? 'Create List' : 'Update',
      }}
    />
  );
}
