import React, { useContext, useState, useEffect, useRef, useMemo } from 'react';
import { RouteComponentProps } from 'react-router';

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
  formPreview: boolean;
  setFormPreview: React.Dispatch<React.SetStateAction<boolean>>;
  userClaims: { roles?: string[] };
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
  formPreview: false,
  setFormPreview: () => {},
  userClaims: { roles: [] },
});
export default FiregridContext;

export const useFiregridContext = () => useContext(FiregridContext);

export function FiregridProvider({
  children,
  match,
  history,
}: React.PropsWithChildren<RouteComponentProps<{ id?: string }>>) {
  const { currentUser } = useAppContext();

  const [userClaims, setUserClaims] = useState<any | { roles?: string[] }>({});
  const getUserClaims = async (currentUser) => {
    const results = await currentUser.getIdTokenResult(true);
    setUserClaims(results.claims);
  };
  useEffect(() => {
    if (currentUser) {
      getUserClaims(currentUser);
    }
  }, [currentUser]);

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

  // Set form preview state
  const [formPreview, setFormPreview] = useState(false);

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
        formPreview,
        setFormPreview,
        userClaims,
      }}
    >
      {children}
    </FiregridContext.Provider>
  );
}
