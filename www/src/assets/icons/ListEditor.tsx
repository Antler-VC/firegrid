import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';
import { mdiPlaylistEdit } from '@mdi/js';

export default function ListEditor(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d={mdiPlaylistEdit} />
    </SvgIcon>
  );
}
