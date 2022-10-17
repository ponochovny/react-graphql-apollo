import { gql } from '@apollo/client'

export const GET_MOVIES = gql`
	query moviesQuery {
		movies {
			id
			name
			genre
			director {
				id
				name
			}
			watched
			rate
		}
	}
`
export const EDIT_MOVIE = gql`
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
export const ADD_MOVIE = gql`
	mutation (
		$name: String!
		$genre: String!
		$directorId: ID
		$watched: Boolean!
		$rate: Int
	) {
		addMovie(
			name: $name
			genre: $genre
			directorId: $directorId
			watched: $watched
			rate: $rate
		) {
			name
		}
	}
`
export const DELETE_MOVIE = gql`
	mutation ($id: ID) {
		deleteMovie(id: $id) {
			id
			name
		}
	}
`
