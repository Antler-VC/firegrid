import React, { useContext, useState, useEffect, useRef } from 'react';
import { RouteComponentProps } from 'react-router';
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
  _newForm,
  _deleteForm,
} from 'utils/helpers';
import { FieldModalRef } from 'components/FieldModal';
import { useAppContext } from './AppContext';
import { routes } from 'constants/routes';

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
  updateSelectedForm: (data: Record<string, any>) => void;
  newForm: ReturnType<typeof _newForm>;
  deleteForm: ReturnType<typeof _deleteForm>;
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
  updateSelectedForm: () => {},
  newForm: async () => {},
  deleteForm: async () => {},
});
export default FiregridContext;

export const useFiregridContext = () => useContext(FiregridContext);

export function FiregridProvider({
  children,
  match,
  history,
}: React.PropsWithChildren<RouteComponentProps<{ id?: string }>>) {
  const { currentUser } = useAppContext();

  // Get all forms once
  const [forms, setForms] = useState<Form[] | 'loading'>('loading');
  useEffect(() => {
    db.collection(DB_ROOT)
      .where('app', '!=', 'DEV')
      .get()
      .then((snapshot) =>
        setForms(
          snapshot.docs.map(
            (docSnapshot) =>
              ({ ...docSnapshot.data(), id: docSnapshot.id } as Form)
          )
        )
      );
  }, [match.params?.id]);

  // Set up listener for selected form
  const [selectedFormState, selectedFormDispatch, updateSelectedForm] = useDoc(
    match.params?.id ? { path: `${DB_ROOT}/${match.params!.id}` } : {}
  );
  // Add a ref so helper functions get fresh form data
  const selectedFormRef = useRef<Form | null>(null);
  selectedFormRef.current = selectedFormState.doc;
  const selectedForm = selectedFormState.doc;

  // Change selected form based on URL
  useEffect(() => {
    const path = `${DB_ROOT}/${match.params!.id}`;
    if (selectedFormState.path !== path) selectedFormDispatch({ path });
  }, [match.params?.id]);

  // Set selected form & update URL
  const setSelectedFormId = (id: string) => {
    selectedFormDispatch({
      path: `${DB_ROOT}/${id}`,
      loading: true,
      doc: null,
    });

    history.push(routes.fieldEditor + '/' + id);
  };

  // Store ref to field modal to open
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
  const newForm = _newForm(currentUser!, history);
  const deleteForm = _deleteForm(history);

  return (
    <FiregridContext.Provider
      value={{
        forms,
        selectedFormRef,
        selectedForm,
        setSelectedFormId,
        reOrderField,
        addField,
        editField,
        deleteField,
        fieldModalRef,
        updateSelectedForm,
        newForm,
        deleteForm,
      }}
    >
      {children}
    </FiregridContext.Provider>
  );
}
