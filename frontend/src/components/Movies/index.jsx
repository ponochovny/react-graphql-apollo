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
import { Stack } from '@mui/system'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { useState } from 'react'
import { MyRating } from '../MyRating/MyRating'

import {
	GET_MOVIES,
	EDIT_MOVIE,
	ADD_MOVIE,
	DELETE_MOVIE,
} from '../../tools/queries/movies'
import { GET_DIRECTORS } from '../../tools/queries/directors'

const Movies = () => {
	const { data: { directors = undefined } = {} } = useQuery(GET_DIRECTORS)
	const { loading, data: { movies = undefined } = {} } = useQuery(GET_MOVIES)
	const [updateMovie] = useMutation(EDIT_MOVIE)
	const [addMovie] = useMutation(ADD_MOVIE)
	const [deleteMovie] = useMutation(DELETE_MOVIE)

	const [open, setOpen] = useState(false)
	const [editableMovie, setEditableMovie] = useState(null)

	const handleCloseModal = () => {
		setOpen(false)
	}
	const handleOpenModal = (action = 'edit') => {
		setOpen(true)
		if (action === 'add') {
			setEditableMovie({
				id: null,
				name: '',
				genre: '',
				directorId: directors[0].id,
				watched: false,
				rate: null,
			})
		}
	}

	const handleMovieQuery = ({ type = 'edit', payload }) => {
		switch (type) {
			case 'delete':
				deleteMovie({
					variables: {
						id: payload,
					},
					refetchQueries: [{ query: GET_MOVIES }],
				})
				break
			case 'add':
				addMovie({
					variables: {
						name: editableMovie.name,
						genre: editableMovie.genre,
						directorId: editableMovie.directorId,
						rate: editableMovie.rate,
						watched: editableMovie.watched,
					},
					refetchQueries: [{ query: GET_MOVIES }],
				})
				break
			default:
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
	}

	return (
		<Box sx={{ py: 2 }}>
			<Stack direction='row' flex alignItems='center' marginBottom={1} gap={1}>
				<Typography variant={'h5'}>Movies</Typography>
				<IconButton
					onClick={() => {
						handleOpenModal('add')
					}}
					aria-label='add'
					size='small'
				>
					<AddCircleOutlineIcon fontSize='small' />
				</IconButton>
			</Stack>
			{loading ? (
				<p>Loading...</p>
			) : (
				<TableContainer component={Paper}>
					<Table aria-label='customized table'>
						<TableHead>
							<TableRow sx={{ bgcolor: grey[300] }}>
								<TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Genre</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Rate</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Director</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Watched</TableCell>
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
													handleOpenModal()
													setEditableMovie({
														id: el.id,
														name: el.name,
														genre: el.genre,
														directorId: el.director?.id,
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
				onClose={() => handleCloseModal()}
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
					{editableMovie?.id !== null && (
						<>
							<Button
								onClick={() => {
									const answer = confirm('Are you sure?')
									if (answer) {
										handleMovieQuery({
											type: 'delete',
											payload: editableMovie.id,
										})
										handleCloseModal()
									}
								}}
								variant='text'
								color='error'
							>
								Delete
							</Button>
							<div style={{ flex: '1 0 0' }} />
						</>
					)}
					<Button onClick={() => handleCloseModal()}>Cancel</Button>
					<Button
						autoFocus
						onClick={() => {
							handleCloseModal()
							handleMovieQuery(editableMovie.id == null && { type: 'add' })
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
