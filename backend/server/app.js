require('dotenv').config()
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('../schema/schema')
const mongoose = require('mongoose')
const cors = require('cors')

const isProduction = true

mongoose.connect(process.env.MONGO, { useNewUrlParser: true })

const app = express()
const PORT = 3005
const corsOptions = isProduction
	? {
			origin: 'https://react-graphql-movies.netlify.app',
	  }
	: null

app.use(cors(corsOptions))

app.use(
	'/graphql',
	graphqlHTTP({
		schema,
		graphiql: true,
	})
)

const dbConnection = mongoose.connection
dbConnection.on('error', (err) => console.log(`Connection error: ${err}`))
dbConnection.once('open', () => console.log(`Connected to DB!`))

app.listen(process.env.PORT || PORT, (err) => {
	err ? console.log(err) : console.log('Server started!')
})
