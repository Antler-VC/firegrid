import { Field } from 'form-builder';

export interface Form {
  id: string;
  app: string;
  name: string;
  fields: Field[];
}
