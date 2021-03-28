import { useFiregridContext } from 'contexts/FiregridContext'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import {
  FormWithPreview as Layout,
  EmptyState,
} from '@antlerengineering/components'
import FormSelectors from 'components/FormSelectors'
import FormPreview from 'components/FormPreview'
import FormFields from 'components/FormPreview/FormFields'
import FormValues from 'components/FormPreview/FormValues'
import FieldDialog from 'components/FieldModal'

import { FieldEditorIcon } from 'constants/routes'

const customComponents = {}

export default function FieldEditorPage() {
  const { selectedForm } = useFiregridContext()

  if (selectedForm === null)
    return (
      <Layout paperHeader={<FormSelectors />}>
        <EmptyState
          Icon={FieldEditorIcon}
          message="No form selected"
          description="Select a form above to begin"
        />
      </Layout>
    )

  if (!selectedForm.fields)
    return (
      <Layout paperHeader={<FormSelectors />}>
        <EmptyState
          Icon={FieldEditorIcon}
          message="Invalid form configuration"
          description={`ID: ${selectedForm?.id}`}
        />
      </Layout>
    )

  return (
    <>
      {/* TODO: REMOVE ANY */}
      <FormPreview fields={selectedForm.fields as any}>
        <Layout
          paperHeader={<FormSelectors />}
          children={
            <DndProvider backend={HTML5Backend}>
              <FormFields
                // TODO: REMOVE ANY
                fields={selectedForm.fields as any}
                customComponents={customComponents}
              />
            </DndProvider>
          }
          previewContent={<FormValues />}
        />
      </FormPreview>

      <FieldDialog />
    </>
  )
}
