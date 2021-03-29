import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';
import { mdiClipboardEditOutline } from '@mdi/js';

export default function FieldEditor(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiClipboardEditOutline} />
    </SvgIcon>
  );
}
