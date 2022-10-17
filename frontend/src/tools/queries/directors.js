import { gql } from '@apollo/client'

export const GET_DIRECTORS = gql`
	query directorsQuery {
		directors {
			id
			name
			age
		}
	}
`
export const ADD_DIRECTOR = gql`
	mutation ($name: String!, $age: Int!) {
		addDirector(name: $name, age: $age) {
			id
			name
			age
		}
	}
`
export const EDIT_DIRECTOR = gql`
	mutation ($id: ID, $name: String!, $age: Int!) {
		updateDirector(id: $id, name: $name, age: $age) {
			id
			name
			age
		}
	}
`
export const DELETE_DIRECTOR = gql`
	mutation ($id: ID) {
		deleteDirector(id: $id) {
			id
			name
			age
		}
	}
`
