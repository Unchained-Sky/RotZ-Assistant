import { Box, MantineProvider } from '@mantine/core'
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
					gridTemplateRows: '1fr 1fr',
					gridTemplateAreas: '"Damage Players" "LastResult Players"',
					gap: 'var(--mantine-spacing-md)'
				}}
			>
				<DamageCalculator />
				<HealthTracker />
				<LastResult />
			</Box>
		</MantineProvider>
	)
}
