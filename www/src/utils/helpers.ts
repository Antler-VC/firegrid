import React from 'react';
import _findIndex from 'lodash/findIndex';
import arrayMove from 'array-move';

import { Form } from 'types/Form';
import { Field } from 'form-builder';

export const _reOrderField = (
  selectedFormRef: React.MutableRefObject<Form | null>,
  updateSelectedForm: (value: Partial<Form>) => void
) => (fromName: string, toName: string) => {
  const fields = selectedFormRef.current?.fields;
  if (!Array.isArray(fields)) return;

  const from = _findIndex(fields, { name: fromName });
  const to = _findIndex(fields, { name: toName });

  if (from === to) return;

  const newFields = arrayMove(fields, from, to);
  updateSelectedForm({ fields: newFields });
};

export const _addField = (
  selectedFormRef: React.MutableRefObject<Form | null>,
  updateSelectedForm: (value: Partial<Form>) => void
) => (index: number, config: Field) => {
  const fields = selectedFormRef.current?.fields;
  if (!Array.isArray(fields)) return;

  const newFields = [...fields];
  newFields.splice(index, 0, config);
  updateSelectedForm({ fields: newFields });
};

export const _editField = (
  selectedFormRef: React.MutableRefObject<Form | null>,
  updateSelectedForm: (value: Partial<Form>) => void
) => (name: string, config: Field, index: number) => {
  const fields = selectedFormRef.current?.fields;
  if (!Array.isArray(fields)) return;

  const currentIndex = _findIndex(fields, { name });

  const newFields = [...fields];
  if (currentIndex !== index) newFields.splice(currentIndex, 1);
  newFields.splice(index, 1, config);
  updateSelectedForm({ fields: newFields });
};

export const _deleteField = (
  selectedFormRef: React.MutableRefObject<Form | null>,
  updateSelectedForm: (value: Partial<Form>) => void
) => (name: string) => {
  const fields = selectedFormRef.current?.fields;
  if (!Array.isArray(fields)) return;

  const index = _findIndex(fields, { name });

  const newFields = [...fields];
  if (index > -1) {
    newFields.splice(index, 1);
    updateSelectedForm({ fields: newFields });
  }
};
