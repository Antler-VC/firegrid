import { useReducer, useCallback } from 'react';
import firebase from 'firebase/app';
import shortHash from 'shorthash2';
import _findIndex from 'lodash/findIndex';
import _startCase from 'lodash/startCase';

import { useAppContext } from 'contexts/AppContext';
import { db, bucket } from '../firebase';

export type FileRecord = {
  downloadURL: string;
  name: string;
  type: string;
  lastModifiedTS: number;
};
export type UploadingFile = Omit<FileRecord, 'downloadURL'> & {
  progress: number;
  errorMessage?: string;
  uploadTask: firebase.storage.UploadTask;
  id: string;
  objectURL: string;
};

export type UploadFnProps = {
  file: File;
  metadata?: firebase.storage.UploadMetadata;
  fieldName: string;
  docRef?: string | firebase.firestore.DocumentReference;
  callback: (fileRecord: FileRecord) => void;
};

const uploadingFilesReducer = (
  prevState: UploadingFile[],
  action:
    | { type: 'upload'; id?: string; file: UploadingFile }
    | { type: 'update'; id: string; [key: string]: any }
    | { type: 'complete'; id: string }
) => {
  switch (action.type) {
    case 'upload':
      return [...prevState, action.file];

    case 'update': {
      const { type, id, ...params } = action;

      const newState = [...prevState];
      const index = _findIndex(prevState, { id });
      newState[index] = { ...newState[index], ...params };

      return newState;
    }

    case 'complete': {
      const newState = [...prevState];
      const index = _findIndex(prevState, ['id', action.id]);
      const removed = newState.splice(index, 1);

      URL.revokeObjectURL(removed[0].objectURL);

      return newState;
    }

    default:
      return prevState;
  }
};

export function useFirebaseUploader() {
  const { currentUser } = useAppContext();
  const defaultStoragePath = `uploads/${currentUser?.uid}`;

  // Store state of files being uploaded
  const [uploadingFiles, dispatch] = useReducer(uploadingFilesReducer, []);

  const upload = useCallback(
    ({
      file,
      metadata,
      fieldName,
      docRef: docRefProp,
      callback,
    }: UploadFnProps) => {
      // Get Firestore document reference to match path in Firebase Storage
      const docRef =
        typeof docRefProp === 'string' ? db.doc(docRefProp) : docRefProp;
      const storageRef = bucket.ref(
        `${docRef ? docRef.path : defaultStoragePath}/${fieldName}/${file.name}`
      );

      const uploadTask = storageRef.put(file, metadata);
      // Add file to list of uploadingFiles
      const id = shortHash(
        file.name + file.size + file.lastModified + new Date().getTime()
      );
      dispatch({
        type: 'upload',
        file: {
          name: file.name,
          type: file.type,
          lastModifiedTS: file.lastModified,
          progress: 0,
          uploadTask,
          id,
          objectURL: URL.createObjectURL(file),
        },
      });

      // Subscribe to changes https://firebase.google.com/docs/reference/js/firebase.storage.UploadTask#on
      const unsubscribe = uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        // On snapshot, get progress
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          dispatch({ type: 'update', id, progress });
        },
        // On error
        (error) => {
          dispatch({
            type: 'update',
            id,
            errorMessage: _startCase(error.code.replace('storage/', '')),
          });
          unsubscribe();
        },
        // On complete
        () => {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then((downloadURL: string) => {
              const fileRecord: FileRecord = {
                downloadURL,
                name: file.name,
                type: file.type,
                lastModifiedTS: file.lastModified,
              };

              // If we have a document reference, store a link to this file directly
              if (docRef) {
                docRef.update({
                  [fieldName]:
                    firebase.firestore.FieldValue.arrayUnion(fileRecord),
                });
              }

              // If we have a callback, pass the fileRecord
              if (callback) callback(fileRecord);

              // Remove this file from uploadingFiles
              dispatch({ type: 'complete', id });
            })
            .catch(() => {
              dispatch({
                type: 'update',
                id,
                errorMessage: 'No Download URL',
              });
            });

          unsubscribe();
        }
      );
    },
    [dispatch, defaultStoragePath]
  );

  return { uploadingFiles, upload };
}

export default useFirebaseUploader;
