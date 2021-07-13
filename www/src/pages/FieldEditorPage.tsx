import { useEffect } from 'react';
import { useFiregridContext } from 'contexts/FiregridContext';

import { EmptyState } from '@antlerengineering/components';
import { FormDialog } from '@antlerengineering/form-builder';

import FormLayout from 'components/FormLayout';
import FormSelectors from 'components/FormSelectors';
import FormPreview from 'components/FormPreview';
import EditableFormPreview from 'components/EditableFormPreview';
import FormFields from 'components/EditableFormPreview/FormFields';
import FormValues from 'components/EditableFormPreview/FormValues';
import FieldModal from 'components/FieldModal';
import ModalFormModal from 'components/ModalFormModal';

import { FieldEditorIcon } from 'constants/routes';
import { customComponents } from 'components/CustomFields';

export default function FieldEditorPage() {
  const { selectedForm, formPreview, setFormPreview } = useFiregridContext();

  useEffect(() => {
    if (selectedForm && !document.title.includes(selectedForm.name))
      document.title = `${selectedForm.name} | ${selectedForm.app} | Field Editor | Firegrid`;
  }, [selectedForm]);

  if (selectedForm === null)
    return (
      <FormLayout paperHeader={<FormSelectors />}>
        <EmptyState
          Icon={FieldEditorIcon}
          message="No form selected"
          description="Select a form above to begin"
        />
      </FormLayout>
    );

  if (!selectedForm.fields)
    return (
      <FormLayout paperHeader={<FormSelectors />}>
        <EmptyState
          Icon={FieldEditorIcon}
          message="Invalid form configuration"
          description={`ID: ${selectedForm?.id}`}
        />
      </FormLayout>
    );

  if (formPreview) {
    if (selectedForm.variant === 'modal')
      return (
        <FormLayout
          paperHeader={<FormSelectors />}
          children={
            <FormDialog
              open
              onSubmit={(v) => console.log(v)}
              onClose={() => setFormPreview(false)}
              fields={selectedForm.fields}
              customComponents={customComponents}
              {...(selectedForm.modal ?? {})}
            />
          }
        />
      );

    return (
      <FormPreview
        fields={selectedForm.fields}
        customComponents={customComponents}
      >
        {(formFields) => (
          <FormLayout
            paperHeader={<FormSelectors />}
            children={formFields}
            previewContent={<FormValues />}
          />
        )}
      </FormPreview>
    );
  }

  return (
    <>
      <EditableFormPreview fields={selectedForm.fields}>
        <FormLayout
          paperHeader={<FormSelectors />}
          children={
            <FormFields
              fields={selectedForm.fields}
              customComponents={customComponents}
            />
          }
          previewContent={<FormValues />}
        />
      </EditableFormPreview>

      <FieldModal />
      {selectedForm.variant === 'modal' && <ModalFormModal />}
    </>
  );
}
