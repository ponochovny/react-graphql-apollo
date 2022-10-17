import { Rating } from '@mui/material'
import { useState } from 'react'

export const MyRating = ({ initialValue, changed }) => {
	const [value, setValue] = useState(initialValue)
	const handleChange = (e, newVal) => {
		setValue(newVal)
		changed(newVal)
	}
	return <Rating value={value} onChange={handleChange} />
}
