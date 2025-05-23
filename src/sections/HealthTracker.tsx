import { ActionIcon, Button, Card, Group, Modal, NumberInput, Stack, Table, Tabs, Text, TextInput, Title, Tooltip } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { IconDropletMinus, IconMinus, IconPlus, IconReload, IconUserMinus, IconUserPlus } from '@tabler/icons-react'
import { tooltipProps } from '../utils/tooltipProps'
import { useDamageStore } from '../utils/useDamageStore'
import { useHealthStore } from '../utils/useHealthStore'

export default function HealthTracker() {
	return (
		<Card component={Stack} mih={170}>
			<Group justify='space-between'>
				<Title order={2}>Health Tracker</Title>

				<Group gap='xs'>
					<CustomHit />
					<AddCharacterModal />
					<RemoveCharacterModal />
				</Group>
			</Group>

			<Players />
			<Summons />
		</Card>
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
					<ActionIcon mr='sm' variant='default' onClick={() => useDamageStore.setState({ customHit: 0 })}>
						<IconReload />
					</ActionIcon>
				</Tooltip>
			)}
		/>
	)
}

function AddCharacterModal() {
	const [opened, { open, close }] = useDisclosure(false)

	return (
		<>
			<Tooltip label='Add Character' {...tooltipProps}>
				<ActionIcon
					variant='transparent'
					color='white'
					size='lg'
					onClick={open}
				>
					<IconUserPlus size={100} />
				</ActionIcon>
			</Tooltip>

			<Modal opened={opened} onClose={close} title='Add Character'>
				<Tabs
					defaultValue='player'
					styles={{
						panel: {
							paddingTop: 'var(--mantine-spacing-md)'
						}
					}}
				>
					<Tabs.List>
						<Tabs.Tab value='player'>Player</Tabs.Tab>
						<Tabs.Tab value='summon'>Summon</Tabs.Tab>
					</Tabs.List>
					<Tabs.Panel value='player'>
						<AddPlayerForm close={close} />
					</Tabs.Panel>
					<Tabs.Panel value='summon'>
						<AddSummonForm close={close} />
					</Tabs.Panel>
				</Tabs>
			</Modal>
		</>
	)
}

type FormProps = {
	close: () => void
}

function AddPlayerForm({ close }: FormProps) {
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
	)
}

function AddSummonForm({ close }: FormProps) {
	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			summonName: '',
			healthDrain: 0,
			maxHealth: 0
		},
		validate: {
			summonName: value => value.length > 2 ? null : 'Player Name must be at least 2 characters long',
			healthDrain: value => value > 0 ? null : 'Health Drain must be a more than 0',
			maxHealth: value => value > 0 ? null : 'Max Health must be a more than 0'
		}
	})

	return (
		<form
			onSubmit={form.onSubmit(({ summonName, healthDrain, maxHealth }) => {
				useHealthStore.getState().addSummon(summonName, maxHealth, healthDrain)
				close()
				form.reset()
			})}
		>
			<Stack>
				<TextInput
					withAsterisk
					label='Summon Name'
					key={form.key('summonName')}
					{...form.getInputProps('summonName')}
				/>
				<Group grow>
					<NumberInput
						withAsterisk
						hideControls
						label='Health Drain'
						allowDecimal={false}
						allowNegative={false}
						key={form.key('healthDrain')}
						{...form.getInputProps('healthDrain')}
					/>
					<NumberInput
						withAsterisk
						hideControls
						label='Max Health'
						allowDecimal={false}
						allowNegative={false}
						key={form.key('maxHealth')}
						{...form.getInputProps('maxHealth')}
					/>
				</Group>
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
	)
}

function RemoveCharacterModal() {
	const [opened, { open, close }] = useDisclosure(false)

	const players = useHealthStore(state => state.players)
	const summons = useHealthStore(state => state.summons)

	return (
		<>
			<Tooltip label='Remove Character' {...tooltipProps}>
				<ActionIcon
					variant='transparent'
					color='white'
					size='lg'
					onClick={open}
				>
					<IconUserMinus size={100} />
				</ActionIcon>
			</Tooltip>

			<Modal
				opened={opened}
				onClose={close}
				title='Remove Character'
			>
				<Stack>
					<Title order={3}>Players</Title>
					{
						Object.keys(players).map((playerName, i) => {
							return (
								<Group key={i} justify='space-between'>
									<Text>{playerName}</Text>
									<Button color='red' onClick={() => useHealthStore.getState().removeCharacter(playerName, 'players')}>Remove</Button>
								</Group>
							)
						})
					}
					<Title order={3}>Summons</Title>
					{
						Object.keys(summons).map((summonName, i) => {
							return (
								<Group key={i} justify='space-between'>
									<Text>{summonName}</Text>
									<Button color='red' onClick={() => useHealthStore.getState().removeCharacter(summonName, 'summons')}>Remove</Button>
								</Group>
							)
						})
					}
				</Stack>
			</Modal>
		</>
	)
}

function Players() {
	const players = useHealthStore(state => state.players)

	return (
		<Table>
			<Table.Thead>
				<Table.Tr>
					<Table.Th miw='35%'>Player</Table.Th>
					<Table.Th>Barrier</Table.Th>
					<Table.Th>S-Durability</Table.Th>
					<Table.Th>
						<Group>
							<Text size='sm' fw={700}>Shield</Text>
							<Tooltip label='Reset All Shields' {...tooltipProps}>
								<ActionIcon size='xs' variant='transparent' onClick={() => Object.keys(players).forEach(name => useHealthStore.getState().resetPlayerShield(name))}>
									<IconReload />
								</ActionIcon>
							</Tooltip>
						</Group>
					</Table.Th>
					<Table.Th>Current Health</Table.Th>
					<Table.Th>Max Health</Table.Th>
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>
				{
					Object.entries(players).map(([playerName, { barrier, shieldDurability, currentShield, currentHealth, maxHealth }], i) => {
						return (
							<Table.Tr key={i}>
								<Table.Td>{playerName}</Table.Td>
								<Table.Td>
									<NumberInput
										hideControls
										w={80}
										allowDecimal={false}
										allowNegative={false}
										value={barrier}
										max={99}
										onChange={value => useHealthStore.setState(state => ({
											players: {
												...state.players,
												[playerName]: {
													...state.players[playerName],
													barrier: +value
												}
											}
										}))}
										rightSection={(
											<Stack gap={0} ml={8}>
												<ActionIcon
													size='xs'
													color='green'
													onClick={() => useHealthStore.getState().updatePlayerBarrier(playerName, 'add')}
												>
													<IconPlus />
												</ActionIcon>
												<ActionIcon
													size='xs'
													color='red'
													onClick={() => useHealthStore.getState().updatePlayerBarrier(playerName, 'remove')}
												>
													<IconMinus />
												</ActionIcon>
											</Stack>
										)}
									/>
								</Table.Td>
								<Table.Td>
									<NumberInput
										w={80}
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
										w={80}
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
													onClick={() => useHealthStore.getState().resetPlayerShield(playerName)}
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
													onClick={() => useHealthStore.getState().updateCurrentHealth(playerName, 'add', 'players')}
												>
													<IconPlus />
												</ActionIcon>
												<ActionIcon
													size='xs'
													color='red'
													onClick={() => useHealthStore.getState().updateCurrentHealth(playerName, 'remove', 'players')}
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

function Summons() {
	const summons = useHealthStore(state => state.summons)

	return (
		<Table>
			<Table.Thead>
				<Table.Tr>
					<Table.Th miw='55%'>Summon</Table.Th>
					<Table.Th>
						<Group>
							<Text size='sm' fw={700}>Health Drain</Text>
							<Tooltip label='Health Drains All Summons' {...tooltipProps}>
								<ActionIcon size='xs' variant='transparent' onClick={() => Object.keys(summons).forEach(name => useHealthStore.getState().summonHealthDrain(name))}>
									<IconDropletMinus />
								</ActionIcon>
							</Tooltip>
						</Group>
					</Table.Th>
					<Table.Th>Current Health</Table.Th>
					<Table.Th>Max Health</Table.Th>
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>
				{
					Object.entries(summons).map(([summonName, { healthDrain, currentHealth, maxHealth }], i) => {
						return (
							<Table.Tr key={i}>
								<Table.Td>{summonName}</Table.Td>
								<Table.Td>
									<Group>
										<Text size='sm' fw={700}>{healthDrain}</Text>
										<Tooltip label='Health Drain' {...tooltipProps}>
											<ActionIcon size='xs' variant='transparent' onClick={() => useHealthStore.getState().summonHealthDrain(summonName)}>
												<IconDropletMinus />
											</ActionIcon>
										</Tooltip>
									</Group>
								</Table.Td>
								<Table.Td>
									<NumberInput
										hideControls
										w={100}
										allowDecimal={false}
										allowNegative={false}
										value={currentHealth}
										onChange={value => useHealthStore.setState(state => ({
											summons: {
												...state.summons,
												[summonName]: {
													...state.summons[summonName],
													currentHealth: +value
												}
											}
										}))}
										rightSection={(
											<Stack gap={0} ml={8}>
												<ActionIcon
													size='xs'
													color='green'
													onClick={() => useHealthStore.getState().updateCurrentHealth(summonName, 'add', 'summons')}
												>
													<IconPlus />
												</ActionIcon>
												<ActionIcon
													size='xs'
													color='red'
													onClick={() => useHealthStore.getState().updateCurrentHealth(summonName, 'remove', 'summons')}
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
											summons: {
												...state.summons,
												[summonName]: {
													...state.summons[summonName],
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
