import { ActionIcon, Badge, Card, Group, Menu, Stack, Title, Tooltip } from '@mantine/core'
import { IconReload } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { Temporal } from 'temporal-polyfill'
import { tooltipProps } from '../utils/tooltipProps'
import { useAttackHistoryStore, type Attack } from '../utils/useAttackHistoryStore'
import { useDamageStore, type DamageStore } from '../utils/useDamageStore'

export default function AttackHistory() {
	const attacks = useAttackHistoryStore(state => state.attacks)

	return (
		<Card component={Stack}>
			<Group justify='space-between'>
				<Title order={2}>Attack History</Title>
				<Tooltip label='Reset Attack History' {...tooltipProps}>
					<ActionIcon
						variant='default'
						onClick={() => {
							useAttackHistoryStore.setState({ attacks: [] })
						}}
					>
						<IconReload />
					</ActionIcon>
				</Tooltip>
			</Group>

			{!!attacks.length && (
				<Group>
					{
						attacks.map((attack, i) => {
							return <AttackBadge key={i} attack={attack} />
						})
					}
				</Group>
			)}
		</Card>
	)
}

type AttackBadgeProps = {
	attack: Attack
}

function AttackBadge({ attack }: AttackBadgeProps) {
	const hasModifiers = Object.values(attack.modifiers).some(Boolean)

	const [duration, setDuration] = useState('')
	useEffect(() => {
		const addedTemporal = Temporal.Instant.fromEpochMilliseconds(attack.time)
		const interval = setInterval(() => {
			const now = Temporal.Now.instant()
			const duration = now.since(addedTemporal, { smallestUnit: 'second', largestUnit: 'hours' })
			setDuration(duration.toLocaleString('en-GB'))
		}, 1000)
		return () => clearInterval(interval)
	}, [attack.time])

	return (
		<Menu trigger='hover' withArrow>
			<Menu.Target>
				<Badge>{attack.name}</Badge>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Label>{attack.result.damage} damage{attack.result.crit ? ' (CRIT)' : ''}</Menu.Label>
				<Menu.Divider />
				<Menu.Label>RF+RS% (CP) [RA] CC%</Menu.Label>
				<Menu.Item
					onClick={() => {
						useDamageStore.setState({
							numbers: attack.numbers,
							attackName: attack.name
						})
					}}
				>{attack.numbers.runeFlat}+{attack.numbers.runeScaling}% ({attack.numbers.power}) [{attack.numbers.runeAcc}] {attack.numbers.critValue}%
				</Menu.Item>
				{hasModifiers && <Modifiers modifiers={attack.modifiers} />}
				<Menu.Divider />
				<Menu.Label>{duration}</Menu.Label>
			</Menu.Dropdown>
		</Menu>
	)
}

type ModifiersProps = {
	modifiers: DamageStore['modifiers']
}

function Modifiers({ modifiers }: ModifiersProps) {
	return (
		<>
			<Menu.Divider />
			<Menu.Label>Modifiers</Menu.Label>
			{
				Object.entries(modifiers)
					.filter(([_, value]) => value)
					.map(([modifier]) => {
						return (
							<Menu.Item
								key={modifier}
								style={{ textTransform: 'capitalize' }}
								onClick={() => {
									useDamageStore.setState({
										modifiers: {
											...useDamageStore.getState().modifiers,
											[modifier]: true
										}
									})
								}}
							>{modifier}
							</Menu.Item>
						)
					})
			}
		</>
	)
}
