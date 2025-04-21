/* eslint-disable react/prop-types */
import { ActionIcon, Button, Card, Divider, FileInput, Group, List, Modal, Stack, Textarea, Title, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconFileImport, IconReload } from '@tabler/icons-react'
import { useState } from 'react'
import Markdown from 'react-markdown'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { tooltipProps } from '../utils/tooltipProps'

const PLACEHOLDER_TEXT = `# Character Sheet
## Stats
- Movement: 2
- Health: 250
- Power: 80`

export default function CharacterSheet() {
	const [importModal, importModalHandlers] = useDisclosure(false)
	const characterSheet = useCharacterSheetStore(state => state.characterSheet)

	return (
		<>
			<Card component={Stack}>
				<Group justify='space-between'>
					<Title order={2}>Character Sheet</Title>
					<Group gap='xs'>
						<Tooltip label='Import Character Sheet' {...tooltipProps}>
							<ActionIcon variant='default' onClick={importModalHandlers.open}>
								<IconFileImport />
							</ActionIcon>
						</Tooltip>
						<Tooltip label='Reset Character Sheet' {...tooltipProps}>
							<ActionIcon variant='default' onClick={() => useCharacterSheetStore.getState().setCharacterSheet('')}>
								<IconReload />
							</ActionIcon>
						</Tooltip>
					</Group>
				</Group>
				<MantineMarkdown markdown={characterSheet} />
			</Card>

			<ImportSheetModal opened={importModal} close={importModalHandlers.close} />
		</>
	)
}

type ImportSheetModalProps = {
	opened: boolean
	close: () => void
}

function ImportSheetModal({ opened, close }: ImportSheetModalProps) {
	const [file, setFile] = useState<File | null>(null)
	const [text, setText] = useState<string>('')

	return (
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
							const setSheet = useCharacterSheetStore.getState().setCharacterSheet
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
	)
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
	characterSheet: string
	setCharacterSheet: (sheet: string) => void
}

const useCharacterSheetStore = create<CharacterSheetStore>()(persist((set, _get) => ({
	characterSheet: '',
	setCharacterSheet: sheet => {
		set({ characterSheet: sheet })
	}
}), { name: 'rotz-assistant-character-sheet-store' }))
