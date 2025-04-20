import { Group, MantineProvider, Stack } from '@mantine/core'
import CharacterSheet from './CharacterSheet'
import DamageCalculator from './DamageCalculator'
import HealthTracker from './HealthTracker'
import LastResult from './LastResult'

export default function App() {
	return (
		<MantineProvider defaultColorScheme='dark' theme={{ primaryColor: 'violet' }}>
			<Group grow p='md' align='start'>
				<Stack>
					<DamageCalculator />
					<LastResult />
				</Stack>
				<Stack>
					<HealthTracker />
					<CharacterSheet />
				</Stack>
			</Group>
		</MantineProvider>
	)
}
