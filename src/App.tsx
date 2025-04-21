import { Group, MantineProvider, Stack } from '@mantine/core'
import CharacterSheet from './CharacterSheet'
import DamageCalculator from './DamageCalculator'
import HealthTracker from './HealthTracker'
import LastResult from './LastResult'
import Tokens from './Tokens'

export default function App() {
	return (
		<MantineProvider defaultColorScheme='dark' theme={{ primaryColor: 'violet' }}>
			<Group grow p='md' align='start'>
				<Stack>
					<DamageCalculator />
					<LastResult />
					<Tokens />
				</Stack>
				<Stack>
					<HealthTracker />
					<CharacterSheet />
				</Stack>
			</Group>
		</MantineProvider>
	)
}
