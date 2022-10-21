import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('Test main page', () => {
	test('renders title', () => {
		render(<App />)
		const pageTitle = screen.getByText(/react \+ graphql/i)
		expect(pageTitle).toBeInTheDocument()
		expect(pageTitle).toMatchSnapshot()
	})

	test('renders main blocks', () => {
		render(<App />)

		const moviesTitle = screen.getByText(/movies/i)
		expect(moviesTitle).toBeInTheDocument()
		expect(moviesTitle).toMatchSnapshot()

		const tables = screen.queryByTestId('tables')
		expect(tables).toBeInTheDocument()
		expect(tables).toMatchSnapshot()
	})
})
