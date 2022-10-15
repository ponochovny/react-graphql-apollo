const graphql = require('graphql')

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLBoolean,
} = graphql

const Movies = require('../models/movie')
const Directors = require('../models/director')

const MovieType = new GraphQLObjectType({
	name: 'Movie',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: new GraphQLNonNull(GraphQLString) },
		genre: { type: new GraphQLNonNull(GraphQLString) },
		director: {
			type: DirectorType,
			resolve({ directorId }, _) {
				return Directors.findById(directorId)
			},
		},
		rate: { type: GraphQLInt },
		watched: { type: new GraphQLNonNull(GraphQLBoolean) },
	}),
})

const DirectorType = new GraphQLObjectType({
	name: 'Director',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: new GraphQLNonNull(GraphQLString) },
		age: { type: new GraphQLNonNull(GraphQLInt) },
		movies: {
			type: new GraphQLList(MovieType),
			resolve({ id }, _) {
				return Movies.find({ directorId: id })
			},
		},
	}),
})

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addDirector: {
			type: DirectorType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
			},
			resolve(_, { name, age }) {
				const director = new Directors({
					name,
					age,
				})
				return director.save()
			},
		},
		addMovie: {
			type: MovieType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				genre: { type: new GraphQLNonNull(GraphQLString) },
				directorId: { type: GraphQLID },
				rate: { type: GraphQLInt },
				watched: { type: new GraphQLNonNull(GraphQLBoolean) },
			},
			resolve(_, { name, genre, directorId, rate, watched }) {
				const movie = new Movies({
					name,
					genre,
					directorId,
					rate,
					watched,
				})
				return movie.save()
			},
		},
		deleteDirector: {
			type: DirectorType,
			args: {
				id: { type: GraphQLID },
			},
			resolve(_, { id }) {
				return Directors.findByIdAndRemove(id)
			},
		},
		deleteMovie: {
			type: MovieType,
			args: {
				id: { type: GraphQLID },
			},
			resolve(_, { id }) {
				return Movies.findByIdAndRemove(id)
			},
		},
		updateDirector: {
			type: DirectorType,
			args: {
				id: { type: GraphQLID },
				name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
			},
			resolve(_, { id, name, age }) {
				return Directors.findByIdAndUpdate(
					id,
					{ $set: { name, age } },
					{ new: true }
				)
			},
		},
		updateMovie: {
			type: MovieType,
			args: {
				id: { type: GraphQLID },
				name: { type: new GraphQLNonNull(GraphQLString) },
				genre: { type: new GraphQLNonNull(GraphQLString) },
				directorId: { type: GraphQLID },
				rate: { type: GraphQLInt },
				watched: { type: new GraphQLNonNull(GraphQLBoolean) },
			},
			resolve(_, { id, name, genre, directorId, rate, watched }) {
				return Movies.findByIdAndUpdate(
					id,
					{
						$set: {
							name,
							genre,
							directorId,
							rate,
							watched,
						},
					},
					{ new: true }
				)
			},
		},
	},
})

const Query = new GraphQLObjectType({
	name: 'Query',
	fields: {
		movie: {
			type: MovieType,
			args: { id: { type: GraphQLID } },
			resolve(_, { id }) {
				return Movies.findById(id)
			},
		},
		director: {
			type: DirectorType,
			args: { id: { type: GraphQLID } },
			resolve(_, { id }) {
				return Directors.findById(id)
			},
		},
		movies: {
			type: new GraphQLList(MovieType),
			resolve() {
				return Movies.find()
			},
		},
		directors: {
			type: new GraphQLList(DirectorType),
			resolve() {
				return Directors.find()
			},
		},
	},
})

module.exports = new GraphQLSchema({
	query: Query,
	mutation: Mutation,
})
