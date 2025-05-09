import { Group, MantineProvider, Stack } from '@mantine/core'
import AttackHistory from './sections/AttackHistory'
import CharacterSheet from './sections/CharacterSheet'
import DamageCalculator from './sections/DamageCalculator'
import HealthTracker from './sections/HealthTracker'
import LastResult from './sections/LastResult'
import Notes from './sections/Notes'
import RandomNumber from './sections/RandomNumber'
import Rules from './sections/Rules'
import Tokens from './sections/Tokens'

export default function App() {
	return (
		<MantineProvider defaultColorScheme='dark' theme={{ primaryColor: 'violet' }}>
			<Group grow p='md' align='start'>
				<Stack>
					<DamageCalculator />
					<LastResult />
					<AttackHistory />
					<RandomNumber />
					<Tokens />
					<Notes />
					<Rules />
				</Stack>
				<Stack>
					<HealthTracker />
					<CharacterSheet />
				</Stack>
			</Group>
		</MantineProvider>
	)
}
