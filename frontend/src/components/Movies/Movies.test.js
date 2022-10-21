import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import App from '../../App'
import Movies from '.'
import { GET_MOVIES } from '../../tools/queries/movies'

const mocks = [
	{
		request: {
			query: GET_MOVIES,
		},
		result: {
			data: {
				movies: [
					{
						id: '6349e9bd59bcaf74841d5536',
						name: 'Pulp Fiction',
						genre: 'Crime',
						director: {
							id: '6349e94559bcaf74841cf7b9',
							name: 'Michael Radford',
							watched: false,
							rate: null,
						},
					},
				],
			},
		},
	},
]

describe('Movies page', () => {
	test('renders title', () => {
		render(<App />)
		const pageTitle = screen.getByText(/movies/i)
		expect(pageTitle).toBeInTheDocument()
		expect(pageTitle).toMatchSnapshot()
	})

	test('table is null', () => {
		render(<App />)

		const tables = screen.queryByTestId('movies-table')
		expect(tables).toBeNull()
		expect(tables).toMatchSnapshot()
	})

	it('table rows are rendered', async () => {
		render(
			<MockedProvider mocks={mocks} addTypename={false}>
				<Movies />
			</MockedProvider>
		)
		const tables = await screen.findByTestId('table-row')
		expect(tables).toBeInTheDocument()
	})
})
