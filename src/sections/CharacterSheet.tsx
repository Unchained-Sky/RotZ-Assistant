/* eslint-disable react/prop-types */
import { ActionIcon, Button, Card, Divider, FileInput, Group, List, Modal, Stack, Tabs, Text, Textarea, Title, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconFileDots, IconFileImport } from '@tabler/icons-react'
import { useState } from 'react'
import Markdown from 'react-markdown'
import { Temporal } from 'temporal-polyfill'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { tooltipProps } from '../utils/tooltipProps'

const PLACEHOLDER_TEXT = `# Character Sheet
## Stats
- Movement: 2
- Health: 250
- Power: 80`

export default function CharacterSheet() {
	return (
		<Card component={Stack}>
			<Group justify='space-between'>
				<Title order={2}>Character Sheet</Title>
				<Group gap='xs'>
					<ImportSheetModal />
					<RemoveSheetModal />
				</Group>
			</Group>
			<CharacterTabs />
		</Card>
	)
}

function ImportSheetModal() {
	const [opened, { open, close }] = useDisclosure(false)

	const [file, setFile] = useState<File | null>(null)
	const [text, setText] = useState<string>('')

	return (
		<>
			<Tooltip label='Import Character Sheet' {...tooltipProps}>
				<ActionIcon variant='default' onClick={open}>
					<IconFileImport />
				</ActionIcon>
			</Tooltip>

			<Modal
				opened={opened}
				onClose={close}
				title='Import Character Sheet'
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
						placeholder={PLACEHOLDER_TEXT}
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
								const setSheet = useCharacterSheetStore.getState().addCharacterSheet
								if (file) {
									const reader = new FileReader()
									reader.onload = () => {
										setSheet(reader.result as string)
										close()
									}
									reader.readAsText(file)
								} else {
									setSheet(text)
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
						return (
							<Tabs.Panel key={i} value={playerName}>
								<MantineMarkdown markdown={characterSheet[playerName]} />
							</Tabs.Panel>
						)
					})
				}
			</Tabs>
		)
		: null
}

type MantineMarkdownProps = {
	markdown: string
}

function MantineMarkdown({ markdown }: MantineMarkdownProps) {
	return (
		<Stack gap={0}>
			<Markdown
				components={{
					h1(props) {
						return <Title order={1} pt='xs'>{props.children}</Title>
					},
					h2(props) {
						return <Title order={2} pt='xs'>{props.children}</Title>
					},
					h3(props) {
						return <Title order={3} pt='xs'>{props.children}</Title>
					},
					ul(props) {
						return <List withPadding>{props.children}</List>
					},
					li(props) {
						const text = props.children
						if (typeof text !== 'string' || !text.includes(':')) return <List.Item>{text}</List.Item>
						const [title, desc] = text.split(':')
						return (
							<List.Item>
								<strong>{title}:</strong>
								{desc}
							</List.Item>
						)
					}
				}}
			>{markdown}
			</Markdown>
		</Stack>
	)
}

type CharacterSheetStore = {
	characterSheet: Record<string, string>
	activeCharacter: string
	addCharacterSheet: (sheet: string) => void
	removeCharacterSheet: (name: string) => void
}

const useCharacterSheetStore = create<CharacterSheetStore>()(persist((set, get) => ({
	characterSheet: {},
	activeCharacter: '',
	addCharacterSheet: sheet => {
		const firstLine = sheet.split('\n')[0]
		const name = firstLine.startsWith('# ') ? firstLine.replace('# ', '') : 'Unknown'
		const title = `${name}::${+new Date()}`
		set(state => ({
			characterSheet: {
				...state.characterSheet,
				[title]: sheet
			},
			activeCharacter: title
		}))
	},
	removeCharacterSheet: name => {
		const { [name]: _name, ...characterSheet } = get().characterSheet
		const { activeCharacter } = get()
		if (activeCharacter === name) set({ activeCharacter: Object.keys(characterSheet).at(-1) ?? '' })
		set({ characterSheet })
	}
}), { name: 'rotz-assistant-character-sheet-store' }))
