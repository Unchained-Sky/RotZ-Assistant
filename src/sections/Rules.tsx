import { ActionIcon, Button, Card, Divider, FileInput, Group, Modal, Stack, Textarea, Title, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconFileDots, IconFileImport } from '@tabler/icons-react'
import { useState } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MantineMarkdown } from '../utils/MantineMarkdown'
import { tooltipProps } from '../utils/tooltipProps'

export default function Rules() {
	const rules = useRulesStore(state => state.rules)

	return (
		<Card component={Stack}>
			<Group justify='space-between'>
				<Title order={2}>Rules</Title>
				<Group gap='xs'>
					<AddRulesModal />
					<Tooltip label='Clear Rules' {...tooltipProps}>
						<ActionIcon
							variant='default'
							onClick={() => useRulesStore.getState().setRules('')}
						>
							<IconFileDots size={100} />
						</ActionIcon>
					</Tooltip>
				</Group>
			</Group>

			<MantineMarkdown markdown={rules} />
		</Card>
	)
}

const PLACEHOLDER_MARKDOWN_TEXT = `# Title
## Subtitle
- Rules text here`

function AddRulesModal() {
	const [opened, { open, close }] = useDisclosure(false)

	const [file, setFile] = useState<File | null>(null)
	const [text, setText] = useState<string>('')

	return (
		<>
			<Tooltip label='Add Rules' {...tooltipProps}>
				<ActionIcon variant='default' onClick={open}>
					<IconFileImport />
				</ActionIcon>
			</Tooltip>

			<Modal
				opened={opened}
				onClose={close}
				title='Add Rules'
				onExitTransitionEnd={() => {
					setFile(null)
					setText('')
				}}
			>
				<Stack>
					<FileInput
						label='Markdown File'
						clearable
						placeholder='rules.md'
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
								if (file) {
									const reader = new FileReader()
									reader.onload = () => {
										if (typeof reader.result !== 'string') return console.error('FileReader.result is not a string')
										useRulesStore.setState({ rules: reader.result })
										close()
									}
									reader.readAsText(file)
								} else {
									useRulesStore.setState({ rules: text })
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

type RulesStore = {
	rules: string
	setRules: (rules: string) => void
}

const useRulesStore = create<RulesStore>()(persist((set, _get) => ({
	rules: '',
	setRules: rules => {
		set({ rules })
	}
}), { name: 'rotz-assistant-rules-store' }))
