import { useFiregridContext } from 'contexts/FiregridContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { EmptyState } from '@antlerengineering/components';
import FormLayout from 'components/FormLayout';
import FormSelectors from 'components/FormSelectors';
import FormPreview from 'components/FormPreview';
import FormFields from 'components/FormPreview/FormFields';
import FormValues from 'components/FormPreview/FormValues';
import FieldDialog from 'components/FieldModal';

import { FieldEditorIcon } from 'constants/routes';

const customComponents = {};

export default function FieldEditorPage() {
  const { selectedForm } = useFiregridContext();

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

  return (
    <>
      <FormPreview fields={selectedForm.fields}>
        <FormLayout
          paperHeader={<FormSelectors />}
          children={
            <DndProvider backend={HTML5Backend}>
              <FormFields
                fields={selectedForm.fields}
                customComponents={customComponents}
              />
            </DndProvider>
          }
          previewContent={<FormValues />}
        />
      </FormPreview>

      <FieldDialog />
    </>
  );
}
