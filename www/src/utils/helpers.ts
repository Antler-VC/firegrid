import _findIndex from 'lodash/findIndex';
import arrayMove from 'array-move';

import { Form } from 'types/Form';

export const _reOrderField = (
  fields: Form['fields'],
  updateSelectedForm: (value: Partial<Form>) => void
) => (fromName: string, toName: string) => {
  if (!Array.isArray(fields)) return;

  const from = _findIndex(fields, { name: fromName });
  const to = _findIndex(fields, { name: toName });

  if (from === to) return;

  // For some reason, we need to mutate this to properly trigger an update
  arrayMove.mutate(fields, from, to);
  updateSelectedForm({ fields });
};
