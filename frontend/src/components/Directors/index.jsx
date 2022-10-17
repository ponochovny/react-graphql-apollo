import { useQuery, gql } from '@apollo/client'
import {
	Box,
	IconButton,
	List,
	ListItem,
	Stack,
	Typography,
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

const GET_DIRECTORS = gql`
	query directorsQuery {
		directors {
			id
			name
			age
		}
	}
`

const Directors = () => {
	const { loading, data: { directors = undefined } = {} } =
		useQuery(GET_DIRECTORS)

	return (
		<Box sx={{ py: 2 }}>
			{loading ? (
				<p>Loading...</p>
			) : (
				<>
					<Stack direction='row' flex alignItems='center' gap={1}>
						<Typography variant={'h5'}>Directors</Typography>

						<IconButton onClick={() => {}} aria-label='add' size='small'>
							<AddCircleOutlineIcon fontSize='small' />
						</IconButton>
					</Stack>
					{directors && (
						<List aria-labelledby='basic-list-demo'>
							{directors.map((el) => (
								<ListItem disablePadding key={el.id}>
									{el.name}
								</ListItem>
							))}
						</List>
					)}
				</>
			)}
		</Box>
	)
}

export default Directors
