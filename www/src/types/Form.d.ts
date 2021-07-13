import { Field, IFormDialogProps } from '@antlerengineering/form-builder';

export interface Form {
  id: string;
  app: string;
  name: string;
  fields: Field[];
  editorRoles: string[];
  variant: 'inline' | 'modal';

  // Modal-specific fields
  modal: Pick<
    IFormDialogProps,
    | 'title'
    | 'SubmitButtonProps'
    | 'CancelButtonProps'
    | 'hideCancelButton'
    | 'DialogProps'
    | 'hideSubmitError'
    | 'SubmitErrorProps'
    | 'CloseConfirmProps'
  >;
}
