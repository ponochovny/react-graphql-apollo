import { useQuery, gql, useMutation } from '@apollo/client'
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	IconButton,
	MenuItem,
	Paper,
	Rating,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { grey } from '@mui/material/colors'
import { useState } from 'react'
import { Stack } from '@mui/system'
import { MyRating } from '../MyRating/MyRating'

const GET_MOVIES = gql`
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
const SET_WATCHED = gql`
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
const GET_DIRECTORS = gql`
	query directorsQuery {
		directors {
			id
			name
			age
		}
	}
`

const Movies = () => {
	const { data: { directors = undefined } = {} } = useQuery(GET_DIRECTORS)
	const { loading, data: { movies = undefined } = {} } = useQuery(GET_MOVIES)
	const [updateMovie] = useMutation(SET_WATCHED)

	const [open, setOpen] = useState(false)
	const [editableMovie, setEditableMovie] = useState(null)

	const updateMovieFunc = () => {
		updateMovie({
			variables: {
				id: editableMovie.id,
				name: editableMovie.name,
				genre: editableMovie.genre,
				directorId: editableMovie.directorId,
				rate: editableMovie.rate,
				watched: editableMovie.watched,
			},
			refetchQueries: [{ query: GET_MOVIES }],
		})
	}

	return (
		<Box sx={{ py: 2 }}>
			<Typography variant={'h5'} gutterBottom>
				Movies
			</Typography>
			{loading ? (
				<p>Loading...</p>
			) : (
				<TableContainer component={Paper}>
					<Table aria-label='customized table'>
						<TableHead>
							<TableRow sx={{ bgcolor: grey[300] }}>
								<TableCell>
									<b>Name</b>
								</TableCell>
								<TableCell>
									<b>Genre</b>
								</TableCell>
								<TableCell>
									<b>Rate</b>
								</TableCell>
								<TableCell>
									<b>Director</b>
								</TableCell>
								<TableCell>
									<b>Watched</b>
								</TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{movies &&
								movies.map((el) => (
									<TableRow hover key={el.id}>
										<TableCell>{el.name}</TableCell>
										<TableCell>{el.genre}</TableCell>
										<TableCell>
											<Rating value={el.rate} readOnly />
										</TableCell>
										<TableCell>{el.director.name}</TableCell>
										<TableCell align='center'>
											<Box>
												{el.watched ? (
													<VisibilityIcon fontSize='small' color='action' />
												) : (
													<VisibilityIcon fontSize='small' color='disabled' />
												)}
											</Box>
										</TableCell>
										<TableCell>
											<IconButton
												onClick={() => {
													setOpen(true)
													setEditableMovie({
														id: el.id,
														name: el.name,
														genre: el.genre,
														directorId: el.director.id,
														rate: el.rate,
														watched: el.watched,
													})
												}}
												aria-label='edit'
												size='small'
											>
												<EditIcon fontSize='medium' />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
			)}

			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				aria-labelledby='dialog-title'
				aria-describedby='dialog-description'
			>
				<DialogTitle id='dialog-title'>Movie Editor</DialogTitle>
				<DialogContent sx={{ minWidth: '350px' }}>
					<Stack marginBottom={2} marginTop={1}>
						<TextField
							label='Name'
							value={editableMovie?.name}
							size='small'
							onChange={(e) => {
								setEditableMovie((prev) => {
									return { ...prev, name: e.target.value }
								})
							}}
						/>
					</Stack>
					<Stack marginBottom={2}>
						<TextField
							label='Genre'
							size='small'
							value={editableMovie?.genre}
							onChange={(e) => {
								setEditableMovie((prev) => {
									return { ...prev, genre: e.target.value }
								})
							}}
						/>
					</Stack>
					<Stack marginBottom={1}>
						<TextField
							label='Select director'
							select
							value={editableMovie?.directorId}
							onChange={(e) =>
								setEditableMovie((prev) => {
									return {
										...prev,
										directorId: e.target.value,
									}
								})
							}
							fullWidth
						>
							{directors &&
								directors.map((director) => (
									<MenuItem key={director.id} value={director.id}>
										{director.name}
									</MenuItem>
								))}
						</TextField>
					</Stack>
					<Stack>
						<FormControlLabel
							label='Watched?'
							control={
								<Switch
									checked={editableMovie?.watched}
									onChange={(e) => {
										setEditableMovie((prev) => {
											return {
												...prev,
												watched: e.target.checked,
											}
										})
									}}
								/>
							}
						/>
					</Stack>
					<Stack>
						<MyRating
							changed={(newVal) => {
								setEditableMovie((prev) => {
									return { ...prev, rate: newVal }
								})
							}}
							initialValue={editableMovie?.rate}
						/>
					</Stack>
				</DialogContent>
				<DialogActions sx={{ px: 3 }}>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					<Button
						autoFocus
						onClick={() => {
							setOpen(false)
							updateMovieFunc()
						}}
						variant='contained'
					>
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	)
}

export default Movies
