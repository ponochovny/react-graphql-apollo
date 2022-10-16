import { useQuery, gql } from '@apollo/client'
import { Box, List, ListItem, Typography } from '@mui/material'

const GET_LOCATIONS = gql`
	query directorsQuery {
		directors {
			id
			name
			age
		}
	}
`

const Directors = () => {
	const {
		loading,
		error,
		data: { directors = undefined } = {},
	} = useQuery(GET_LOCATIONS)

	console.log(directors)

	return (
		<Box sx={{ py: 2 }}>
			{loading ? (
				<p>Loading...</p>
			) : (
				<>
					<Typography variant={'h5'}>Directors</Typography>
					{directors && (
						<List aria-labelledby='basic-list-demo'>
							{directors.map((el) => (
								<ListItem key={el.id}>{el.name}</ListItem>
							))}
						</List>
					)}
				</>
			)}
		</Box>
	)
}

export default Directors
