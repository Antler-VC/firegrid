import React, { useContext, useState, useEffect } from 'react';

import { db } from '../firebase';
import useDoc from '../hooks/useDoc';

import { EmptyState, Loading } from '@antlerengineering/components';

import { DB_ROOT } from 'constants/firegrid';
import { Form } from 'types/Form';
import { _reOrderField } from 'utils/helpers';

export interface IFiregridContextInterface {
  forms: Form[];
  selectedForm: Form | null;
  setSelectedFormId: (id: string) => void;
  reOrderField: ReturnType<typeof _reOrderField>;
}

export const FiregridContext = React.createContext<IFiregridContextInterface>({
  forms: [],
  selectedForm: null,
  setSelectedFormId: () => {},
  reOrderField: () => {},
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
  const selectedForm = selectedFormState.doc;

  const setSelectedFormId = (id: string) => {
    selectedFormDispatch({
      path: `${DB_ROOT}/${id}`,
      loading: true,
      doc: null,
    });
  };

  if (forms === 'loading') return <Loading message="Loading forms" />;
  if (forms.length === 0) return <EmptyState message="No forms to edit" />;

  if (selectedFormState.loading && selectedFormState.path)
    return <Loading message="Loading form" />;

  // Helper write functions
  const reOrderField = _reOrderField(selectedForm.fields, updateSelectedForm);

  const contextValue = {
    forms,
    selectedForm,
    setSelectedFormId,
    reOrderField,
  };
  console.log(contextValue);

  return (
    <FiregridContext.Provider value={contextValue}>
      {children}
    </FiregridContext.Provider>
  );
}
