import { Button, Card, Divider, FileInput, Group, Modal, Stack, Textarea, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import MantineMarkdown from './MantineMarkdown'

const PLACEHOLDER_TEXT = `# Character Sheet
## Stats
- Movement: 2
- Health: 250
- Power: 80`

export default function CharacterSheet() {
	const [importModal, importModalHandlers] = useDisclosure(false)
	const [sheet, setSheet] = useState('')

	return (
		<>
			<Card component={Stack}>
				<Group justify='space-between'>
					<Title order={2}>Character Sheet</Title>
					<Button variant='default' onClick={importModalHandlers.open}>Import</Button>
				</Group>
				<MantineMarkdown markdown={sheet} />
			</Card>

			<ImportSheetModal opened={importModal} close={importModalHandlers.close} setSheet={setSheet} />
		</>
	)
}

type ImportSheetModalProps = {
	opened: boolean
	close: () => void
	setSheet: (sheet: string) => void
}

function ImportSheetModal({ opened, close, setSheet }: ImportSheetModalProps) {
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
