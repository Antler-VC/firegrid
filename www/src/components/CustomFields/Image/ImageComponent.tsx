import React, { useCallback, useState, useEffect } from 'react';
import { IFieldComponentProps } from '@antlerengineering/form-builder';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import _findIndex from 'lodash/findIndex';
import arrayMove from 'array-move';

import {
  makeStyles,
  createStyles,
  FormControl,
  Typography,
  Grid,
  Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddAPhoto';

import { FieldLabel, FieldErrorMessage } from '@antlerengineering/form-builder';

import useFirebaseUploader from 'hooks/useFirebaseUploader';
import ImageWrapper from './ImageWrapper';
import { bucket } from '../../../firebase';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: { display: 'flex' },
    description: { cursor: 'default' },

    fullSize: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: theme.shape.borderRadius,
    },

    image: {
      objectFit: 'cover',
      width: 30,
      height: 30,

      display: 'block',
    },
  })
);

export interface IImageUploaderProps extends IFieldComponentProps {
  multiple?: boolean;
  description?: React.ReactNode;
  docRef?: firebase.default.firestore.DocumentReference;
  previewImageStyles?: React.CSSProperties;
}

export default function ImageUploader({
  field: { onChange, onBlur, value: formValue },

  name,
  useFormMethods: { setError, clearErrors },

  label,
  errorMessage,

  required,
  disabled,

  multiple = false,
  description,
  previewImageStyles,
  docRef,
}: IImageUploaderProps) {
  const classes = useStyles();

  // MUST store internal value state here - too buggy to rely on react-hook-form state
  const [value, setValue] = useState(Array.isArray(formValue) ? formValue : []);
  // JSON stringifying value does not prevent unnecessary onChange calls
  useEffect(() => {
    onChange(value);
  }, [value]);

  const { uploadingFiles, upload } = useFirebaseUploader();

  const onDrop: DropzoneOptions['onDrop'] = useCallback(
    (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        setError(name, {
          type: 'manual',
          message: fileRejections[0].errors[0].message,
        });
      } else {
        clearErrors(name);

        for (const file of acceptedFiles)
          upload({
            file,
            fieldName: name,
            docRef,
            callback: (file) => {
              console.log('uploaded', file);
              multiple
                ? setValue((value) => {
                    console.log(value);
                    return [...value, file];
                  })
                : setValue([file]);
            },
          });
      }
    },
    [docRef, name, upload, multiple, setError, clearErrors]
  );

  const handleDelete = useCallback((downloadURL: string) => {
    setValue((value) => {
      const index = _findIndex(value, { downloadURL });
      const newValue = [...value];
      newValue.splice(index, 1);

      bucket.refFromURL(downloadURL).delete();

      return newValue;
    });
  }, []);

  const handleSwap = useCallback((from: number, to: number) => {
    setValue((value) => arrayMove(value, from, to));
  }, []);

  let buttonText = 'Upload';
  if (multiple && (uploadingFiles.length > 0 || value?.length > 0))
    buttonText = 'Upload Another';
  if (multiple === false) {
    if (value?.length > 0) buttonText = 'Replace';
    else buttonText = 'Upload';
  }

  // Disable when uploading
  const disableUpload = disabled || uploadingFiles.length > 0;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: [
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'image/gif',
      'image/webp',
    ],
    disabled: disableUpload,
    // Don’t allow multiple uploads in case this component unmounts
    multiple: false,
  });

  return (
    <FormControl className={classes.root} onClick={onBlur}>
      <Grid container spacing={2} wrap="nowrap" alignItems="baseline">
        <Grid item xs>
          <FieldLabel
            error={!!errorMessage}
            disabled={!!disabled}
            required={!!required}
          >
            {label}
          </FieldLabel>
        </Grid>

        <Grid item {...getRootProps()}>
          <input {...getInputProps()} />
          <Button
            color="primary"
            endIcon={<AddIcon />}
            disabled={disableUpload}
          >
            {buttonText}
          </Button>
        </Grid>
      </Grid>

      {description && (
        <Typography variant="body1" paragraph className={classes.description}>
          {description}
        </Typography>
      )}

      <Grid container spacing={1} alignItems="center">
        {Array.isArray(value) &&
          !(multiple === false && uploadingFiles.length > 0) &&
          value.map((file, i) => (
            <Grid item key={file.downloadURL}>
              <ImageWrapper
                name={name}
                index={i}
                file={file}
                onDelete={() => handleDelete(file.downloadURL)}
                multiple={multiple}
                onSwap={handleSwap}
                disabled={disableUpload}
              >
                <a
                  href={file.downloadURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={file.downloadURL}
                    alt={file.name}
                    className={classes.image}
                    style={previewImageStyles}
                  />
                </a>
              </ImageWrapper>
            </Grid>
          ))}

        {uploadingFiles.map((file, i) => (
          <Grid item key={i}>
            <ImageWrapper
              name={name}
              index={i}
              multiple={multiple}
              disabled={disableUpload}
            >
              <img
                src={file.objectURL}
                alt={file.name}
                className={classes.image}
                style={previewImageStyles}
              />
            </ImageWrapper>
          </Grid>
        ))}
      </Grid>

      <FieldErrorMessage>{errorMessage}</FieldErrorMessage>
    </FormControl>
  );
}
