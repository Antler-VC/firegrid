import firebase from 'firebase/app';
import { db } from '../firebase';
import { useEffect, useReducer, useContext } from 'react';
import { AppContext } from 'contexts/AppContext';

export enum DocActions {
  update,
  delete,
}
const documentReducer = (prevState: any, newProps: any) => {
  switch (newProps.action) {
    case DocActions.update:
      // takes data object form the dispatcher and updates doc
      db.doc(prevState.path).set({ ...newProps.data }, { merge: true });
      //prevState.ref.update({ ...newProps.data, updatedAt: new Date() });
      return { ...prevState, doc: { ...prevState.doc, ...newProps.data } };
    case DocActions.delete:
      prevState.ref.delete();
      return null;
    default:
      return { ...prevState, ...newProps };
  }
};
const documentInitialState = {
  path: null,
  prevPath: null,
  doc: null,
  ref: null,
  loading: true,
};

const useDoc = (intialOverrides: any) => {
  const [documentState, documentDispatch] = useReducer(documentReducer, {
    ...documentInitialState,
    ...intialOverrides,
  });
  const { currentUser } = useContext(AppContext);

  const setDocumentListener = () => {
    documentDispatch({ prevPath: documentState.path });
    const unsubscribe = db.doc(documentState.path).onSnapshot(
      (snapshot) => {
        if (snapshot.exists) {
          const data = snapshot.data();

          const id = snapshot.id;
          const doc = { ...data, id };
          documentDispatch({
            doc,
            ref: snapshot.ref,
            loading: false,
          });
        } else {
          documentDispatch({
            loading: false,
          });
        }
      },
      (error: any) => {
        console.log({ documentState, error });
      }
    );
    documentDispatch({ unsubscribe });
  };
  useEffect(() => {
    const { path, prevPath, unsubscribe } = documentState;
    if (path && path !== prevPath) {
      if (unsubscribe) unsubscribe();
      setDocumentListener();
    }
  }, [documentState]);
  useEffect(
    () => () => {
      if (documentState.unsubscribe) documentState.unsubscribe();
    },
    []
  );

  const updateDoc = (data) => {
    documentDispatch({
      action: DocActions.update,
      data: {
        ...data,
        _ft_updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        _ft_updatedBy: currentUser?.uid ?? '',
      },
    });

    // db.doc(documentState.path).set(
    //   {
    //     ...data,
    //     updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    //     updatedBy: currentUser?.uid ?? '',
    //   },
    //   { merge: true }
    // );
  };

  return [documentState, documentDispatch, updateDoc];
};

export default useDoc;
