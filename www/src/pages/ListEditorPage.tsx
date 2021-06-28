import { useEffect } from 'react';
import { useListEditorContext } from 'contexts/ListEditorContext';

import { EmptyState } from '@antlerengineering/components';
import FormLayout from 'components/FormLayout';
import ListSelectors from 'components/ListSelectors';
import { Form, FieldType } from '@antlerengineering/form-builder';
import SortList from 'components/SortList';

import { ListEditorIcon } from 'constants/routes';

export default function ListEditorPage() {
  const { selectedList, updateSelectedList } = useListEditorContext();

  useEffect(() => {
    if (selectedList && !document.title.includes(selectedList.name))
      document.title = `${selectedList.name} | List Editor | Firegrid`;
  }, [selectedList]);

  if (selectedList === null)
    return (
      <FormLayout paperHeader={<ListSelectors />}>
        <EmptyState
          Icon={ListEditorIcon}
          message="No list selected"
          description="Select a list above to begin"
        />
      </FormLayout>
    );

  if (!selectedList.values)
    return (
      <FormLayout paperHeader={<ListSelectors />}>
        <EmptyState
          Icon={ListEditorIcon}
          message="Invalid list configuration"
          description={`ID: ${selectedList?.id}`}
        />
      </FormLayout>
    );

  return (
    <FormLayout
      paperHeader={<ListSelectors />}
      children={
        <Form
          fields={[
            { type: '_sortList', name: '_sortList' },
            {
              type: FieldType.list,
              name: 'values',
              label: '',
            },
          ]}
          values={{ values: selectedList.values }}
          onSubmit={updateSelectedList}
          autoSave
          customComponents={{ _sortList: { component: SortList } }}
        />
      }
    />
  );
}
