import './App.css'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import Movies from './components/Movies'
import Directors from './components/Directors'
import { Box, Typography } from '@mui/material'

const client = new ApolloClient({
	uri: 'http://localhost:3005/graphql',
	cache: new InMemoryCache(),
})

function App() {
	return (
		<ApolloProvider client={client}>
			<Box
				sx={{ py: 2, px: 4, display: 'flex', flexDirection: 'column' }}
				alignItems='center'
			>
				<Typography variant={'h3'} component={'h1'} align='center'>
					React + GraphQL
				</Typography>
				<Box
					sx={{
						display: 'inline-block',
						maxWidth: '900px',
					}}
				>
					<Movies />
					<Directors />
				</Box>
			</Box>
		</ApolloProvider>
	)
}

export default App
