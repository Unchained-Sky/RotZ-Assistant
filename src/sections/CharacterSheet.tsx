/* eslint-disable @stylistic/quote-props */
import { ActionIcon, Button, Card, Divider, FileInput, Group, List, Modal, NumberInput, Stack, Tabs, Text, Textarea, Title, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconFileDots, IconFileImport } from '@tabler/icons-react'
import { type } from 'arktype'
import { type MouseEventHandler, type ReactNode, useState } from 'react'
import { Temporal } from 'temporal-polyfill'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MantineMarkdown } from '../utils/MantineMarkdown'
import { tooltipProps } from '../utils/tooltipProps'
import { useDamageStore } from '../utils/useDamageStore'
import { useHealthStore } from '../utils/useHealthStore'

const PLACEHOLDER_MARKDOWN_TEXT = `# Character Sheet
## Stats
- Movement: 2
- Health: 250
- Power: 80`

const PLACEHOLDER_JSON_TEXT = `{
	"info": {
		"name": "Character Name",
	}
}`

export default function CharacterSheet() {
	return (
		<Card component={Stack}>
			<Group justify='space-between'>
				<Title order={2}>Character Sheet</Title>
				<Group gap='xs'>
					<ImportMarkdownSheetModal />
					<ImportJsonSheetModal />
					<RemoveSheetModal />
				</Group>
			</Group>
			<CharacterTabs />
		</Card>
	)
}

function ImportMarkdownSheetModal() {
	const [opened, { open, close }] = useDisclosure(false)

	const [file, setFile] = useState<File | null>(null)
	const [text, setText] = useState<string>('')

	return (
		<>
			<Tooltip label='Import Markdown Character Sheet' {...tooltipProps}>
				<ActionIcon variant='default' onClick={open}>
					<IconFileImport />
				</ActionIcon>
			</Tooltip>

			<Modal
				opened={opened}
				onClose={close}
				title='Import Markdown Character Sheet'
				onExitTransitionEnd={() => {
					setFile(null)
					setText('')
				}}
			>
				<Stack>
					<FileInput
						label='Markdown File'
						clearable
						placeholder='character-sheet.md'
						accept='.md'
						value={file}
						onChange={setFile}
						disabled={text.length > 0}
					/>
					<Divider label='or' />
					<Textarea
						label='Text'
						autosize
						minRows={2}
						maxRows={5}
						placeholder={PLACEHOLDER_MARKDOWN_TEXT}
						value={text}
						onChange={event => setText(event.currentTarget.value)}
						disabled={file !== null}
					/>
					<Group>
						<Button variant='default' onClick={close}>Cancel</Button>
						<Button
							type='submit'
							flex={1}
							onClick={() => {
								const addSheet = useCharacterSheetStore.getState().addMarkdownSheet
								if (file) {
									const reader = new FileReader()
									reader.onload = () => {
										if (typeof reader.result !== 'string') return console.error('FileReader.result is not a string')
										addSheet(reader.result)
										close()
									}
									reader.readAsText(file)
								} else {
									addSheet(text)
									close()
								}
							}}
						>Confirm
						</Button>
					</Group>
				</Stack>
			</Modal>
		</>
	)
}

function ImportJsonSheetModal() {
	const [opened, { open, close }] = useDisclosure(false)

	const [file, setFile] = useState<File | null>(null)
	const [text, setText] = useState<string>('')

	return (
		<>
			<Tooltip label='Import Json Character Sheet' {...tooltipProps}>
				<ActionIcon variant='default' onClick={open}>
					<IconFileImport />
				</ActionIcon>
			</Tooltip>

			<Modal
				opened={opened}
				onClose={close}
				title='Import Json Character Sheet'
				onExitTransitionEnd={() => {
					setFile(null)
					setText('')
				}}
			>
				<Stack>
					<FileInput
						label='Json File'
						clearable
						placeholder='character-sheet.json'
						accept='.json'
						value={file}
						onChange={setFile}
						disabled={text.length > 0}
					/>
					<Divider label='or' />
					<Textarea
						label='Text'
						autosize
						minRows={2}
						maxRows={5}
						placeholder={PLACEHOLDER_JSON_TEXT}
						value={text}
						onChange={event => setText(event.currentTarget.value)}
						disabled={file !== null}
					/>
					<Group>
						<Button variant='default' onClick={close}>Cancel</Button>
						<Button
							type='submit'
							flex={1}
							onClick={() => {
								const addSheet = useCharacterSheetStore.getState().addJsonSheet
								if (file) {
									const reader = new FileReader()
									reader.onload = () => {
										if (typeof reader.result !== 'string') return console.error('FileReader.result is not a string')
										addSheet(reader.result)
										close()
									}
									reader.readAsText(file)
								} else {
									addSheet(text)
									close()
								}
							}}
						>Confirm
						</Button>
					</Group>
				</Stack>
			</Modal>
		</>
	)
}

function RemoveSheetModal() {
	const characterSheet = useCharacterSheetStore(state => state.characterSheet)
	const [opened, { open, close }] = useDisclosure(false)

	return (
		<>
			<Tooltip label='Remove Character Sheet' {...tooltipProps}>
				<ActionIcon variant='default' onClick={open}>
					<IconFileDots />
				</ActionIcon>
			</Tooltip>

			<Modal
				opened={opened}
				onClose={close}
				title='Remove Character Sheet'
			>
				<Stack>
					{
						Object.keys(characterSheet).map((playerName, i) => {
							const [name, added] = playerName.split('::')
							const addedTemporal = Temporal.Instant.fromEpochMilliseconds(+added)
							const now = Temporal.Now.instant()
							const duration = now.since(addedTemporal, { smallestUnit: 'second', largestUnit: 'hours' })
							return (
								<Group key={i} justify='space-between'>
									<Stack gap={0}>
										<Text>{name}</Text>
										<Text size='xs'>Added: {duration.toLocaleString('en-GB')} ago</Text>
									</Stack>
									<Button color='red' onClick={() => useCharacterSheetStore.getState().removeCharacterSheet(playerName)}>Remove</Button>
								</Group>
							)
						})
					}
				</Stack>
			</Modal>
		</>
	)
}

function CharacterTabs() {
	const characterSheet = useCharacterSheetStore(state => state.characterSheet)
	const activeCharacter = useCharacterSheetStore(state => state.activeCharacter)

	return Object.keys(characterSheet).length
		? (
			<Tabs value={activeCharacter} onChange={name => useCharacterSheetStore.setState({ activeCharacter: name ?? '' })}>
				<Tabs.List>
					{
						Object.keys(characterSheet).reverse().map((playerName, i) => {
							return (
								<Tabs.Tab key={i} value={playerName}>{playerName.split('::')[0]}</Tabs.Tab>
							)
						})
					}
				</Tabs.List>
				{
					Object.keys(characterSheet).map((playerName, i) => {
						const { type } = characterSheet[playerName]
						// Remove legacy character sheet stored as string
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
						if (!type) {
							useCharacterSheetStore.getState().removeCharacterSheet(playerName)
							return null
						}
						if (type === 'markdown') {
							return (
								<Tabs.Panel key={i} value={playerName}>
									<MantineMarkdown markdown={characterSheet[playerName].markdown} />
								</Tabs.Panel>
							)
						}
						return (
							<Tabs.Panel key={i} value={playerName}>
								<JsonCharacterSheet data={characterSheet[playerName].json} />
							</Tabs.Panel>
						)
					})
				}
			</Tabs>
		)
		: null
}

type JsonCharacterSheetProps = {
	data: CharacterSheetJson['json']
}

function JsonCharacterSheet({ data }: JsonCharacterSheetProps) {
	const resolveCount = useCharacterSheetStore(state => state.resolveCount)

	return (
		<Stack gap={0} pr={48}>
			<Title order={1} pt='xs'>{data.info.name}</Title>

			<Title order={2} pt='xs'>Stats</Title>
			<List withPadding>
				<ListItem title='Movement' desc={data.info.stats.movement} />
				<ListItem title='Health' desc={data.info.stats.health} />
				<ListItem
					title='Power'
					desc={(
						<InlineButton
							text={data.info.stats.power}
							tooltip='Click to update power'
							onClick={() => useDamageStore.getState().updateNumber('power', data.info.stats.power)}
						/>
					)}
				/>
				<ListItem title='Basic Attack Range' desc={data.info.stats.basicRange} />
				<ListItem
					title='Crit Chance'
					desc={(
						<InlineButton
							text={`${data.info.stats.critChance}%`}
							tooltip='Click to update crit chance'
							onClick={() => useDamageStore.getState().updateNumber('critValue', data.info.stats.critChance)}
						/>
					)}
				/>
				<ListItem title='Shield' desc={`${data.info.stats.shield[0]} (${data.info.stats.shield[1]})`} />
			</List>

			<Title order={2} pt='xs'>Runes</Title>

			<Title order={3} pt='xs'>Passive</Title>
			<List withPadding>
				{data.runes.passive.map((rune, i) => <List.Item key={i}>{rune}</List.Item>)}
			</List>

			<Title order={3} pt='xs'>Primary</Title>
			<List withPadding>
				<ListItem
					title='Basic Attack'
					desc={(
						<Group>
							<InlineButton
								text='Load'
								onClick={() => {
									useDamageStore.getState().updateNumber('runeFlat', 20)
									useDamageStore.getState().updateNumber('runeScaling', 35)
									useDamageStore.getState().updateNumber('runeAcc', 2 + ~~(+resolveCount / 25))
								}}
							/>
							<Tooltip label='Resolve Count' {...tooltipProps}>
								<NumberInput
									size='xs'
									maw={64}
									value={resolveCount}
									onChange={event => useCharacterSheetStore.setState({ resolveCount: +event })}
									allowDecimal={false}
									allowNegative={false}
									max={9999}
									stepHoldDelay={500}
									stepHoldInterval={t => Math.max(1000 / t ** 2, 25)}
								/>
							</Tooltip>
						</Group>
					)}
				/>
			</List>
			{
				Object.entries(data.runes.primary).map(([runeName, runeData], i) => {
					const damageString = runeData.damageDisplay ?? (runeData.damage ? `${runeData.damage[0]}+${runeData.damage[1]}%` : undefined)
					const name = runeData.damage || runeData.heal
						? (
							<InlineButton
								text={runeName}
								attackName={runeName}
								onClick={() => {
									if (runeData.damage) {
										useDamageStore.getState().updateNumber('runeFlat', runeData.damage[0])
										useDamageStore.getState().updateNumber('runeScaling', runeData.damage[1])
									}
									if (runeData.heal) {
										useDamageStore.getState().updateNumber('runeFlat', runeData.heal[0])
										useDamageStore.getState().updateNumber('runeScaling', runeData.heal[1])
									}
									if (runeData.accuracy) useDamageStore.getState().updateNumber('runeAcc', runeData.accuracy)
								}}
							/>
						)
						: runeName
					return (
						<List key={i} withPadding>
							<List.Item>
								{name}
								<List withPadding>
									<ListItem title={runeData.healing ? 'Damage / Healing' : 'Damage'} desc={damageString} />
									<ListItem title='Heal' desc={runeData.heal ? `${runeData.heal[0]}+${runeData.heal[1]}%` : undefined} />
									<ListItem title='Accuracy' desc={runeData.accuracyDisplay ?? runeData.accuracy} />
									<ListItem title='Speed' desc={runeData.speed} />
									<ListItem title='Range' desc={runeData.range} />
									<ListItem title='AoE' desc={runeData.AoE} />
									<ListItem title='Duration' desc={runeData.duration} />
									<ListItem title='Effect' desc={runeData.effect} />
									<ListItem title='Resolve' desc={`${+runeData.resolve[0] > 0 ? '+' : ''}${runeData.resolve[0]} (${runeData.resolve[1]})`} />
									<ListItem title='Bonus' desc={runeData.bonus ? `${runeData.bonus[0]} - ${runeData.bonus[1]}` : undefined} />
								</List>
							</List.Item>
						</List>
					)
				})
			}

			<Title order={3} pt='xs'>Secondary</Title>
			{
				Object.entries(data.runes.secondary).map(([runeName, runeData], i) => {
					return (
						<List key={i} withPadding>
							<List.Item>
								{runeName}
								<List withPadding>
									<ListItem title='Damage' desc={runeData.damage} />
									<ListItem title='Duration' desc={runeData.duration} />
									<ListItem title='Effect' desc={runeData.effect} />
								</List>
							</List.Item>
						</List>
					)
				})
			}

			<Title order={2} pt='xs'>More Info</Title>
			{
				Object.entries(data.info.moreInfo).map(([key, values], i) => {
					return (
						<List key={i} withPadding>
							<List.Item>
								{key}
								{
									values[0] !== '' && (
										<List withPadding>
											{values.map((value, i) => <List.Item key={i}>{value}</List.Item>)}
										</List>
									)
								}
							</List.Item>
						</List>
					)
				})
			}

			{Object.keys(data.info.summons).length > 0 && <Title order={2} pt='xs'>Summons</Title>}
			{
				Object.entries(data.info.summons).map(([summonName, summonData], i) => {
					return (
						<List key={i} withPadding>
							<List.Item>
								<InlineButton
									text={summonName}
									onClick={() => useHealthStore.getState().addSummon(summonName, summonData.health[0], summonData.health[1])}
									tooltip='Add summon to the health tracker'
								/>
								<List withPadding>
									<ListItem title='Cost' desc={summonData.cost} />
									<ListItem title='Health' desc={`${summonData.health[0]} (${summonData.health[1]})`} />
									<ListItem title='Speed' desc={summonData.speed} />
									<ListItem title='Power'	desc={summonData.power} />
									<ListItem title='Movement' desc={summonData.movement} />
									{summonData.passive.map((passive, i) => <ListItem key={i} title='Passive' desc={passive} />)}
									{summonData.active.map((active, i) => {
										return (active.damage || active.heal) && !(active.damage && active.heal)
											? (
												<List.Item key={i}>
													<InlineButton
														text='Active'
														onClick={() => {
															const { updateNumber } = useDamageStore.getState()
															updateNumber('power', summonData.power)
															if (active.accuracy) {
																updateNumber('runeAcc', active.accuracy ?? 2)
															}
															if (active.damage) {
																updateNumber('runeFlat', active.damage[0])
																updateNumber('runeScaling', active.damage[1])
															}
															if (active.heal) {
																updateNumber('runeFlat', active.heal[0])
																updateNumber('runeScaling', active.heal[1])
															}
														}}
													/>
													{': '}
													{active.effect}
												</List.Item>
											)
											: <ListItem key={i} title='Active' desc={active.effect} />
									})}
								</List>
							</List.Item>
						</List>
					)
				})
			}
		</Stack>
	)
}

type ListItemProps = {
	title: string
	desc: string | number | undefined | ReactNode
}

function ListItem({ title, desc }: ListItemProps) {
	return desc !== undefined && (
		<List.Item>
			<strong>{title}:</strong>
			{' '}
			{desc}
		</List.Item>
	)
}

type InlineButtonProps = {
	text: string | number
	tooltip?: string
	attackName?: string
	onClick: MouseEventHandler<HTMLButtonElement>
}

function InlineButton({ text, tooltip = 'Click to update damage calculator', attackName, onClick }: InlineButtonProps) {
	return (
		<Tooltip label={tooltip} {...tooltipProps}>
			<Button
				size='compact-xs'
				color='dark.3'
				onClick={event => {
					onClick(event)
					if (attackName) useDamageStore.setState({ attackName })
				}}
			>
				{text}
			</Button>
		</Tooltip>
	)
}

const parseJson = type('string').pipe.try(
	s => JSON.parse(s),
	type({
		info: {
			name: 'string',
			shortName: 'string',
			version: 'number',
			stats: {
				movement: 'number',
				health: 'number',
				power: 'number',
				basicRange: 'number',
				critChance: 'number',
				shield: ['number', 'number']
			},
			moreInfo: {
				'[string]': 'string[]'
			},
			summons: {
				'[string]': {
					'cost?': 'number',
					health: ['number', 'number'],
					speed: '\'fast\' | \'slow\'',
					power: 'number',
					movement: 'number',
					passive: 'string[]',
					active: type({
						'damage?': ['number', 'number'],
						'heal?': ['number', 'number'],
						'accuracy?': 'number',
						effect: 'string'
					}).array()
				}
			}
		},
		runes: {
			passive: 'string[]',
			primary: {
				'[string]': {
					'damage?': ['number', 'number'],
					'damageDisplay?': 'string',
					'heal?': ['number', 'number'],
					'healing?': 'boolean',
					'accuracy?': 'number',
					'accuracyDisplay?': 'string',
					speed: 'number',
					'range?': 'number | string',
					'AoE?': 'number',
					'duration?': 'string',
					effect: 'string',
					// Regex for percentages
					resolve: ['number | /\\d+(?:\\.\\d+)?%/', 'number'],
					'bonus?': ['number', 'string']
				}
			},
			secondary: {
				'[string]': {
					'damage?': 'number',
					'duration?': 'string',
					effect: 'string'
				}
			}
		}
	})
)

type CharacterSheetMarkdown = {
	type: 'markdown'
	markdown: string
}

type CharacterSheetJson = {
	type: 'json'
	json: typeof parseJson.infer
}

type CharacterSheetStore = {
	characterSheet: Record<string, CharacterSheetMarkdown | CharacterSheetJson>
	activeCharacter: string
	resolveCount: number
	addMarkdownSheet: (markdown: string) => void
	addJsonSheet: (json: string) => void
	removeCharacterSheet: (name: string) => void
}

function getTitle(name: string) {
	return `${name}::${+new Date()}`
}

const useCharacterSheetStore = create<CharacterSheetStore>()(persist((set, get) => ({
	characterSheet: {},
	activeCharacter: '',
	resolveCount: 0,
	addMarkdownSheet: sheet => {
		const firstLine = sheet.split('\n')[0]
		const name = firstLine.startsWith('# ') ? firstLine.replace('# ', '') : 'Unknown'
		const title = getTitle(name)
		set(state => ({
			characterSheet: {
				...state.characterSheet,
				[title]: {
					type: 'markdown',
					markdown: sheet
				}
			},
			activeCharacter: title
		}))
	},
	addJsonSheet: sheet => {
		const out = parseJson(sheet)
		if (out instanceof type.errors) {
			console.error(out.summary)
		} else {
			const title = getTitle(out.info.shortName)
			set(state => ({
				characterSheet: {
					...state.characterSheet,
					[title]: {
						type: 'json',
						json: out
					}
				},
				activeCharacter: title
			}))

			useHealthStore.getState().addPlayer(
				out.info.shortName,
				out.info.stats.shield[0],
				out.info.stats.shield[1],
				out.info.stats.health
			)
		}
	},
	removeCharacterSheet: name => {
		const { [name]: _name, ...characterSheet } = get().characterSheet
		const { activeCharacter } = get()
		if (activeCharacter === name) set({ activeCharacter: Object.keys(characterSheet).at(-1) ?? '' })
		set({ characterSheet })
	}
}), { name: 'rotz-assistant-character-sheet-store' }))
