import { ActionIcon, Button, Card, Group, Modal, NumberInput, Stack, Table, Text, TextInput, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconMinus, IconPlus, IconUserMinus, IconUserPlus } from '@tabler/icons-react'
import { useState } from 'react'
import { useHealthStore } from './useHealthStore'

export default function HealthTracker() {
	const [addPlayerModal, addPlayerModalHandlers] = useDisclosure(false)
	const [removePlayerModal, removePlayerModalHandlers] = useDisclosure(false)

	return (
		<>
			<Card component={Stack} style={{ gridArea: 'Players' }}>
				<Group justify='space-between'>
					<Title order={2}>Health Tracker</Title>

					<Group>
						<ActionIcon
							variant='transparent'
							color='white'
							size='lg'
							onClick={addPlayerModalHandlers.open}
						>
							<IconUserPlus size={100} />
						</ActionIcon>
						<ActionIcon
							variant='transparent'
							color='white'
							size='lg'
							onClick={removePlayerModalHandlers.open}
						>
							<IconUserMinus size={100} />
						</ActionIcon>
					</Group>
				</Group>

				<Players />
			</Card>

			<AddPlayerModal opened={addPlayerModal} close={addPlayerModalHandlers.close} />
			<RemovePlayerModal opened={removePlayerModal} close={removePlayerModalHandlers.close} />
		</>
	)
}

type PlayerModalProps = {
	opened: boolean
	close: () => void
}

function AddPlayerModal({ opened, close }: PlayerModalProps) {
	const [playerName, setPlayerName] = useState('')
	const [playerNameError, setPlayerNameError] = useState(false)

	const [maxHealth, setMaxHealth] = useState<string | number>(0)
	const [maxHealthError, setMaxHealthError] = useState(false)

	const handleClose = () => {
		close()
		setTimeout(() => {
			setPlayerName('')
			setPlayerNameError(false)
			setMaxHealth(0)
			setMaxHealthError(false)
		}, 200)
	}

	const handleConfirm = () => {
		setPlayerNameError(false)
		setMaxHealthError(false)

		if (playerName.length <= 2) setPlayerNameError(true)
		if (maxHealth === 0) setMaxHealthError(true)
		if (playerName.length <= 2 || maxHealth === 0) return

		handleClose()
		useHealthStore.getState().addPlayer(playerName, +maxHealth)
	}

	return (
		<Modal
			opened={opened}
			onClose={handleClose}
			title='Add New Player'
		>
			<Stack>
				<TextInput
					label='Player Name'
					error={playerNameError && 'Player Name must be at least 2 characters long'}
					value={playerName}
					onChange={event => setPlayerName(event.currentTarget.value)}
				/>
				<NumberInput
					label='Max Health'
					error={maxHealthError && 'Max Health must be a more than 0'}
					value={maxHealth}
					onChange={setMaxHealth}
					allowDecimal={false}
					allowNegative={false}
					hideControls
				/>
				<Group>
					<Button onClick={close} variant='default'>Cancel</Button>
					<Button onClick={handleConfirm} flex={1}>Confirm</Button>
				</Group>
			</Stack>
		</Modal>
	)
}

function RemovePlayerModal({ opened, close }: PlayerModalProps) {
	const players = useHealthStore(state => state.players)

	return (
		<Modal
			opened={opened}
			onClose={close}
			title='Remove Player'
		>
			<Stack>
				{
					Object.keys(players).map((playerName, i) => {
						return (
							<Group key={i} justify='space-between'>
								<Text>{playerName}</Text>
								<Button color='red' onClick={() => useHealthStore.getState().removePlayer(playerName)}>Remove</Button>
							</Group>
						)
					})
				}
			</Stack>
		</Modal>
	)
}

function Players() {
	const players = useHealthStore(state => state.players)

	return (
		<Table>
			<Table.Thead>
				<Table.Tr>
					<Table.Th miw='60%'>Player</Table.Th>
					<Table.Th>Current Health</Table.Th>
					<Table.Th>Max Health</Table.Th>
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>
				{
					Object.entries(players).map(([playerName, [currentHealth, maxHealth]], i) => {
						return (
							<Table.Tr key={i}>
								<Table.Td>{playerName}</Table.Td>
								<Table.Td>
									<NumberInput
										hideControls
										w={100}
										value={currentHealth}
										onChange={value => useHealthStore.setState(state => ({
											players: {
												...state.players,
												[playerName]: [+value, maxHealth]
											}
										}))}
										rightSection={(
											<Stack gap={0} ml={8}>
												<ActionIcon
													size='xs'
													color='green'
													onClick={() => useHealthStore.getState().updateCurrentHealth(playerName, 'add')}
												>
													<IconPlus />
												</ActionIcon>
												<ActionIcon
													size='xs'
													color='red'
													onClick={() => useHealthStore.getState().updateCurrentHealth(playerName, 'remove')}
												>
													<IconMinus />
												</ActionIcon>
											</Stack>
										)}
									/>
								</Table.Td>
								<Table.Td>{maxHealth}</Table.Td>
							</Table.Tr>
						)
					})
				}
			</Table.Tbody>
		</Table>
	)
}
