import { useState, useEffect } from 'react';
import { IFieldComponentProps } from '@antlerengineering/form-builder';

import MultiSelect, { Option } from '@antlerengineering/multiselect';

import { db } from '../../firebase';

export default function OptionsListSelect({
  field: { onChange, value },
  label,
  assistiveText,
}: IFieldComponentProps) {
  const [lists, setLists] = useState<Option<string>[]>([]);

  useEffect(() => {
    db.collection('/_FIRETABLE_/_FIREGRID_/lists')
      .get()
      .then((res) =>
        setLists(
          res.docs.map((doc) => ({ value: doc.id, label: doc.data().name }))
        )
      );
  }, []);

  return (
    <MultiSelect
      multiple={false}
      value={value}
      onChange={onChange}
      options={lists}
      label={label}
      labelPlural="lists"
      TextFieldProps={{ helperText: assistiveText }}
    />
  );
}
