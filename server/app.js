require('dotenv').config()
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('../schema/schema')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO)

const app = express()
const PORT = 3005

app.use(
	'/graphql',
	graphqlHTTP({
		schema,
		graphiql: true,
	})
)

app.listen(PORT, (err) => {
	err ? console.log(err) : console.log('Server started!')
})
