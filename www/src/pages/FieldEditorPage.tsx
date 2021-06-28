import { useEffect } from 'react';
import { useFiregridContext } from 'contexts/FiregridContext';

import { EmptyState } from '@antlerengineering/components';
import FormLayout from 'components/FormLayout';
import FormSelectors from 'components/FormSelectors';
import FormPreview from 'components/FormPreview';
import EditableFormPreview from 'components/EditableFormPreview';
import FormFields from 'components/EditableFormPreview/FormFields';
import FormValues from 'components/EditableFormPreview/FormValues';
import FieldDialog from 'components/FieldModal';

import { FieldEditorIcon } from 'constants/routes';

const customComponents = {};

export default function FieldEditorPage() {
  const { selectedForm, formPreview } = useFiregridContext();

  useEffect(() => {
    if (selectedForm && !document.title.includes(selectedForm.name))
      document.title = `${selectedForm.name} | Field Editor | Firegrid`;
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
    return (
      <FormPreview fields={selectedForm.fields}>
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

      <FieldDialog />
    </>
  );
}
