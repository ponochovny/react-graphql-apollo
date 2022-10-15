import { useQuery, gql } from '@apollo/client'

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
		<div>
			<h2>Directors</h2>
			<ul>
				{loading ? (
					<p>Loading...</p>
				) : (
					<ul>
						{directors && directors.map((el) => <li key={el.id}>{el.name}</li>)}
					</ul>
				)}
			</ul>
		</div>
	)
}

export default Directors
