import { CalendarDays } from 'lucide-react'
import Input from './Input'
import type { InputHTMLAttributes } from 'react'

type DatePickerProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string
  error?: string
  hint?: string
}

function DatePicker(props: DatePickerProps) {
  return <Input type="date" icon={CalendarDays} {...props} />
}

export default DatePicker
