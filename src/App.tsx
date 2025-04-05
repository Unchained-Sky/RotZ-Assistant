import { Box, MantineProvider, Stack } from '@mantine/core'
import DamageCalculator from './DamageCalculator'
import HealthTracker from './HealthTracker'
import LastResult from './LastResult'

export default function App() {
	return (
		<MantineProvider defaultColorScheme='dark' theme={{ primaryColor: 'violet' }}>
			<Box
				p='md'
				style={{
					display: 'grid',
					gridTemplateColumns: '1fr 1fr',
					gridTemplateRows: '1fr',
					gridTemplateAreas: '"Damage Players"',
					gap: 'var(--mantine-spacing-md)'
				}}
			>
				<Stack style={{ gridArea: 'Damage' }}>
					<DamageCalculator />
					<LastResult />
				</Stack>
				<HealthTracker />
			</Box>
		</MantineProvider>
	)
}
