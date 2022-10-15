import './App.css'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import Movies from './components/Movies'
import Directors from './components/Directors'

const client = new ApolloClient({
	uri: 'http://localhost:3005/graphql',
	cache: new InMemoryCache(),
})

function App() {
	return (
		<ApolloProvider client={client}>
			<div>
				<h1>React + GraphQL</h1>
				<Movies />
				<Directors />
			</div>
		</ApolloProvider>
	)
}

export default App
