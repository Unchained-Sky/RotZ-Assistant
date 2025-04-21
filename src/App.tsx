import { Group, MantineProvider, Stack } from '@mantine/core'
import CharacterSheet from './sections/CharacterSheet'
import DamageCalculator from './sections/DamageCalculator'
import HealthTracker from './sections/HealthTracker'
import LastResult from './sections/LastResult'
import Notes from './sections/Notes'
import Tokens from './sections/Tokens'

export default function App() {
	return (
		<MantineProvider defaultColorScheme='dark' theme={{ primaryColor: 'violet' }}>
			<Group grow p='md' align='start'>
				<Stack>
					<DamageCalculator />
					<LastResult />
					<Tokens />
					<Notes />
				</Stack>
				<Stack>
					<HealthTracker />
					<CharacterSheet />
				</Stack>
			</Group>
		</MantineProvider>
	)
}
