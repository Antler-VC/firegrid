import { useReducer } from 'react';
import { bucket } from '../firebase';
import { useAppContext } from 'contexts/AppContext';

import firebase from 'firebase/app';
const initialState = { progress: 0, isLoading: false };
const uploadReducer = (prevState: any, newProps: any) => {
  return { ...prevState, ...newProps };
};
const useUploader = () => {
  const app = useAppContext();
  const [uploaderState, uploaderDispatch] = useReducer(uploadReducer, {
    ...initialState,
  });

  const upload = ({
    fieldName,
    files,
    docRef,
    previousValue,
    callback,
  }: {
    fieldName: string;
    files: File[];
    docRef?: firebase.firestore.DocumentReference;
    previousValue?: any;
    callback?: any;
  }) => {
    uploaderDispatch({ isLoading: true });
    files.forEach((file) => {
      const storageRef = bucket.ref(
        `${
          docRef ? docRef.path : `uploads/${app.currentUser?.uid}`
        }/${fieldName}/${file.name}`
      );
      var uploadTask = storageRef.put(file);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function (snapshot: any) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          uploaderDispatch({ progress });
          uploaderDispatch({
            files: { ...uploaderState.files, [file.name]: progress },
          });

          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
        },
        function (error: any) {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;

            case 'storage/canceled':
              // User canceled the upload
              break;
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        function () {
          uploaderDispatch({ isLoading: false });

          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(function (downloadURL: string) {
              if (docRef) {
                // this stores download url directly to firestore is doc ref is provided
                if (previousValue) {
                  docRef.update({
                    [fieldName]: [
                      ...previousValue,
                      {
                        downloadURL,
                        name: file.name,
                        type: file.type,
                        lastModifiedTS: file.lastModified,
                      },
                    ],
                  });
                } else {
                  docRef.update({
                    [fieldName]: [
                      {
                        downloadURL,
                        name: file.name,
                        type: file.type,
                        lastModifiedTS: file.lastModified,
                      },
                    ],
                  });
                }
              } else if (callback) {
                callback({
                  downloadURL,
                  name: file.name,
                  type: file.type,
                  lastModifiedTS: file.lastModified,
                });
              }
            });
        }
      );
    });
  };

  return [uploaderState, upload];
};

export default useUploader;
