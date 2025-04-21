import { Card, Stack, Textarea, Title } from '@mantine/core'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export default function Notes() {
	const { notes, setNotes } = useNotesStore()

	return (
		<Card component={Stack}>
			<Title order={2}>Notes</Title>
			<Textarea
				autosize
				placeholder='Notes'
				resize='vertical'
				minRows={4}
				value={notes}
				onChange={event => setNotes(event.target.value)}
			/>
		</Card>
	)
}

type NotesStore = {
	notes: string
	setNotes: (notes: string) => void
}

const useNotesStore = create<NotesStore>()(persist((set, _get) => ({
	notes: '',
	setNotes: notes => {
		set({ notes })
	}
}), { name: 'rotz-assistant-notes-store' }))
