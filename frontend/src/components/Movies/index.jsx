import { useQuery, gql, useMutation } from '@apollo/client'

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
		<div>
			<h2>Movies</h2>
			{loading ? (
				<p>Loading...</p>
			) : (
				<table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Genre</th>
							<th>Rate</th>
							<th>Director</th>
							<th>Watched</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{movies &&
							movies.map((el) => (
								<tr key={el.id}>
									<td>{el.name}</td>
									<td>{el.genre}</td>
									<td>{el.rate ? el.rate : 'not voted'}</td>
									<td>{el.director.name}</td>
									<td
										className='watching'
										onClick={() => {
											updateMovieFunc(el)
										}}
									>
										{el.watched ? 'Yes' : 'No'}
									</td>
									<td>Edit btn</td>
								</tr>
							))}
					</tbody>
				</table>
			)}
		</div>
	)
}

export default Movies
