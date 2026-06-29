import { CalendarDays } from 'lucide-react'
import Input from './Input'

function DatePicker(props) {
  return <Input type="date" icon={CalendarDays} {...props} />
}

export default DatePicker
