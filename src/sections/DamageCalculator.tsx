import { ActionIcon, Button, Card, Chip, Group, NumberInput, Slider, Stack, Text, Title, Tooltip } from '@mantine/core'
import { IconReload } from '@tabler/icons-react'
import { forwardRef } from 'react'
import { tooltipProps } from '../utils/tooltipProps'
import { type DamageStore, useDamageStore } from '../utils/useDamageStore'

export default function DamageCalculator() {
	const rollDamage = useDamageStore(state => state.rollDamage)

	return (
		<Card component={Stack} gap='md'>
			<Group justify='space-between'>
				<Title order={2}>Damage Calculator</Title>
				<ResetAll />
			</Group>

			<CritChance />

			<RuneStats />

			<Group align='center'>
				<Modifiers />
				<Button onClick={rollDamage} flex={1}>Calculate</Button>
			</Group>
		</Card>
	)
}

function ResetAll() {
	return (
		<Tooltip label='Reset All' {...tooltipProps}>
			<ActionIcon
				variant='default'
				onClick={() => useDamageStore.setState({
					numbers: useDamageStore.getInitialState().numbers,
					modifiers: useDamageStore.getInitialState().modifiers
				})}
			>
				<IconReload />
			</ActionIcon>
		</Tooltip>
	)
}

function CritChance() {
	const critValue = useDamageStore(state => state.numbers.critValue)

	return (
		<Stack gap={0}>
			<Text size='sm'>Crit Chance - {critValue}%</Text>
			<Slider
				value={critValue}
				onChange={value => useDamageStore.getState().updateNumber('critValue', value)}
				step={5}
				label={null}
				mb={20}
				pr={26}
				flex={1}
				marks={[
					{ value: 0, label: '0%' },
					{ value: 25, label: '25%' },
					{ value: 50, label: '50%' },
					{ value: 75, label: '75%' },
					{ value: 100, label: '100%' }
				]}
			/>
		</Stack>
	)
}

function RuneStats() {
	const characterPower = useDamageStore(state => state.numbers.power)
	const runeFlat = useDamageStore(state => state.numbers.runeFlat)
	const runeScaling = useDamageStore(state => state.numbers.runeScaling)
	const runeAcc = useDamageStore(state => state.numbers.runeAcc)

	return (
		<Group grow>
			<NumberInput
				label='Character Power'
				value={characterPower}
				onChange={value => useDamageStore.getState().updateNumber('power', +value)}
				allowDecimal={false}
				allowNegative={false}
				rightSection={(
					<Tooltip label='Reset Character Power' {...tooltipProps}>
						<ActionIcon mr='sm' variant='default' onClick={() => useDamageStore.getState().updateNumber('power', 0)}>
							<IconReload />
						</ActionIcon>
					</Tooltip>
				)}
			/>
			<NumberInput
				label='Rune Flat'
				value={runeFlat}
				onChange={value => useDamageStore.getState().updateNumber('runeFlat', +value)}
				allowDecimal={false}
				allowNegative={false}
				rightSection={(
					<Tooltip label='Reset Rune Flat' {...tooltipProps}>
						<ActionIcon mr='sm' variant='default' onClick={() => useDamageStore.getState().updateNumber('runeFlat', 0)}>
							<IconReload />
						</ActionIcon>
					</Tooltip>
				)}
			/>
			<NumberInput
				label='Rune Scaling'
				value={runeScaling}
				onChange={value => useDamageStore.getState().updateNumber('runeScaling', +value)}
				allowDecimal={false}
				allowNegative={false}
				rightSection={(
					<Tooltip label='Reset Rune Scaling' {...tooltipProps}>
						<ActionIcon mr='sm' variant='default' onClick={() => useDamageStore.getState().updateNumber('runeScaling', 0)}>
							<IconReload />
						</ActionIcon>
					</Tooltip>
				)}
			/>
			<NumberInput
				label='Rune Accuracy'
				value={runeAcc}
				onChange={value => useDamageStore.getState().updateNumber('runeAcc', +value)}
				allowDecimal={false}
				allowNegative={false}
				rightSection={(
					<Tooltip label='Reset Rune Accuracy' {...tooltipProps}>
						<ActionIcon mr='sm' variant='default' onClick={() => useDamageStore.getState().updateNumber('runeAcc', 0)}>
							<IconReload />
						</ActionIcon>
					</Tooltip>
				)}
			/>
		</Group>
	)
}

function Modifiers() {
	return (
		<Group miw={231} justify='center'>
			<Modifier type='confused' description="Minimum dice damage set to 0 and it can't crit" />
			<Modifier type='encouraged' description='Minimum dice damage is added to each dice roll' />
		</Group>
	)
}

type ModifierProps = ModifierChipProps & {
	description: string
}

function Modifier({ type, description }: ModifierProps) {
	return (
		<Tooltip label={description} {...tooltipProps}>
			<ModifierChip type={type} />
		</Tooltip>
	)
}

type ModifierChipProps = {
	type: keyof DamageStore['modifiers']
}

const ModifierChip = forwardRef<HTMLDivElement, ModifierChipProps>(function TestComponent({ type }, ref) {
	const checked = useDamageStore(state => state.modifiers[type])

	return (
		<Chip
			rootRef={ref}
			tt='capitalize'
			checked={checked}
			onChange={() => useDamageStore.setState({
				modifiers: {
					...useDamageStore.getState().modifiers,
					[type]: !checked
				}
			})}
		>
			{type}
		</Chip>
	)
})
