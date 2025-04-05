import { ActionIcon, Button, Card, Group, Modal, NumberInput, Stack, Table, Text, TextInput, Title, Tooltip } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { IconMinus, IconPlus, IconReload, IconUserMinus, IconUserPlus } from '@tabler/icons-react'
import { tooltipProps } from './tooltipProps'
import { useDamageStore } from './useDamageStore'
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
						<CustomHit />
						<Tooltip label='Add Player' {...tooltipProps}>
							<ActionIcon
								variant='transparent'
								color='white'
								size='lg'
								onClick={addPlayerModalHandlers.open}
							>
								<IconUserPlus size={100} />
							</ActionIcon>
						</Tooltip>
						<Tooltip label='Remove Player' {...tooltipProps}>
							<ActionIcon
								variant='transparent'
								color='white'
								size='lg'
								onClick={removePlayerModalHandlers.open}
							>
								<IconUserMinus size={100} />
							</ActionIcon>
						</Tooltip>
					</Group>
				</Group>

				<Players />
			</Card>

			<AddPlayerModal opened={addPlayerModal} close={addPlayerModalHandlers.close} />
			<RemovePlayerModal opened={removePlayerModal} close={removePlayerModalHandlers.close} />
		</>
	)
}

function CustomHit() {
	const customHit = useDamageStore(state => state.customHit)

	return (
		<NumberInput
			value={customHit}
			onChange={value => useDamageStore.setState({ customHit: +value })}
			allowDecimal={false}
			allowNegative={false}
			rightSection={(
				<Tooltip label='Reset Custom Hit' {...tooltipProps}>
					<ActionIcon size='md' mr='sm' variant='default' onClick={() => useDamageStore.setState({ customHit: 0 })}>
						<IconReload />
					</ActionIcon>
				</Tooltip>
			)}
		/>
	)
}

type PlayerModalProps = {
	opened: boolean
	close: () => void
}

function AddPlayerModal({ opened, close }: PlayerModalProps) {
	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			playerName: '',
			shieldAmount: 0,
			shieldDurability: 0,
			maxHealth: 0
		},
		validate: {
			playerName: value => value.length > 2 ? null : 'Player Name must be at least 2 characters long',
			maxHealth: value => value > 0 ? null : 'Max Health must be a more than 0'
		}
	})

	return (
		<Modal opened={opened} onClose={close} title='Add Player'>
			<form
				onSubmit={form.onSubmit(({ playerName, shieldAmount, shieldDurability, maxHealth }) => {
					useHealthStore.getState().addPlayer(playerName, shieldAmount, shieldDurability, maxHealth)
					close()
					form.reset()
				})}
			>
				<Stack>
					<TextInput
						withAsterisk
						label='Player Name'
						key={form.key('playerName')}
						{...form.getInputProps('playerName')}
					/>
					<Group grow>
						<NumberInput
							hideControls
							label='Shield Amount'
							allowDecimal={false}
							allowNegative={false}
							key={form.key('shieldAmount')}
							{...form.getInputProps('shieldAmount')}
						/>
						<NumberInput
							hideControls
							label='Shield Durability'
							allowDecimal={false}
							allowNegative={false}
							key={form.key('shieldDurability')}
							{...form.getInputProps('shieldDurability')}
						/>
					</Group>
					<NumberInput
						withAsterisk
						hideControls
						label='Max Health'
						allowDecimal={false}
						allowNegative={false}
						key={form.key('maxHealth')}
						{...form.getInputProps('maxHealth')}
					/>
					<Group>
						<Button
							variant='default'
							onClick={() => {
								close()
								form.reset()
							}}
						>Cancel
						</Button>
						<Button type='submit' flex={1}>Confirm</Button>
					</Group>
				</Stack>
			</form>
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
					<Table.Th miw='40%'>Player</Table.Th>
					<Table.Th>Shield Durability</Table.Th>
					<Table.Th>
						<Group>
							<Text size='sm' fw={700}>Shield</Text>
							<ActionIcon size='xs' variant='transparent' onClick={() => Object.keys(players).forEach(name => useHealthStore.getState().resetShield(name))}>
								<IconReload />
							</ActionIcon>
						</Group>
					</Table.Th>
					<Table.Th>Current Health</Table.Th>
					<Table.Th>Max Health</Table.Th>
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>
				{
					Object.entries(players).map(([playerName, { shieldDurability, currentShield, currentHealth, maxHealth }], i) => {
						return (
							<Table.Tr key={i}>
								<Table.Td>{playerName}</Table.Td>
								<Table.Td>
									<NumberInput
										w={100}
										allowDecimal={false}
										allowNegative={false}
										value={shieldDurability}
										max={99}
										onChange={value => useHealthStore.setState(state => ({
											players: {
												...state.players,
												[playerName]: {
													...state.players[playerName],
													shieldDurability: +value
												}
											}
										}))}
									/>
								</Table.Td>
								<Table.Td>
									<NumberInput
										hideControls
										w={100}
										allowDecimal={false}
										allowNegative={false}
										value={currentShield}
										onChange={value => useHealthStore.setState(state => ({
											players: {
												...state.players,
												[playerName]: {
													...state.players[playerName],
													currentShield: +value
												}
											}
										}))}
										rightSection={(
											<Stack gap={0} ml={8}>
												<ActionIcon
													size='xs'
													color='green'
													onClick={() => useHealthStore.getState().resetShield(playerName)}
												>
													<IconReload />
												</ActionIcon>
												<ActionIcon
													size='xs'
													color='red'
													onClick={() => {
														const damage = useDamageStore.getState().customHit || useDamageStore.getState().result.damage
														useHealthStore.setState(state => ({
															players: {
																...state.players,
																[playerName]: {
																	...state.players[playerName],
																	currentShield: Math.max(state.players[playerName].currentShield - damage, 0)
																}
															}
														}))
													}}
												>
													<IconMinus />
												</ActionIcon>
											</Stack>
										)}
									/>
								</Table.Td>
								<Table.Td>
									<NumberInput
										hideControls
										w={100}
										allowDecimal={false}
										allowNegative={false}
										value={currentHealth}
										onChange={value => useHealthStore.setState(state => ({
											players: {
												...state.players,
												[playerName]: {
													...state.players[playerName],
													currentHealth: +value
												}
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
								<Table.Td>
									<NumberInput
										hideControls
										w={100}
										allowDecimal={false}
										allowNegative={false}
										value={maxHealth}
										onChange={value => useHealthStore.setState(state => ({
											players: {
												...state.players,
												[playerName]: {
													...state.players[playerName],
													maxHealth: +value
												}
											}
										}))}
									/>
								</Table.Td>
							</Table.Tr>
						)
					})
				}
			</Table.Tbody>
		</Table>
	)
}
