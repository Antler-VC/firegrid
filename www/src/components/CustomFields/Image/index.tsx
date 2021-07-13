import { lazy } from 'react';
import { IFieldConfig } from '@antlerengineering/form-builder';

import SvgIcon from '@material-ui/core/SvgIcon';
import { mdiFileImage } from '@mdi/js';

// import Settings from './ImageSettings';
const Component = lazy(
  () => import('./ImageComponent') /* webpackChunkName: FormBuilder-Image */
);

export const ImageConfig: IFieldConfig = {
  type: 'image',
  name: 'Image',
  group: 'input',
  icon: (
    <SvgIcon>
      <path d={mdiFileImage} />
    </SvgIcon>
  ),
  dataType: 'string',
  defaultValue: '',
  component: Component,
  settings: [], //Settings,
  validation: () => [['array']],
};
export default ImageConfig;
