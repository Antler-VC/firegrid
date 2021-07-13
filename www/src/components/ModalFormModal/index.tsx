import { useState } from 'react';

import { useTheme } from '@material-ui/core';
import { FormDialog, FieldType } from '@antlerengineering/form-builder';

import { useFiregridContext } from 'contexts/FiregridContext';

export type ModalFormModalRef = {
  open: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ModalFormModal() {
  const { selectedForm, updateSelectedForm, modalFormModalRef } =
    useFiregridContext();

  const [open, setOpen] = useState(false);
  modalFormModalRef.current = { open: setOpen };

  const theme = useTheme();

  if (!selectedForm || !open) return null;

  return (
    <FormDialog
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={updateSelectedForm}
      title="Edit Modal Form"
      fields={[
        {
          type: FieldType.shortText,
          name: 'modal.title',
          label: 'Title',
        },

        {
          type: FieldType.contentHeader,
          name: '_contentHeader_footer',
          label: 'Optional Overrides',
        },

        {
          type: FieldType.singleSelect,
          name: 'modal.DialogProps.maxWidth',
          label: 'Modal Max Width',
          options: [
            { value: '', label: 'Default (sm)' },
            ...['xs', 'sm', 'md', 'lg', 'xl'].map((breakpoint) => ({
              value: breakpoint,
              label: (
                <span style={{ fontFamily: theme.typography.fontFamilyMono }}>
                  {breakpoint} –{' '}
                  {Math.max(theme.breakpoints.values[breakpoint], 444)
                    .toString()
                    .padStart(4, '\xa0')}
                  px
                </span>
              ),
            })),
          ],
        },
        {
          type: FieldType.checkbox,
          name: 'modal.DialogProps.fullWidth',
          label: 'Full width',
          defaultValue: true,
        },

        {
          type: FieldType.contentSubHeader,
          name: '_contentSubHeader_footer',
          label: 'Footer',
        },
        {
          type: FieldType.shortText,
          name: 'modal.CancelButtonProps.children',
          label: 'Cancel Button',
          placeholder: 'Cancel',
          gridCols: 6,
        },
        {
          type: FieldType.shortText,
          name: 'modal.SubmitButtonProps.children',
          label: 'Submit Button',
          placeholder: 'Submit',
          gridCols: 6,
        },
        {
          type: FieldType.checkbox,
          name: 'modal.hideCancelButton',
          label: 'Hide Cancel button',
        },

        {
          type: FieldType.contentSubHeader,
          name: '_contentSubHeader_submitError',
          label: 'Submit Error',
        },
        {
          type: FieldType.paragraph,
          name: 'modal.SubmitErrorProps.children',
          label: 'Message',
          placeholder:
            'Cannot continue. Make sure all the required fields are in the correct format.',
        },
        {
          type: FieldType.checkbox,
          name: 'modal.hideSubmitError',
          label: 'Hide submit error message',
        },

        {
          type: FieldType.contentSubHeader,
          name: '_contentSubHeader_closeConfirmation',
          label: 'Close Confirmation',
        },
        {
          type: FieldType.shortText,
          name: 'modal.CloseConfirmProps.title',
          label: 'Title',
          placeholder: 'Close form?',
        },
        {
          type: FieldType.paragraph,
          name: 'modal.CloseConfirmProps.body',
          label: 'Body',
          placeholder: 'You will lose all the data you entered in this form.',
        },
        {
          type: FieldType.shortText,
          name: 'modal.CloseConfirmProps.cancelButtonProps.children',
          label: 'Cancel Button',
          placeholder: 'Cancel',
          gridCols: 6,
        },
        {
          type: FieldType.shortText,
          name: 'modal.CloseConfirmProps.confirmButtonProps.children',
          label: 'Confirm Button',
          placeholder: 'Close',
          gridCols: 6,
        },
      ]}
      values={selectedForm}
      DialogProps={{ maxWidth: 'xs' }}
      SubmitButtonProps={{ children: 'Update' }}
    />
  );
}
