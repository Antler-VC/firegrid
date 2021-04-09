import React, { useContext, useState, useEffect, useRef } from 'react';
import _findIndex from 'lodash/findIndex';

import { db } from '../firebase';
import useDoc from '../hooks/useDoc';

import { EmptyState, Loading } from '@antlerengineering/components';

import { DB_ROOT } from 'constants/firegrid';
import { Form } from 'types/Form';
import {
  _reOrderField,
  _addField,
  _editField,
  _deleteField,
} from 'utils/helpers';
import { FieldModalRef } from 'components/FieldModal';

export interface IFiregridContextInterface {
  forms: Form[];
  selectedFormRef: React.MutableRefObject<Form | null>;
  selectedForm: Form | null;
  setSelectedFormId: (id: string) => void;
  reOrderField: ReturnType<typeof _reOrderField>;
  addField: ReturnType<typeof _addField>;
  editField: ReturnType<typeof _editField>;
  deleteField: ReturnType<typeof _deleteField>;
  fieldModalRef: React.MutableRefObject<FieldModalRef | undefined>;
}

export const FiregridContext = React.createContext<IFiregridContextInterface>({
  forms: [],
  selectedFormRef: { current: null },
  selectedForm: null,
  setSelectedFormId: () => {},
  reOrderField: () => {},
  addField: () => {},
  editField: () => {},
  deleteField: () => {},
  fieldModalRef: { current: undefined },
});
export default FiregridContext;

export const useFiregridContext = () => useContext(FiregridContext);

export function FiregridProvider({ children }: React.PropsWithChildren<{}>) {
  const [forms, setForms] = useState<Form[] | 'loading'>('loading');
  useEffect(() => {
    db.collection(DB_ROOT)
      .get()
      .then((snapshot) =>
        setForms(
          snapshot.docs.map(
            (docSnapshot) =>
              ({ ...docSnapshot.data(), id: docSnapshot.id } as Form)
          )
        )
      );
  }, []);

  // TODO: RESET
  const [selectedFormState, selectedFormDispatch, updateSelectedForm] = useDoc({
    path: `${DB_ROOT}/Rb2NYmn5KDqrgzJ4AOOM`,
  });
  const selectedFormRef = useRef<Form | null>(null);
  selectedFormRef.current = selectedFormState.doc;
  const selectedForm = selectedFormState.doc;

  const setSelectedFormId = (id: string) => {
    selectedFormDispatch({
      path: `${DB_ROOT}/${id}`,
      loading: true,
      doc: null,
    });
  };

  const fieldModalRef = useRef<FieldModalRef>();

  if (forms === 'loading') return <Loading message="Loading forms" />;
  if (forms.length === 0) return <EmptyState message="No forms to edit" />;

  if (selectedFormState.loading && selectedFormState.path)
    return <Loading message="Loading form" />;

  // Helper write functions
  const reOrderField = _reOrderField(selectedFormRef, updateSelectedForm);
  const addField = _addField(selectedFormRef, updateSelectedForm);
  const editField = _editField(selectedFormRef, updateSelectedForm);
  const deleteField = _deleteField(selectedFormRef, updateSelectedForm);

  const contextValue = {
    forms,
    selectedFormRef,
    selectedForm,
    setSelectedFormId,
    reOrderField,
    addField,
    editField,
    deleteField,
    fieldModalRef,
  };
  console.log(contextValue);

  return (
    <FiregridContext.Provider value={contextValue}>
      {children}
    </FiregridContext.Provider>
  );
}
