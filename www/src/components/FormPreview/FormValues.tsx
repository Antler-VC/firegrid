import { useFormContext, useWatch } from 'react-hook-form'
import ReactJson from 'react-json-view'

import { CardSubheading } from '@antlerengineering/components'

export default function FormValues() {
  const { control } = useFormContext()
  const values = useWatch({ control })

  return (
    <div>
      <CardSubheading>Form Values</CardSubheading>
      <ReactJson src={values} name="values" />
    </div>
  )
}
