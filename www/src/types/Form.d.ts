import { Field } from '@antlerengineering/form-builder';

export interface Form {
  id: string;
  app: string;
  name: string;
  fields: Field[];
}
