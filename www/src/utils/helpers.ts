import React from 'react';
import { RouteComponentProps } from 'react-router';
import _findIndex from 'lodash/findIndex';
import _omitBy from 'lodash/omitBy';
import _isUndefined from 'lodash/isUndefined';
import arrayMove from 'array-move';

import { Form } from 'types/Form';
import { Field } from '@antlerengineering/form-builder';

import { db } from '../firebase';
import { DB_ROOT } from 'constants/firegrid';
import { firetableUser } from 'utils';
import { routes } from 'constants/routes';

export const _reOrderField = (
  selectedFormRef: React.MutableRefObject<Form | null>,
  updateSelectedForm: (value: Partial<Form>) => void
) => (from: number, to: number) => {
  const fields = selectedFormRef.current?.fields;
  if (!Array.isArray(fields)) return;

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
  newFields.splice(index, 0, _omitBy(config, _isUndefined) as typeof config);
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
  newFields.splice(index, 1, _omitBy(config, _isUndefined) as typeof config);
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

export const _newForm = (
  currentUser: firebase.default.User,
  history: RouteComponentProps['history']
) => async (values: Record<string, any>) => {
  if (!values || !currentUser) return;

  const data = {
    ...values,
    fields: [] as any[],
    _ft_createdAt: new Date(),
    _ft_createdBy: firetableUser(currentUser),
  };

  if (values._starterTemplateUsed && values._starterTemplate) {
    const templateDocRef = await db
      .doc(DB_ROOT + '/' + values._starterTemplate)
      .get();
    const templateDoc = templateDocRef.data() ?? {};

    if (Array.isArray(templateDoc.fields)) data.fields = templateDoc.fields;
  }

  // Use `id` filed in `values`
  if (values.id) await db.collection(DB_ROOT).doc(values.id).set(data);

  const newDocRef = values.id
    ? db.collection(DB_ROOT).doc(values.id)
    : await db.collection(DB_ROOT).add(data);

  history.push(routes.fieldEditor + '/' + newDocRef.id);
};

export const _deleteForm = (history: RouteComponentProps['history']) => async (
  id: string
) => {
  if (!id) return;

  await db.collection(DB_ROOT).doc(id).delete();
  window.location.href = routes.fieldEditor;
};
