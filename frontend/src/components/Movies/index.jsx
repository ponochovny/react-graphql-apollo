import { useQuery, gql } from '@apollo/client'

const GET_LOCATIONS = gql`
	query moviesQuery {
		movies {
			id
			name
			genre
		}
	}
`

const Movies = () => {
	const {
		loading,
		error,
		data: { movies = undefined } = {},
	} = useQuery(GET_LOCATIONS)

	console.log(movies)

	return (
		<div>
			<h2>Movies</h2>
			{loading ? (
				<p>Loading...</p>
			) : (
				<ul>{movies && movies.map((el) => <li key={el.id}>{el.name}</li>)}</ul>
			)}
		</div>
	)
}

export default Movies
