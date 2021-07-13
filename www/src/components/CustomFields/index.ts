import {
  CustomComponents,
  IFieldConfig,
} from '@antlerengineering/form-builder';

import Image from './Image';

export const customComponents: CustomComponents = {
  image: {
    component: Image.component,
    validation: [['number']],
  },
};

export const CustomFieldConfigs: IFieldConfig[] = [Image];
