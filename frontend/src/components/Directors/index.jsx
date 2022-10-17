import { useQuery, gql, useMutation } from '@apollo/client'
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	List,
	ListItem,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { useState, useEffect } from 'react'

const GET_DIRECTORS = gql`
	query directorsQuery {
		directors {
			id
			name
			age
		}
	}
`
const ADD_DIRECTOR = gql`
	mutation ($name: String!, $age: Int!) {
		addDirector(name: $name, age: $age) {
			id
			name
			age
		}
	}
`
const EDIT_DIRECTOR = gql`
	mutation ($id: ID, $name: String!, $age: Int!) {
		updateDirector(id: $id, name: $name, age: $age) {
			id
			name
			age
		}
	}
`
const DELETE_DIRECTOR = gql`
	mutation ($id: ID) {
		deleteDirector(id: $id) {
			id
			name
			age
		}
	}
`

const Directors = () => {
	const { loading, data: { directors = undefined } = {} } =
		useQuery(GET_DIRECTORS)
	const [open, setOpen] = useState(false)
	const [editableDirector, setEditableDirector] = useState({
		id: null,
		age: -1,
		name: '',
	})

	const [updateDirector] = useMutation(EDIT_DIRECTOR)
	const [addDirector] = useMutation(ADD_DIRECTOR)
	const [deleteDirector] = useMutation(DELETE_DIRECTOR)

	useEffect(() => {
		console.log(editableDirector)
	}, [editableDirector])

	const handleDirectorQuery = ({ type = 'edit', payload }) => {
		switch (type) {
			case 'delete':
				console.log('1')
				deleteDirector({
					variables: {
						id: payload,
					},
					refetchQueries: [{ query: GET_DIRECTORS }],
				})
				break
			case 'add':
				console.log('2')
				addDirector({
					variables: {
						name: editableDirector.name,
						age: +editableDirector.age,
					},
					refetchQueries: [{ query: GET_DIRECTORS }],
				})
				break
			default:
				console.log('3', editableDirector)
				updateDirector({
					variables: {
						id: editableDirector.id,
						name: editableDirector.name,
						age: editableDirector.age,
					},
					refetchQueries: [{ query: GET_DIRECTORS }],
				})
		}
	}

	return (
		<>
			<Box sx={{ py: 2 }}>
				{loading ? (
					<p>Loading...</p>
				) : (
					<>
						<Stack direction='row' flex alignItems='center' gap={1}>
							<Typography variant={'h5'}>Directors</Typography>
							<IconButton
								onClick={() => {
									setOpen(true)
									setEditableDirector({ id: null, age: -1, name: '' })
								}}
								aria-label='add'
								size='small'
							>
								<AddCircleOutlineIcon fontSize='small' />
							</IconButton>
						</Stack>
						{directors && (
							<List aria-labelledby='basic-list-demo'>
								{directors.map((el) => (
									<ListItem disablePadding key={el.id}>
										{el.name}
										<IconButton
											aria-label='edit'
											size='small'
											onClick={() => {
												setEditableDirector({
													id: el.id,
													name: el.name,
													age: el.age,
												})
												setOpen(true)
											}}
										>
											<MoreHorizIcon fontSize='small' />
										</IconButton>
									</ListItem>
								))}
							</List>
						)}
					</>
				)}
			</Box>

			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				aria-labelledby='dialog-title'
				aria-describedby='dialog-description'
			>
				<DialogTitle id='dialog-title'>Director Editor</DialogTitle>
				<DialogContent sx={{ minWidth: '350px' }}>
					<Stack marginTop={1} marginBottom={2}>
						<TextField
							label='Name'
							value={editableDirector?.name}
							size='small'
							onChange={(e) => {
								setEditableDirector((prev) => {
									return { ...prev, name: e.target.value }
								})
							}}
						/>
					</Stack>
					<Stack>
						<TextField
							type='number'
							label='Age'
							value={editableDirector?.age < 0 ? '' : editableDirector?.age}
							size='small'
							onChange={(e) => {
								setEditableDirector((prev) => {
									return { ...prev, age: e.target.value }
								})
							}}
						/>
					</Stack>
				</DialogContent>
				<DialogActions sx={{ px: 3 }}>
					{editableDirector.id !== null && (
						<>
							<Button
								onClick={() => {
									const answer = confirm('Are you sure?')
									if (answer) {
										handleDirectorQuery({
											type: 'delete',
											payload: editableDirector.id,
										})
										setOpen(false)
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
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					<Button
						autoFocus
						onClick={() => {
							setOpen(false)
							handleDirectorQuery(
								editableDirector.id === null && { type: 'add' }
							)
						}}
						variant='contained'
					>
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default Directors
