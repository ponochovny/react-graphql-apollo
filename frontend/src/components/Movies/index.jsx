import { useQuery, gql, useMutation } from '@apollo/client'
import {
	Box,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { green, grey, red } from '@mui/material/colors'

const GET_MOVIES = gql`
	query moviesQuery {
		movies {
			id
			name
			genre
			director {
				name
			}
			watched
			rate
		}
	}
`
const SET_WATCHED = gql`
	mutation (
		$id: ID
		$name: String!
		$genre: String!
		$directorId: ID
		$watched: Boolean!
		$rate: Int
	) {
		updateMovie(
			id: $id
			name: $name
			genre: $genre
			directorId: $directorId
			watched: $watched
			rate: $rate
		) {
			name
			genre
			director {
				name
			}
			watched
			rate
		}
	}
`

const Movies = () => {
	const {
		loading,
		error,
		data: { movies = undefined } = {},
	} = useQuery(GET_MOVIES)
	const [
		updateMovie,
		{ data, loading: loadingUPDMovie, error: errorUPDMovie },
	] = useMutation(SET_WATCHED)

	console.log(movies)

	const updateMovieFunc = (el) => {
		console.log(el.watched)
		updateMovie({
			variables: {
				id: el.id,
				name: el.name,
				genre: el.genre,
				directorId: el.directorId,
				watched: !el.watched,
			},
			refetchQueries: [{ query: GET_MOVIES }],
		})
	}

	return (
		<Box sx={{ py: 2 }}>
			<Typography variant={'h5'} gutterBottom>
				Movies
			</Typography>
			{loading ? (
				<p>Loading...</p>
			) : (
				<TableContainer component={Paper}>
					<Table aria-label='customized table'>
						<TableHead>
							<TableRow sx={{ bgcolor: grey[300] }}>
								<TableCell>
									<b>Name</b>
								</TableCell>
								<TableCell>
									<b>Genre</b>
								</TableCell>
								<TableCell>
									<b>Rate</b>
								</TableCell>
								<TableCell>
									<b>Director</b>
								</TableCell>
								<TableCell>
									<b>Watched</b>
								</TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{movies &&
								movies.map((el) => (
									<TableRow hover key={el.id}>
										<TableCell>{el.name}</TableCell>
										<TableCell>{el.genre}</TableCell>
										<TableCell>{el.rate ? el.rate : 'not voted'}</TableCell>
										<TableCell>{el.director.name}</TableCell>
										<TableCell
											align='center'
											sx={[
												{
													bgcolor: el.watched ? green[300] : red[300],
													transition: 'background-color .3s ease',
												},
												{
													'&:hover': {
														bgcolor: el.watched ? green[200] : red[200],
														cursor: 'pointer',
													},
												},
											]}
											onClick={() => {
												updateMovieFunc(el)
											}}
										>
											<Box>{el.watched ? 'Yes' : 'No'}</Box>
										</TableCell>
										<TableCell>
											<IconButton aria-label='edit' size='small'>
												<EditIcon fontSize='medium' />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</Box>
	)
}

export default Movies
